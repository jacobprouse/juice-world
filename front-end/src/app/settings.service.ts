import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  uri='';
  constructor(private http:HttpClient) { }
  
  editAComment(obj, callback){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+localStorage.getItem('token')
    });
    
    let options = {
      'headers': httpHeaders
    };

    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/comments';
    this.http.put(this.uri, JSON.stringify(obj), options)
      .subscribe(
        res => {
          callback(res);
          
        },
        err=>{
          alert(err.error.text) 
        });
  }
  
  editUserDetails(email,active, role, callback){
    let obj = {
      'email':email,
      'active':active,
      'role':role
    };
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+localStorage.getItem('token')
    });
    
    let options = {
      'headers': httpHeaders
    };

    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/user';
    this.http.put(this.uri, JSON.stringify(obj), options)
      .subscribe(
        res => {
          callback();
          
        },
        err=>{
          alert(err.error.text) 
        });
  }
  
  getUsers(callback){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+localStorage.getItem('token')
    });
    
    let options = {
      'headers': httpHeaders
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/user';
    return this.http.get(this.uri, options)
      .subscribe(
        res => {
          callback(res);
    });
  }
  
  getComments(callback){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+localStorage.getItem('token')
    });
    
    let options = {
      'headers': httpHeaders
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/comments';
    return this.http.get(this.uri, options)
      .subscribe(
        res => {
          callback(res);
    });
  }
  
  putJuice(obj, callback){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+localStorage.getItem('token')
    });
    
    let options = {
      'headers': httpHeaders
    };
    console.log(obj['_id'])
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/juice/'+obj['_id'];
    this.http.put(this.uri, JSON.stringify(obj), options)
      .subscribe(
        res => {
          callback();
          
        },
        err=>{
          alert(err.error.text) 
        });
  }
  
  deleteJuice(_id, callback){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+localStorage.getItem('token')
    });
    
    let options = {
      'headers': httpHeaders
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/juice/'+_id;
    this.http.delete(this.uri, options)
      .subscribe(
        res => {
          callback();
          
        },
        err=>{
          alert(err.error.text) 
        });
  }
  
  postJuice(obj, callback){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+localStorage.getItem('token')
    });
    
    let options = {
      'headers': httpHeaders
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/juice';
    this.http.post(this.uri, JSON.stringify(obj), options)
      .subscribe(
        res => {
          callback();
        },
        err=>{
          alert(err.error.text) 
        });
  }
}
