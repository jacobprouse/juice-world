import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( private loginService : LoginService ) { }

  ngOnInit() {
  }
  
  onClick(email, password){
    let user = {
      'email': email,
      'password': password
    };
    
    this.loginService.authenticate(user);
  }

}
