import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { JuiceComponent } from './juice/juice.component';
import { LoginService } from './login.service';
import { JuiceService } from './juice.service';
import { RegisterComponent } from './register/register.component';
import { RegisterService } from './register.service';
import { FormsModule } from '@angular/forms';
import { ShopComponent } from './shop/shop.component';
import { CollectionsComponent } from './collections/collections.component';

const JWT_Module_Options: JwtModuleOptions = {
    config: {
        tokenGetter: ()=>{
          const token = localStorage.getItem('token');
          return token;
        }
    }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    JuiceComponent,
    RegisterComponent,
    ShopComponent,
    CollectionsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    JwtModule.forRoot(JWT_Module_Options)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
