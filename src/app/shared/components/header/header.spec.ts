import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CartService } from '../../services/cart.service';
import { of, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Product } from '../product-list/product.model';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let mockAuthService: any;
    let mockCartService: any;
    let userSubject: Subject<any>;
    let cartSubject: Subject<Product[]>;

    beforeEach(() => {
        userSubject = new Subject();
        cartSubject = new Subject();

        mockAuthService = {
            user: userSubject.asObservable(),
            logout: jasmine.createSpy('logout')
        };

        mockCartService = {
            cart$: cartSubject.asObservable(),
            loadCartFromApi: jasmine.createSpy('loadCartFromApi')
        };

        TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: CartService, useValue: mockCartService }
            ]
        });

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
    });


    it('should subscribe to authService.user and set isAuthenticated to true if user exists', () => {
        fixture.detectChanges();
        userSubject.next({ name: 'test' });
        expect(component.isAuthenticated).toBeTrue();
    });

    it('should subscribe to authService.user and set isAuthenticated to false if user is null', () => {
        fixture.detectChanges();
        userSubject.next(null);
        expect(component.isAuthenticated).toBeFalse();
    });

    it('should call cartService.loadCartFromApi on init', () => {
        fixture.detectChanges();
        expect(mockCartService.loadCartFromApi).toHaveBeenCalled();
    });

    it('should update cartItems and cartItemCount when cart$ emits', () => {
        const products: Product[] = [{
            id: '1',
            name: 'Test',
            price: 10,
            currency: 'USD',
            customerReview: '',
            reviewCount: '0',
            imageLink: '',
            category: '',
            productLink: '',
            productId: '',
            grammage: '',
            sourceName: '',
            isOnSale: false,
            quantity: 1
        }];
        fixture.detectChanges();
        cartSubject.next(products);
        expect(component.cartItems).toEqual(products);
        expect(component.cartItemCount).toBe(1);
    });

    it('should call authService.logout on onLogout', () => {
        component.onLogout();
        expect(mockAuthService.logout).toHaveBeenCalled();
    });
});