import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable, Subject, Subscription } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductSearch } from './product-search.model';
import { Item } from '../../Enums/Item';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProductListService implements OnInit {
  constructor(private httpClient: HttpClient) {}
  productsChanged = new Subject<Product[]>();
  productsFoundChanged = new Subject<Product[]>();
  subscription: Subscription;
  url = environment.apiUrl; //'http://localhost:5099/';
  private apiUrl = environment.apiUrl;
  products: Product[] = [];
  productsFound: Product[] = [];
  showShoppingListItems: boolean = false;

  leftItems: Item[] = [];
  rightItems: Item[] = [];

  selectedLeftItems: Item[] = [];
  selectedRightItems: Item[] = [];

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.httpClient
      .get<Product[]>(this.url + 'api/products/all-stores')
      .subscribe((products) => {
        this.products = products;
        this.productsChanged.next(this.products.slice());
      });
    return this.products.slice();
  }

  getPagedProducts(page: number, pageSize: number) {
    return this.httpClient.get<{ totalCount: number; items: Product[] }>(
      `${this.url}api/products/all-stores?page=${page}&pageSize=${pageSize}`
    );
  }

  getProductsByName(productSearch: ProductSearch): Observable<Product[]> {
    return this.httpClient.post<Product[]>(
      this.url + 'api/products/searchByNames',
      productSearch
    );
  }

  searchAndUpdateMatchedProducts(productSearch: ProductSearch): void {
    this.getProductsByName(productSearch).subscribe((products) => {
      this.productsFound = products;
      if (this.productsFound.length > 0) {
        this.showShoppingListItems = true;
      }
      this.productsFoundChanged.next(this.productsFound.slice());
    });
  }

  translateToGerman(englishText: string): Promise<string> {
    return lastValueFrom(
      this.httpClient.post<any>(this.url + 'api/products/translate', {
        text: englishText,
      })
    ).then((response) => response.translatedText);
  }
}
