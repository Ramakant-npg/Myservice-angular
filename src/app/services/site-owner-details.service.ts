import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, forkJoin } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class SiteOwnerDetailsService {

  private siteOwnerUrl=environment.baseUrl+'connectionJob/Connection_Site_Owner_Details';
  private SiteOwnerUrl=environment.baseUrl+'connectionJob/Connection_Site_Owner_Details/'

  constructor(private http: HttpClient) { }

  public submitSiteOwnerDetails(data: any): Observable<any> {
    return this.http.post(this.siteOwnerUrl,data).pipe(map(
      (response) => {
      return response;
    }),
    catchError((err) => {
      console.log('Failed to Create the Site Owner Details: ', err);
      throw err as HttpErrorResponse;
    })
    );
  }

  public updateSiteOwnerDetails(data: any, connectionId: any): Observable<any> {
    let updateSiteOwnerUrl=this.SiteOwnerUrl+connectionId;
    return this.http.put(updateSiteOwnerUrl, data).pipe(map(
      (response) => {
      return response;
    }),
    catchError((err) => {
      console.log('Failed to Get the Site Owner Details: ', err);
      throw err as HttpErrorResponse;
    })
    );
  }

  public getSiteOwnerDetails(connectionId: any): Observable<any> {
    let getSiteOwnerUrl=this.SiteOwnerUrl+connectionId;
    return this.http.get(getSiteOwnerUrl).pipe(map(
      (response) => {
      return response;
    }),
    catchError((err) => {
      console.log('Failed to Get the Site Owner Details: ', err);
      throw err as HttpErrorResponse;
    })
    );
  }


  public saveForLaterStatus(){
  let progressUrl =environment.baseUrl+"Connection_Progression";
  let connectionJobStatusUrl =environment.baseUrl+"connection_Status";
  let req1 = this.http.get(progressUrl);
  let req2 = this.http.get(connectionJobStatusUrl);

  forkJoin([req1, req2]).subscribe((result)=>{
    console.log(result, 'result');
      return result;
  })

  // return this.http.get(progressUrl).pipe(map(
  // (response) => {
  // return response;
  // }), catchError((err) => {
  // console.log('Failed to save connection job status: ', err);
  // throw err as HttpErrorResponse;
  // })
  
  }

}


