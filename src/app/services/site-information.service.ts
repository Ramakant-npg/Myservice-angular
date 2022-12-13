import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteInformationService {
  private  siteInformationURL= environment.baseUrl+'connection_Jobs/Connection_Site_Information/';
  private savesiteInformationURL = environment.baseUrl+'connection_Jobs/Connection_Site_Information';

  constructor(private http: HttpClient) { }

  public saveSiteInformationData(data : any): Observable<any> {
    

    return this.http.post<any>(this.savesiteInformationURL, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create Site Info: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public updateSiteInformation(data: any, connectionId: number): Observable<any> {
    
    let updateSiteInfoUrl = this.siteInformationURL + connectionId;
    return this.http.put(updateSiteInfoUrl, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to update Site Info: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public getSiteInformation(connectionId: number): Observable<any> {
    let getSiteInfoUrl = this.siteInformationURL + connectionId;
    return this.http.get(getSiteInfoUrl).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get Site Info: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }
}
