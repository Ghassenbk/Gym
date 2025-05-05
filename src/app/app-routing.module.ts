import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // à adapter selon ton projet
import { ProgramDetailsComponent } from './program-details/program-details.component'; // à adapter aussi
import { ContactComponent } from './contact/contact.component';
import { CoachesComponent } from './coaches/coaches.component';
import { AboutComponent } from './about/about.component';
import { CoachProfileComponent } from './coach-profile/coach-profile.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { ClientsComponent } from './admin/clients/clients.component';
import { AdminCoachesComponent } from './admin/admin-coaches/admin-coaches.component';
import { AdminContactComponent } from './admin/admin-contact/admin-contact.component';
import { SubscriptionsComponent } from './admin/subscriptions/subscriptions.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'program-details', component: ProgramDetailsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'coaches', component: CoachesComponent },
  { path: 'about', component: AboutComponent },
  {path:'coachprofile',component:CoachProfileComponent},
  {path:'adminDashBoard',component:ClientsComponent},
  {path:'admin-clients',component:ClientsComponent},
  {path:'admin-coaches',component:AdminCoachesComponent},
  {path:'admin_contactus',component:AdminContactComponent},
  {path:'admin_subscriptions',component:SubscriptionsComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
