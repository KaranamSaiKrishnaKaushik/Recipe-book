import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductListService } from './product-list.service';
import { CartService } from '../../services/cart.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { of, Subject } from 'rxjs';
import { Product } from './product.model';

describe('ProductListComponent', () => {
    let component: ProductListComponent;
    let fixture: ComponentFixture<ProductListComponent>;
    let mockPlService: any;
    let mockCartService: any;
    let mockShoppingListService: any;

    beforeEach(async () => {
        mockPlService = {
            getPagedProducts: jasmine.createSpy().and.returnValue(of({ items: [{ name: 'Apple', quantity: 0 }], totalCount: 1 })),
            productsFoundChanged: new Subject<Product[]>(),
            showShoppingListItems: false,
            searchAndUpdateMatchedProducts: jasmine.createSpy(),
            getProductsByName: jasmine.createSpy().and.returnValue(of([{ name: 'Banana', quantity: 0 }])),
            translateToGerman: jasmine.createSpy().and.returnValue(Promise.resolve('Banane'))
        };
        mockCartService = {
            addToCart: jasmine.createSpy(),
            decrementQuantity: jasmine.createSpy()
        };
        mockShoppingListService = {
            getIngredients: jasmine.createSpy().and.returnValue([
                { baseName: { name: 'Milk' } },
                { baseName: { name: 'Eggs' } }
            ])
        };

        await TestBed.configureTestingModule({
            declarations: [ProductListComponent],
            providers: [
                { provide: ProductListService, useValue: mockPlService },
                { provide: CartService, useValue: mockCartService },
                { provide: ShoppingListService, useValue: mockShoppingListService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should load products on init', () => {
        expect(mockPlService.getPagedProducts).toHaveBeenCalledWith(1, 20);
        expect(component.pagedProducts.length).toBe(1);
        expect(component.totalPages).toBe(1);
    });

    it('should add product to cart with quantity 1', () => {
        const product: Product = {
            id: '1',
            name: 'Apple',
            quantity: 0,
            price: 1.99,
            currency: 'EUR',
            customerReview: '',
            category: '',
            reviewCount: '0',
            imageLink: '',
            productLink: '',
            productId: '',
            grammage: '', 
            sourceName: '', 
            isOnSale: false 
        };
        component.addToCart(product);
        expect(product.quantity).toBe(1);
        expect(mockCartService.addToCart).toHaveBeenCalledWith(product);
    });

    it('should increment product quantity and update cart', () => {
        const product: Product = {
            id: '2',
            name: 'Apple',
            quantity: 2,
            price: 1.99,
            currency: 'EUR',
            customerReview: '',
            category: '',
            reviewCount: '0',
            imageLink: '',
            productLink: '',
            productId: '',
            grammage: '',
            sourceName: '',
            isOnSale: false
        };
        component.increment(product);
        expect(product.quantity).toBe(3);
        expect(mockCartService.addToCart).toHaveBeenCalledWith(product);
    });

    it('should decrement product quantity and update cart', () => {
        const product: Product = {
            id: '3',
            name: 'Apple',
            quantity: 3,
            price: 1.99,
            currency: 'EUR',
            customerReview: '',
            category: '',
            reviewCount: '0',
            imageLink: '',
            productLink: '',
            productId: '',
            grammage: '',
            sourceName: '',
            isOnSale: false
        };
        component.decrement(product);
        expect(product.quantity).toBe(2);
        expect(mockCartService.addToCart).toHaveBeenCalledWith(product);
    });

    it('should set quantity to 0 and call decrementQuantity if quantity is 1', () => {
        const product: Product = {
            id: '4',
            name: 'Apple',
            quantity: 1,
            price: 1.99,
            currency: 'EUR',
            customerReview: '',
            category: '',
            reviewCount: '0',
            imageLink: '',
            productLink: '',
            productId: '',
            grammage: '',
            sourceName: '',
            isOnSale: false
        };
        component.decrement(product);
        expect(product.quantity).toBe(0);
        expect(mockCartService.decrementQuantity).toHaveBeenCalledWith(product);
    });

    it('should clear productsFound and filteredFound if searchFound is empty', () => {
        component.productsFound = [{
            id: '1',
            name: 'Apple',
            quantity: 1,
            price: 1.99,
            currency: 'EUR',
            customerReview: '',
            category: '',
            reviewCount: '0',
            imageLink: '',
            productLink: '',
            productId: '',
            grammage: '',
            sourceName: '',
            isOnSale: false
        }];
        component.searchFound = '   ';
        component.onSearchFoundChange();
        expect(component.productsFound).toEqual([]);
        expect(component.filteredFound).toEqual([]);
    });

    it('should call searchAndUpdateMatchedProducts with correct ProductSearch', () => {
        component.searchFound = 'apple';
        component.onSearchFoundChange();
        expect(mockPlService.searchAndUpdateMatchedProducts).toHaveBeenCalledWith({
            source: 'all-stores',
            names: ['apple']
        });
    });

    it('should filter productsFound by searchFound', () => {
        component.productsFound = [
            {
                id: '1',
                name: 'Apple',
                quantity: 1,
                price: 1.99,
                currency: 'EUR',
                customerReview: '',
                category: '',
                reviewCount: '0',
                imageLink: '',
                productLink: '',
                productId: '',
                grammage: '',
                sourceName: '',
                isOnSale: false
            },
            {
                id: '2',
                name: 'Banana',
                quantity: 1,
                price: 0.99,
                currency: 'EUR',
                customerReview: '',
                category: '',
                reviewCount: '0',
                imageLink: '',
                productLink: '',
                productId: '',
                grammage: '',
                sourceName: '',
                isOnSale: false
            }
        ];
        component.searchFound = 'app';
        component.filterFound();
        expect(component.filteredFound.length).toBe(1);
        expect(component.filteredFound[0].name).toBe('Apple');
    });

    it('should call loadProducts if searchAll is empty in filterAll', () => {
        spyOn(component, 'loadProducts');
        component.searchAll = ' ';
        component.filterAll();
        expect(component.loadProducts).toHaveBeenCalled();
    });

    it('should call getProductsByName with translated term in filterAll', async () => {
        component.searchAll = 'banana';
        await component.filterAll();
        expect(mockPlService.translateToGerman).toHaveBeenCalledWith('banana');
        expect(mockPlService.getProductsByName).toHaveBeenCalledWith({
            source: 'all-stores',
            names: ['banane']
        });
        expect(component.pagedProducts[0].name).toBe('Banana');
    });

    it('should change page and load products', () => {
        spyOn(component, 'loadProducts');
        component.changePage(2);
        expect(component.currentPage).toBe(2);
        expect(component.loadProducts).toHaveBeenCalled();
    });

    it('should return correct totalPagesArray', () => {
        component.totalPages = 10;
        component.currentPage = 5;
        const arr = component.totalPagesArray;
        expect(arr.length).toBe(5);
        expect(arr[0]).toBe(3);
        expect(arr[4]).toBe(7);
    });

    it('should call searchAndUpdateMatchedProducts with ingredient names on shopping list toggle', () => {
        const event = { target: { checked: true } } as any as Event;
        component.onShoppingListToggle(event);
        expect(mockShoppingListService.getIngredients).toHaveBeenCalled();
        expect(mockPlService.searchAndUpdateMatchedProducts).toHaveBeenCalledWith({
            source: 'all-stores',
            names: ['Milk', 'Eggs']
        });
    });

    it('should return correct brand logo url', () => {
        expect(component.getBrandLogoUrl('REWE')).toContain('REWE_Dein_Markt-Logo_neu.png');
        expect(component.getBrandLogoUrl('LIDL')).toContain('Lidl-Logo.svg');
        expect(component.getBrandLogoUrl('PENNY')).toContain('Penny-Logo.svg');
        expect(component.getBrandLogoUrl('ALDI')).toContain('AldiWorldwideLogo.svg');
        expect(component.getBrandLogoUrl('UNKNOWN')).toBe('');
    });

    it('should update productsFound and showShoppingList on productsFoundChanged', () => {
        mockPlService.showShoppingListItems = true;
        mockPlService.productsFoundChanged.next([{ name: 'Orange', quantity: 1 }]);
        expect(component.productsFound[0].name).toBe('Orange');
        expect(component.showShoppingList).toBeTrue();
    });
});