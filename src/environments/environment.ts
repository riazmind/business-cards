// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const firebaseConfig = { 

  // Use your configuration 
  apiKey: "AIzaSyAVesUXRkpWGGulQLEaXE49bBjpS-6Eycw",
  authDomain: "businesscards-a9c3b.firebaseapp.com",
  databaseURL: "https://businesscards-a9c3b.firebaseio.com",
  projectId: "businesscards-a9c3b",
  storageBucket: "businesscards-a9c3b.appspot.com",
  messagingSenderId: "191499950808"
};

export const textDetectionConfig = { 
  // Use your key  
  CSC436: '' 
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
