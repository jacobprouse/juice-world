import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  logged = '';
  hide=true;
  constructor(private auth:AuthService){}
  
  ngOnInit(){
    if(this.auth.isAuthenticated()){
      //direct to /home
      this.logged = 'Logout';
      this.hide = false;
    }
    else{
      this.logged='Login';
      this.hide = true;
    }
  }
  
  log(){
    if(this.auth.isAuthenticated()){
      localStorage.setItem('token', '') 
    }
    window.location.href = '/home';
  }
}
