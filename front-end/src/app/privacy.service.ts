import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrivacyService {
  uri;
  constructor(private http:HttpClient) { }
  
  //get the policy for showing on main screen
  getPolicy(callback){
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/policy';
    return this.http.get(this.uri)
      .subscribe(
        res => {
          callback(res);
    });
  }
  
  //set the privacy policy, if the current policy is empty, submit post request, otherwise put
  setPolicy(privacy, text){
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/policy';
    let obj = {
      'content':text
    };
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+localStorage.getItem('token')
    });
    
    let options = {
      'headers': httpHeaders
    };

    if(privacy == ''){
      this.http.post(this.uri, JSON.stringify(obj), options)
      .subscribe(
        res => {
          
        },
        err=>{
          alert(err.error.text) 
        });
    }
    else{
      this.http.put(this.uri, JSON.stringify(obj), options)
      .subscribe(
        res => {
          
        },
        err=>{
          alert(err.error.text) 
        });
    }
  }
}
