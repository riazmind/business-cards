import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';

@Injectable()

export class LoginService {
  authState: Observable<{} | null>;

  user: Observable<{} | null>;
  userUid: string;
  userEmail: string;
  isAdmin: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase
  ) {

    this.user = this.afAuth.authState
    .switchMap((user) => {
      if (user) {
        this.userUid = user.uid;
        this.userEmail = user.email;
        this.checkAdmin(user.uid);
        //console.log('SWITCHMAP');
        //console.log(user);
        //console.log('SWITCHMAP');
        return this.db.object(`users/${user.uid}`).update({email: user.email}).then( () => {
          return this.db.object(`users/${user.uid}`).valueChanges();
        }).catch( (error) => {
          console.log('ERROR UPDATING USER EMAIL');
          console.log(error);
          console.log('ERROR UPDATING USER EMAIL');
        });
      } else {
        return Observable.of(null);
      }
    });
  }

  checkAdmin(userID) {
    const obs1 = this.db.object(`admins/${userID}`).snapshotChanges()
    .subscribe(data => {
      //console.log(`data admin = ${data.payload.val()}`);
      if(data.payload.val())
        this.isAdmin = true;
      else 
        this.isAdmin = false;
      console.log(`User Admin = ${this.isAdmin}`);
    });
  }

  loginWithEmail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email.trim(), password.trim())
      .then((auth) => {
        const createdAt = firebase.database.ServerValue.TIMESTAMP;
        //console.log('CREATED AT');
        //console.log(createdAt);
        //console.log('CREATED AT');
        const sessionKey = this.db.database
                        .ref(`sessions`)
                        .push({
                          userUid: auth.user.uid
                        }).key;

        const sessionPayload: any = {
          createdAt: createdAt,
          userUid: auth.user.uid,
          currentSessionKey: sessionKey,
        };

        const sessionPayloads: any = {};
        sessionPayloads[`currentSession/${auth.user.uid}`] = sessionPayload;
        sessionPayloads[`users/${auth.user.uid}/sessions/${sessionKey}`] = {'createdAt': createdAt};
        return this.db.database.ref().update(sessionPayloads);
      })
      .catch(error => {
        console.log(error);
        // console.log('Error Sign in 1');
        throw error;
      });
  }

  signOut() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }
}

