import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdditionalInformationService {

  constructor(private http: HttpClient ) { }

  private additionalInformationPostApi = environment.baseUrl+'connectionJob/ConnectionAdditionalInformation';
  private additionalInformationGetPutApi = environment.baseUrl+'connectionJob/ConnectionAdditionalInformation/';

  public submitAdditionalInformationAPI(data: any): Observable<any> {

    return this.http.post(this.additionalInformationPostApi,data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create Additional Information : ', err);
        throw err as HttpErrorResponse;
      })
    );

  }

  public getAdditionalInformationAPI(connectionId: number): Observable<any> {

    let additionalInformationGetApi = this.additionalInformationGetPutApi + connectionId;

    return this.http.get(additionalInformationGetApi).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get Additional Information : ', err);
        throw err as HttpErrorResponse;
      })
    );

  }

  public updateAdditionalInformationAPI(data: any, connectionId: number): Observable<any> {

    let additionalInformationPutApi = this.additionalInformationGetPutApi + connectionId;

    return this.http.put(additionalInformationPutApi, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to update Additional Information : ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

}
