import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { EmptyLayoutComponent } from './core/layouts/empty/empty-layout.component';
import { DynamicLayoutComponent } from './core/layouts/dynamic/dynamic-layout.component';

const routes: Routes = [
  /*
    Default route
  */
  { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },
  // { path: '', redirectTo: '/authentication/signup', pathMatch: 'full' },
  /*
    Auth routes + layout
  */
  {
    path: '',
    component: EmptyLayoutComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule)
      }
    ]
  },
  /*
    Main routes + dynamic layouts
  */
  {
    path: '',
    component: DynamicLayoutComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule)
      },
      {
        path: 'crm',
        loadChildren: () => import('./modules/crm/crm.module').then(m => m.CrmModule)
      },
      {
        path: 'voting',
        loadChildren: () => import('./modules/voting/voting.module').then(m => m.VotingModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./modules/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'finance',
        loadChildren: () => import('./modules/finance/finance.module').then(m => m.FinanceModule)
      },
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
    ]
  },
  /*
    Undefined routes (should redirect to a 404 page)
  */
  { path: '**', redirectTo: 'home/dashboard' }
];

@NgModule({
  // Only call RouterModule.forRoot() in the root AppRoutingModule (or the AppModule if that's where you register
  // top level application routes). In any other module, you must call the RouterModule.forChild method to register additional routes.
  imports: [
    RouterModule.forRoot(routes, {
      // If you want to preload all lazy routes when the app loads, uncomment the following line
      // preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload',
      // This value is required for server-side rendering to work.
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
