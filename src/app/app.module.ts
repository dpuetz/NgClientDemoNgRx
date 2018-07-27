import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';  //https://fontawesome.com/how-to-use/svg-with-js
// import { SharedModule } from './shared/shared.module';
import { RouterModule, PreloadAllModules } from '@angular/router';
// import { AppHeaderComponent } from './shared/app-header';
import { EffectsModule } from '@ngrx/effects';
// import { HomeComponent } from './home/home-component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { UserModule } from './user/user.module';
import { MenuComponent } from './home/menu.component';
import { PageNotFoundComponent } from './home/page-not-found.component';
import { ShellComponent } from './home/shell.component';
import { WelcomeComponent } from './home/welcome.component';

// const routes  = [
//         { path: 'home', component: HomeComponent },
//         {
//             path: 'user',
//             loadChildren: './user/user.module#UserModule'
//         },
//         {
//             path: 'websites',
//             loadChildren: './websites/websites.module#WebsitesModule'
//         },
//         { path: '', redirectTo: '/home', pathMatch: 'full'},
//         { path: '**', component: HomeComponent }
//     ]

const appRoutes  = [
    {
        path: '',
        component: ShellComponent,
        children: [

                { path: 'welcome', component: WelcomeComponent },
                {
                    path: 'websites',
                    loadChildren: './websites/websites.module#WebsitesModule'
                },
                { path: '', redirectTo: '/welcome', pathMatch: 'full'},
        ]
    },
     { path: '**', component: PageNotFoundComponent }

]

@NgModule({
  imports: [
    BrowserModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    }),
    UserModule,
    RouterModule.forRoot(appRoutes,  {preloadingStrategy: PreloadAllModules} ),
  ],
  declarations: [
    AppComponent,
    // AppHeaderComponent,
    // HomeComponent,
    MenuComponent,
    PageNotFoundComponent,
    ShellComponent,
    WelcomeComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
