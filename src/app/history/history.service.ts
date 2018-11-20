import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import 'rxjs/add/operator/switchMap';

import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})

export class HistoryService {

  searchHistoryRef: any;

  constructor(private loginService: LoginService, private db: AngularFireDatabase) {

    this.searchHistoryRef = this.db.list('history');
  }

  allHistory() {    
    return this.searchHistoryRef.valueChanges();
  }

  addHistory(date: number, user: string, action: string) {

      this.searchHistoryRef.push(
      { 
        date: date,
        user: user,
        action: action
      }
    );
  }

}
