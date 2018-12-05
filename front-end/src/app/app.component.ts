import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { RouterModule } from '@angular/router';
import{
RoleGuardService as RoleGuard 
} from './role-guard.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  logged = '';
  hide=false;
  admin=false;
  constructor(private auth:AuthService, private roleGuard:RoleGuard){}
  
  ngOnInit(){
    if(this.auth.isAuthenticated()){
      //direct to /home
      this.logged = 'Logout';
      this.hide = false;
      this.admin=true;
    }
    else{
      this.logged='Login';
      this.hide = true;
      this.admin=true;
      //this.log();
    }
    if(this.roleGuard.isAdmin()){
      this.admin = false;
    }
  }
  log(){
    localStorage.setItem('token', '')
    window.location.href = '/home';
  }
}
