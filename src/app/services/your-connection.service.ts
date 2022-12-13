import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YourConnectionService {

  constructor(private http: HttpClient) { }

  public saveConnectionDate(data: any) {
    const connectionDateUrl = environment.baseUrl+'connection_Jobs/Connection_Your_Connection_Date';

    return this.http.post<any>(connectionDateUrl, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        console.log('Failed to save the Connection Date: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }
  public getConnectionDate(connectionId: any): Observable<any> {
    let getConnectionDateApi = environment.baseUrl+'connectionJob/Connection_Your_Connection_Date/' +  connectionId;
    return this.http.get(getConnectionDateApi).pipe(map(
      (response) => {
      return response;
    }),
    catchError((err) => {
      console.log('Failed to get the Connection Date: ', err);
      throw err as HttpErrorResponse;
    })
    );
  }

  public updateConnectionDate(data: any, connectionId: any) : Observable<any> {
    let getConnectionDateApi = environment.baseUrl+'connectionJob/Connection_Your_Connection_Date/' +  connectionId;
    return this.http.put(getConnectionDateApi,data).pipe(map(
      (response) => {
      return response;
    }),
    catchError((err) => {
      console.log('Failed to update the Connection Date: ', err);
      throw err as HttpErrorResponse;
    })
    );
  }

  public saveConnection(data: any) {
    const connectionDateUrl = environment.baseUrl+'connectionJob/Connection_Your_Connection';

    return this.http.post<any>(connectionDateUrl, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        console.log('Failed to save the Connection Date: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public getConnection(connectionId: any): Observable<any> {
    let getConnectionDateApi = environment.baseUrl+'connectionJob/Connection_Your_Connection/' +  connectionId;
    return this.http.get(getConnectionDateApi).pipe(map(
      (response) => {
      return response;
    }),
    catchError((err) => {
      console.log('Failed to get the Connection : ', err);
      throw err as HttpErrorResponse;
    })
    );
  }

  public updateConnection(data: any, connectionId: any) : Observable<any> {
    let getConnectionDateApi = environment.baseUrl+'connectionJob/Connection_Your_Connection/' +  connectionId;
    return this.http.put(getConnectionDateApi,data).pipe(map(
      (response) => {
      return response;
    }),
    catchError((err) => {
      console.log('Failed to update the Connection : ', err);
      throw err as HttpErrorResponse;
    })
    );
  }

}
