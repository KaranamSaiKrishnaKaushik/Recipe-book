Genie# RecipeBook

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


* Install bootstrap3
  npm install --save bootstrap@3
* Angular Json
# "node_modules/bootstrap/dist/css/bootstrap.min.css"
* Ts Config
# "strictPropertyInitialization": false,
* Add Routing Module ( path should not have '/')
* Import it in app module
* Add router-outlet to the app component. Then it starts routing.
* Add Shopping List service into providers of app module
* Add &nbsp after button
  <button class="btn btn-primary" type="button" (click)="onClear()">Clear</button> &nbsp;
