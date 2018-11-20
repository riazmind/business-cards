# Business Cards

Scan and store business cards in firebase. 

## Usage  

- Take snapshot by using your device camera. 
- The Google Vision API used to extract text from image. 
- The text parses names, email, phone and other text and store in firebase database along with image of business card in base64 format. 
- Google Analytics tracks usage of app and log all events like when user login or scan a business card.
- History in firebase store all event of user like searched names and scanned business cards etc. 
- Two types of users: Admins and Non-Admins. Admins has full rights to do every thing while non admins cannot see the history. 


## Development Tools and languages 

- Angular 
- Angular CLI 
- TypeScript
- RxJs
- Html 
- CSS
- JavaScript
- Firebase database 
- Google Analytics 
- Bootstrap 
- Visual Studio Code 
- Web Camera


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

