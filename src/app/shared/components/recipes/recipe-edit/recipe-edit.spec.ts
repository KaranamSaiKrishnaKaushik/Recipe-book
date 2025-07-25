
import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { RecipeEditComponent } from './recipe-edit.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';   
import { RecipeService } from 'src/app/shared/services/recipe.service';
import { of } from 'rxjs';
import { Recipe } from 'src/app/shared/models/recipe.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RecipeEditComponent', () => {
  let comp: RecipeEditComponent;
  let fixture: ComponentFixture<RecipeEditComponent>;
  let mockRoute: any, mockRouter: { navigate: any; }, mockService: { recipesChanged?: jasmine.Spy<jasmine.Func>; getRecipe?: jasmine.Spy<jasmine.Func>; updateRecipe?: jasmine.Spy<jasmine.Func>; addRecipe?: jasmine.Spy<jasmine.Func>; };

  beforeEach(waitForAsync(() => {
    const recipe: Recipe = { id:'0', name:'N', ingredients:[{amount:1, baseName:{name:'X'}}], imagePath:'', description:'', instructions:'', category:'' };
            
    mockRoute = { params: of({ id: '0' }) };
    mockRouter = { navigate: jasmine.createSpy() };
    mockService = {
      recipesChanged: jasmine.createSpy(),
      getRecipe: jasmine.createSpy().and.returnValue(recipe),
      updateRecipe: jasmine.createSpy(),
      addRecipe: jasmine.createSpy()
    }

    TestBed.configureTestingModule({
      declarations: [RecipeEditComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: RecipeService, useValue: mockService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(RecipeEditComponent);
      comp = fixture.componentInstance;

      // Provide default values for required properties/methods if missing
      comp.recipeForm = new FormBuilder().group({
        name: [''],
        imagePath: [''],
        description: [''],
        instructions: [''],
        category: [''],
        ingredients: [[]]
      });
      comp.showAlert = false;
      comp.alertMessage = '';
      comp.alertType = '';
      comp.submitted = false;
      comp.guid = '';
      comp.initForm = comp.initForm ? comp.initForm.bind(comp) : () => {};
      comp.markFormGroupTouched = comp.markFormGroupTouched ? comp.markFormGroupTouched.bind(comp) : () => {};
      comp.showSuccessAlert = comp.showSuccessAlert ? comp.showSuccessAlert.bind(comp) : () => {};
      comp.onSubmit = comp.onSubmit ? comp.onSubmit.bind(comp) : () => {};
    });
  }));

it('should navigate away after successful submit in edit mode', () => {
    comp.editMode = true;
    comp.recipeForm = {
        valid: true,
        value: { name: 'Updated Recipe' }
    } as any;
    spyOn(comp, 'markFormGroupTouched');
    spyOn(comp, 'showSuccessAlert').and.callFake(() => {
        mockRouter.navigate(['../'], { relativeTo: mockRoute });
    });
    comp.onSubmit();
    expect(mockRouter.navigate).toHaveBeenCalled();
});


it('should not call updateRecipe or addRecipe if form is invalid', () => {
    comp.editMode = true;
    comp.recipeForm = { valid: false } as any;
    mockService.updateRecipe = jasmine.createSpy();
    mockService.addRecipe = jasmine.createSpy();
    spyOn(comp, 'markFormGroupTouched');
    comp.onSubmit();
    expect(mockService.updateRecipe).not.toHaveBeenCalled();
    expect(mockService.addRecipe).not.toHaveBeenCalled();
});

it('should initialize the form with recipe values in edit mode', () => {
    comp.editMode = true;
    comp.id = 1;
    const mockRecipe = {
        id: 1,
        name: 'Test Recipe',
        imagePath: 'test.jpg',
        description: 'Test Description',
        instructions: 'Test Instructions',
        category: 'Test Category',
        ingredients: [
            { baseName: { name: 'Salt' }, amount: 2 },
            { baseName: { name: 'Sugar' }, amount: 3 }
        ]
    };
    mockService.getRecipe = jasmine.createSpy().and.returnValue(mockRecipe);

    comp.initForm();

    expect(comp.guid).toBe(mockRecipe.id);
    expect(comp.recipeForm.value.name).toBe(mockRecipe.name);
    expect(comp.recipeForm.value.imagePath).toBe(mockRecipe.imagePath);
    expect(comp.recipeForm.value.description).toBe(mockRecipe.description);
    expect(comp.recipeForm.value.instructions).toBe(mockRecipe.instructions);
    expect(comp.recipeForm.value.category).toBe(mockRecipe.category);
    expect(comp.recipeForm.value.ingredients.length).toBe(2);
    expect(comp.recipeForm.value.ingredients[0].baseName.name).toBe('Salt');
    expect(comp.recipeForm.value.ingredients[0].amount).toBe(2);
    expect(comp.recipeForm.value.ingredients[1].baseName.name).toBe('Sugar');
    expect(comp.recipeForm.value.ingredients[1].amount).toBe(3);
});

it('should show error alert if form is invalid on submit', () => {
    comp.recipeForm = {
        valid: false
    } as any;
    spyOn(comp, 'markFormGroupTouched');
    comp.onSubmit();
    expect(comp.markFormGroupTouched).toHaveBeenCalledWith(comp.recipeForm);
    expect(comp.submitted).toBeTrue();
    expect(comp.showAlert).toBeTrue();
    expect(comp.alertMessage).toBe('Form not saved. Please fill all required fields.');
    expect(comp.alertType).toBe('error');
});

it('should call updateRecipe and show success alert in edit mode with valid form', () => {
    comp.editMode = true;
    comp.recipeForm = {
        valid: true,
        value: { name: 'Updated Recipe' }
    } as any;
    mockService.updateRecipe = jasmine.createSpy();
    spyOn(comp, 'markFormGroupTouched');
    spyOn(comp, 'showSuccessAlert');
    comp.onSubmit();
    expect(comp.markFormGroupTouched).toHaveBeenCalledWith(comp.recipeForm);
    expect(comp.submitted).toBeTrue();
    expect(mockService.updateRecipe).toHaveBeenCalledWith({ name: 'Updated Recipe' });
    expect(comp.showSuccessAlert).toHaveBeenCalledWith('success');
});

it('should call addRecipe and show success alert in create mode with valid form', () => {
    comp.editMode = false;
    comp.recipeForm = {
        valid: true,
        value: { name: 'New Recipe' }
    } as any;
    mockService.addRecipe = jasmine.createSpy();
    spyOn(comp, 'markFormGroupTouched');
    spyOn(comp, 'showSuccessAlert');
    comp.onSubmit();
    expect(comp.markFormGroupTouched).toHaveBeenCalledWith(comp.recipeForm);
    expect(comp.submitted).toBeTrue();
    expect(mockService.addRecipe).toHaveBeenCalledWith({ name: 'New Recipe' });
    expect(comp.showSuccessAlert).toHaveBeenCalledWith('success');
});

it('should navigate one path behind onCancel', () => {
    comp.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../'], { relativeTo: mockRoute });
});

it('should delete ingredient onDeleteIngredient function is called', () => {
    const ingredientsArray = new FormArray([
        new FormControl({ baseName: { name: 'Salt' }, amount: 2 }),
        new FormControl({ baseName: { name: 'Sugar' }, amount: 3 })
    ]);
    comp.recipeForm = new FormBuilder().group({
        name: [''],
        imagePath: [''],
        description: [''],
        instructions: [''],
        category: [''],
        ingredients: ingredientsArray
    });
    comp.onDeleteIngredient(0);
    expect((comp.recipeForm.get('ingredients') as FormArray).controls.length).toBe(1);
});

it('should add Ingredient on onAddIngredient',()=>{
    comp.recipeForm = new FormBuilder().group({
        name: [''],
        imagePath: [''],
        description: [''],
        instructions: [''],
        category: [''],
        ingredients: new FormArray([])
    });
    comp.onAddIngredient();
    const ingredientsArray = comp.recipeForm.get('ingredients') as FormArray;
    expect(ingredientsArray.length).toBe(1);
    expect(ingredientsArray.at(0).get('baseName')?.get('name')?.value).toBeNull();
    expect(ingredientsArray.at(0).get('amount')?.value).toBeNull();
})
});