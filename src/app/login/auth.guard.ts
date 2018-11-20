import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { LoginService} from './login.service';
import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';

@Injectable()

export class AuthGuard implements CanActivate {

  constructor(private authService: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

     // Non-Admin user cannot navigate to History 
     if (this.authService.isAdmin === next.data.role) {
        console.log(`Non Admin user ${this.authService.userEmail} is not Authorized to see history.`);
        alert(`Non Admin user ${this.authService.userEmail} is not Authorized to see history.`);
        return false;
      }

    return this.authService.user.pipe(
      take(1),
      map((user) => !!user),
      
      tap((loggedIn) => { 
        console.log(`loggedIn = ${loggedIn}`);
        if (!loggedIn) {
          console.log('access denied');
          this.router.navigate(['']);
        }
      }),
    );
  }

}
