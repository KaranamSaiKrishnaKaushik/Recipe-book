import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { UserSettings } from '../models/user-settings.model';

describe('SettingsService', () => {
    let service: SettingsService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let mockUser: UserSettings;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'put', 'get']);
        TestBed.configureTestingModule({
            providers: [
                SettingsService,
                { provide: HttpClient, useValue: httpClientSpy }
            ]
        });
        service = TestBed.inject(SettingsService);

        mockUser = {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            salutation: 'Mr.',
            userFirstName: 'Test',
            userLastName: 'User',
            headline: '',
            phoneNumber: '',
            address: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
            preferences: {},
            notificationsEnabled: true,
            theme: 'light',
            language: 'en',
            avatarUrl: '',
            dateOfBirth: '',
            gender: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            roles: [],
            lastLogin: new Date(),
            socialAccounts: [],
            emailVerified: true,
            biography: '',
            website: '',
            facebookUserName: '',
            instagramUserName: '',
            twitterUserName: '',
            linkedinUserName: '',
            occupation: '',
            company: '',
            interests: [],
            timezone: '',
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: false,
            // Add missing properties for UserSettings type
            tiktokUserName: '',
            linkedInPublicProfileUrl: '',
            youtubeUserName: '',
            emailId: '',
            githubUserName: '',
            pinterestUserName: '',
            snapchatUserName: '',
            mediumUserName: '',
            // Added missing properties
            streetAddress: '',
            houseNumber: '',
            preferredPaymentMethod: '',
            setPaymentMethod: () => {},
            setEmailId: () => {}
        } as UserSettings;
    });

    it('should call HttpClient.post on addUser', () => {
        httpClientSpy.post.and.returnValue(of({ success: true }));
        spyOn(console, 'log');
        service.addUser(mockUser);
        expect(httpClientSpy.post).toHaveBeenCalledWith(jasmine.stringMatching('add-user'), mockUser);
        expect(console.log).toHaveBeenCalled();
    });

    it('should call HttpClient.put on updateUser', () => {
        httpClientSpy.put.and.returnValue(of({ success: true }));
        spyOn(console, 'log');
        service.updateUser(mockUser);
        expect(httpClientSpy.put).toHaveBeenCalledWith(jasmine.stringMatching('update-user'), mockUser);
        expect(console.log).toHaveBeenCalled();
    });

    it('should call HttpClient.put on updateSocialUserEmailId', () => {
        httpClientSpy.put.and.returnValue(of({ success: true }));
        spyOn(console, 'log');
        service.updateSocialUserEmailId('new@email.com');
        expect(httpClientSpy.put).toHaveBeenCalledWith(
            jasmine.stringMatching('update-user-email'),
            { EmailId: 'new@email.com' }
        );
        expect(console.log).toHaveBeenCalled();
    });

    it('should call HttpClient.get and update userSubject on getUser', () => {
        const userObj = { id: 1, name: 'Test User', email: 'test@example.com' };
        spyOn(UserSettings, 'fromObject').and.returnValue(mockUser);
        httpClientSpy.get.and.returnValue(of(userObj));
        spyOn(console, 'log');
        service.getUser();
        expect(httpClientSpy.get).toHaveBeenCalledWith(jasmine.stringMatching('get-user'));
        expect(UserSettings.fromObject).toHaveBeenCalledWith(userObj);
        service.user$.subscribe(user => {
            expect(user).toEqual(mockUser);
        });
        expect(console.log).toHaveBeenCalled();
    });
/*
    it('should handle 404 error in getUser', () => {
        const errorResponse = { status: 404 };
        httpClientSpy.get.and.returnValue(throwError(() => errorResponse));
        spyOn(console, 'error');
        service.getUser();
        expect(console.error).toHaveBeenCalledWith('User not found (404)');
    });

     it('should handle other errors in getUser', () => {
        const errorResponse = { status: 500, message: 'Server error' };
        httpClientSpy.get.and.returnValue(throwError(() => errorResponse));
        spyOn(console, 'error');
        service.getUser();
        expect(console.error).toHaveBeenCalledWith('An error occurred:', errorResponse);
    }); */

    it('should return current user from getter', () => {
        (service as any).userSubject.next(mockUser);
        expect(service.user).toEqual(mockUser);
    });

    it('should return null from getter if no user', () => {
        (service as any).userSubject.next(null);
        expect(service.user).toBeNull();
    });
});