import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpEventType} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // API url
  baseApiUrl = 'https://localhost/4200';
  Progession_Status_Url = environment.baseUrl+"connection_Jobs/";

  constructor(private http: HttpClient) {}

  // Returns an observable
  upload( formData:FormData): Observable<any> {
    // Create form data
    ///const formData = new FormData();

    // Store form name as "file" with file data
    ///formData.append('file', file, file.name);

    // Make http post request over api
    // with formData as req
    console.log('file'+ 'formData'+ formData);
    let url = environment.baseUrl+'upload';
    //environment.baseUrl+'upload'
    return this.http.post( url, formData).pipe(map(response => response));
  }

  //getCorrospondanceAddress(){}

  getCorrospondanceAddress(): Observable<any> {
    let url = environment.baseUrl+"connectionJob/Use_Correspondence_Address/";
     return this.http.get(url).pipe(map(response => response));
   }
  //Get Connection Job template list
  getConnectionJobTemplate(jobType:any): Observable<any> {
    let url = environment.baseUrl+"connectionJob/Connection_Type/"+jobType;
     return this.http.get(url).pipe(map(response => response));
   }

   public getAllPreRequiredData(jobType:any): Observable<any>{
    let progressUrl =environment.baseUrl+"Connection_Progression";
    let connectionJobStatusUrl =environment.baseUrl+"connection_Status";
    let connectionJobTypeUrl = environment.baseUrl+"connectionJob/Connection_Type/"+jobType;
    let guaranteedUrl = environment.baseUrl+"connectionJob/Connection_Guaranteen";
    let loginUrl = environment.baseUrl+"connectionJob/Connection_Login";
    let correspondenceAddressUrl=  environment.baseUrl+"connectionJob/Use_Correspondence_Address";

    let req1 = this.http.get(progressUrl).pipe(map(response => response ));
    let req2 = this.http.get(connectionJobStatusUrl).pipe(map(response => response ));
    let req3 = this.http.get(connectionJobTypeUrl).pipe(map(response => response ));
    let req4 = this.http.get(guaranteedUrl).pipe(map(response => response ));
    let req5 = this.http.get(loginUrl).pipe(map(response => response ));
    let req6 = this.http.get(correspondenceAddressUrl).pipe(map(response => response ));

    return forkJoin([req1, req2, req3, req6]);
    }

    public getConnectionProgressStaus(id:any): Observable<any> {
      let progressionUrl = this.Progession_Status_Url + 2;
      return this.http.get(progressionUrl).pipe(map(response => response));
    }

    public saveConnectionProgressStaus(payload: any): Observable<any> {
      let progressionUrl = this.Progession_Status_Url;
      return this.http.post(progressionUrl, payload).pipe(map(response => response));
    }

    public updateConnectionProgressStaus(payload: any, id:number): Observable<any> {
      let progressionUrl = this.Progession_Status_Url+id;
      return this.http.put(progressionUrl, payload).pipe(map(response => response));
    }
   
}