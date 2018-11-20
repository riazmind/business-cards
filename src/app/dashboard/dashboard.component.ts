import { Component, OnInit } from '@angular/core';

import { DashboardService } from './dashboard.service';
import { HistoryService } from '../history/history.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  cards: any; // for all cards 
  searchedCard: any; 
  searchCardFound: boolean = false;
  searchCardNotFound: boolean = false;
  cameraAccess: boolean = false;
  
  constructor(private loginService: LoginService, 
    private dashboardService: DashboardService, private historyService: HistoryService) {
  }

  searchName(first: string, last: string) {
    this.searchCardFound = false; 
    this.searchCardNotFound = false;

    // do not display all cards when search for specific card.  
    this.cards = null;
    this.cameraAccess = false; // close camera when show all cards

    // save search history in firebase 
    this.historyService.addHistory(Date.now(), this.loginService.userEmail, `Search name ${first} ${last}`);
    
    this.dashboardService.lookupName().subscribe( (data:any[]) => { 

      data.filter( data1 => {

        if(data1['firstName'].toLowerCase() === first.toLowerCase() && 
        data1['lastName'].toLowerCase() === last.toLowerCase()) {
          this.searchedCard = data1;
          this.searchCardFound = true;
          this.cards = null;
        } 
      })

      if(!this.searchCardFound) {
        this.searchCardNotFound = true;
        console.log(`Record Not Available`);
      }
        
      //data.forEach( (data2) => {
        //console.log(`Data2 = ${data2['firstName']}`);
      //})
    });
  }

  allCards() {
    
    this.searchCardFound = false; // hide search card 
    this.searchCardNotFound = false; // remove message for searched card not found 
    this.cameraAccess = false; // close camera when show all cards 

    this.dashboardService.allCards() 
    .subscribe( (data:any) => {
      this.cards = data;
    });    
  }

  searchEmail(email: string) {
    this.searchCardFound = false; 
    this.searchCardNotFound = false;

    // do not display all cards when search for specific card.  
    this.cards = null;
    this.cameraAccess = false; // close camera when show all cards

    // save search history in firebase 
    this.historyService.addHistory(Date.now(), this.loginService.userEmail, `Search email ${email}`);
    
    this.dashboardService.lookupName().subscribe( (data:any[]) => { 

      data.filter( data1 => {

        if(data1['email'].toLowerCase() === email.toLowerCase()) {
          this.searchedCard = data1;
          this.searchCardFound = true;
          this.cards = null;
        } 
      })

      if(!this.searchCardFound) {
        this.searchCardNotFound = true;
        console.log(`Record Not Available`);
      }

    });
  }

  getCamera() {
    // do not display searched card when camera is ON 
    this.searchCardFound = false; 
    this.searchCardNotFound = false; // remove message for searched card not found 

    // do not display all cards when camera is ON 
    this.cards = null;

    // On or Off camera 
    this.cameraAccess = !this.cameraAccess;
  }

  receiveMessage($event) {
    this.cameraAccess = $event;
  }

  ngOnInit() {
  }

}
