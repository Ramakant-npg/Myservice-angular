import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExistingGenerationService {
  private existing_generation_API = environment.baseUrl+'connectionJob/Connection_Existing_Generation';
  private Update_existing_generation_API = environment.baseUrl+'connectionJob/Connection_Existing_Generation/';

  constructor(private httpClient: HttpClient) { }

  public submitexistingGenerationata(data: any): Observable<any> {
    return this.httpClient.post(this.existing_generation_API,data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create Existing Generation : ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public updateExisitingGeneration(data: any, connectionId: number): Observable<any> {
    let updatedExistingGenerationAPI = this.Update_existing_generation_API + connectionId;

    return this.httpClient.put(updatedExistingGenerationAPI, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to update Existing Generation : ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public getExisitingGeneration(connectionId: number): Observable<any> {
    let getExistingGenerationAPI = this.Update_existing_generation_API + connectionId;

    return this.httpClient.get(getExistingGenerationAPI).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get Existing Generation : ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

}
