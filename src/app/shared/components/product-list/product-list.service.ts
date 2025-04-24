import {HttpClient} from "@angular/common/http";
import {Subject, Subscription} from "rxjs";
import {Injectable, OnInit} from "@angular/core";
import {Product} from "./product.model";
import {ProductSearch} from "./product-search.model";
import {Item} from "../../Enums/Item";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Injectable()
export class ProductListService implements OnInit{
  constructor(private httpClient: HttpClient) {
  }
  productsChanged = new Subject<Product[]>();
  productsFoundChanged = new Subject<Product[]>();
  subscription: Subscription;
  url = 'http://localhost:5099/';
  products : Product[] = [];
  productsFound: Product[] = [];

  leftItems: Item[] = []
  rightItems: Item[] = []

  selectedLeftItems: Item[] = []
  selectedRightItems: Item[] = []

  ngOnInit(): void {
    this.getProducts();

  }

  getProducts(){
    this.httpClient
      .get<Product[]>(this.url+'api/products/amazon')
      .subscribe(products=>{
        this.products=products;
        this.productsChanged.next(this.products.slice())
      })
    return this.products.slice();
  }

  getProductsByName(productSearch: ProductSearch){
    this.httpClient
      .post<Product[]>(this.url+'api/products/searchByNames',productSearch)
      .subscribe(products=>{
        this.productsFound=products;
        this.productsFoundChanged.next(this.productsFound.slice());
      })
    return this.productsFound.slice();
  }
}
