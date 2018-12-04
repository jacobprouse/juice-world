import { Component, OnInit } from '@angular/core';
import { JuiceService } from '../juice.service';
import { SettingsService } from '../settings.service';
import { PrivacyService } from '../privacy.service';
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
  policy=''
  dcma=''
  //get services
  constructor(private juiceService:JuiceService, 
              private settingsService:SettingsService,
              private privacyService:PrivacyService) { }
  //clear and populate tables on init
  ngOnInit() {
    this.clearTable();
    this.juiceService.getJuices(this.populateTable.bind(this));
    this.settingsService.getComments(this.populateComments.bind(this));
    this.settingsService.getUsers(this.populateUsers.bind(this));
  }
  //set the policy variable
  setPolicy(text){
    this.privacyService.setPolicy(this.policy, text);
  }
  //set current comment selected
  setCurrentComment(id){
    this.currentComment = id;
  }
  //set current product selected
  setCurrentProduct(id){
    this.currentProduct = id;
  }
  //set current user selected
  setCurrentUser(email){
    this.currentEmail = email;
  }
  //edit user
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
  //clear the tables
  clearTable(){
    this.products = []
    this.comments = []
  }
  //delete a juice
  deleteItem(_id){
    this.settingsService.deleteJuice(_id, this.refresh.bind(this))
  }
  //populate the comments section
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
  //edit specifics of a juice
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
  //add a new juice
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
  //refresh the tables of the page
  refresh(){
    this.juiceService.getJuices(this.populateTable.bind(this));
    this.settingsService.getComments(this.populateComments.bind(this));
    this.settingsService.getUsers(this.populateUsers.bind(this));

  }
  //edit a comments visibility
  editComment(vis){
    let obj = {
      '_id':this.currentComment,
      'visibility':vis
    }
    this.settingsService.editAComment(obj,this.populateComments.bind(this))
  }
}

