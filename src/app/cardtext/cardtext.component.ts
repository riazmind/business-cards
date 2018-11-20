import { Component, OnInit, Input, Output, 
  EventEmitter, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { textDetectionConfig } from '../../environments/environment';
import { DashboardService } from '../dashboard/dashboard.service';
import { HistoryService } from '../history/history.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-cardtext',
  templateUrl: './cardtext.component.html',
  styleUrls: ['./cardtext.component.css']
})
export class CardtextComponent implements OnInit, AfterViewInit {

  @Input('imageOnly') imageOnly: string;
  @Input('imageUri') imageUri: string;

  @Output() closeCardtextEvent = new EventEmitter<boolean>();

  fullName: string = '';
  firstName1: string = '';
  lastName1: string = '';
  phone1: string = '';
  email1: string = '';
  extraText1: string = '';
  
  getName: boolean = false;
  getPhone: boolean = false;
  getEmail: boolean = false;

  dataSaved: boolean = false;

  constructor(private http: HttpClient, 
    private loginService: LoginService, 
    private dashboardService: DashboardService, 
    private historyService: HistoryService) { 
  }

  ngAfterViewInit() {
    this.dataSaved = false; 
    //this.cardtextClose = false;
    this.closeCardtextEvent.emit(true);
    this.getName = false;
    this.getPhone = false;
    this.getEmail = false;
    this.extractText();
  }

  extractText() {
    // disable it when use webcam or another source of image 
        //this.imageUri = 'https://lh3.googleusercontent.com/-sQsJlPZIPTc/ThwkpQeADtI/AAAAAAAAAuI/MWUH1I_7X0A/w530-h289-n/patrick-bateman-card.png';
      
        const request: any = {
          'requests': [
            {
              'image': { 
                // for image available locally in base64 
                "content": this.imageOnly 

                /* 
                // for image url available online 
                'source': {
                  'imageUri': this.imageUri
                },
                */
              },
              'features': [
                {
                  'type': 'TEXT_DETECTION',
                  'maxResults': 1,
                }
              ]
            }
          ]
    };
    
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${textDetectionConfig.CSC436}`; 
    //const url = 'https://www.example.com';

    //console.log(`CSC436 = ${textDetectionConfig.CSC436}`);
    //console.log(`url = ${url}`);
    
    this.http.post(
      url,
      request
    )
    .pipe(
        map(response => response['responses']
            .map(result => result['fullTextAnnotation'])
            .map(result => result['text'])
            )
    )
    .subscribe( (data: any) => {
      
        console.log('RESULTS RESULTS RESULTS');
        console.log(`Text Extracted = ${data}`);
        console.log('RESULTS RESULTS RESULTS'); 

        // parse data to name, phone, email and extra text. 
        this.parseData(data.toString());

        // save action in history for text detection 
        this.historyService.addHistory(Date.now(), this.loginService.userEmail, 'User performed text detection on business card.');
      }
      
    );
  
    //var data1 : any ='212 555 6342\nemail123@emailsss.com\nPIERCE &PIERCE\nMERGERS AND AQUISTIONS\nPATRICK BATEMAN\nVICE PRESIDENT\n358 EXCHANGE PLACE New YORK, N.Y. 10099 FAX 212\n555 6390 TELEX 10 4534\n';
    //this.parseData(data1.toString()); 
  }

  parseData(data: string) {

    //console.log(`data = ${data}`);

    // initialize the values to remove old data if still present 
    this.fullName = '';
    this.phone1 = '';
    this.email1 = '';
    this.extraText1 = '';

    var data1 = data.split('\n');

    data1.forEach(data2 => {
      //console.log(`data2 = ${ data2 }`);
      //console.log(`data2 is index = ${ data2.search(/@/i) }`);

      if(data2.search(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) >= 0) {
        // check for email 
        //console.log(`data2 is email = ${ data2 }`);
        this.email1 = data2;
        this.getEmail = true; // just save first email and store others in extra text 
      }
      else if(data2.search(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/) >= 0) {
        // check for phone number 
        //console.log(`data2 is phone = ${ data2 }`);
        this.phone1 = data2;
        this.getPhone = true;  // just save first phone and store others in extra text 
      } else if(data2.search(/^[A-Za-z\s]+$/i) >= 0) {
        // check for full name
        //console.log(`data2 is name = ${ data2 }`);
        this.fullName = data2;
        this.getName = true; // just save first full name and store others in extra text 
      } else {
        // store all the extra text 
        //console.log(`data2 is extra text = ${ data2 }`);
        this.extraText1 = this.extraText1 + " " + data2;
      }

    })

    const nameData = this.fullName.split(' ');

    // if fullname is available 
    if(nameData.length > 0) {
      this.firstName1 = nameData[0]; // Save first name 

      // if full name has two or more names 
      if(nameData.length > 1)
        this.lastName1 = nameData[nameData.length - 1]; // Save last name 
    }

    /*
    console.log(`Full Name = ${ this.fullName }`);
    console.log(`First Name = ${ this.firstName1 }`);
    console.log(`Last Name = ${ this.lastName1 }`);
    console.log(`Phone = ${ this.phone1 }`);
    console.log(`Email = ${ this.email1 }`);
    console.log(`Extra Text = ${ this.extraText1 }`);
    */

  }

  addCard(firstName: string, lastName: string, email: string, phone: string, extraText: string) {

      // upload card data to firebase 
      this.dashboardService.addCard(firstName, lastName, email, phone, extraText, this.imageUri);
      
      // Add user action to add card in history of firebase  
      this.historyService.addHistory(Date.now(), this.loginService.userEmail, `Added business card for ${firstName} ${lastName}`);
      this.dataSaved = true;

      // add google analytics event when user add business card in firebase   
      (<any>window).gtag('event', 'Add card in list', {
        'event_category' : 'New Business Card',
        'event_label' : 'New Card'
      });
  }

  cancel() {
    //this.cardtextClose = true;
    this.closeCardtextEvent.emit(false);
  }

  removeView() {
    // after saving data, remove card text view, go back to parent 
    // and change close camera to access camera 
    this.closeCardtextEvent.emit(false);
  }

  ngOnInit() {
  }

}
