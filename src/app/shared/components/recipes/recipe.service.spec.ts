import { RecipeService } from "../../services/recipe.service";
import {HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ShoppingListService } from "../../services/shopping-list.service";
import { TestBed } from "@angular/core/testing";
import { Recipe } from "../../models/recipe.model";

describe('RecipeService', ()=>{
    let service: RecipeService;
    let httpMock: HttpTestingController;
    let mockSL: ShoppingListService;

    beforeEach(()=>{
        mockSL = { addMultipleIngredientsToList: jasmine.createSpy() } as any;
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RecipeService, {provide: ShoppingListService, useValue: mockSL}]
        });

        service = TestBed.inject(RecipeService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(()=> httpMock.verify());

    it('should fetch recipes and publish', ()=>{
        const dummy: Recipe[] = [{ id: '1', name: 'Test', ingredients: [], imagePath:'', description:'', instructions:'', category:'' }];
        let published: Recipe[] | undefined;
        service.recipesChanged.subscribe(r => published = r);

        service.fetchRecipesFromDataSource();
    
        const req = httpMock.expectOne(service.url + 'fetch-all-recipes');
        expect(req.request.method).toBe('GET');
        req.flush(dummy);

        expect(service.recipes).toEqual(dummy);
        expect(published).toEqual(dummy);
    });

    it('addRecipe should POST and refresh',()=>{
        spyOn(service, 'fetchRecipesFromDataSource');
        const recipe: Recipe = { id:'2', name:'A', ingredients:[], imagePath:'', description:'', instructions:'', category:'' };
        service.addRecipe(recipe);
        const req = httpMock.expectOne(service.url+'add-recipe');
        expect(req.request.body).toBe(recipe);
        req.flush({});
        expect(service.fetchRecipesFromDataSource).toHaveBeenCalled();
    });

    it('addAllRecipes should POST and refresh',()=>{
       spyOn(service,'fetchRecipesFromDataSource');
       const recipes: Recipe[] = [{ id:'1', name:'A', ingredients:[], imagePath:'', description:'', instructions:'', category:'' },
    { id:'2', name:'B', ingredients:[], imagePath:'', description:'', instructions:'', category:'' }];
        service.addAllRecipes(recipes);
        //const req = httpMock.expectOne(service.url+'add-all-recipes');
        //expect(req.request.body).toBe(recipes);
        //req.flush({});
        //expect(service.fetchRecipesFromDataSource).toHaveBeenCalled();
    });

    it('addIngredientsToShoppingList should delegate',()=>{
        const ingr = [{amount:1, baseName:{name:'X'}}];
        service.addIngredientsToShoppingList(ingr);
        expect(mockSL.addMultipleIngredientsToList).toHaveBeenCalledWith(ingr);
    });
})