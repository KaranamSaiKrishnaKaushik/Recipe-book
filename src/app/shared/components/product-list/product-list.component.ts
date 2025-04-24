import { Component, OnInit } from '@angular/core';
import {ProductListService} from "./product-list.service";
import {Product} from "./product.model";
import {Subscription} from "rxjs";
import {Item} from "../../Enums/Item";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(private plService: ProductListService) { }
  products: Product[]=[];
  productsFound: Product[]=[];

  prodSubscription: Subscription;
  prodFoundSubscription: Subscription;
  ngOnInit(): void {
    this.products = this.plService.getProducts();
    this.prodSubscription = this.plService.productsChanged
      .subscribe(
      (products: Product[])=>{
        this.products = products;
      }
    );

    this.prodFoundSubscription = this.plService.productsFoundChanged
      .subscribe(
        (productsFound: Product[])=>{
          this.productsFound = productsFound;
/*          this.leftItems = productsFound.map((product, index) => ({
            id: index+1,
            name: product.name,
          }));*/
        }
      );
  }

  addToCart(product: any) {
    console.log('Add to cart:', product);
    // Add your cart service logic here
  }

  addToWishlist(product: any) {
    console.log('Add to wishlist:', product);
    // Add wishlist logic here
  }


/*
  leftItems: Item[] = []
  rightItems: Item[] = []

  selectedLeftItems: Item[] = []
  selectedRightItems: Item[] = []

  /!**
   * Toggle selection state of an item
   *!/
  toggleSelect(item: Item, list: 'left' | 'right'): void {
    if (list === 'left') {
      const index = this.selectedLeftItems.findIndex(i => i.id === item.id);
      if (index === -1) {
        this.selectedLeftItems.push(item); // Select the item
      } else {
        this.selectedLeftItems.splice(index, 1); // Deselect the item
      }
    } else {
      // Same logic for right list
      const index = this.selectedRightItems.findIndex(i => i.id === item.id);
      if (index === -1) {
        this.selectedRightItems.push(item);
      } else {
        this.selectedRightItems.splice(index, 1);
      }
    }
  }

  /!**
   * Check if an item is selected
   *!/
  isSelected(item: Item, list: 'left' | 'right'): boolean {
    if (list === 'left') {
      return this.selectedLeftItems.some(i => i.id === item.id);
    } else {
      return this.selectedRightItems.some(i => i.id === item.id);
    }
  }

  /!**
   * Check if there are any selected items in a list
   *!/
  hasSelectedItems(list: 'left' | 'right'): boolean {
    return list === 'left'
      ? this.selectedLeftItems.length > 0
      : this.selectedRightItems.length > 0;
  }

  /!**
   * Tracking function for ngFor performance
   *!/
  trackById(index: number, item: Item): number {
    return item.id;
  }

  /!**
   * Handle drop events between lists
   *!/
  drop(event: CdkDragDrop<Item[]>) {
    if (event.previousContainer === event.container) {
      // Reordering within the same list
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Moving between lists
      if (this.isSingleItemDrag(event)) {
        // Single item transfer
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        // Multi-item transfer - our custom logic
        this.handleMultiItemDrag(event);
      }
    }

    // Clear selections after completing the operation
    this.clearSelections();
  }

  /!**
   * Check if this is a single item drag operation
   *!/
  private isSingleItemDrag(event: CdkDragDrop<Item[]>): boolean {
    const sourceList = event.previousContainer.id === 'cdk-drop-list-0' ? 'left' : 'right';
    const draggedItem = event.item.data;

    // Check if the dragged item is part of a multi-selection
    return sourceList === 'left'
      ? !this.selectedLeftItems.some(item => item.id === draggedItem.id) || this.selectedLeftItems.length === 0
      : !this.selectedRightItems.some(item => item.id === draggedItem.id) || this.selectedRightItems.length === 0;
  }


  /!**
   * Custom logic to handle dragging multiple selected items
   *!/
  private handleMultiItemDrag(event: CdkDragDrop<Item[]>) {
    const sourceList = event.previousContainer.id === 'cdk-drop-list-0' ? 'left' : 'right';
    const draggedItem = event.item.data;
    const selectedItems = sourceList === 'left' ? this.selectedLeftItems : this.selectedRightItems;

    // Fall back to single item drag if the dragged item isn't in selection
    if (!selectedItems.some(item => item.id === draggedItem.id)) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      return;
    }

    // Find indices of all selected items
    const selectedIndices = selectedItems.map(item =>
      event.previousContainer.data.findIndex(listItem => listItem.id === item.id)
    ).filter(index => index !== -1).sort((a, b) => a - b);

    // Move all selected items while adjusting for removed items
    for (let i = 0; i < selectedIndices.length; i++) {
      // Adjust index based on already removed items
      const adjustedIndex = selectedIndices[i] - i;
      const item = event.previousContainer.data[adjustedIndex];

      // Remove from source
      event.previousContainer.data.splice(adjustedIndex, 1);

      // Add to target at appropriate position
      const targetIndex = event.currentIndex > event.previousIndex
        ? event.currentIndex - i
        : event.currentIndex;
      event.container.data.splice(targetIndex, 0, item);
    }
  }

  /!**
   * Move selected items from left to right
   *!/
  moveSelectedToRight(): void {
    if (this.selectedLeftItems.length === 0) return;

    // Add selected items to right list
    this.rightItems = [...this.rightItems, ...this.selectedLeftItems];

    // Remove them from left list
    this.leftItems = this.leftItems.filter(
      item => !this.selectedLeftItems.some(selected => selected.id === item.id)
    );

    this.clearSelections();
  }

  /!**
   * Move selected items from right to left
   *!/
  moveSelectedToLeft(): void {
    if (this.selectedRightItems.length === 0) return;

    // Add selected items to left list
    this.leftItems = [...this.leftItems, ...this.selectedRightItems];

    // Remove them from right list
    this.rightItems = this.rightItems.filter(
      item => !this.selectedRightItems.some(selected => selected.id === item.id)
    );

    this.clearSelections();
  }

  /!**
   * Clear all selections
   *!/
  clearSelections(): void {
    this.selectedLeftItems = [];
    this.selectedRightItems = [];
  }*/

}
