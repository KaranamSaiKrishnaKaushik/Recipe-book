import { ShoppingListService } from "src/app/shared/services/shopping-list.service";
import { ShoppingListEditComponent } from "./shopping-list-edit.component";
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from "rxjs";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

describe('ShoppingListEditComponent',()=>{
   let comp: ShoppingListEditComponent;
   let mockSL: Partial<ShoppingListService>;
   let fixture: ComponentFixture<ShoppingListEditComponent>;


beforeEach(waitForAsync(() => {
    mockSL = {
        getIngredients: jasmine.createSpy().and.returnValue(of([])),
        addMultipleIngredientsToList: jasmine.createSpy(),
        startedEditing: new Subject<number>(), // mock as Subject<number>
        ingredientsChanged: new Subject<any[]>(), // mock as Subject<Ingredient[]>
        ingredients: [] // mock as array, if accessed directly
    };
    
    TestBed.configureTestingModule({
        declarations: [ShoppingListEditComponent],
        imports: [FormsModule, ReactiveFormsModule],
        providers: [{ provide: ShoppingListService, useValue: mockSL }]
    }).compileComponents()
    .then (() => {
        fixture = TestBed.createComponent(ShoppingListEditComponent);
        comp = fixture.componentInstance;
        (comp as any).slService = mockSL;
        fixture.detectChanges();
})}));


/* 
   it('should fetch ingredients on init', () => {
       expect(mockSL.getIngredients).toHaveBeenCalled();
   }); */

it('should call removeIngredient with correct ingredient when onDelete is called in edit mode', () => {
     comp.editMode = true;
     const mockForm = {
          value: {
                name: 'Tomato',
                amount: 2
          }
     } as NgForm;
    // Accessing private property via bracket notation for testing purposes
    (comp as any).slService.removeIngredient = jasmine.createSpy('removeIngredient');
     comp.onDelete(mockForm);
     expect((comp as any).slService.removeIngredient).toHaveBeenCalled();
     const calledWith = ((comp as any).slService.removeIngredient as jasmine.Spy).calls.mostRecent().args[0];
     expect(calledWith.baseName.name).toBe('Tomato');
     expect(calledWith.amount).toBe(2);
});


it('should not call removeIngredient when onDelete is called and not in edit mode', () => {
     comp.editMode = false;
     const mockForm = {
          value: {
                name: 'Potato',
                amount: 3
          }
     } as NgForm;
     (comp as any).slService.removeIngredient = jasmine.createSpy('removeIngredient');
     comp.onDelete(mockForm);
     expect((comp as any).slService.removeIngredient).not.toHaveBeenCalled();
}); 
})
