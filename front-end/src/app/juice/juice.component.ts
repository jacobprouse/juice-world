import { Component, OnInit } from '@angular/core';
import { JuiceService} from '../juice.service'

@Component({
  selector: 'app-juice',
  templateUrl: './juice.component.html',
  styleUrls: ['./juice.component.css']
})
export class JuiceComponent implements OnInit {
  top_ten:string[]=[];
  products:Object[]=[];
  selectedProduct="";

  constructor( private juiceService: JuiceService) {}

  ngOnInit() {
    //when components are loaded, set up products
    this.juiceService.getTopTen(this.showTopTen.bind(this));
    this.juiceService.getJuices(this.populateSelect.bind(this));
  }
  
  //populate the select box with juices
  populateSelect(res:Object){
    var i= 0;
    while(typeof res[i]!='undefined'){
      var obj = res[i];
      this.products.push(obj);
      i++;
    }
  }
  
  //on select box change the label below to selected option
  onChange(newValue){
    this.selectedProduct = newValue;
  }
  
  //show top ten in list
  showTopTen(res:Object){
    var i= 0;
    while(typeof res[i]!='undefined'){
      var str = res[i]['name']+" - Price:$"+res[i]['price']+" - Tax:"+res[i]['tax']+"% - Quantity:"+res[i]['quantity']+" - Sold:"+res[i]['sold']; ; 
      this.top_ten.push(str);
      i++;
    }
  }
  
  
  
}
