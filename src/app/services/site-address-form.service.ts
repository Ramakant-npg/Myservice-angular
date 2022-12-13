import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class SiteAddressFormService {
  // public siteAddressAPI = environment.baseUrl+'connectionJob/Connection_Site_Details';
  public siteAddressAPI = environment.baseUrl+'connectionJob/Connection_Site_Details';

  constructor(private httpClient: HttpClient) { }

  public submitSiteAddessData(data: any): Observable<any> {
    return this.httpClient.post(this.siteAddressAPI,data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create Site Address Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public getSiteAddessDetailsByConnId(connectionId:number):Observable<any> {
    let url = this.siteAddressAPI +'/'+connectionId;
    return this.httpClient.get(url).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get Site Address Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
 }

 public updateSiteAddessData(data: any, connectionId: number): Observable<any> {
  let url = this.siteAddressAPI +'/'+connectionId;
  return this.httpClient.put(url, data).pipe(
    map((response) => {
      return response;
    }),
    catchError((err) => {
      
        console.log('Failed to update Site Address Details: ', err);
      throw err as HttpErrorResponse;
    })
  );
 }

 }
