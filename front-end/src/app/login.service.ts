import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private http: HttpClient ) { }
  
  uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/authenticate';
  
  authenticate( user : Object) { 
		let httpHeaders = new HttpHeaders({
		  'Content-Type' : 'application/json; charset=utf-8',
		});
	  
		let options = {
		  'headers': httpHeaders
		};
		this.http.post(this.uri, JSON.stringify(user), options).subscribe(res => {
		  console.log(res);
		});
  }
}
