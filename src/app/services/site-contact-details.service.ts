import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteContactDetailsService {

  private siteContactDetailsUrl =environment.baseUrl+'connectionJob/Connection_Site_Contact_Details/';
  private savesiteContactDetailsUrl =environment.baseUrl+'connectionJob/Connection_Site_Contact_Details';

  constructor(private http: HttpClient) { }

  public saveSiteContactDetails(data: any): Observable<any> {
    return this.http.post<any>(this.savesiteContactDetailsUrl, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create Site Contact Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public updateSiteInformation(data: any, connectionId: number): Observable<any> {
    
    let updateSiteContactUrl = this.siteContactDetailsUrl + connectionId;
    return this.http.put(updateSiteContactUrl, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to update Site Contact Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public getSiteInformation(connectionId: number): Observable<any> {
    
    let getSiteContactUrl = this.siteContactDetailsUrl + connectionId;
    return this.http.get(getSiteContactUrl).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get Site Contact Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

}
