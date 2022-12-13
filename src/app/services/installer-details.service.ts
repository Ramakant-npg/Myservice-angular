import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstallerDetailsService {
  private Single_Installer_API = environment.baseUrl+'connectionJob/Connection_Single_Installer_Details';
  private Multiple_Installer_API = environment.baseUrl+'connectionJob/Connection_Multiple_Installer_Details';

  private Update_Single_Installer_API = environment.baseUrl+'connectionJob/Connection_Single_Installer_Details/';
  private Update_Multiple_Installer_API = environment.baseUrl+'connectionJob/Connection_Multiple_Installer_Details/';

  constructor(private httpClient: HttpClient) { }

  public submitSingleInstallerData(data: any): Observable<any> {
    return this.httpClient.post(this.Single_Installer_API,data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create Single Installer : ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public updateSingleInstallerData(data: any, connectionId: number): Observable<any> {
    
    let updateSingleInstallerUrl = this.Update_Single_Installer_API + connectionId;
    return this.httpClient.put(updateSingleInstallerUrl, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to update Single Installer : ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public getSingleInstallerData(connectionId: number): Observable<any> {
    
    let getSingleInstallerUrl = this.Update_Single_Installer_API + connectionId;
    return this.httpClient.get(getSingleInstallerUrl).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get Single Installer : ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public submitMultipleInstallerData(data: any): Observable<any> {
    return this.httpClient.post(this.Multiple_Installer_API, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create Multiple Installer : ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public getMultipleInstallerData(connectionId: number): Observable<any> {

    let getMultipleInstallerUrl = this.Update_Multiple_Installer_API + connectionId;
    return this.httpClient.get(getMultipleInstallerUrl).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get Multiple Installer: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public updateMultipleInstallerData(data: any, connectionId: number): Observable<any> {
    
    let updateMultipleInstallerUrl = this.Update_Multiple_Installer_API + connectionId;
    return this.httpClient.put(updateMultipleInstallerUrl, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to update Multiple Installer : ', err);
        throw err as HttpErrorResponse;
      })
    );
  }
  

}
