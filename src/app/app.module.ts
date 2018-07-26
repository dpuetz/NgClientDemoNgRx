import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
// import { LoginComponent } from './users/login.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';  //https://fontawesome.com/how-to-use/svg-with-js
import { SharedModule } from './shared/shared.module';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppHeaderComponent } from './shared/app-header';
import { EffectsModule } from '@ngrx/effects';
// import { UserModule } from './user/user.module';
import { HomeComponent } from './home/home-component';


@NgModule({
  imports: [
    BrowserModule,
    // UserModule,
    SharedModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}),

    //HomeComponent

    // RouterModule.forRoot([
    //     { path: 'users', component: LoginComponent },
    //     {
    //         path: 'websites',
    //         //data: { preload: false },  //this is for custom-built preloader services only, relates to lazy loading
    //         loadChildren: './websites/websites.module#WebsitesModule'
    //     },
    //     { path: '', redirectTo: '/users', pathMatch: 'full'},
    //     { path: '**', component: LoginComponent },
    // ]
     RouterModule.forRoot([
         //C:\AAA\NgClientDemoNgRx\src\app\home\home-component.ts
        { path: 'home', component: HomeComponent },
        {
            path: 'user',
            //C:\AAA\NgClientDemoNgRx\src\app\user\login.component.ts
            loadChildren: './user/user.module#UserModule'
        },
        {
            path: 'websites',
            //data: { preload: false },  //this is for custom-built preloader services only, relates to lazy loading
            //C:\AAA\NgClientDemoNgRx\src\app\websites\websites.module.ts
            loadChildren: './websites/websites.module#WebsitesModule'
        },
        { path: '', redirectTo: '/home', pathMatch: 'full'},
        { path: '**', component: HomeComponent },
    ]
    , {preloadingStrategy: PreloadAllModules} )   //prod
    // , {preloadingStrategy: PreloadAllModules, enableTracing: true} ) //dev ONLY, view routing events in console.
  ],
  declarations: [
    AppComponent,
    AppHeaderComponent,
    HomeComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
