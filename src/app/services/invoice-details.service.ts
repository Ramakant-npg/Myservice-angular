import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceDetailsService {

  private postInvoiceDetailsUrl = environment.baseUrl+'connection_Jobs/Connection_invoice_Details';
  private invoiceDetailsUrl = environment.baseUrl+'connectionJob/Connection_Invoice_Details/'

  constructor(private http: HttpClient) { }

  public submitInvoiceDetails(data:any): Observable<any> {
    return this.http.post(this.postInvoiceDetailsUrl, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create Invoice Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public updateInvoiceDetails(data: any, connectionId: number): Observable<any> {
    
    let updateInvoiceUrl = this.invoiceDetailsUrl + connectionId;
    return this.http.put(updateInvoiceUrl, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to update Invoice Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public getInvoiceDetails(connectionId: number): Observable<any> {
    
    let getInvoiceUrl = this.invoiceDetailsUrl + connectionId;
    return this.http.get(getInvoiceUrl).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to get Invoice Details: ', err);
        throw err as HttpErrorResponse;
      })
    );
  }
  
}
