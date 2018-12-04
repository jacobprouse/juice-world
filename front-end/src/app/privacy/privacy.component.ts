import { Component, OnInit } from '@angular/core';
import { PrivacyService } from '../privacy.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  privacy='';
  
  constructor(private privacyService:PrivacyService) { }

  ngOnInit() {
    this.privacyService.getPolicy(this.populatePolicy.bind(this));
  }
  
  //populate policy variable
  populatePolicy(text){
    this.privacy = text[0]['content'];
  }
  


}
