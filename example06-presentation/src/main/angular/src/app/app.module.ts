import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularComponent } from './angular/angular.component';
import { SportTypesComponent } from './sportTypes/sportTypes.component';
import { CreateSportTypeComponent } from './sportTypes/create-sportType/create-sportType.component';
import { SportTypesListComponent } from './sportTypes/sportTypes-list/sportTypes-list.component';
import { SportTypesCardComponent } from './sportTypes/sportTypes-card/sportTypes-card.component';

import { CreateNewsComponent } from './angular/create-news/create-news.component';
import { NewsDetailsComponent } from './angular/news-details/news-details.component';
import { NewsListComponent } from './angular/news-list/news-list.component';

import { MatIconModule } from '@angular/material/icon';
import { CardGridComponent } from './angular/card-grid/card-grid.component';
import { CreateTrainingSessionComponent } from './angular/create-TrainingSession/create-trainingSession.component';
import { EditTrainingSessionComponent } from './angular/edit-TrainingSession/edit-trainingSession.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginUserComponent } from './login/login-user.component';
import { RegisterUserComponent } from './register/register-user.component';
import { StageComponent } from './main-stage/stage.component';

import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    AngularComponent,
    SportTypesComponent,
    CreateSportTypeComponent,
    SportTypesListComponent,
    CreateNewsComponent,
    NewsDetailsComponent,
    NewsListComponent,

    CardGridComponent,
    LoginUserComponent,
    RegisterUserComponent,
    CreateTrainingSessionComponent,
    EditTrainingSessionComponent,
    SportTypesCardComponent,
    StageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
