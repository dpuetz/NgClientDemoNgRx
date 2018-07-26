import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login.component';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './state/user.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './state/user.effects';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from './user.service';
// import { HomeComponent } from '../home/home-component';

const userRoutes: Routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(userRoutes),
    StoreModule.forFeature('user', userReducer),
    EffectsModule.forFeature(
      [ UserEffects ]
    )
  ],
  declarations: [
    LoginComponent
    // HomeComponent
  ],
  providers: [
    UserService
  ]
})
export class UserModule { }