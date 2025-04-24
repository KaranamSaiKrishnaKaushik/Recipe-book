import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropListsComponent } from './drag-drop-lists.component';

describe('DragDropListsComponent', () => {
  let component: DragDropListsComponent;
  let fixture: ComponentFixture<DragDropListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragDropListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragDropListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
