import { Component, OnInit } from '@angular/core';
import { JuiceService } from '../juice.service';
import { CollectionsService } from '../collections.service';
import decode from 'jwt-decode';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {
  collections:String[]=[];
  collection:String[]=[];
  products:String[]=[];
  globalCollection:String[]=[]
  globalJuices:String[]=[]
  currentCollection:String='';
  currentGlobalCollection:String='';
  currentUser=''

  constructor(private juiceService:JuiceService,
              private collectionsService:CollectionsService) { }

  ngOnInit() {
    let token = localStorage.getItem('token')
    let email = decode(token).email;
    this.currentUser = email;
    this.collection=[]
    this.juiceService.getJuices(this.populateTable.bind(this));
    this.collectionsService.getAllCollections(this.populateGlobalCollections.bind(this))
    this.collectionsService.getUserCollection(this.populateUserCollections.bind(this))
  }
  
  setCurrentCollection(id){
    this.clearJuiceTable();
    this.currentCollection = id;
    this.collectionsService.getSingleCollection(id,this.addToTable.bind(this))
    this.resetTables();
  }
  setCurrentGlobalCollection(id){
    this.clearJuiceTable();
    this.currentGlobalCollection = id;
    this.collectionsService.getSingleCollection(id,this.addToGlobalTable.bind(this))
    this.resetTables();
  }
  resetTables(){
    this.clearJuiceTable()
    this.collectionsService.getAllCollections(this.populateGlobalCollections.bind(this))
    this.collectionsService.getUserCollection(this.populateUserCollections.bind(this))
  }
  clearJuiceTable(){
    this.collection=[]
    this.globalJuices=[]
  }

  addToTable(res){
    var j =0;
    while(typeof res.juices[j]!='undefined'){
      this.collection.push(res.juices[j])
      j++;
    }
  }
  addToGlobalTable(res){
    var j =0;
    while(typeof res.juices[j]!='undefined'){
      this.globalJuices.push(res.juices[j])
      j++;
    }
  }
  //populate the table with juices
  populateTable(res:Object){
    this.clearProductTable();
    var i= 0;
    while(typeof res[i]!='undefined'){
      this.products.push(res[i]);
      i++;
    }
  }
  
  clearProductTable(){
    this.products = [];
  }
  
  addCollection(name, des, vis){
    this.collectionsService.addNewCollection(name, des, vis, this.resetTables.bind(this));
  }
  
  populateUserCollections(res: Object){
    this.collections=[]
    var i= 0;
    while(typeof res[i]!='undefined'){
      this.collections.push(res[i]);
      i++;
    }
  }
  
  populateGlobalCollections(res: Object){
    this.globalCollection=[]
    var i= 0;
    while(typeof res[i]!='undefined'){
      this.globalCollection.push(res[i]);
      i++;
    }
  }
  
  addToCollection(id, wanted, name, method){
    let res = false;
    this.collection.forEach(element =>{
      if(res == true){
        
      }
      else{
      if(element['juiceID'] == id){
        alert('You already have that in your collection');
        res = true
      }
      }
    });
    if(res==false){
      this.collectionsService.addToCollections(id, wanted, name, method, this.currentCollection, this.resetTables.bind(this));
    }
  }
  
  increaseCollection(id, wanted, name, method){
    if(wanted <= 0){
      alert("You cannot wish for negative values")
    }
    else{
      this.collectionsService.addToCollections(id, wanted, name, method, this.currentCollection);
    }
  }
  
  deleteCollection(_id){
    this.collectionsService.deleteSingleCollection(_id, this.resetTables.bind(this));
  }
    deleteCollectionItem(juice_id){
    this.collectionsService.deleteSingleCollectionItem(this.currentCollection,juice_id, this.resetTables.bind(this));
  }
  
  editCollection(name, des, vis){
    this.collectionsService.editCollectionItem(name, des, vis, this.currentCollection, this.resetTables.bind(this));
  }
}
