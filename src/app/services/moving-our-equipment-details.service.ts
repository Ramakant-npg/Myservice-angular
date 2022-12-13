import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovingOurEquipmentDetailsService {

  private Equipment_Detail_API = environment.baseUrl+'connectionJob/Connection_Moving_Equipment';
  private Update_Equipment_Detail = environment.baseUrl+'connectionJob/Connection_Moving_Equipment/';

  constructor(private http: HttpClient) { }

  public submitEquipmentDetail(data: any): Observable<any> {
    return this.http.post(this.Equipment_Detail_API, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create Moving Equipment Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public updateEquipmentDetail(data: any, connectionId: number): Observable<any> {
    
    let updateSiteContactUrl = this.Update_Equipment_Detail + connectionId;
    return this.http.put(updateSiteContactUrl, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to update Moving Equipment Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public getEquipmentDetail(connectionId: number): Observable<any> {
    
    let getSiteContactUrl = this.Update_Equipment_Detail + connectionId;
    return this.http.get(getSiteContactUrl).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get Moving Equipment Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }
}
