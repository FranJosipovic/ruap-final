import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/home-page/home-page.component').then(
        (mod) => mod.HomePageComponent
      ),
  },
  {
    path: 'upitnik',
    loadComponent: () =>
      import('../pages/upitnik/upitnik.component').then(
        (mod) => mod.UpitnikComponent
      ),
  },
];
