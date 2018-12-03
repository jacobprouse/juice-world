import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import decode from 'jwt-decode';
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  constructor(private http:HttpClient) { }
  
  getSingleCollection(coll_id, callback){
    let collection = {
      '_id':coll_id
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/collections/'+coll_id;
    this.http.get(this.uri, JSON.stringify(collection)).subscribe(res => {
          callback(res);
    });
  }
  
  addToCollections(id, wanted,name, method, collection){
    let token = localStorage.getItem('token')
    let email = decode(token).email;
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+token
    });
    
    let options = {
      'headers': httpHeaders
    };
    let collection = {
      'coll_id':collection,
      'prod_id':id,
      'juiceName':name,
      'email':email,
      'wanted':wanted,
      'method':method
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/collections';
    this.http.put(this.uri, JSON.stringify(collection), options).subscribe(res => {
    });
  }
  
  addNewCollection(name, des, vis, callback){
    let token = localStorage.getItem('token')
    let email = decode(token).email;
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8'
      'Authorization' : 'Bearer '+token
    });
    
    let options = {
      'headers': httpHeaders
    };
    let collection = {
      'name': name,
      'email':email,
      'description':des,
      'visibility':vis
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/collections';
    this.http.post(this.uri, JSON.stringify(collection), options).subscribe(res => {
      callback(res);
    });
  }
  getUserCollection(callback){
    let token = localStorage.getItem('token')
    let email = decode(token).email;
    let collection = {
      'email':email
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/collections';
    this.http.get(this.uri, JSON.stringify(collection)).subscribe(res => {
      callback(res)
    });
  }
  
  getAllCollections(callback){
    let token = localStorage.getItem('token')
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/collections/all';
    this.http.get(this.uri).subscribe(res => {
      callback(res)
    });
  }
  deleteSingleCollection(_id, callback){
    let token = localStorage.getItem('token')
    let email = decode(token).email;
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+token
    });
    
    let options = {
      'headers': httpHeaders
    };
    let collection = {
      'coll_id':_id
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/collections/'+_id;
    this.http.delete(this.uri, JSON.stringify(collection), options).subscribe(res => {
      callback()
    });
  }
  deleteSingleCollectionItem(coll_id, juice_id, callback){
    let token = localStorage.getItem('token')
    let email = decode(token).email;
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+token
    });
    
    let options = {
      'headers': httpHeaders
    };
    let collection = {
      'coll_id':coll_id,
      'juice_id':juice_id
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/collections/juice';
    this.http.put(this.uri, JSON.stringify(collection), options).subscribe(res => {
      callback()
    });
  }
  editCollectionItem(name, des, vis, _id, callback){
    let token = localStorage.getItem('token')
    let email = decode(token).email;
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization' : 'Bearer '+token
    });
    
    let options = {
      'headers': httpHeaders
    };
    let collection = {
      'coll_id': _id
      'name': name,
      'description':des,
      'visibility':vis,
      'method':'update'
    };
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/collections';
    this.http.put(this.uri, JSON.stringify(collection), options).subscribe(res => {
      callback()
    });
  }
}
