import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../models/ingredient.model";
import {Subscription} from "rxjs";
import {ShoppingListService} from "../../services/shopping-list.service";
import {MatTableDataSource} from "@angular/material/table";
import { MatSort } from '@angular/material/sort';
import {MatPaginator} from "@angular/material/paginator";
import {ProductSearch} from "../product-list/product-search.model";
import {ProductListService} from "../product-list/product-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import { environment } from 'src/environments/environment';

declare var paypal: any;

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, AfterViewInit {

  yourPaypalSandboxClientId = environment.paypalSandboxClientId;
  private apiUrl = environment.apiUrl;//http://localhost:5099/
  constructor(
    private slService: ShoppingListService,
    private plService: ProductListService,
    private router: Router,
    private route: ActivatedRoute) { }


  displayedColumns: string[] = ['name', 'amount'];
  ingredients: { name: string; amount: number }[];
  subscription: Subscription;
  ngOnInit(): void {
    this.ingredients = this.slService.getIngredients().map(i => ({
      name: i.baseName.name,
      amount: i.amount
    }));
    this.dataSource.data = this.ingredients;
    this.subscription = this.slService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[])=>{
        this.ingredients = ingredients.map(i => ({
          name: i.baseName.name,
          amount: i.amount
        }));
        this.dataSource.data = this.ingredients;
      }
    );
  }

  onEditItem(name: string){
    console.log('name : ',name);
    let index = this.ingredients.findIndex(item => item.name === name);
    this.slService.startedEditing.next(index);
  }

  onToMarketPlace(){
    console.log('ingredients: ', this.ingredients);
    let ingredientNames = [];
    for(let ingredient of this.ingredients){
      ingredientNames.push(ingredient.name);
    }
    let productSearch = new ProductSearch("amazon",ingredientNames);
    console.log('productSearch: ', productSearch);
    this.plService.getProductsByName(productSearch);
    this.router.navigate(['/product-list'],{relativeTo: this.route});
  }

  /* Bellow code is for pagination, sorting */

  dataSource = new MatTableDataSource<any>();
  showAll: boolean = false;
  private _paginator!: MatPaginator;

  private _sort!: MatSort;
  @ViewChild(MatSort)
  set matSort(sort: MatSort) {
    if (sort) {
      this._sort = sort;
      this.dataSource.sort = sort;
    }
  }

  @ViewChild(MatPaginator)
  set matPaginator(paginator: MatPaginator) {
    if (paginator) {
      this._paginator = paginator;
      this.dataSource.paginator = paginator;
    }
    if (this._sort) {
      this.dataSource.sort = this._sort;
    }
  }

  private _results: any[] | undefined;

  @Input() set results(value: any[] | undefined) {
    this._results = value;
    if (value) {
      this.dataSource.data = value;
      if (this._paginator) {
        this.dataSource.paginator = this._paginator;
      }
    }
  }

  get results(): any[] | undefined {
    return this._results;
  }

  filterValues: any = {
    name: '',
    amount: ''
  };

  ngAfterViewInit() {
    this.updatePagination();
    this.dataSource.filterPredicate = this.createFilter();

    if (typeof paypal !== 'undefined') {
      this.loadPaypalScript().then(() => {
        paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return fetch( this.apiUrl+'api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ value: '1.00' })
            })
              .then(res => res.json())
              .then(order => order.id);
          },
          onApprove: (data: any, actions: any) => {
            return fetch(this.apiUrl+'api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: data.orderID })
            })
              .then(res => res.json())
              .then(details => {
                console.log('Transaction completed by ' + details.payer.name.given_name);
                alert('Transaction completed by ' + details.payer.name.given_name);
              });
          }
        }).render('#paypal-button-container');
      });
    } else {
      console.error('PayPal SDK not loaded.');
    }
  }

  updatePagination() {
    this.dataSource.paginator = this.showAll ? null! : this._paginator;
  }

  applyColumnFilter(event: Event, column: string) {
    const input = event.target as HTMLInputElement;
    const filterValue = input?.value?.trim().toLowerCase() || '';

    this.filterValues[column] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  createFilter(): (data: any, filter: string) => boolean {
    return (data: any, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      return Object.keys(searchTerms).every(key => {
        return data[key]?.toString().toLowerCase().includes(searchTerms[key]);
      });
    };
  }

  /* bellow code is for paypal */
  loadPaypalScript(): Promise<void> {
    return new Promise((resolve) => {
      // If already loaded, resolve right away
      if ((window as any).paypal) {
        resolve();
        return;
      }

      // Otherwise, dynamically add the PayPal script to <head> or <body>
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id='+this.yourPaypalSandboxClientId+'&currency=EUR';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

}
