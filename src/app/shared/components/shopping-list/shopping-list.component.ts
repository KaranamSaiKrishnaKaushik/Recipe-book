import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Ingredient } from '../../models/ingredient.model';
import { Subscription } from 'rxjs';
import { ShoppingListService } from '../../services/shopping-list.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ProductSearch } from '../product-list/product-search.model';
import { ProductListService } from '../product-list/product-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CartService } from '../../services/cart.service';

declare var paypal: any;

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, AfterViewInit {
  paypalSandboxClientId = environment.paypalSandboxClientId;
  private apiUrl = environment.apiUrl;
  constructor(
    private slService: ShoppingListService,
    private plService: ProductListService,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  orderedItemHistoryList: any[];
  displayedColumns: string[] = ['name', 'amount'];
  ingredients: { name: string; amount: number }[];
  subscription: Subscription;
  public spendingDates: string[] = [];
  public spendingValues: number[] = [];
  public groupBy: 'month' | 'quarter' | '4months' = 'month';

  public topProductNames: string[] = [];
  public topProductCounts: number[] = [];

  ngOnInit(): void {
    this.ingredients = this.slService.getIngredients().map((i) => ({
      name: i.baseName.name,
      amount: i.amount,
    }));
    this.dataSource.data = this.ingredients;
    this.subscription = this.slService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients.map((i) => ({
          name: i.baseName.name,
          amount: i.amount,
        }));
        this.dataSource.data = this.ingredients;
      }
    );
    this.cartService.loadOrderedItemHistory();
    this.cartService.orderedItemHistory$.subscribe((history) => {
      this.orderedItemHistoryList = history;
      console.log('orderedItemHistory :', this.orderedItemHistoryList);
      if (history && history.length > 0) {
      this.prepareSpendingOverTime(history);
      this.prepareTopProducts(history);
  }
    });
  }

  onEditItem(name: string) {
    console.log('name : ', name);
    let index = this.ingredients.findIndex((item) => item.name === name);
    this.slService.startedEditing.next(index);
  }

  onToMarketPlace() {
    console.log('ingredients: ', this.ingredients);
    let ingredientNames = [];
    for (let ingredient of this.ingredients) {
      ingredientNames.push(ingredient.name);
    }
    let productSearch = new ProductSearch('all-stores', ingredientNames);
    console.log('productSearch: ', productSearch);
    this.plService.searchAndUpdateMatchedProducts(productSearch);
    this.router.navigate(['/product-list'], { relativeTo: this.route });
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
    amount: '',
  };

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
      return Object.keys(searchTerms).every((key) => {
        return data[key]?.toString().toLowerCase().includes(searchTerms[key]);
      });
    };
  }

  prepareSpendingOverTime(history: any[]) {
  const grouped = history.reduce((acc, item) => {
    const date = new Date(item.createdDateTime);

    let key: string;
    switch (this.groupBy) {
      case 'month':
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
      case 'quarter': {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${date.getFullYear()} Q${quarter}`;
        break;
      }
      case '4months': {
        const block = Math.floor(date.getMonth() / 4) + 1;
        key = `${date.getFullYear()} B${block}`; // Block 1/2/3
        break;
      }
      default:
        key = date.toISOString().split('T')[0];
    }

    acc[key] = (acc[key] || 0) + item.price;
    return acc;
  }, {} as Record<string, number>);

  // Sort by key
  const sortedKeys = Object.keys(grouped).sort();

  this.spendingDates = sortedKeys;
  this.spendingValues = sortedKeys.map(key => +grouped[key].toFixed(2));
}


  prepareSpendingOverTimeEveryDay(history: any[]) {
    const byDate = history.reduce((acc, item) => {
      const date = item.createdDateTime; // e.g. "2025-05-15"
      acc[date] = (acc[date] || 0) + item.price;
      return acc;
    }, {} as Record<string, number>);
    // sort dates
    this.spendingDates = Object.keys(byDate).sort();
    this.spendingValues = this.spendingDates.map((d) => +byDate[d].toFixed(2));
  }

  prepareTopProducts(history: any[]) {
    // 1) Build a frequency map
    const freq = history.reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 2) Coerce entries to [string, number][]
    const entries = Object.entries(freq) as [string, number][];

    // 3) Sort descending by count and take top 8
    const sorted = entries
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 8);

    // 4) Split into labels and data arrays
    this.topProductNames = sorted.map(([name]) => name);
    this.topProductCounts = sorted.map(([, count]) => count);
  }

  ngAfterViewInit() {
    this.updatePagination();
    this.dataSource.filterPredicate = this.createFilter();

    if (typeof paypal !== 'undefined') {
      this.loadPaypalScript().then(() => {
        paypal
          .Buttons({
            createOrder: (data: any, actions: any) => {
              return fetch(this.apiUrl + 'api/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: '1.00' }),
              })
                .then((res) => res.json())
                .then((order) => order.id);
            },
            onApprove: (data: any, actions: any) => {
              return fetch(this.apiUrl + 'api/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: data.orderID }),
              })
                .then((res) => res.json())
                .then((details) => {
                  let amount =
                    details.purchase_units[0].payments.captures[0].amount.value;
                  let currency =
                    details.purchase_units[0].payments.captures[0].amount
                      .currency_code;
                  console.log(
                    'Transaction of ' +
                      amount +
                      ' ' +
                      currency +
                      ' completed by ' +
                      details.payer.name.given_name
                  );
                  alert(
                    'Transaction of ' +
                      amount +
                      ' ' +
                      currency +
                      ' completed by ' +
                      details.payer.name.given_name
                  );
                });
            },
          })
          .render('#paypal-button-container');
      });
    } else {
      console.error('PayPal SDK not loaded.');
    }
  }

  /* bellow code is for paypal */
  loadPaypalScript(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).paypal) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://www.paypal.com/sdk/js?client-id=' +
        this.paypalSandboxClientId +
        '&currency=EUR';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }
}
