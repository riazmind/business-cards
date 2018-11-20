import { Component, AfterViewInit } from '@angular/core';
import { HistoryService } from './history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements AfterViewInit {

  history: any[];

  constructor(private historyService: HistoryService) { 
  }

  getHistory() {

    this.historyService.allHistory().subscribe( (data:any) => {

      // sorting history according to time stamp. 
      data = data.sort((x,y) => {
        return y.date - x.date // Latest search first and old search last.    
        //return x.date - y.date  // Latest search first and old search last.        
      })
      
      this.history = data;
    });
  }

  ngAfterViewInit() {
    this.getHistory(); // get history from firebase 
  }

}
