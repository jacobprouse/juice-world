import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JuiceService {

  constructor( private http:HttpClient) { }
  uri;
  
  //get the top ten juices
  getTopTen(callback){ 
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+localStorage.getItem('token')
    });
    
    let options = {
      'headers': httpHeaders
    };
    
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/juice/top_juices';
    return this.http.get(this.uri).subscribe(res => {
      callback(res);
    });
  }
  //get all the juices
  getJuices(callback){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+localStorage.getItem('token')
    });
    
    let options = {
      'headers': httpHeaders
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/juice';
    return this.http.get(this.uri).subscribe(res => {
      callback(res);
    });
  }
    //get all the juices
  getNonEmptyJuices(callback){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+localStorage.getItem('token')
    });
    
    let options = {
      'headers': httpHeaders
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/juice/notempty';
    return this.http.get(this.uri).subscribe(res => {
      callback(res);
    });
  }
}
