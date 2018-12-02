import { Component, OnInit } from '@angular/core';
import { JuiceService } from '../juice.service';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  //current cart
  cart:String[]=[];
  products:String[]=[];
  collection:String[]=[];
  total=0;
  currentID='';

  constructor(private juiceService:JuiceService, private shopService:ShopService) { }

  ngOnInit() {
    //set cart from localstorage
    try{
      let oldCart = JSON.parse(localStorage.getItem('cart'));
      this.cart = oldCart;
      this.calculateTotal();
      console.log(this.total)
    }catch{
      console.log('no cart');
    }
    this.juiceService.getJuices(this.populateTable.bind(this));
  }
  
  //populate the table with juices
  populateTable(res:Object){
    this.clearTable();
    var i= 0;
    while(typeof res[i]!='undefined'){
      this.products.push(res[i]);
      console.log(this.products)
      i++;
    }
  }
  
  //add items to cart
  addToCart(juice_id){
    let alreadyIn=false;
    this.products.forEach(element => {
      if(element['_id'] == juice_id){
        if(this.cart!=null){
          this.cart.forEach(element => {
            if(element['_id'] == juice_id){
              alert('That is already in your cart')
              alreadyIn = true;
            }
          });
        }
        else{
          this.cart=[]
        }
        if(alreadyIn!=true){
          let obj = {
            _id: element['_id'],
            name:element['name'],
            description:element['description'],
            price:element['price'],
            tax:element['tax'],
            quantity:element['quantity'],
            cart: 1
          };
          this.cart.push(obj);
        }
      }
    });
    this.calculateTotal();
    localStorage.setItem('cart', JSON.stringify(this.cart))
  }
  
  calculateTotal(){
    let newTotal = 0;
    this.cart.forEach(element => {
      newTotal+=(element['price']*(element['tax']/100+1))*element['cart'];
    })
    this.total = newTotal.toFixed(2);
  }
  
  checkQuantity(id, cartNum){
    let res = false;
    this.products.forEach(element => {
      if(id==element['_id']){
        if(cartNum > element['quantity']){
          //if there is more ordered than we have
          res = false;
          alert("You are adding more than we have")
        }
        else if(cartNum <= 1){
          res=false;
          alert("You can not have less than one item")
        }
        else{
          //if there is less cart than quant
          res= true;
        }
      }
    });
    return res;
  }
  
  increaseCart(id, cartNum){
    this.currentID = id;
    let result = this.checkQuantity(id, cartNum)
    if(result==true){
        for(var i =0; i<this.cart.length; i++){
          if(this.currentID == this.cart[i]['_id']){
            this.cart[i]['cart']+=1;
            this.calculateTotal();
            break;
          }
        }
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }
  
  decreaseCart(id, cartNum){
    this.currentID = id;
    let result = this.checkQuantity(id, cartNum)
    if(result==true){
        for(var i =0; i<this.cart.length; i++){
          if(this.currentID == this.cart[i]['_id']){
            this.cart[i]['cart']-=1;
            this.calculateTotal();
            break;
          }
        }
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }
  
  clear(method){
    if(method=='clear'){
      if(window.confirm("Are you sure you want to clear cart?")){
        localStorage.removeItem('cart')
        this.cart = [];
        this.calculateTotal();
      }
    }else{
      localStorage.removeItem('cart')
      this.cart = [];
      this.calculateTotal();
    }
  }
  clearTable(){
    this.products = []
  }
  buy(){
    if(this.cart == null){
      alert("Add items to your cart");
    }
    else{
      if(window.confirm("Your purchase comes to: "+this.total)){
        //update stock
        console.log('coming');
        for(var i =0; i<this.cart.length; i++){
          console.log(this.cart[i])
          this.shopService.buyJuice(this.cart[i]);
        }
        let oldCart = this.cart;
        let oldTotal = this.total;
        this.clear('buy');
        this.juiceService.getJuices(this.populateTable.bind(this));
        let names=''
        for(var i = 0; i<oldCart.length; i++){
          let price = (oldCart[i]['price']*(oldCart[i]['tax']/100+1))*oldCart[i]['cart']
          names += (oldCart[i]['name']+" - Amount: "+oldCart[i]['cart']+ " - Total Per Item: " +price+"\n")
        }
        window.confirm("THANK YOU FOR SHOPPING FOR JUICE\n"
                      +"Your reciept: \n"
                      +"Items: \n"+ names
                      +"Total: "+oldTotal+"\n")
      }
    }
  }
}
