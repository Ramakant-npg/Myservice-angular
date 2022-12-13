import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YourWorkDateService {
  private yourWork_date_API = environment.baseUrl+'connectionJob/Connection_Your_Work_Date';
  private Update_YourWork_Date_API = environment.baseUrl+'connectionJob/Connection_Your_Work_Date/';

  constructor(private httpClient: HttpClient) { }
  public submitYourWorkDate(data: any): Observable<any> {
    return this.httpClient.post(this.yourWork_date_API,data).pipe(map(
      (response) => {
      return response;
    }),
    catchError((err) => {
      console.log('Failed to Create the Work Date: ', err);
      throw err as HttpErrorResponse;
    })
    );
  }
  public UpdateYourWorkDate(data: any, connectionId: number): Observable<any> {
    let Updated_YourWork_Date_API= this.Update_YourWork_Date_API+connectionId;
    return this.httpClient.put(Updated_YourWork_Date_API, data).pipe(map(
      (response) => {
      return response;
    }),
    catchError((err) => {
      console.log('Failed to update the Work Date: ', err);
      throw err as HttpErrorResponse;
    })
    );
  }

  public getYourWorkDate(connectionId: any) {
    let getYouwWorkDateApi = this.Update_YourWork_Date_API+ connectionId;
    return this.httpClient.get(getYouwWorkDateApi).pipe(map(
      (response) => {
      return response;
    }),
    catchError((err) => {
      console.log('Failed to get the Work Date: ', err);
      throw err as HttpErrorResponse;
    })
    );
  }
}