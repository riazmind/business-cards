import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  email: string;
  password: string;
  loginSuccessful: boolean = true;

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  
  logoutAutomatically(){
    setInterval(() => {
      this.loginService.signOut();
    }, 10 * 60 * 1000); //logout automatically after 10 minutes
  }

  onLoginEmail(): void {
    if (this.validateForm(this.email, this.password)) {
      this.emailLogin(this.email, this.password);
    }
  }

  validateForm(email: string, password: string): boolean {
    if (email.length === 0) {
      this.loginSuccessful = false;
      return false;
    }

    if (password.length === 0) {
      this.loginSuccessful = false;
      return false;
    }

    if (password.length < 6) {
      this.loginSuccessful = false;
      return false;
    }
    return true;
  }

  emailLogin(email: string, password: string) {

    this.logoutAutomatically(); 

    this.loginService.loginWithEmail(this.email, this.password)
        .then(() => { 
          this.router.navigate(['/dashboard']);
          console.log('Login Successful');
          this.loginSuccessful = true;

          // add Google Analytics event for successful login 
          (<any>window).gtag('event', 'Successful', {
            'event_category' : 'User Login',
            'event_label' : 'Login'
          });

        })
        .catch( error => {
          console.log(error);
          this.loginSuccessful = false;
          console.log('Error Sign in 2');
          this.router.navigate(['/login']);
        });
  }
}

