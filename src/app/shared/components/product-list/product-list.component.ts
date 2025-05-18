import { Component, OnInit } from '@angular/core';
import { ProductListService } from './product-list.service';
import { Product } from './product.model';
import { Subject, Subscription } from 'rxjs';
import { Item } from '../../Enums/Item';
import { CartService } from '../../services/cart.service';
import { ProductSearch } from './product-search.model';
import { ShoppingListService } from '../../services/shopping-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  constructor(
    private plService: ProductListService,
    private cartService: CartService,
    private shoppingListService: ShoppingListService
  ) {}

  showShoppingList: boolean = false;
  showAllProducts: boolean = true;
  productsFound: Product[] = [];
  productsFoundChanged = new Subject<Product[]>();
  searchFound: string = '';
  searchAll: string = '';

  pageSize: number = 20;
  currentPage: number = 1;
  pagedProducts: Product[] = [];
  totalPages: number = 1;
  filteredFound: Product[] = [];
  prodFoundSubscription: Subscription;

  ngOnInit(): void {
    this.loadProducts(); // Load first page on init

    this.prodFoundSubscription = this.plService.productsFoundChanged.subscribe(
      (productsFound: Product[]) => {
        this.productsFound = productsFound;
        this.showShoppingList = this.plService.showShoppingListItems;
        this.filterFound();
      }
    );
  }

  loadProducts() {
    this.plService
      .getPagedProducts(this.currentPage, this.pageSize)
      .subscribe((response) => {
        this.pagedProducts = response.items;
        this.totalPages = Math.ceil(response.totalCount / this.pageSize);
      });
  }

  addToCart(product: Product) {
    product.quantity = 1;
    this.updateCart(product);
  }

  increment(product: Product) {
    product.quantity++;
    this.updateCart(product);
  }

  decrement(product: Product) {
    if (product.quantity > 1) {
      product.quantity--;
    } else {
      product.quantity = 0;
    }
    this.updateCart(product);
  }

  updateCart(product: Product) {
    this.cartService.addToCart(product);
  }

  onSearchFoundChange() {
    const searchTerm = this.searchFound.trim().toLowerCase();

    if (!searchTerm) {
      // If search box is empty, maybe reload the original matched products or clear
      this.productsFound = []; // or reload initial matched products
      this.productsFoundChanged.next(this.productsFound.slice());
      this.filteredFound = [];
      return;
    }

    // Build search model dynamically based on search term
    const matchedSearch: ProductSearch = {
      source: 'all-stores',
      names: [searchTerm],
    };

    this.plService.searchAndUpdateMatchedProducts(matchedSearch);
  }

  filterFound() {
    this.filteredFound = this.productsFound.filter((p) =>
      p.name.toLowerCase().includes(this.searchFound.toLowerCase())
    );
  }

  filterAll() {
    if (!this.searchAll.trim()) {
      this.loadProducts();
      return;
    }

    const searchModel: ProductSearch = {
      source: 'all-stores',
      names: [this.searchAll.trim().toLowerCase()],
    };
    this.plService.getProductsByName(searchModel).subscribe((products) => {
      this.pagedProducts = products;
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  get totalPagesArray(): number[] {
    const range = [];
    const visiblePages = 5;
    let start = Math.max(this.currentPage - Math.floor(visiblePages / 2), 1);
    let end = start + visiblePages - 1;

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(end - visiblePages + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }

  onShoppingListToggle(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('Shopping list toggle:', isChecked);

    if (isChecked) {
      let ingredients = this.shoppingListService.getIngredients();
      const ingredientNames = ingredients.map(
        (ingredient) => ingredient.baseName.name
      );
      console.log('ingredients from product list component :', ingredients);
      const matchedSearch: ProductSearch = {
        source: 'all-stores',
        names: ingredientNames,
      };

      this.plService.searchAndUpdateMatchedProducts(matchedSearch);
    }
  }

  getBrandLogoUrl(sourceName: string): string {
  switch (sourceName.toUpperCase()) {
    case 'REWE':
      return 'https://upload.wikimedia.org/wikipedia/commons/5/5a/REWE_Dein_Markt-Logo_neu.png';
    case 'LIDL':
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Lidl-Logo.svg/768px-Lidl-Logo.svg.png';
    case 'PENNY':
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Penny-Logo.svg/2048px-Penny-Logo.svg.png';
    case 'ALDI':
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/AldiWorldwideLogo.svg/1708px-AldiWorldwideLogo.svg.png';
    default:
      return '';
    }
  }
}
