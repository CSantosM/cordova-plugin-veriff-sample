import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators/catchError";

declare var VERIFF;

@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {

  constructor(
    private platform: Platform,
    private httpClient: HttpClient
  ) {}

  private API_KEY = "your-api-key";
  private VERIFF_URL = "https://api.veriff.me/v1/sessions/";
  private body = {
    verification: {
      callback: "https://veriff.com",
      person: {
        firstName: "John",
        lastName: "Doe",
        idNumber: "100000001",
      },
      document: {
        number: "AB1000001",
        type: "PASSPORT",
        country: "IE",
      },
      vendorData: "11111111",
      lang: "en",
      timestamp: "2020-02-25T16:57:00.000Z",
    },
  };

  veriff() {
    this.platform.ready().then(async () => {
      const session = await this.createVeriffSession();
      VERIFF.start(session.verification.url).then((code) => {
        console.log("Code: ", code);
      });
    });
  }

  createVeriffSession(): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(this.body);
      const options = {
        headers: new HttpHeaders({
          "X-AUTH-CLIENT" : this.API_KEY,
          "Content-Type": "application/json",
        }),
      };
      return this.httpClient
        .post(this.VERIFF_URL, body, options)
        .pipe(
          catchError((error) => {
            reject(error);
            return error;
          })
        )
        .subscribe((response) => {
          console.log(response);
          resolve(response);
        });
    });
  }
}
