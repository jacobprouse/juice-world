import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error = "";

  constructor( private loginService : LoginService ) { }

  ngOnInit() {
  }
  //on click send login 
  onClick(email, password){
    if(email==null||password==null){
      alert("Input an email");
    }
    else{
      let user = {
        'email': email,
        'password': password
      };
     this.loginService.authenticate(user);
    }
  }

}
