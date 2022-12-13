import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplyFormService {
  private Connection_Type_API=environment.baseUrl+'connectionJob/';

  constructor(private http: HttpClient) { }

  loadTemplate(connectionType: any) {
    let ConnectionApi= this.Connection_Type_API+connectionType;
    this.http.get(ConnectionApi).subscribe(res => {
      console.log(JSON.stringify(res));
    })
  }

}
