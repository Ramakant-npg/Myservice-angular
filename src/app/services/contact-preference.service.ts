import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactPreferenceService {

  private postContactPreferenceUrl = environment.baseUrl+'connectionJob/Connection_Contact_Preference';
  private contactPreferenceUrl = environment.baseUrl+'connectionJob/Connection_Contact_Preference/';

  constructor(private http: HttpClient) { }

  public submitContactPreferenceData(data: any): Observable<any> {
    return this.http.post<any>(this.postContactPreferenceUrl, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create Contact Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public updateContactPreferenceData(data: any, connectionId: number): Observable<any> {

    let updateContactprefurl = this.contactPreferenceUrl+connectionId;
    return this.http.put<any>(updateContactprefurl, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to update Contact Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public getContactPreferenceData(connectionId: number): Observable<any> {

    let getContactprefurl = this.contactPreferenceUrl+connectionId;
    return this.http.get<any>(getContactprefurl).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get Contact Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

}
