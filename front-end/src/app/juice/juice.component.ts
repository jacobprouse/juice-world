import { Component, OnInit } from '@angular/core';
import { JuiceService} from '../juice.service'
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../auth.service';
import { CommentsService } from '../comments.service'
import * as $ from 'jquery';

@Component({
  selector: 'app-juice',
  templateUrl: './juice.component.html',
  styleUrls: ['./juice.component.css']
})
export class JuiceComponent implements OnInit {
  top_ten:string[]=[];
  products:Object[]=[];
  comments:Object[]=[];
  selectedProduct='';
  currentID='';
  ver=true;
  userRating='';

  constructor( private juiceService: JuiceService, private auth:AuthService, 
                private commentsService: CommentsService) {}

  ngOnInit() {
    //hiding account options if already logged in
    if(this.auth.isAuthenticated()){
      //direct to /home
      this.ver=false;
    }
    else{
      this.ver=true;
    }
    //radio buttons load on doc load
    $(document).ready(function(){
      // Check Radio-box
      $(".rating input:radio").attr("checked", false);
  
      $('.rating input').click(function () {
          $(".rating span").removeClass('checked');
          $(this).parent().addClass('checked');
      });
    });
    //when components are loaded, set up products
    this.juiceService.getTopTen(this.showTopTen.bind(this));
    this.juiceService.getJuices(this.populateSelect.bind(this));
  }
  
  //radio buttons updating
  onSelectionChange(val){
    this.userRating = val;
  }
  
  //populate the select box with juices
  populateSelect(res:Object){
    var i= 0;
    while(typeof res[i]!='undefined'){
      this.products.push(res[i]);
      i++;
    }
  }
  
  //on select box change the label below to selected option
  onChange(newValue){
    this.currentID = newValue[1];
    this.clearComments();
    this.selectedProduct = newValue[0];
    this.commentsService.getComments(this.currentID, this.populateComments.bind(this));
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
  
  newComment(text){
    if(typeof this.currentID=='undefined'||typeof this.userRating=='undefined'){
      alert('Pick a product');
    }
    else{
      this.commentsService.makeComment(this.currentID,this.selectedProduct, text, this.userRating)
    }
  }
  clearComments(){
    this.comments=[]
  }
  
  populateComments(res:Object){
    var i= 0;
    while(typeof res[i]!='undefined' || i==4){
      this.comments.push(res[i]);
      i++;
    }
  }
  
  
  
}
