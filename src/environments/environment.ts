export const environment = {
  production: false,
  apiUrl: 'http://localhost:5099/', // 'https://kitchen-recipes-api-fvacd4b5esh5ezax.germanywestcentral-01.azurewebsites.net/'
  paypalSandboxClientId: 'Ae9Hcx388JWuvk9PypBO8iteGwm06-jOhZjxpAHktDyobKAslFOwnh6Apy8h15udU60ge9WGQUe9xROD',
  firebase: {
    apiKey: "AIzaSyBYiivFgH-eJ7k6GamIdwvhoUVLhgHukwU",
    authDomain: "ng-recipe-book-01-2ff9b.firebaseapp.com",
    databaseURL: "https://ng-recipe-book-01-2ff9b-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ng-recipe-book-01-2ff9b",
    storageBucket: "ng-recipe-book-01-2ff9b.firebasestorage.app",
    messagingSenderId: "432290866529",
    appId: "1:432290866529:web:c6a1df2fd7e0c33c0e9120"
  },
    auth: {
    domain: 'dev-a3b5v471sfb0dbt2.us.auth0.com', // from Auth0 tenant
    clientId: 'YRrot4dOmj1xYEfdTg5R5zQwfT2iy1G0',
    authorizationParams: {
      audience: 'https://dev-a3b5v471sfb0dbt2.us.auth0.com/api/v2/', // optional if you want to call backend API
      redirect_uri: window.location.origin,
    }
  }
};

