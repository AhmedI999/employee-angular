import { Routes } from '@angular/router';
import {LandingComponent} from './landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'company',
    loadChildren: () => import('./employees/employees.routes')
      .then(m => m.routes),
  }
];
