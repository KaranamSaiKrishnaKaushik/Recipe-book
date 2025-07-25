import { ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ProductListService } from '../product-list/product-list.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';
import { MatTableDataSource } from '@angular/material/table';

describe('ShoppingListComponent', () => {
    let component: ShoppingListComponent;
    let fixture: ComponentFixture<ShoppingListComponent>;
    let slService: jasmine.SpyObj<ShoppingListService>;
    let plService: jasmine.SpyObj<ProductListService>;
    let cartService: jasmine.SpyObj<CartService>;
    let router: jasmine.SpyObj<Router>;
    let route: ActivatedRoute;

    beforeEach(async () => {
        slService = jasmine.createSpyObj('ShoppingListService', [
            'getIngredients',
            'startedEditing'
        ], {
            ingredientsChanged: new Subject<Ingredient[]>()
        });
        plService = jasmine.createSpyObj('ProductListService', [
            'translateToGerman',
            'searchAndUpdateMatchedProducts'
        ]);
        cartService = jasmine.createSpyObj('CartService', [
            'loadOrderedItemHistory'
        ], {
            orderedItemHistory$: of([])
        });
        router = jasmine.createSpyObj('Router', ['navigate']);
        route = {} as ActivatedRoute;
        slService.getIngredients.and.returnValue([]); // Ensure getIngredients returns an array to avoid undefined.map error

        await TestBed.configureTestingModule({
            declarations: [ShoppingListComponent],
            providers: [
                { provide: ShoppingListService, useValue: slService },
                { provide: ProductListService, useValue: plService },
                { provide: CartService, useValue: cartService },
                { provide: Router, useValue: router },
                { provide: ActivatedRoute, useValue: route }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA] // Suppress unknown element errors like mat-slide-toggle
        }).compileComponents();

        fixture = TestBed.createComponent(ShoppingListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should initialize ingredients and subscribe to changes on ngOnInit', () => {
        const mockIngredients = [
            { baseName: { name: 'Apple' }, amount: 2 },
            { baseName: { name: 'Banana' }, amount: 3 }
        ];
        slService.getIngredients.and.returnValue(mockIngredients as any);
        const changedIngredients = [
            { baseName: { name: 'Orange' }, amount: 5 }
        ];
        (slService.ingredientsChanged as Subject<Ingredient[]>).next(changedIngredients as any);

        component.ngOnInit();

        expect(component.ingredients).toEqual([
            { name: 'Apple', amount: 2 },
            { name: 'Banana', amount: 3 }
        ]);
        expect(component.dataSource.data).toEqual([
            { name: 'Apple', amount: 2 },
            { name: 'Banana', amount: 3 }
        ]);
    });
 /* 
    it('should call startedEditing with correct index on onEditItem', () => {
        component.ingredients = [
            { name: 'Milk', amount: 1 },
            { name: 'Eggs', amount: 2 }
        ];
        spyOn(slService.startedEditing, 'next');
        component.onEditItem('Eggs');
        expect(slService.startedEditing.next).toHaveBeenCalledWith(1);
    });  */

    it('should translate ingredients and navigate to product-list on onToMarketPlace', fakeAsync(() => {
        component.ingredients = [
            { name: 'Milk', amount: 1 },
            { name: 'Eggs', amount: 2 }
        ];
        plService.translateToGerman.and.callFake((name: string) => Promise.resolve(name + '_de'));
        plService.searchAndUpdateMatchedProducts.and.stub();

        component.onToMarketPlace();
        tick();

        expect(plService.translateToGerman).toHaveBeenCalledTimes(2);
        expect(plService.searchAndUpdateMatchedProducts).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/product-list'], { relativeTo: route });
    }));

/*     it('should apply column filter', () => {
        const event = { target: { value: 'milk' } } as any as Event;
        spyOnProperty(component, 'dataSource', 'get').and.returnValue(new MatTableDataSource<any>());
        component.applyColumnFilter(event, 'name');
        expect(component.filterValues.name).toBe('milk');
    }); */

    it('should create a filter function that matches data', () => {
        const filterFn = component.createFilter();
        const data = { name: 'milk', amount: 2 };
        const filter = JSON.stringify({ name: 'milk', amount: '' });
        expect(filterFn(data, filter)).toBeTrue();
    });

    it('should prepare spending over time grouped by month', () => {
        component.groupBy = 'month';
        const history = [
            { createdDateTime: '2024-05-01', price: 10 },
            { createdDateTime: '2024-05-15', price: 20 },
            { createdDateTime: '2024-06-01', price: 30 }
        ];
        component.prepareSpendingOverTime(history);
        expect(component.spendingDates.length).toBeGreaterThan(0);
        expect(component.spendingValues.length).toBe(component.spendingDates.length);
    });

    it('should prepare spending by store', () => {
        component.groupBy = 'month';
        const now = new Date();
        const history = [
            { createdDateTime: now.toISOString(), price: 10, sourceName: 'StoreA' },
            { createdDateTime: now.toISOString(), price: 20, sourceName: 'StoreB' }
        ];
        component.prepareSpendingByStore(history);
        expect(component.storeLabels).toContain('StoreA');
        expect(component.storeSpendings.length).toBe(2);
    });

    it('should prepare top products', () => {
        component.groupBy = 'month';
        const now = new Date();
        const history = [
            { createdDateTime: now.toISOString(), name: 'Milk' },
            { createdDateTime: now.toISOString(), name: 'Milk' },
            { createdDateTime: now.toISOString(), name: 'Eggs' }
        ];
        component.prepareTopProducts(history);
        expect(component.topProductNames).toContain('Milk');
        expect(component.topProductCounts[0]).toBeGreaterThan(0);
    });

    it('should prepare average price per category', () => {
        const history = [
            { category: 'Dairy', price: 10 },
            { category: 'Dairy', price: 20 },
            { category: 'Fruit', price: 30 }
        ];
        component.prepareAveragePricePerCategory(history);
        expect(component.avgPriceCategoryLabels).toContain('Dairy');
        expect(component.avgPriceCategoryValues.length).toBe(2);
    });

    it('should update groupBy and call prepare methods on onGroupChange', () => {
        spyOn(component, 'prepareSpendingOverTime');
        spyOn(component, 'prepareTopProducts');
        spyOn(component, 'prepareSpendingByStore');
        component.orderedItemHistoryList = [];
        component.onGroupChange('quarter');
        expect(component.groupBy).toBe('quarter');
        expect(component.prepareSpendingOverTime).toHaveBeenCalled();
        expect(component.prepareTopProducts).toHaveBeenCalled();
        expect(component.prepareSpendingByStore).toHaveBeenCalled();
    });

/*     it('should update pagination in updatePagination', () => {
        component.showAll = false;
        const paginator = { pageIndex: 0 } as any;
        component['dataSource'].paginator = paginator;
        component['_paginator'] = paginator;
        component.updatePagination();
        expect(component['dataSource'].paginator).toBe(paginator);
    });
*/

     it('should set and get results', () => {
        const results = [{ name: 'Milk', amount: 1 }];
        component.results = results;
        expect(component.results).toBe(results);
        expect(component.dataSource.data).toBe(results);
    }); 
});