import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import decode from 'jwt-decode';
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  uri='';

  constructor(private http:HttpClient) { }
  
  //get all the comments
  getComments(juiceID, callback){
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/comments/'+juiceID;

    return this.http.get(this.uri).subscribe(res => {
      console.log(res)
      callback(res);
    });
  }
  //make a new comment
  makeComment(juiceID,juiceName, text, rating){
    let token = localStorage.getItem('token')
    let email = decode(token).email
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+localStorage.getItem('token')
    });
    
    let options = {
      'headers': httpHeaders
    };
    let juice = {
      '_id':juiceID,
      'juiceName':juiceName.split('-')[0],
      'email':email,
      'text':text,
      'rating':rating
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/comments/'+juiceID;
    this.http.post(this.uri, JSON.stringify(juice), options).subscribe(res => {
    });
  }
  //get all user comments
  getUserComments(email){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+localStorage.getItem('token')
    });
  
    let options = {
      'headers': httpHeaders
    };
    let juice = {
      'email':email
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/comments/'+email;
    this.http.get(this.uri, JSON.stringify(juice), options).subscribe(res => {
    });
  }
}
