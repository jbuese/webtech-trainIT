import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularComponent } from './angular/angular.component';
import { SportTypesComponent } from './sportTypes/sportTypes.component';
import { LoginUserComponent } from './login/login-user.component';
import { RegisterUserComponent } from './register/register-user.component';
import { AuthGuard } from './auth.guard';
import { SessionAuthService } from './session-auth.service';
import { StageComponent } from './main-stage/stage.component';

const routes: Routes = [
  { path: 'register', component: RegisterUserComponent },
  { path: 'login', component: LoginUserComponent },
  { path: 'main',
    canActivate: [AuthGuard],
    component: StageComponent,
    children: [
      { path: '', redirectTo: 'session', pathMatch: 'full' },
      { path: 'sportTypes', component: SportTypesComponent },
      { path: 'session', component: AngularComponent, pathMatch: 'full' },
    ]
  },
  { path: '',
    redirectTo: 'main',
    pathMatch: 'full',},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [SessionAuthService]
})
export class AppRoutingModule { }
