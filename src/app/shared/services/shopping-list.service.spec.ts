import { TestBed } from '@angular/core/testing';
import { ShoppingListService } from './shopping-list.service';
import { HttpClient } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';

describe('ShoppingListService', () => {
    let service: ShoppingListService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    const mockIngredients: Ingredient[] = [
            { baseName: { name: 'Apple' }, amount: 2 },
            { baseName: { name: 'Banana' }, amount: 3 }
        ];;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
        TestBed.configureTestingModule({
            providers: [
                ShoppingListService,
                { provide: HttpClient, useValue: httpClientSpy }
            ]
        });
        service = TestBed.inject(ShoppingListService);
        service.url = 'http://test/';
    });

    it('ngOnInit should fetch ingredients and set them', () => {
        httpClientSpy.get.and.returnValue(of(mockIngredients));
        service.ngOnInit();
        expect(httpClientSpy.get).toHaveBeenCalledWith('http://test/ingredients');
        expect(service.ingredients).toEqual(mockIngredients);
    });

    it('fetchIngredientsFromDataSource should update ingredients and emit', (done) => {
        httpClientSpy.get.and.returnValue(of(mockIngredients));
        service.ingredientsChanged.subscribe((ingredients) => {
            expect(ingredients.length).toBe(2);
            expect(ingredients).toEqual(mockIngredients);
            done();
        });
        service.fetchIngredientsFromDataSource();
    });

    it('addSingleIngredientToList should call changeIngredientOrderList', () => {
        spyOn(service, 'changeIngredientOrderList');
        const ingredient: Ingredient = { baseName: { name: 'Tomato' }, amount: 1 };
        service.addSingleIngredientToList(ingredient);
        expect(service.changeIngredientOrderList).toHaveBeenCalledWith(ingredient, 'add-single-ingredient');
    });

    it('addMultipleIngredientsToList should POST and fetch ingredients', () => {
        httpClientSpy.post.and.returnValue(of({}));
        spyOn(service, 'fetchIngredientsFromDataSource');
        service.addMultipleIngredientsToList(mockIngredients);
        expect(httpClientSpy.post).toHaveBeenCalledWith('http://test/add-multiple-ingredients', mockIngredients);
        expect(service.fetchIngredientsFromDataSource).toHaveBeenCalled();
    });

    it('updateSingleIngredient should call changeIngredientOrderList', () => {
        spyOn(service, 'changeIngredientOrderList');
        const ingredient: Ingredient = { baseName: { name: 'Potato' }, amount: 5 };
        service.updateSingleIngredient(ingredient);
        expect(service.changeIngredientOrderList).toHaveBeenCalledWith(ingredient, 'update-single-ingredient');
    });

    it('changeIngredientOrderList should POST and fetch ingredients', () => {
        httpClientSpy.post.and.returnValue(of({}));
        spyOn(service, 'fetchIngredientsFromDataSource');
        const ingredient: Ingredient = { baseName: { name: 'Carrot' }, amount: 2 };
        service.changeIngredientOrderList(ingredient, 'custom-endpoint');
        expect(httpClientSpy.post).toHaveBeenCalledWith('http://test/custom-endpoint', ingredient);
        expect(service.fetchIngredientsFromDataSource).toHaveBeenCalled();
    });

    it('removeIngredient should DELETE and fetch ingredients', () => {
        httpClientSpy.delete.and.returnValue(of({}));
        spyOn(service, 'fetchIngredientsFromDataSource');
        const ingredient: Ingredient = { baseName: { name: 'Onion' }, amount: 1 };
        service.removeIngredient(ingredient);
        expect(httpClientSpy.delete).toHaveBeenCalledWith('http://test/remove-ingredient', { body: ingredient });
        expect(service.fetchIngredientsFromDataSource).toHaveBeenCalled();
    });

    it('getIngredients should fetch and return a copy of ingredients', () => {
        spyOn(service, 'fetchIngredientsFromDataSource');
        service.ingredients = mockIngredients;
        const result = service.getIngredients();
        expect(service.fetchIngredientsFromDataSource).toHaveBeenCalled();
        expect(result).toEqual(mockIngredients);
        expect(result).not.toBe(service.ingredients);
    });

    it('getIngredient should return ingredient by index', () => {
        service.ingredients = mockIngredients;
        expect(service.getIngredient(1)).toEqual(mockIngredients[1]);
    });

    it('addIngredient should call addSingleIngredientToList', () => {
        spyOn(service, 'addSingleIngredientToList');
        const ingredient: Ingredient = { baseName: { name: 'Pepper' }, amount: 4 };
        service.addIngredient(ingredient);
        expect(service.addSingleIngredientToList).toHaveBeenCalledWith(ingredient);
    });

    it('updateIngredient should call updateSingleIngredient', () => {
        spyOn(service, 'updateSingleIngredient');
        const ingredient: Ingredient = { baseName: { name: 'Salt' }, amount: 1 };
        service.updateIngredient(0, ingredient);
        expect(service.updateSingleIngredient).toHaveBeenCalledWith(ingredient);
    });
});