(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/about/about.component.html":
/*!**********************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/about/about.component.html ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h3 class=\"text-center\">What is OpenEBench ?</h3>\n<p>\n    OpenEBench is an infra-structure designed to establish a continuous automated benchmarking system for bioinformatics methods, tools and web services. It is being developed so as to cater for the needs of the bioinformatics community, especially software\n    developers who need an objective and quantitative way to inform their decisions as well as the larger community of end-users, in their search for unbiased and up-to-date evaluation of bioinformatics methods.\n</p>\n\n<div>\n    <img class=\"diagram\" src=\"assets/img/dashboard_diagram.svg\" alt=\"Diagram\">\n</div>\n\n\n<hr>\n\n<p class=\"text-center\"><b>The goals of OpenEBench are to:</b></p>\n<p>Provide guidance and software infrastructure for Benchmarking and Techincal monitoring of bioinformatics tools.</p>\n<p>Engage with existing benchmark initiatives making different communities aware of the platform.</p>\n<p>Maintain a data warehouse infrastructure to keep record of Benchmarking initiatives.</p>\n<p>Expose benchmarking and technical monitoring results to Elixir Tools registry.</p>\n<p>Establish and refine communication protocols with communities and/or infrastructure projects willing to have a unified benchmark infrastructure Coordinate with Elixir.</p>\n<p>Interoperability Platform to keep FAIR data principles on Benchmarking data warehouse.</p>\n\n<hr>\n\n<p class=\"text-center\"><b>The white paper for this project is available </b><a target=\"_blank\" href=\"https://www.biorxiv.org/content/early/2017/08/31/181677\">here</a></p>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/app.component.html":
/*!**************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/app.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--The content below is only a placeholder and can be replaced.-->\n<div class=\"container\">\n    <app-top-menu></app-top-menu>\n    <router-outlet></router-outlet>\n    <app-footer></app-footer>\n</div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/dashboard/dashboard.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/dashboard/dashboard.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n    <div class=\"card-group\">\n        <div class=\"card border-light\">\n            <img class=\"main-logo\" src=\"assets/img/opeb_logo.gif\" alt=\"Card image cap\">\n        </div>\n    </div>\n\n    <form class=\"main-search-div\">\n        <input type=\"text\" class=\"main-search\" name='text' [(ngModel)]=\"model\" />\n        <button class=\"main-submit\" type=\"submit\" (click)='submitForm()'>Go!</button>\n    </form>\n\n    <div class=\"card-group\">\n        <div class=\"card border-light\">\n            <div class=\"card-body\">\n                <h5 class=\"card-title text-center\">Scientific Benchmark</h5>\n\n            </div>\n            <a routerLink='/scientific' class=\"card-icon\">\n                <img class=\"card-img-top\" src=\"assets/img/scientific_benchmarking.svg\" alt=\"Card image cap\">\n            </a>\n        </div>\n        <div class=\"card border-light\">\n            <div class=\"card-body\">\n                <h5 class=\"card-title text-center\">Technical Monitoring</h5>\n\n            </div>\n            <a routerLink='/tool' class=\"card-icon\">\n                <img class=\"card-img-top\" src=\"assets/img/technical_monitoring.svg\" alt=\"Card image cap\">\n            </a>\n        </div>\n\n    </div>\n\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/docs/docs.component.html":
/*!********************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/docs/docs.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>docs works!</p>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/footer/footer.component.html":
/*!************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/footer/footer.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<hr>\n<div class=\"flex-container\">\n    <div class=\"flex-item\">\n        <img class=\"eu-flag\" src=\"assets/img/eu.png\" alt=\"\" />\n\n    </div>\n    <div class=\"flex-item\">\n\n        <small>\n            ELIXIR is partly funded by the European Commission within the Research Infraestructure\n            programme of Horizon 2020, contract no. 676559.\n        </small>\n        <br>\n        <small>The sole responsibility for the content of this webpage lies with BSC. It does not\n            necessarily\n            reflect the opinion of the European Union and the European Commission is not responsible for any use that\n            may\n            be made of the information contained therein.\n        </small>\n        <br>\n        <small>\n            Copyright © <a href=\"https://www.bsc.es/\">BSC-CNS</a> 2019\n        </small>\n    </div>\n</div>\n<!-- <p class=\"flex-item\">ELIXIR Excelerate is funded by the European Comission, contract no. 676559 </p> -->"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/page-not-found/page-not-found.component.html":
/*!****************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/page-not-found/page-not-found.component.html ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"circletag\" id=\"nay\">\n        <!-- <img src=\"https://material.angular.io/assets/img/examples/shiba1.jpg\"> -->\n        <h1>Page not found</h1>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/private/private.component.html":
/*!**************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/private/private.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"header-actions\">\n      <div class=\"userDetails\" *ngIf=\"userDetails\">     \n        <h3 class=\"text-center\">Welcome {{userDetails.firstName}} !</h3>\n        <p class=\"text-center\">{{userDetails.email}}</p>\n        \n\n      <button mat-raised-button (click)=\"logout()\">Log out</button>\n\n      </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/statistics/statistics.component.html":
/*!********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/statistics/statistics.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<div class=\"containerflex\" *ngIf=\"loading; else loading \">\n    <div class=\"item\" id=\"toolspublications\"></div>\n    <div class=\"item\" id=\"toolsbioschemas\"></div>\n    <div class=\"item\" id=\"toolsopensource\"></div>\n</div>\n<ng-template #loading>loading...</ng-template>\n<!-- <div id=\"chart\" style=\"width: 900;height: 500\"></div> -->\n\n  "

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/top-menu/top-menu.component.html":
/*!****************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/top-menu/top-menu.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar sticky-top navbar-expand-lg navbar-light bg-white\">\n    <a [hidden]=\"getPath()\" [routerLink]=\"dashboardLink.path\" class=\"navbar-brand\"> <img width=\"100px\" src=\"assets/img/opeb_logo.gif\" alt=\"OpEB\"> </a>\n    <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarNav\" aria-controls=\"navbarNav\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n\t\t<span class=\"navbar-toggler-icon\"></span>\n\t</button>\n    <div class=\"collapse navbar-collapse\" id=\"navbarNav\">\n        <ul class=\"navbar-nav ml-auto\">\n            <li *ngFor=\"let link of navLinks\" class=\"nav-item\">\n                <a [routerLink]=\"link.path\" class=\"nav-link\">{{link.label}}</a>\n            </li>\n        </ul>\n    </div>\n</nav>\n\n\n<!-- <button mat-button [matMenuTriggerFor]=\"menu\">Menu</button>\n<mat-menu #menu=\"matMenu\">\n    <button mat-menu-item>Item 1</button>\n    <button mat-menu-item>Item 2</button>\n</mat-menu> -->"

/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/about/about.component.css":
/*!*******************************************!*\
  !*** ./src/app/about/about.component.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2Fib3V0L2Fib3V0LmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/about/about.component.ts":
/*!******************************************!*\
  !*** ./src/app/about/about.component.ts ***!
  \******************************************/
/*! exports provided: AboutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AboutComponent", function() { return AboutComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


/**
 * About component
 */
var AboutComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function AboutComponent() {
    }
    /**
     * Initializer
     */
    AboutComponent.prototype.ngOnInit = function () {
    };
    AboutComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-about',
            template: __webpack_require__(/*! raw-loader!./about.component.html */ "./node_modules/raw-loader/index.js!./src/app/about/about.component.html"),
            styles: [__webpack_require__(/*! ./about.component.css */ "./src/app/about/about.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], AboutComponent);
    return AboutComponent;
}());



/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: routes, AppRoutingModule, routingComponents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routes", function() { return routes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routingComponents", function() { return routingComponents; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dashboard/dashboard.component */ "./src/app/dashboard/dashboard.component.ts");
/* harmony import */ var _about_about_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./about/about.component */ "./src/app/about/about.component.ts");
/* harmony import */ var _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./page-not-found/page-not-found.component */ "./src/app/page-not-found/page-not-found.component.ts");
/* harmony import */ var _statistics_statistics_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./statistics/statistics.component */ "./src/app/statistics/statistics.component.ts");
/* harmony import */ var _docs_docs_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./docs/docs.component */ "./src/app/docs/docs.component.ts");
/* harmony import */ var _private_private_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./private/private.component */ "./src/app/private/private.component.ts");
/* harmony import */ var _app_authguard__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./app.authguard */ "./src/app/app.authguard.ts");










// import { ToolModule } from './tool/tool.module';
// import { ScientificModule } from './scientific/scientific.module';
/**
 * Routes to componentes, ToolComponent and Scientific component have there own specific routeing.modules
 */
var routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_3__["DashboardComponent"], },
    { path: 'tool', loadChildren: function () { return __webpack_require__.e(/*! import() | tool-tool-module */ "tool-tool-module").then(__webpack_require__.bind(null, /*! ./tool/tool.module */ "./src/app/tool/tool.module.ts")).then(function (m) { return m.ToolModule; }); }, },
    { path: 'scientific', loadChildren: function () { return __webpack_require__.e(/*! import() | scientific-scientific-module */ "scientific-scientific-module").then(__webpack_require__.bind(null, /*! ./scientific/scientific.module */ "./src/app/scientific/scientific.module.ts")).then(function (m) { return m.ScientificModule; }); } },
    { path: 'stats', component: _statistics_statistics_component__WEBPACK_IMPORTED_MODULE_6__["StatisticsComponent"], },
    { path: 'about', component: _about_about_component__WEBPACK_IMPORTED_MODULE_4__["AboutComponent"], },
    { path: 'docs', component: _docs_docs_component__WEBPACK_IMPORTED_MODULE_7__["DocsComponent"], },
    { path: 'private', component: _private_private_component__WEBPACK_IMPORTED_MODULE_8__["PrivateComponent"], canActivate: [_app_authguard__WEBPACK_IMPORTED_MODULE_9__["AppAuthGuard"]] },
    { path: '**', component: _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_5__["PageNotFoundComponent"] }
];
/**
 * root module for routing
 */
var AppRoutingModule = /** @class */ (function () {
    /**
     * export routing module
     */
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            // This is a root module so we use forRoot, ,  { enableTracing: true }  is for debuging
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes, {
                    onSameUrlNavigation: 'reload',
                    anchorScrolling: 'enabled',
                }),
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]],
            providers: [_app_authguard__WEBPACK_IMPORTED_MODULE_9__["AppAuthGuard"]],
        })
        /**
         * export routing module
         */
    ], AppRoutingModule);
    return AppRoutingModule;
}());

/**
 *  routing component
 *  so we dont have to import everything in the module.ts again
 */
var routingComponents = [_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_3__["DashboardComponent"], _statistics_statistics_component__WEBPACK_IMPORTED_MODULE_6__["StatisticsComponent"], _about_about_component__WEBPACK_IMPORTED_MODULE_4__["AboutComponent"], _private_private_component__WEBPACK_IMPORTED_MODULE_8__["PrivateComponent"], _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_5__["PageNotFoundComponent"]];


/***/ }),

/***/ "./src/app/app.authguard.ts":
/*!**********************************!*\
  !*** ./src/app/app.authguard.ts ***!
  \**********************************/
/*! exports provided: AppAuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppAuthGuard", function() { return AppAuthGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var keycloak_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! keycloak-angular */ "./node_modules/keycloak-angular/fesm5/keycloak-angular.js");




/**
 * Class Appauthguard extends keycloakauthguard
*/
var AppAuthGuard = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AppAuthGuard, _super);
    // tslint:disable-next-line:max-line-length
    /**
     * Construtor method
    */
    function AppAuthGuard(router, keycloakAngular) {
        var _this = _super.call(this, router, keycloakAngular) || this;
        _this.router = router;
        _this.keycloakAngular = keycloakAngular;
        return _this;
    }
    /**
     * Checks for user access
    */
    AppAuthGuard.prototype.isAccessAllowed = function (route, state) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var e_1, _a;
            var keycloakLoginOptions = {
                redirectUri: window.location.origin + '/html/private',
            };
            if (!_this.authenticated) {
                _this.keycloakAngular.login(keycloakLoginOptions);
                return;
            }
            var requiredRoles = route.data.roles;
            if (!requiredRoles || requiredRoles.length === 0) {
                return resolve(true);
            }
            else {
                if (!_this.roles || _this.roles.length === 0) {
                    resolve(false);
                }
                var granted = false;
                try {
                    for (var requiredRoles_1 = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](requiredRoles), requiredRoles_1_1 = requiredRoles_1.next(); !requiredRoles_1_1.done; requiredRoles_1_1 = requiredRoles_1.next()) {
                        var requiredRole = requiredRoles_1_1.value;
                        if (_this.roles.indexOf(requiredRole) > -1) {
                            granted = true;
                            break;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (requiredRoles_1_1 && !requiredRoles_1_1.done && (_a = requiredRoles_1.return)) _a.call(requiredRoles_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                resolve(granted);
            }
        });
    };
    AppAuthGuard.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: keycloak_angular__WEBPACK_IMPORTED_MODULE_3__["KeycloakService"] }
    ]; };
    AppAuthGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], keycloak_angular__WEBPACK_IMPORTED_MODULE_3__["KeycloakService"]])
    ], AppAuthGuard);
    return AppAuthGuard;
}(keycloak_angular__WEBPACK_IMPORTED_MODULE_3__["KeycloakAuthGuard"]));



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");




/**
 * main app component
 */
var AppComponent = /** @class */ (function () {
    function AppComponent(router) {
        /**
         * title
         */
        this.title = 'app';
        var navEndEvents = router.events.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (event) { return event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_2__["NavigationEnd"]; }));
        navEndEvents.subscribe(function (event) {
            gtag('config', 'UA-143782781-2', {
                'page_path': event.urlAfterRedirects
            });
        });
    }
    AppComponent.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }
    ]; };
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/index.js!./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        })
        /**
         * expot app angular
         */
        ,
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: createApollo, AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createApollo", function() { return createApollo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var keycloak_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! keycloak-angular */ "./node_modules/keycloak-angular/fesm5/keycloak-angular.js");
/* harmony import */ var _utils_app_init__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/app-init */ "./src/app/utils/app-init.ts");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _material_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./material.module */ "./src/app/material.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_statistics_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./shared/statistics.service */ "./src/app/shared/statistics.service.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _top_menu_top_menu_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./top-menu/top-menu.component */ "./src/app/top-menu/top-menu.component.ts");
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./footer/footer.component */ "./src/app/footer/footer.component.ts");
/* harmony import */ var _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./page-not-found/page-not-found.component */ "./src/app/page-not-found/page-not-found.component.ts");
/* harmony import */ var angular_datatables__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! angular-datatables */ "./node_modules/angular-datatables/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var apollo_angular__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! apollo-angular */ "./node_modules/apollo-angular/fesm5/ng.apollo.js");
/* harmony import */ var apollo_angular_link_http__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! apollo-angular-link-http */ "./node_modules/apollo-angular-link-http/fesm5/ng.apolloLink.http.js");
/* harmony import */ var apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! apollo-cache-inmemory */ "./node_modules/apollo-cache-inmemory/lib/bundle.esm.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _docs_docs_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./docs/docs.component */ "./src/app/docs/docs.component.ts");






// Material designe















// env variable to a local variable
var envurl = _environments_environment__WEBPACK_IMPORTED_MODULE_19__["environment"].SCIENTIFIC_SERVICE_URL;
// function to create apollo client
function createApollo(httpLink) {
    return {
        link: httpLink.create({ uri: envurl }),
        cache: new apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_18__["InMemoryCache"](),
    };
}
/**
 * Main app module
 */
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"],
                _top_menu_top_menu_component__WEBPACK_IMPORTED_MODULE_11__["TopMenuComponent"],
                // all the pages that are in top menu
                _app_routing_module__WEBPACK_IMPORTED_MODULE_5__["routingComponents"],
                _footer_footer_component__WEBPACK_IMPORTED_MODULE_12__["FooterComponent"],
                _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_13__["PageNotFoundComponent"],
                _docs_docs_component__WEBPACK_IMPORTED_MODULE_20__["DocsComponent"],
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                angular_datatables__WEBPACK_IMPORTED_MODULE_14__["DataTablesModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_5__["AppRoutingModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_6__["BrowserAnimationsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_8__["ReactiveFormsModule"],
                _material_module__WEBPACK_IMPORTED_MODULE_7__["MaterialModule"],
                keycloak_angular__WEBPACK_IMPORTED_MODULE_3__["KeycloakAngularModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpClientModule"],
                apollo_angular__WEBPACK_IMPORTED_MODULE_16__["ApolloModule"],
                apollo_angular_link_http__WEBPACK_IMPORTED_MODULE_17__["HttpLinkModule"]
            ],
            providers: [_shared_statistics_service__WEBPACK_IMPORTED_MODULE_9__["StatisticsService"], {
                    provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__["APP_INITIALIZER"],
                    useFactory: _utils_app_init__WEBPACK_IMPORTED_MODULE_4__["initializer"],
                    multi: true,
                    deps: [keycloak_angular__WEBPACK_IMPORTED_MODULE_3__["KeycloakService"]]
                }, {
                    provide: apollo_angular__WEBPACK_IMPORTED_MODULE_16__["APOLLO_OPTIONS"],
                    useFactory: createApollo,
                    deps: [apollo_angular_link_http__WEBPACK_IMPORTED_MODULE_17__["HttpLink"]]
                }],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/dashboard/dashboard.component.css":
/*!***************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".main-search-div {\n    padding: 1vh 0 1vh 0;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    position: relative;\n}\n\n.main-submit {\n    background-color: #FFFFFF;\n    border: solid 1px #EF7500;\n    padding: 15px 32px;\n    text-align: center;\n    width: 20%;\n    height: 60px;\n    cursor: not-allowed;\n}\n\n.main-submit:enabled {\n    cursor: pointer;\n    color: #EF7500;\n}\n\n.border-light {\n    border-color: white !important;\n}\n\n.main-logo {\n    width: 40%;\n    align-self: center\n}\n\n.card-icon {\n    width: 25%;\n    height: auto;\n    align-self: center;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZGFzaGJvYXJkL2Rhc2hib2FyZC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksb0JBQW9CO0lBQ3BCLGFBQWE7SUFDYix1QkFBdUI7SUFDdkIsbUJBQW1CO0lBQ25CLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLHlCQUF5QjtJQUN6Qix5QkFBeUI7SUFDekIsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUNsQixVQUFVO0lBQ1YsWUFBWTtJQUNaLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLGVBQWU7SUFDZixjQUFjO0FBQ2xCOztBQUVBO0lBQ0ksOEJBQThCO0FBQ2xDOztBQUVBO0lBQ0ksVUFBVTtJQUNWO0FBQ0o7O0FBRUE7SUFDSSxVQUFVO0lBQ1YsWUFBWTtJQUNaLGtCQUFrQjtBQUN0QiIsImZpbGUiOiJzcmMvYXBwL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5tYWluLXNlYXJjaC1kaXYge1xuICAgIHBhZGRpbmc6IDF2aCAwIDF2aCAwO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5tYWluLXN1Ym1pdCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjtcbiAgICBib3JkZXI6IHNvbGlkIDFweCAjRUY3NTAwO1xuICAgIHBhZGRpbmc6IDE1cHggMzJweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgd2lkdGg6IDIwJTtcbiAgICBoZWlnaHQ6IDYwcHg7XG4gICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbn1cblxuLm1haW4tc3VibWl0OmVuYWJsZWQge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBjb2xvcjogI0VGNzUwMDtcbn1cblxuLmJvcmRlci1saWdodCB7XG4gICAgYm9yZGVyLWNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50O1xufVxuXG4ubWFpbi1sb2dvIHtcbiAgICB3aWR0aDogNDAlO1xuICAgIGFsaWduLXNlbGY6IGNlbnRlclxufVxuXG4uY2FyZC1pY29uIHtcbiAgICB3aWR0aDogMjUlO1xuICAgIGhlaWdodDogYXV0bztcbiAgICBhbGlnbi1zZWxmOiBjZW50ZXI7XG59XG4iXX0= */"

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.ts":
/*!**************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.ts ***!
  \**************************************************/
/*! exports provided: DashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardComponent", function() { return DashboardComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _elasticsearch_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./elasticsearch.service */ "./src/app/dashboard/elasticsearch.service.ts");






/**
 * Elastic search url to server
 */
// const ES_URL = environment.ES_URL;
// /**
//  * http params for the search
//  */
// const PARAMS = new HttpParams({});
/**
 * Injectable
 */
// @Injectable()
// export class OpebService {
//   /**
//    * Constructor for the injectable class
//    */
//   constructor(private http: HttpClient) {}
//   /**
//    * Serch function
//    */
//   search(term: string) {
//     if (term === '') {
//       return of([]);
//     }
//     return this.http
//       .get(ES_URL, {params: PARAMS.set('text', term)}).pipe(
//         map(response =>
//           $.map(response['hits'].hits, function(tool) {
//             const t = [];
//             t.push(tool['_source'].name);
//             return t;
//           }
//         )
//       ));
//   }
// }
/**
 * Dashboard component
 */
var DashboardComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function DashboardComponent(_service, router) {
        var _this = this;
        this._service = _service;
        this.router = router;
        /**
         * searching
         */
        this.searching = false;
        /**
         * searchFailed
         */
        this.searchFailed = false;
        /**
         * search for elastic search
         */
        this.search = function (text$) {
            return text$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["debounceTime"])(300), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function () { return _this.searching = true; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["switchMap"])(function (term) {
                return _this._service.search(term).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function () { return _this.searchFailed = false; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function () {
                    _this.searchFailed = true;
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])([]);
                }));
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function () { return _this.searching = false; }));
        };
    }
    /**
     * Naviage to searched tool via URL
     */
    DashboardComponent.prototype.goToToolsPage = function (term) {
        this.router.navigate(['/tool'], { queryParams: { search: term }, queryParamsHandling: '' });
    };
    /**
     * Submit the search
     */
    DashboardComponent.prototype.submitForm = function () {
        this.goToToolsPage(this.model);
    };
    DashboardComponent.ctorParameters = function () { return [
        { type: _elasticsearch_service__WEBPACK_IMPORTED_MODULE_5__["ElasticsearchService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }
    ]; };
    DashboardComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__(/*! raw-loader!./dashboard.component.html */ "./node_modules/raw-loader/index.js!./src/app/dashboard/dashboard.component.html"),
            providers: [_elasticsearch_service__WEBPACK_IMPORTED_MODULE_5__["ElasticsearchService"]],
            styles: [__webpack_require__(/*! ./dashboard.component.css */ "./src/app/dashboard/dashboard.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_elasticsearch_service__WEBPACK_IMPORTED_MODULE_5__["ElasticsearchService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ }),

/***/ "./src/app/dashboard/elasticsearch.service.ts":
/*!****************************************************!*\
  !*** ./src/app/dashboard/elasticsearch.service.ts ***!
  \****************************************************/
/*! exports provided: ElasticsearchService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ElasticsearchService", function() { return ElasticsearchService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_6__);







var ElasticsearchService = /** @class */ (function () {
    function ElasticsearchService(http) {
        this.http = http;
        this.ES_URL = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].ES_URL;
        this.PARAMS = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({});
    }
    /**
     * Serch function
     */
    ElasticsearchService.prototype.search = function (term) {
        if (term === '') {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_5__["of"])([]);
        }
        return this.http
            .get(this.ES_URL, { params: this.PARAMS.set('text', term) }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) {
            return jquery__WEBPACK_IMPORTED_MODULE_6__["map"](response['hits'].hits, function (tool) {
                var t = [];
                t.push(tool['_source'].name);
                return t;
            });
        }));
    };
    ElasticsearchService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    ElasticsearchService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], ElasticsearchService);
    return ElasticsearchService;
}());



/***/ }),

/***/ "./src/app/docs/docs.component.css":
/*!*****************************************!*\
  !*** ./src/app/docs/docs.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3MvZG9jcy5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/docs/docs.component.ts":
/*!****************************************!*\
  !*** ./src/app/docs/docs.component.ts ***!
  \****************************************/
/*! exports provided: DocsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocsComponent", function() { return DocsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var DocsComponent = /** @class */ (function () {
    function DocsComponent() {
    }
    DocsComponent.prototype.ngOnInit = function () {
    };
    DocsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-docs',
            template: __webpack_require__(/*! raw-loader!./docs.component.html */ "./node_modules/raw-loader/index.js!./src/app/docs/docs.component.html"),
            styles: [__webpack_require__(/*! ./docs.component.css */ "./src/app/docs/docs.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], DocsComponent);
    return DocsComponent;
}());



/***/ }),

/***/ "./src/app/footer/footer.component.css":
/*!*********************************************!*\
  !*** ./src/app/footer/footer.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".eu-flag{\n    padding-top: 0.4em;\n    height: 4em;\n}\n.flex-container{\n    display: flex;\n    flex-wrap: nowrap;\n}\n.flex-item{\n    padding: 0.2em;\n    order: 0;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksa0JBQWtCO0lBQ2xCLFdBQVc7QUFDZjtBQUNBO0lBQ0ksYUFBYTtJQUNiLGlCQUFpQjtBQUNyQjtBQUNBO0lBQ0ksY0FBYztJQUNkLFFBQVE7QUFDWiIsImZpbGUiOiJzcmMvYXBwL2Zvb3Rlci9mb290ZXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5ldS1mbGFne1xuICAgIHBhZGRpbmctdG9wOiAwLjRlbTtcbiAgICBoZWlnaHQ6IDRlbTtcbn1cbi5mbGV4LWNvbnRhaW5lcntcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtd3JhcDogbm93cmFwO1xufVxuLmZsZXgtaXRlbXtcbiAgICBwYWRkaW5nOiAwLjJlbTtcbiAgICBvcmRlcjogMDtcbn0iXX0= */"

/***/ }),

/***/ "./src/app/footer/footer.component.ts":
/*!********************************************!*\
  !*** ./src/app/footer/footer.component.ts ***!
  \********************************************/
/*! exports provided: FooterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FooterComponent", function() { return FooterComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


/**
 * Footer Component
 */
var FooterComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function FooterComponent() {
    }
    /**
     * Initializer
     */
    FooterComponent.prototype.ngOnInit = function () {
    };
    FooterComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-footer',
            template: __webpack_require__(/*! raw-loader!./footer.component.html */ "./node_modules/raw-loader/index.js!./src/app/footer/footer.component.html"),
            styles: [__webpack_require__(/*! ./footer.component.css */ "./src/app/footer/footer.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], FooterComponent);
    return FooterComponent;
}());



/***/ }),

/***/ "./src/app/material.module.ts":
/*!************************************!*\
  !*** ./src/app/material.module.ts ***!
  \************************************/
/*! exports provided: MaterialModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialModule", function() { return MaterialModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material_badge__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/badge */ "./node_modules/@angular/material/esm5/badge.es5.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/esm5/button.es5.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/esm5/card.es5.js");
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/checkbox */ "./node_modules/@angular/material/esm5/checkbox.es5.js");
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/core */ "./node_modules/@angular/material/esm5/core.es5.js");
/* harmony import */ var _angular_material_expansion__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/expansion */ "./node_modules/@angular/material/esm5/expansion.es5.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/esm5/form-field.es5.js");
/* harmony import */ var _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/grid-list */ "./node_modules/@angular/material/esm5/grid-list.es5.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/paginator */ "./node_modules/@angular/material/esm5/paginator.es5.js");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/progress-spinner */ "./node_modules/@angular/material/esm5/progress-spinner.es5.js");
/* harmony import */ var _angular_material_radio__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/radio */ "./node_modules/@angular/material/esm5/radio.es5.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm5/select.es5.js");
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/sidenav */ "./node_modules/@angular/material/esm5/sidenav.es5.js");
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/sort */ "./node_modules/@angular/material/esm5/sort.es5.js");
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/table */ "./node_modules/@angular/material/esm5/table.es5.js");
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/tabs */ "./node_modules/@angular/material/esm5/tabs.es5.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/esm5/tooltip.es5.js");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm5/dialog.es5.js");


// import { CommonModule } from '@angular/common';



















/**
 * Common Material Design modules.
 */
var MaterialModule = /** @class */ (function () {
    function MaterialModule() {
    }
    MaterialModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_material_button__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"], _angular_material_select__WEBPACK_IMPORTED_MODULE_14__["MatSelectModule"], _angular_material_input__WEBPACK_IMPORTED_MODULE_10__["MatInputModule"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__["MatProgressSpinnerModule"], _angular_material_sort__WEBPACK_IMPORTED_MODULE_16__["MatSortModule"], _angular_material_tabs__WEBPACK_IMPORTED_MODULE_18__["MatTabsModule"],
                _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatFormFieldModule"], _angular_material_table__WEBPACK_IMPORTED_MODULE_17__["MatTableModule"], _angular_material_paginator__WEBPACK_IMPORTED_MODULE_11__["MatPaginatorModule"], _angular_material_radio__WEBPACK_IMPORTED_MODULE_13__["MatRadioModule"], _angular_material_expansion__WEBPACK_IMPORTED_MODULE_7__["MatExpansionModule"], _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_9__["MatGridListModule"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_19__["MatTooltipModule"],
                _angular_material_core__WEBPACK_IMPORTED_MODULE_6__["MatPseudoCheckboxModule"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_20__["MatDialogModule"],
                _angular_material_badge__WEBPACK_IMPORTED_MODULE_2__["MatBadgeModule"], _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_5__["MatCheckboxModule"], _angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCardModule"], _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_15__["MatSidenavModule"]],
            exports: [_angular_material_button__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"], _angular_material_select__WEBPACK_IMPORTED_MODULE_14__["MatSelectModule"], _angular_material_input__WEBPACK_IMPORTED_MODULE_10__["MatInputModule"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__["MatProgressSpinnerModule"], _angular_material_sort__WEBPACK_IMPORTED_MODULE_16__["MatSortModule"], _angular_material_tabs__WEBPACK_IMPORTED_MODULE_18__["MatTabsModule"],
                _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatFormFieldModule"], _angular_material_table__WEBPACK_IMPORTED_MODULE_17__["MatTableModule"], _angular_material_paginator__WEBPACK_IMPORTED_MODULE_11__["MatPaginatorModule"], _angular_material_radio__WEBPACK_IMPORTED_MODULE_13__["MatRadioModule"], _angular_material_expansion__WEBPACK_IMPORTED_MODULE_7__["MatExpansionModule"], _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_9__["MatGridListModule"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_19__["MatTooltipModule"],
                _angular_material_core__WEBPACK_IMPORTED_MODULE_6__["MatPseudoCheckboxModule"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_20__["MatDialogModule"],
                _angular_material_badge__WEBPACK_IMPORTED_MODULE_2__["MatBadgeModule"], _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_5__["MatCheckboxModule"], _angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCardModule"], _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_15__["MatSidenavModule"]]
        })
    ], MaterialModule);
    return MaterialModule;
}());



/***/ }),

/***/ "./src/app/page-not-found/page-not-found.component.css":
/*!*************************************************************!*\
  !*** ./src/app/page-not-found/page-not-found.component.css ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2Utbm90LWZvdW5kL3BhZ2Utbm90LWZvdW5kLmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/page-not-found/page-not-found.component.ts":
/*!************************************************************!*\
  !*** ./src/app/page-not-found/page-not-found.component.ts ***!
  \************************************************************/
/*! exports provided: PageNotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageNotFoundComponent", function() { return PageNotFoundComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


/**
 * 404 Component
 */
var PageNotFoundComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function PageNotFoundComponent() {
    }
    /**
     * Initializer
     */
    PageNotFoundComponent.prototype.ngOnInit = function () {
    };
    PageNotFoundComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-page-not-found',
            template: __webpack_require__(/*! raw-loader!./page-not-found.component.html */ "./node_modules/raw-loader/index.js!./src/app/page-not-found/page-not-found.component.html"),
            styles: [__webpack_require__(/*! ./page-not-found.component.css */ "./src/app/page-not-found/page-not-found.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], PageNotFoundComponent);
    return PageNotFoundComponent;
}());



/***/ }),

/***/ "./src/app/private/private.component.css":
/*!***********************************************!*\
  !*** ./src/app/private/private.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3ByaXZhdGUvcHJpdmF0ZS5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/private/private.component.ts":
/*!**********************************************!*\
  !*** ./src/app/private/private.component.ts ***!
  \**********************************************/
/*! exports provided: PrivateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrivateComponent", function() { return PrivateComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var keycloak_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! keycloak-angular */ "./node_modules/keycloak-angular/fesm5/keycloak-angular.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");





/**
 * Private area Component
 */
var PrivateComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function PrivateComponent(keycloakService, router, location) {
        this.keycloakService = keycloakService;
        this.router = router;
        this.location = location;
    }
    /**
     * Initializer async
     */
    PrivateComponent.prototype.ngOnInit = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var _a;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.keycloakService.isLoggedIn()];
                    case 1:
                        if (!_b.sent()) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, this.keycloakService.loadUserProfile()];
                    case 2:
                        _a.userDetails = _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * logout function
     */
    PrivateComponent.prototype.logout = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var redirectUri;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        redirectUri = window.location.origin + '/html/dashboard';
                        return [4 /*yield*/, this.keycloakService.logout(redirectUri)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PrivateComponent.ctorParameters = function () { return [
        { type: keycloak_angular__WEBPACK_IMPORTED_MODULE_2__["KeycloakService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] },
        { type: _angular_common__WEBPACK_IMPORTED_MODULE_4__["Location"] }
    ]; };
    PrivateComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-private',
            template: __webpack_require__(/*! raw-loader!./private.component.html */ "./node_modules/raw-loader/index.js!./src/app/private/private.component.html"),
            styles: [__webpack_require__(/*! ./private.component.css */ "./src/app/private/private.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [keycloak_angular__WEBPACK_IMPORTED_MODULE_2__["KeycloakService"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["Location"]])
    ], PrivateComponent);
    return PrivateComponent;
}());



/***/ }),

/***/ "./src/app/shared/statistics.service.ts":
/*!**********************************************!*\
  !*** ./src/app/shared/statistics.service.ts ***!
  \**********************************************/
/*! exports provided: StatisticsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatisticsService", function() { return StatisticsService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");





/**
 * injectable statistics
 */
var StatisticsService = /** @class */ (function () {
    /**
     * constructor
     */
    function StatisticsService(http) {
        this.http = http;
        /**
         * url
         */
        this.URL = _environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].METRICS_STATISTICS_URL;
    }
    /**
     * get stats from server
     */
    StatisticsService.prototype.getStats = function () {
        return this.http.get(this.URL);
    };
    /**
     * error handle
     */
    StatisticsService.prototype.handleError = function (operation, result) {
        if (operation === void 0) { operation = 'operation'; }
        return function (error) {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(result);
        };
    };
    StatisticsService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"] }
    ]; };
    StatisticsService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"]])
    ], StatisticsService);
    return StatisticsService;
}());



/***/ }),

/***/ "./src/app/statistics/statistics.component.css":
/*!*****************************************************!*\
  !*** ./src/app/statistics/statistics.component.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n.containerflex {\n    display: flex;\n    flex-wrap: wrap;\n    justify-content: center;\n}\n\n.item{\n    margin: 5px;   \n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc3RhdGlzdGljcy9zdGF0aXN0aWNzLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBO0lBQ0ksYUFBYTtJQUNiLGVBQWU7SUFDZix1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxXQUFXO0FBQ2YiLCJmaWxlIjoic3JjL2FwcC9zdGF0aXN0aWNzL3N0YXRpc3RpY3MuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLmNvbnRhaW5lcmZsZXgge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC13cmFwOiB3cmFwO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4uaXRlbXtcbiAgICBtYXJnaW46IDVweDsgICBcbn0iXX0= */"

/***/ }),

/***/ "./src/app/statistics/statistics.component.ts":
/*!****************************************************!*\
  !*** ./src/app/statistics/statistics.component.ts ***!
  \****************************************************/
/*! exports provided: StatisticsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatisticsComponent", function() { return StatisticsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_statistics_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/statistics.service */ "./src/app/shared/statistics.service.ts");



/**
 * Componet for Statistics
 */
var StatisticsComponent = /** @class */ (function () {
    /**
     * constructor function
     */
    function StatisticsComponent(statsService) {
        this.statsService = statsService;
        /**
         * event
         */
        this.event = false;
    }
    /**
     * initializer
     */
    StatisticsComponent.prototype.ngOnInit = function () {
        this.fetchdata();
    };
    /**
     * fetches the data and generates the statistics charts
     */
    StatisticsComponent.prototype.fetchdata = function () {
        var _this = this;
        this.statsService.getStats()
            .subscribe(function (data) {
            _this.loading = 1;
            _this.data = data;
            _this.statistics = {
                'tools': _this.data['/@timestamp'],
                'publications': _this.data['/project/publications'],
                'bioschemas': _this.data['/project/website/bioschemas:true'],
                'opensource': _this.data['/project/license/open_source:true'],
            };
            _this.generateChart(_this.statistics);
        });
    };
    /**
     * helper method for the fechdata
     */
    StatisticsComponent.prototype.generateChart = function (data) {
        this.event = true;
        c3.generate({
            size: {
                height: 340,
                width: 680
            },
            title: {
                text: 'Publications'
            },
            data: {
                columns: [
                    ['Tools with no publications ', data.tools - data.publications],
                    ['Tools with publications', data.publications]
                ],
                type: 'pie',
            },
            tooltip: {
                format: {
                    value: function (value) {
                        return (d3.format(',')(value) + ' / ' + d3.format(',')(data.tools));
                    }
                }
            },
            bindto: '#toolspublications',
        });
        c3.generate({
            size: {
                height: 340,
                width: 680
            },
            title: {
                text: 'Bioschemas'
            },
            data: {
                columns: [
                    ['Tools with bioschemas', data.bioschemas],
                    ['Tools without bioschemas ', data.tools - data.bioschemas]
                ],
                type: 'pie',
            },
            tooltip: {
                format: {
                    value: function (value) {
                        return (d3.format(',')(value) + ' / ' + d3.format(',')(data.tools));
                    }
                }
            },
            bindto: '#toolsbioschemas',
        });
        c3.generate({
            size: {
                height: 340,
                width: 680
            },
            data: {
                columns: [
                    ['Tools with opensource license', data.opensource],
                    ['Tools without opensource license ', data.tools - data.opensource]
                ],
                type: 'pie',
            },
            title: {
                text: 'Open Source'
            },
            tooltip: {
                format: {
                    value: function (value) {
                        return (d3.format(',')(value) + ' / ' + d3.format(',')(data.tools));
                    }
                }
            },
            bindto: '#toolsopensource',
        });
    };
    StatisticsComponent.ctorParameters = function () { return [
        { type: _shared_statistics_service__WEBPACK_IMPORTED_MODULE_2__["StatisticsService"] }
    ]; };
    StatisticsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-statistics',
            template: __webpack_require__(/*! raw-loader!./statistics.component.html */ "./node_modules/raw-loader/index.js!./src/app/statistics/statistics.component.html"),
            styles: [__webpack_require__(/*! ./statistics.component.css */ "./src/app/statistics/statistics.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_shared_statistics_service__WEBPACK_IMPORTED_MODULE_2__["StatisticsService"]])
    ], StatisticsComponent);
    return StatisticsComponent;
}());



/***/ }),

/***/ "./src/app/top-menu/top-menu.component.css":
/*!*************************************************!*\
  !*** ./src/app/top-menu/top-menu.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RvcC1tZW51L3RvcC1tZW51LmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/top-menu/top-menu.component.ts":
/*!************************************************!*\
  !*** ./src/app/top-menu/top-menu.component.ts ***!
  \************************************************/
/*! exports provided: TopMenuComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TopMenuComponent", function() { return TopMenuComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var keycloak_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! keycloak-angular */ "./node_modules/keycloak-angular/fesm5/keycloak-angular.js");




/**
 * This component is where the we specify the top menu paths
 */
var TopMenuComponent = /** @class */ (function () {
    /**
     * Construtor method
    */
    function TopMenuComponent(location, keycloakService) {
        this.location = location;
        this.keycloakService = keycloakService;
        /**
         * Navigation links and labels for the menu on the right (LOGO)
        */
        this.dashboardLink = {
            label: 'Dashboard',
            path: 'dashboard'
        };
    }
    /**
     * Call the getProfileName function on start
     */
    TopMenuComponent.prototype.ngOnInit = function () {
        this.navLinks = [
            {
                label: 'Scientific Benchmarking',
                path: '/scientific'
            },
            {
                label: 'Technical Monitoring',
                path: '/tool'
            },
            {
                label: 'Statistics',
                path: '/stats'
            },
            {
                label: 'About',
                path: '/about'
            },
            {
                label: 'Docs',
                path: '/docs'
            },
        ];
        // this.getProfileName();
    };
    /**
     * Gets the name of the user to add toggle between login and username
    */
    TopMenuComponent.prototype.getProfileName = function () {
        var _this = this;
        this.keycloakService.isLoggedIn().then(function (res) {
            if (res) {
                _this.keycloakService.loadUserProfile().then(function (resp) {
                    _this.navLinks.push({
                        label: resp.username,
                        path: '/private'
                    });
                });
            }
            else {
                _this.navLinks.push({
                    label: 'Login',
                    path: '/private'
                });
            }
        });
    };
    /**
     * Get URL path
    */
    TopMenuComponent.prototype.getPath = function () {
        return this.location.isCurrentPathEqualTo(this.dashboardLink.path);
    };
    TopMenuComponent.ctorParameters = function () { return [
        { type: _angular_common__WEBPACK_IMPORTED_MODULE_2__["Location"] },
        { type: keycloak_angular__WEBPACK_IMPORTED_MODULE_3__["KeycloakService"] }
    ]; };
    TopMenuComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-top-menu',
            template: __webpack_require__(/*! raw-loader!./top-menu.component.html */ "./node_modules/raw-loader/index.js!./src/app/top-menu/top-menu.component.html"),
            styles: [__webpack_require__(/*! ./top-menu.component.css */ "./src/app/top-menu/top-menu.component.css")]
        })
        /**
         * Class top menu component
        */
        ,
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common__WEBPACK_IMPORTED_MODULE_2__["Location"], keycloak_angular__WEBPACK_IMPORTED_MODULE_3__["KeycloakService"]])
    ], TopMenuComponent);
    return TopMenuComponent;
}());



/***/ }),

/***/ "./src/app/utils/app-init.ts":
/*!***********************************!*\
  !*** ./src/app/utils/app-init.ts ***!
  \***********************************/
/*! exports provided: initializer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializer", function() { return initializer; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");


/**
 * Keycloak config file.
 */
function initializer(keycloak) {
    var _this = this;
    return function () {
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise(function (resolve, reject) { return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](_this, void 0, void 0, function () {
            var error_1;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, keycloak.init({
                                config: {
                                    url: _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].AUTH_SERVER,
                                    realm: 'openebench',
                                    clientId: 'oeb-frontend'
                                },
                                enableBearerInterceptor: false,
                                bearerExcludedUrls: [
                                    '/stats',
                                    '/tool',
                                    '/scientific'
                                ],
                            })];
                    case 1:
                        _a.sent();
                        resolve();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        reject(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
}


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false,
    ES_URL: 'https://dev-openebench.bsc.es/esapi/filter',
    AUTH_SERVER: 'https://inb.bsc.es/auth',
    TOOL_SEARCH_URL: 'https://dev-openebench.bsc.es/monitor/rest/edam/aggregate',
    TOOL_SERVICE_URL: 'https://dev-openebench.bsc.es/monitor/rest/aggregate',
    TOOL_STATISTICS_URL: 'https://dev-openebench.bsc.es/monitor/rest/statistics',
    METRICS_STATISTICS_URL: 'https://dev-openebench.bsc.es/monitor/rest/metrics/statistics',
    SCIENTIFIC_SERVICE_URL: 'https://dev-openebench.bsc.es/sciapi/graphql'
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/vsundesh/public_html/openEBenchFrontendAngular/opeb/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es5.js.map