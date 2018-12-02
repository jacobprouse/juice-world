import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private http: HttpClient ) { }
  
  uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/authenticate';
   
  tokenSuccess(response){
  		localStorage.setItem ('token', response.token);
  		//refidect to shopping cart on login success
  		window.location.href = '/';
  }
  
  authenticate( user : Object):string { 
		let httpHeaders = new HttpHeaders({
		  'Content-Type' : 'application/json; charset=utf-8',
		});
	  
		let options = {
		  'headers': httpHeaders
		};
		this.http.post(this.uri, JSON.stringify(user), options)
			.subscribe(
				res => {
					if(typeof res == 'undefined'){
						
					}
					else{
						this.tokenSuccess(res);
		  			alert('Congrats!');
					}
		  		
				}
				err => {
					alert(err.error.text);
				}
			);
  }
}
