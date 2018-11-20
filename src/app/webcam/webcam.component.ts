import { Component, OnInit, Input, EventEmitter, 
  Output, OnChanges, OnDestroy } from '@angular/core';

import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';

import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
})

export class WebcamComponent implements OnInit, OnChanges, OnDestroy {

  // get value from parent dashboard 
  @Input('closeOpenCamera') showWebcam; // = true; 

  // send value to parent dashboard 
  @Output() messageEvent = new EventEmitter<boolean>();
  
  errors: WebcamInitError[] = [];

  // latest snapshot
  webcamImage: WebcamImage = null;

  getCardText: boolean = false;

  // store image 
  imageUri: string = ""; 

  // store image base64 
  imageOnly: string = "";

  // webcam snapshot trigger
  trigger: Subject<void> = new Subject<void>();

  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  public ngOnInit(): void {
      console.log(`showWebcam = ${this.showWebcam}`);
  }

  public triggerSnapshot(): void {
    this.trigger.next();

    this.imageOnly = this.webcamImage.imageAsBase64;
    this.imageUri = this.webcamImage.imageAsDataUrl;

    // sent message to dashboard component 
    //this.messageEvent.emit(this.imageUri);
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  public extractText() {
    this.getCardText = true;
    this.webcamImage = null; // remove snapshot  
    this.showWebcam = false; // hide camera 
  }

  receiveMessage($event) {
    this.getCardText = $event;
    this.messageEvent.emit($event);
  }

  ngOnChanges() {
    if(!this.showWebcam)
      this.webcamImage = null; 
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.webcamImage = null; // remove snapshot  
    this.showWebcam = false; // close camera 
  }
}

