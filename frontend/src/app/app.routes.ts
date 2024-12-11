import { Routes } from '@angular/router';
import { DashboardComponent } from './dashbord/dashbord.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './login/auth.guard';

export const routes: Routes = [
  { path: 'dashboard', component:DashboardComponent ,    canActivate: [AuthGuard],
  }, 
  // Define the route for Dashboard
  // Define the route for Dashboard

  // Define the route for Dashboard

  { path: '', component:HomeComponent  },
  { path: "**", component:HomeComponent  }, // Redirect to dashboard by default (optional)
   // Redirect to dashboard by default (optional)
  // Add other routes here
];
