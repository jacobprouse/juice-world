import { Component, OnInit } from '@angular/core';
import { JuiceService } from '../juice.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  products:String[]=[];
  comments:Object[]=[];
  users:Object[]=[];
  currentProduct='';
  currentComment = '';
  currentEmail='';
  constructor(private juiceService:JuiceService, private settingsService:SettingsService) { }

  ngOnInit() {
    this.clearTable();
    this.juiceService.getJuices(this.populateTable.bind(this));
    this.settingsService.getComments(this.populateComments.bind(this));
    this.settingsService.getUsers(this.populateUsers.bind(this));
  }
  
  setCurrentComment(id){
    this.currentComment = id;
  }
  
  setCurrentProduct(id){
    this.currentProduct = id;
  }
  
  setCurrentUser(email){
    this.currentEmail = email;
  }
  
  editUser(role, active){
    this.settingsService.editUserDetails(this.currentEmail, active, role, this.refresh.bind(this));
  }
  
    //populate the table with juices
  populateUsers(res:Object){
    this.users=[]
    var i= 0;
    while(typeof res[i]!='undefined'){
      this.users.push(res[i]);
      i++;
    }
  }
  
  //populate the table with juices
  populateTable(res:Object){
    this.products=[]
    var i= 0;
    while(typeof res[i]!='undefined'){
      this.products.push(res[i]);
      i++;
    }
  }
  
  clearTable(){
    this.products = []
    this.comments = []
  }
  
  deleteItem(_id){
    this.settingsService.deleteJuice(_id, this.refresh.bind(this))
  }
  
  populateComments(res:Object){
    this.comments = []
    var i= 0;
    while(typeof res[i]!='undefined'){
      this.products.forEach(element=>{
        if(element['_id']==res[i]['juiceID']){
          res[i]['juiceName'] = element['name'];
        }
      })
      this.comments.push(res[i]);
      i++;
    }
  }
  
  editJuice(name, des, p, t, q){
    if(name == ''){
      alert('Please input a name')
    }
    else if(des==''){
      alert('Please input a description')
    }
    else if(isNaN(p)){
      alert('Please input a valid price')
    }
    else if(isNaN(t)){
      alert('Please input a valid tax')
    }
    else if(isNaN(q)){
      alert('Please input a valid quantity')
    }
    else{
      let obj = {
        '_id':this.currentProduct,
        'name':name,
        'description':des,
        'price':p,
        'tax':t,
        'quantity':q,
        'sold':0
      }
      this.settingsService.putJuice(obj, this.refresh.bind(this))
    }
  }
  
  addJuice(name, des, p, t, q){
    if(name == ''){
      alert('Please input a name')
    }
    else if(des==''){
      alert('Please input a description')
    }
    else if(isNaN(p)){
      alert('Please input a valid price')
    }
    else if(isNaN(t)){
      alert('Please input a valid tax')
    }
    else if(isNaN(q)){
      alert('Please input a valid quantity')
    }
    else{
      let obj = {
        'name':name,
        'description':des,
        'price':p,
        'tax':t,
        'quantity':q,
        'sold':0
      }
      this.settingsService.postJuice(obj, this.refresh.bind(this))
    }
  }
  refresh(){
    this.juiceService.getJuices(this.populateTable.bind(this));
    this.settingsService.getComments(this.populateComments.bind(this));
    this.settingsService.getUsers(this.populateUsers.bind(this));

  }
  
  editComment(vis){
    let obj = {
      '_id':this.currentComment,
      'visibility':vis
    }
    this.settingsService.editAComment(obj,this.populateComments.bind(this))
  }
}

