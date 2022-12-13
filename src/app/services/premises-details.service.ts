import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PremisesDetailsService {
  private Multiple_Premises_API = environment.baseUrl+'connectionJob/Connection_Multiple_Premises_Details';
  private Multiple_Premises_Url = environment.baseUrl+'connectionJob/Connection_Multiple_Premises_Details/';
  // private Get_Multiple_Premises = environment.baseUrl+'connectionJob/Connection_Multiple_Premises_Details/'

  private Single_Premise_API = environment.baseUrl+'connectionJob/Connection_Single_Premises_Details/';
  //private Get_Single_Premises = environment.baseUrl+'connectionJob/Connection_Single_Premises_Details/'

  constructor( private http: HttpClient) { }

  public submitMultiplePremisesData(data: any): Observable<any> {
    return this.http.post(this.Multiple_Premises_API, data).pipe(map(response => response));
  }

  public updateMultiplePremisesData(data: any, connectionId: any): Observable<any> {
    let updateMultiplePremise = this.Multiple_Premises_Url + connectionId;
    return this.http.put(updateMultiplePremise, data).pipe(map(response => response));
  }

  public getMultiplePremisesData(connectionId: any): Observable<any> {
    let getPremiseUrl = this.Multiple_Premises_Url + connectionId;
    return this.http.get(getPremiseUrl).pipe(map(response => response));
  }

  public saveSinglePremisesData(data: any): Observable<any> {
    return this.http.post(this.Single_Premise_API, data).pipe(map(response => response));
  }

  public getSinglePremisesData(connectionId: any): Observable<any> {
    let getSinglePremiseUrl = this.Single_Premise_API + connectionId;
    return this.http.get(getSinglePremiseUrl).pipe(map(response => response));
  }

  public updateSInglePremisesData(data: any, connectionId: any): Observable<any> {
    let updatedSinglePremise = this.Single_Premise_API + connectionId;
    return this.http.put(updatedSinglePremise, data).pipe(map(response => response));
  }
  //deleteSinglePermisesById
  public deleteSinglePermisesById( id: number): Observable<any> {
    let url = this.Single_Premise_API + id;
    return this.http.delete(url).pipe(map(response => response));
  }

  //delete multiple Permises By Id
  public deleteMultiplePermisesById( id: number): Observable<any> {
    let url = this.Multiple_Premises_Url + id;
    return this.http.delete(url).pipe(map(response => response));
  }
}
