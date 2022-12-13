import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YourSitePlanService {

  private getSitePlanDetailsUrl =environment.baseUrl+'connectionJob/Connection_Site_Plan/';
  private submitSitePlanAPI = environment.baseUrl+'connectionJob/Connection_Site_Plan';
  private uploadlUrl = environment.baseUrl+'upload'

  constructor(private http: HttpClient) { }

  upload(formData:any): Observable<any> {
    let url = this.uploadlUrl;
    return this.http.post(url, formData).pipe(map(response => response));
  }

  submitSitePlanData(formData:any): Observable<any> {
    let url = this.submitSitePlanAPI;
    // let url = 'http://10.50.41.25:3000/'
    return this.http.put(url, formData).pipe(map(response => {
      return response;
    }),
    catchError((err) => {
      console.log('Failed to Create the Site Plan Details: ', err);
      throw err as HttpErrorResponse;
    })
    );
  }

  getSitePlanData(connectionId: any): Observable<any> {
    let getUrl = this.getSitePlanDetailsUrl+connectionId;
    return this.http.get(getUrl).pipe(map(
      (response) => {
      return response;
    }),
    catchError((err) => {
      console.log('Failed to Get the Site Plan Details: ', err);
      throw err as HttpErrorResponse;
    })
    );
  }
}
