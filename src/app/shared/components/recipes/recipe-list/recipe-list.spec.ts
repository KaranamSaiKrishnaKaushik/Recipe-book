import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RecipeListComponent } from "./recipe-list.component";
import { RecipeService } from "src/app/shared/services/recipe.service";
import { of } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from "src/app/shared/models/recipe.model";
import { Ingredient } from "src/app/shared/models/ingredient.model";

describe('RecipeListComponent', () => {
  let comp: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let mockService: {
    getRecipe: jasmine.Spy<jasmine.Func>;
    getAllRecipesFromDataSource: jasmine.Spy<jasmine.Func>;
    addIngredientsToShoppingList: jasmine.Spy<jasmine.Func>;
    recipesChanged?: any;
    deleteRecipe: jasmine.Spy<jasmine.Func>;
    fetchRecipesFromDataSource: jasmine.Spy<jasmine.Func>;
    getRecipes: jasmine.Spy<jasmine.Func>;
  };
  let mockRouter: { navigate: jasmine.Spy };
  let mockRoute: any;

  beforeEach(waitForAsync(() => {
     const recipe: Recipe = { id:'0', name:'N', ingredients:[{amount:1, baseName:{name:'X'}}], imagePath:'', description:'', instructions:'', category:'' };
            const ingredients: Ingredient[] = [{amount:1, baseName:{name:'X'}}]
 mockService = {
            getRecipe: jasmine.createSpy().and.returnValue(recipe),
            getAllRecipesFromDataSource: jasmine.createSpy().and.returnValue(of([recipe])),
            addIngredientsToShoppingList: jasmine.createSpy(),
            recipesChanged: of([recipe]), // Mock as Observable
            deleteRecipe: jasmine.createSpy(),
            fetchRecipesFromDataSource: jasmine.createSpy().and.returnValue(of([recipe])),
            getRecipes: jasmine.createSpy().and.returnValue([recipe])
        };

    mockRouter = { navigate: jasmine.createSpy() };
    mockRoute = {
      snapshot: { url: [] },
      url: []
    };

    TestBed.configureTestingModule({
      declarations: [RecipeListComponent],
      providers: [
        { provide: RecipeService, useValue: mockService },
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: Router, useValue: mockRouter}
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(RecipeListComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should navigate to new on onNewRecipe', () => {
    comp.onNewRecipe();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['new'], { relativeTo: mockRoute });
  });

    describe('onFileDrop', () => {
        let file: File;
        let event: DragEvent;
        let fileReaderMock: any;

        beforeEach(() => {
            file = new File([JSON.stringify([{
                name: 'Test',
                description: '',
                imagePath: '',
                ingredients: [],
                category: '',
                instructions: ''
            }])], 'recipes.json', { type: 'application/json' });
            fileReaderMock = {
                readAsText: jasmine.createSpy(),
                onload: null,
                result: JSON.stringify([{
                    name: 'Test',
                    description: '',
                    imagePath: '',
                    ingredients: [],
                    category: '',
                    instructions: ''
                }])
            };
            spyOn(window as any, 'FileReader').and.returnValue(fileReaderMock);
        });

        it('should set importedRecipes and clear importError for valid JSON array', () => {
            event = { preventDefault: jasmine.createSpy(), dataTransfer: { files: [file] } } as any;
            comp.onFileDrop(event);
            expect(event.preventDefault).toHaveBeenCalled();
            expect(fileReaderMock.readAsText).toHaveBeenCalledWith(file);

            fileReaderMock.onload();
            expect(comp.importedRecipes).toEqual([{
                name: 'Test',
                description: '',
                imagePath: '',
                ingredients: [],
                category: '',
                instructions: '',
            }]);
            expect(comp.importError).toBeNull();
        });

        it('should set importError if file is not JSON', () => {
            const txtFile = new File(['test'], 'test.txt', { type: 'text/plain' });
            event = { preventDefault: jasmine.createSpy(), dataTransfer: { files: [txtFile] } } as any;
            comp.onFileDrop(event);
            expect(comp.importError).toBe('Please upload a valid JSON file');
        });

        it('should set importError if JSON is not an array', () => {
            fileReaderMock.result = '{"foo": "bar"}';
            event = { preventDefault: jasmine.createSpy(), dataTransfer: { files: [file] } } as any;
            comp.onFileDrop(event);
            fileReaderMock.onload();
            expect(comp.importError).toBe('Failure in conversion');
        });

        it('should set importError if JSON is invalid', () => {
            fileReaderMock.result = 'not a json';
            event = { preventDefault: jasmine.createSpy(), dataTransfer: { files: [file] } } as any;
            comp.onFileDrop(event);
            fileReaderMock.onload();
            expect(comp.importError).toBe('Failure in conversion');
        });

        it('should set importError to false if the file is a valid JSON', () => {
            const txtFile = new File(['[{"name": "Test"}]'], 'test.json', { type: 'application/json' });
            event = { preventDefault: jasmine.createSpy(), dataTransfer: { files: [txtFile] } } as any;
            comp.onFileDrop(event);
            expect(comp.importError).toBeNull()
        });
    });

    describe('onFileDropped', () => {
        let file: File;
        let fileReaderMock: any;

        beforeEach(() => {
            file = new File([JSON.stringify([{
                name: 'Test',
                description: '',
                imagePath: '',
                ingredients: [],
                category: '',
                instructions: ''
            }])], 'recipes.json', { type: 'application/json' });
            fileReaderMock = {
                readAsText: jasmine.createSpy(),
                onload: null,
                result: JSON.stringify([{
                    name: 'Test',
                    description: '',
                    imagePath: '',
                    ingredients: [],
                    category: '',
                    instructions: ''
                }])
            };
            spyOn(window as any, 'FileReader').and.returnValue(fileReaderMock);
        });

        it('should set parsedRecipes and clear jsonError for valid JSON array', () => {
            comp.onFileDropped(file);
            fileReaderMock.onload();
            expect(comp.parsedRecipes).toEqual([{
                name: 'Test',
                description: '',
                imagePath: '',
                ingredients: [],
                category: '',
                instructions: '',
            }]);
            expect(comp.jsonError).toBeNull();
        });

        it('should set jsonError if JSON is not an array', () => {
            fileReaderMock.result = '{"foo": "bar"}';
            comp.onFileDropped(file);
            fileReaderMock.onload();
            expect(comp.parsedRecipes).toBeNull();
            expect(comp.jsonError).toBe('Failed to convert file to Recipe list. Please check the format.');
        });

        it('should set jsonError if JSON is invalid', () => {
            fileReaderMock.result = 'not a json';
            comp.onFileDropped(file);
            fileReaderMock.onload();
            expect(comp.parsedRecipes).toBeNull();
            expect(comp.jsonError).toBe('Failed to convert file to Recipe list. Please check the format.');
        });
    });

    describe('onImportRecipes', () => {
        beforeEach(() => {
            comp.fileContent = JSON.stringify([{ name: 'Imported' }]);
            (comp as any).recipeService = {
                addAllRecipes: jasmine.createSpy().and.returnValue(of({})),
                fetchRecipesFromDataSource: jasmine.createSpy()
            } as any;
            comp.showImportModal = true;
        });

        it('should set importError if fileContent is empty', () => {
            comp.fileContent = '';
            comp.onImportRecipes();
            expect(comp.importError).toBe('No JSON content found');
        });

        it('should set importError if fileContent is invalid JSON', () => {
            comp.fileContent = 'not a json';
            comp.onImportRecipes();
            expect(comp.importError).toBe('Invalid JSON format. Please correct it and try again.');
        });

        it('should set importError if fileContent is not an array', () => {
            comp.fileContent = '{"foo": "bar"}';
            comp.onImportRecipes();
            expect(comp.importError).toBe('Invalid JSON format. Please correct it and try again.');
        });

        it('should call addAllRecipes and fetchRecipesFromDataSource on success', () => {
            comp.onImportRecipes();
            expect((comp as any).recipeService.addAllRecipes).toHaveBeenCalledWith([{ name: 'Imported' }]);
            expect((comp as any).recipeService.fetchRecipesFromDataSource).toHaveBeenCalled();
            expect(comp.showImportModal).toBeFalse();
        });

        it('should set importError on addAllRecipes error', () => {
            (comp as any).recipeService.addAllRecipes = jasmine.createSpy().and.returnValue({
                subscribe: (_success: any, error: any) => error('err')
            });
            spyOn(console, 'error');
            comp.onImportRecipes();
            expect(comp.importError).toBe('Error importing recipes');
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('copyJson', () => {
        let jsonElement: HTMLElement;
        beforeEach(() => {
            jsonElement = document.createElement('div');
            jsonElement.id = 'jsonPrompt';
            jsonElement.innerText = 'test json';
            document.body.appendChild(jsonElement);
            spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
            spyOn(window, 'alert');
        });

        afterEach(() => {
            document.body.removeChild(jsonElement);
        });

        it('should copy JSON to clipboard and alert success', async () => {
            await comp.copyJson();
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test json');
            expect(window.alert).toHaveBeenCalledWith('JSON copied to clipboard!');
        });

    });

 it('should set recipes on ngOnInit', () => {
        const mockRecipes = [{
                id: '0',
                name: 'N',
                description: '',
                imagePath: '',
                ingredients: [{amount:1, baseName:{name:'X'}}],
                category: '',
                instructions: ''
        }];
        mockService.getRecipes.and.returnValue(mockRecipes);
        comp.ngOnInit();
        expect(comp.recipes).toEqual(mockRecipes);
    });  

});