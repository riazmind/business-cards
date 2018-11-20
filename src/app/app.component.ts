import { Component, OnInit } from '@angular/core';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Business Cards';

  constructor(private loginService: LoginService) {
  }

  logout() {
    this.loginService.signOut();
  }

  ngOnInit() {
  }
}
