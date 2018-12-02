import { Component, OnInit } from '@angular/core';
import { JuiceService } from '../juice.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  //current cart
  cart:string[]=[]
  products:string[]=[]
  collection:Object[]={}

  constructor(private juiceService:JuiceService) { }

  ngOnInit() {
    //check if there is a cart in storage
    if(localStorage.getItem('cart'){
      this.cart = localStorage.getItem('cart')
    }
    this.juiceService.getJuices(this.populateTable.bind(this));
  }
  
  //populate the table with juices
  populateTable(res:Object){
    var i= 0;
    while(typeof res[i]!='undefined'){
      this.products.push(res[i]);
      i++;
    }
  }
  
  //add items to cart
  addToCart(juice_id){
    this.cart.push(juice_id)
    localStorage.setItem('cart', this.cart)
  }

}
