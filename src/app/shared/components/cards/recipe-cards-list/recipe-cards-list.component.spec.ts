import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeCardsListComponent } from './recipe-cards-list.component';
import { RecipeService } from '../../../services/recipe.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { of, Subject } from 'rxjs';

const mockRecipes = [
  {
    name: 'Test Recipe',
    description: 'Test Description',
    ingredients: [{ baseName: { name: 'Salt' }, amount: 1 }],
    instructions: 'Step 1\nStep 2',
    imagePath: 'test.jpg',
    category: 'Test Category'
  }
];

describe('RecipeCardsListComponent', () => {
  let component: RecipeCardsListComponent;
  let fixture: ComponentFixture<RecipeCardsListComponent>;
  let recipeService: any;
  let settingsService: any;
  let cartService: any;

  beforeEach(async () => {
    recipeService = {
      getRecipes: jasmine.createSpy().and.returnValue(mockRecipes),
      recipesChanged: new Subject()
    };
    settingsService = {
      updateSocialUserEmailId: jasmine.createSpy()
    };
    cartService = {
      loadCartFromApi: jasmine.createSpy(),
      cart$: of([])
    };

    await TestBed.configureTestingModule({
      declarations: [RecipeCardsListComponent],
      providers: [
        { provide: RecipeService, useValue: recipeService },
        { provide: SettingsService, useValue: settingsService },
        { provide: CartService, useValue: cartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('truncate should return truncated text', () => {
    const text = 'one two three four five';
    expect(component.truncate(text, 3)).toBe('one two three...');
  });
 
   it('should initialize recipes from service', () => {
    expect(component.recipes).toEqual(mockRecipes);
  }); 

  it('should update recipes on recipesChanged', () => {
    const newRecipes = [{ name: 'New', description: '', ingredients: [], instructions: '', imagePath: '', category: 'Test Category' }];
    recipeService.recipesChanged.next(newRecipes);
    expect(component.recipes).toEqual(newRecipes);
  });

  it('should call cartService.loadCartFromApi on init', () => {
    expect(cartService.loadCartFromApi).toHaveBeenCalled();
  });

  it('should call settingsService.updateSocialUserEmailId if isSocialMediaAccount in localStorage', () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'isSocialMediaAccount') return 'true';
      if (key === 'userEmail') return JSON.stringify('test@email.com');
      return null;
    });
    component.ngOnInit();
    expect(settingsService.updateSocialUserEmailId).toHaveBeenCalledWith('test@email.com');
    });
  

  it('onCardSelected should set selectedCard and add no-scroll class', () => {
    spyOn(document.body.classList, 'add');
    component.onCardSelected(mockRecipes[0]);
    expect(component.selectedCard).toEqual(mockRecipes[0]);
    expect(document.body.classList.add).toHaveBeenCalledWith('no-scroll');
  }); 


  it('closeOverlay should clear selectedCard and remove no-scroll class', () => {
    spyOn(document.body.classList, 'remove');
    component.selectedCard = mockRecipes[0];
    component.closeOverlay();
    expect(component.selectedCard).toBeNull();
    expect(document.body.classList.remove).toHaveBeenCalledWith('no-scroll');
  });
 
  it('truncate should return truncated text', () => {
    const text = 'one two three four five';
    expect(component.truncate(text, 3)).toBe('one two three...');
  });

  describe('printCard', () => {
  let originalInnerHTML: string;
  let reloadSpy: jasmine.Spy;
  
  beforeEach(() => {
    originalInnerHTML = document.body.innerHTML;
    spyOn(window, 'print');
    
    reloadSpy = jasmine.createSpy('reload');
    Object.defineProperty(window.location, 'reload', {
      value: reloadSpy,
      writable: true
    });
  });
  
  afterEach(() => {
    document.body.innerHTML = originalInnerHTML;
  });


/*     it('should print card if print-card exists', () => {
      const div = document.createElement('div');
      div.className = 'print-card';
      div.innerHTML = 'PRINT CONTENT';
      document.body.appendChild(div);
      component.printCard();
      expect(window.print).toHaveBeenCalled();
      expect(window.location.reload).toHaveBeenCalled();
      document.body.removeChild(div);
    }); */

/*     it('should do nothing if print-card does not exist', () => {
      component.printCard();
      expect(window.print).not.toHaveBeenCalled();
    }); */

  });

  describe('getBase64ImageFromUrl', () => {
    let component: RecipeCardsListComponent;
    beforeEach(() => {
      component = TestBed.createComponent(RecipeCardsListComponent).componentInstance;
    });

   /*  it('should resolve empty string if imageUrl is empty', async () => {
      const result = await component.getBase64ImageFromUrl('');
      expect(result).toBe('');
    });

    it('should resolve base64 string if fetch succeeds', async () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(blob)
      } as any));
      spyOn(window as any, 'FileReader').and.callFake(function (this: any) {
        this.readAsDataURL = () => { this.onloadend(); };
        this.result = 'data:image/png;base64,TEST';
      });
      const result = await component.getBase64ImageFromUrl('test.png');
      expect(result).toBe('data:image/png;base64,TEST');
    });

    it('should resolve empty string if fetch fails', async () => {
      spyOn(window, 'fetch').and.returnValue(Promise.reject('fail'));
      const result = await component.getBase64ImageFromUrl('bad.png');
      expect(result).toBe('');
    });

    it('should resolve empty string if fetch response is not ok', async () => {
      spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as any));
      const result = await component.getBase64ImageFromUrl('bad.png');
      expect(result).toBe('');
    }); */
  });

  describe('sharePDFViaAPI2', () => {
    let pdfMakeMock: any;
    let component: RecipeCardsListComponent;
    beforeEach(() => {
      component = TestBed.createComponent(RecipeCardsListComponent).componentInstance;
      pdfMakeMock = {
        createPdf: jasmine.createSpy().and.returnValue({
          getBlob: (cb: any) => cb(new Blob(['test'], { type: 'application/pdf' })),
          download: jasmine.createSpy()
        })
      };
      (component as any).selectedCard = {
        name: 'Test',
        description: 'Desc',
        ingredients: [{ baseName: { name: 'Salt' } }],
        instructions: 'Step 1',
        imagePath: 'img.png',
        category: 'Test Category'
      };
      spyOn(component, 'getBase64ImageFromUrl').and.returnValue(Promise.resolve('base64img'));
      (window as any).pdfMake = pdfMakeMock;
    });

   /*  it('should not proceed if selectedCard is null', () => {
      component.selectedCard = null;
      expect(() => component.sharePDFViaAPI2()).not.toThrow();
    });

    it('should call download if navigator.share is not available', async () => {
      (window as any).navigator = {};
      await component.sharePDFViaAPI2();
      expect(pdfMakeMock.createPdf().download).toHaveBeenCalledWith('recipe.pdf');
    }); */

 /*    it('should call navigator.share if available', async () => {
      const shareSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
      (window as any).navigator = {
        canShare: () => true,
        share: shareSpy
      };
      await component.sharePDFViaAPI2();
      expect(shareSpy).toHaveBeenCalled();
    }); */

  /*   it('should fallback to download if navigator.share fails', async () => {
      const shareSpy = jasmine.createSpy().and.returnValue(Promise.reject('fail'));
      (window as any).navigator = {
        canShare: () => true,
        share: shareSpy
      };
      await component.sharePDFViaAPI2();
      expect(pdfMakeMock.createPdf().download).toHaveBeenCalledWith('recipe.pdf');
    }); */
  });
});