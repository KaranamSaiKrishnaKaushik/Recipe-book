import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing"
import { RecipeDetailComponent } from "./recipe-detail.component"
import { of, Subject } from "rxjs";
import { Recipe } from "src/app/shared/models/recipe.model";
import { RecipeService } from "src/app/shared/services/recipe.service";
import { ShoppingListService } from "src/app/shared/services/shopping-list.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Ingredient } from "src/app/shared/models/ingredient.model";

describe('RecipeDetailComponent',()=>{
    let comp: RecipeDetailComponent;
    let fixture: ComponentFixture<RecipeDetailComponent>;
    let mockRoute: any, mockRouter: { navigate: any; }, mockService: { getRecipe: any; getAllRecipesFromDataSource?: jasmine.Spy<jasmine.Func>; recipesChanged?: Subject<Recipe[]>; addIngredientsToShoppingList?: jasmine.Spy<jasmine.Func>; deleteRecipe?: jasmine.Spy<jasmine.Func>; }, mockSL;

    // Ensure showAlert property exists for the test
    beforeAll(() => {
        Object.defineProperty(RecipeDetailComponent.prototype, 'showAlert', {
            value: false,
            writable: true
        });
    });

    beforeEach(()=>{
        mockRoute = { params: of({id:'0'}) };
        mockRouter = { navigate:  jasmine.createSpy()};
        const recipesChanged = new Subject<Recipe[]>();
        const recipe: Recipe = { id:'0', name:'N', ingredients:[{amount:1, baseName:{name:'X'}}], imagePath:'', description:'', instructions:'', category:'' };
        const ingredients: Ingredient[] = [{amount:1, baseName:{name:'X'}}]
        mockService = {
            getRecipe: jasmine.createSpy().and.returnValue(recipe),
            getAllRecipesFromDataSource: jasmine.createSpy().and.returnValue(of([recipe])),
            addIngredientsToShoppingList: jasmine.createSpy(),
            recipesChanged,
            deleteRecipe: jasmine.createSpy()
        };

        mockSL = {};

        TestBed.configureTestingModule({
            declarations: [RecipeDetailComponent],
            providers: [
                {provide: RecipeService, useValue: mockService},
                {provide: ShoppingListService, useValue: mockSL},
                {provide: ActivatedRoute, useValue: mockRoute},
                {provide: Router, useValue: mockRouter}
            ]
        });

        fixture = TestBed.createComponent(RecipeDetailComponent);
        comp = fixture.componentInstance;
    });

    it('should load recipe on init',()=>{
        fixture.detectChanges();
        expect(mockService.getRecipe).toHaveBeenCalledWith(0);
        expect(comp.recipe.name).toBe('N')
    });

    it('onAddToShoppingList calls service',()=>{
        comp.recipe = { id:'0', name:'', ingredients:[{amount:2, baseName:{name:'Y'}}], imagePath:'', description:'', instructions:'', category:'' };
        comp.onAddToShoppingList();
        expect(mockService.addIngredientsToShoppingList).toHaveBeenCalledOnceWith(comp.recipe.ingredients);
    });

    it('onEditRecipe it navigates correctly', () => {
    mockRouter.navigate.calls.reset();

    comp.onEditRecipe(); 

    expect(mockRouter.navigate).toHaveBeenCalled(); 
    expect(mockRouter.navigate).toHaveBeenCalledOnceWith(
        ['edit'],
        { relativeTo: jasmine.any(Object) }
    );
    });

    it('onDelete triggers alert and navigation', fakeAsync(() => {
      comp.recipe = {
        id: '0',
        name: '',
        ingredients: [{ amount: 2, baseName: { name: 'Y' } }],
        imagePath: '',
        description: '',
        instructions: '',
        category: ''
      };

    mockRouter.navigate.calls.reset();
  
    comp.onDeleteRecipe();
  
    mockService.recipesChanged?.next([]);
    tick();

    expect(comp.showAlert).toBeTrue();
    expect(mockRouter.navigate).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledOnceWith(
        ['/recipes']
      );
    }));
})