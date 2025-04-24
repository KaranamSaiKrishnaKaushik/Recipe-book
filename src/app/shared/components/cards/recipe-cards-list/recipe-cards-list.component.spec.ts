import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCardsListComponent } from './recipe-cards-list.component';

describe('RecipeCardsListComponent', () => {
  let component: RecipeCardsListComponent;
  let fixture: ComponentFixture<RecipeCardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeCardsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
