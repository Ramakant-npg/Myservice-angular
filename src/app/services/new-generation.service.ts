import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewGenerationService {

  //added by Lata
  private newGenerationButtonYesNoApi = environment.baseUrl+'connectionJob/Connection_New_Generation/';
  private  installationFormApi = environment.baseUrl+'connectionJob/';

  //Change by Ahmed
  private getThreeSixEightApi = environment.baseUrl+'connectionJob/Connection_New_Generation_3_68kw/';
  private getMwKWApi = environment.baseUrl+'connectionJob/Connection_New_Generation_KW_MW/';
  private getTwoHundredApi = environment.baseUrl+'connectionJob/Connection_New_Generation_200kw/';

  constructor(private http: HttpClient) { }

//delete installation form By Id
public deleteInstallationFormById(url:string, id: number): Observable<any> {
  let deleteFormUrl = this.installationFormApi+ url + id;
  console.log(deleteFormUrl, ' deleteFormUrl =======');
  return this.http.delete(deleteFormUrl).pipe(map(response => response));
}

  public saveInstallationForm(url:string, data:any): Observable<any>{
    let saveFormUrl = this.installationFormApi + url;
    
    return this.http.post(saveFormUrl,data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create New Generate Yes No Options: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  
  public updateInstallationForm(url:string, data:any): Observable<any>{
    let saveFormUrl = this.installationFormApi + url;
    console.log(saveFormUrl, 'update url=======');
    return this.http.put(saveFormUrl,data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create New Generate Yes No Options: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public submitYesNoButtonAPI(data: any): Observable<any> {

    return this.http.post(this.newGenerationButtonYesNoApi,data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create New Generate Yes No Options: ', err);
        throw err as HttpErrorResponse;
      })
    );

  }

  public getYesNoButtonAPI(connectionId: number): Observable<any> {

    let newGenerationButtonYesNotGetApi = this.newGenerationButtonYesNoApi + connectionId;

    return this.http.get(newGenerationButtonYesNotGetApi).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get New Generate Yes No Options: ', err);
        throw err as HttpErrorResponse;
      })
    );

  }

  public updateYesNoButtonAPI(data: any, connectionId: number): Observable<any> {

    let newGenerationButtonYesNotPutApi = this.newGenerationButtonYesNoApi + connectionId;

    return this.http.put(newGenerationButtonYesNotPutApi, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to update New Generate Yes No Options: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public getThreeSixEightData(connectionId: number): Observable<any> {

    let getApi = this.getThreeSixEightApi + connectionId;

    return this.http.get(getApi).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get 3.68 API Data: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public getkwMwData(connectionId: number): Observable<any> {

    let getApi = this.getMwKWApi + connectionId;

    return this.http.get(getApi).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get Mw/Kw API Data: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public getTwoHundredData(connectionId: number): Observable<any> {
    let getApi = this.getTwoHundredApi + connectionId;

    return this.http.get(getApi).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get Two Hundred API Data: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

}
