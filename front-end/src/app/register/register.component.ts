import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor( private registerService : RegisterService ) { }

  ngOnInit() {
  }

  onClick(buttonName, email, password){
    let newUser = {
      'email':email,
      'password':password,
      'buttonType':buttonName
    };
    this.registerService.authenticate(newUser);
  }

}
