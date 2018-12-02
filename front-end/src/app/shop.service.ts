import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  uri='';
  //update quantities of juices
  constructor(private http:HttpClient) { }
  
  buyJuice(juice){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json; charset=utf-8',
    });
    
    let options = {
      'headers': httpHeaders
    };
    let j = {
      '_id': juice._id,
      'newQuantity':(juice.quantity - juice.cart),
      'cart': (juice.cart)
    };
    console.log(j)
    console.log('sending')
    this.uri = 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/juice/buy';
    return this.http.put(this.uri, JSON.stringify(j), options)
      .subscribe(
        res => {
          console.log(res);
        });
  }
  
  
}
