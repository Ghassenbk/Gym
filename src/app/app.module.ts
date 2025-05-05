import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // pour [formControl]
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProgramsComponent } from './programs/programs.component';
import { MotivationBannerComponent } from './motivation-banner/motivation-banner.component';
import { ContactComponent } from './contact/contact.component';
import { TrainersComponent } from './trainers/trainers.component';
import { HeaderComponent } from './header/header.component';
import { ProgramDetailsComponent } from './program-details/program-details.component';
import { CoachesComponent } from './coaches/coaches.component';
import { AboutComponent } from './about/about.component';
import { CoachProfileComponent } from './coach-profile/coach-profile.component';
import { ClientsComponent } from './admin/clients/clients.component';
import { SubscriptionsComponent } from './admin/subscriptions/subscriptions.component';
import { AdminContactComponent } from './admin/admin-contact/admin-contact.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { DashHeaderComponent } from './admin/dash-header/dash-header.component';
import { AdminCoachesComponent } from './admin/admin-coaches/admin-coaches.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProgramsComponent,
    MotivationBannerComponent,
    ContactComponent,
    TrainersComponent,
    HeaderComponent,
    ProgramDetailsComponent,
    CoachesComponent,
    AboutComponent,
    CoachProfileComponent,
    ClientsComponent,
    SubscriptionsComponent,
    AdminContactComponent,
    AdminDashboardComponent,
    DashHeaderComponent,
    AdminCoachesComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule 
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
