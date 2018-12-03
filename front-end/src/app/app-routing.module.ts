import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { JuiceComponent } from './juice/juice.component';
import { ShopComponent } from './shop/shop.component';
import { CollectionsComponent } from './collections/collections.component';
import { SettingsComponent } from './settings/settings.component';



import{
RoleGuardService as RoleGuard 
} from './role-guard.service';

//routes
//to-dos
//-shopping cart area
//-admin page for modifying users, products, comments
const appRoutes: Routes = [
    { 
      path: 'home',
      component: JuiceComponent
    },
    { 
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    },
    { 
      path: 'settings',
      component: SettingsComponent,
      canActivate: [RoleGuard],
      data: {
        expectedRole: 'shop-manager'
      }
    },
    { 
      path: 'shop',
      component: ShopComponent,
      canActivate: [RoleGuard],
      data: {
        expectedRole: 'customer'
      }
    },
    { 
      path: 'collections',
      component: CollectionsComponent,
      canActivate: [RoleGuard],
      data: {
        expectedRole: 'customer'
      }
    },
    { path: '**', redirectTo: 'home' }
  ];
@NgModule({
    imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
