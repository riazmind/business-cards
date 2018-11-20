import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import 'rxjs/add/operator/switchMap';

import { LoginService } from '../login/login.service';

@Injectable()

export class DashboardService {

  databaseRef: any;

  constructor(private loginService: LoginService, private db: AngularFireDatabase) {
    // save reference for database path to use later on 
    this.databaseRef = this.db.list('businessCard');
  }

  allCards() {    
    // get all business cards 
    return this.databaseRef.valueChanges();
  }

  lookupName() {
    return this.databaseRef.valueChanges();
  }

  addCard(firstName: string, lastName: string, email: string, 
    phone: string, extraText: string, imageUri: string) {

      this.databaseRef.push(
      { 
        firstName: firstName,
        lastName: lastName, 
        email: email,
        phone: phone,
        extraText: extraText,
        imageUri: imageUri
      }
    );
  }

}
