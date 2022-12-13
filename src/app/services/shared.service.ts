import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {

  private data: BehaviorSubject<any> = new BehaviorSubject(null);
  //data$: Observable<any> = this.data.asObservable();
  private currentUrl:BehaviorSubject<any> =  new BehaviorSubject(null);
  private currentNav:BehaviorSubject<any> =  new BehaviorSubject(null);
  private formInfo:BehaviorSubject<any> =  new BehaviorSubject(null);
  getFormInfo$: Observable<any> = this.formInfo.asObservable();

  private connectionId: BehaviorSubject<any> = new BehaviorSubject(null);
  private progressionData:BehaviorSubject<any> = new BehaviorSubject(null);
  private statusData: BehaviorSubject <any> = new BehaviorSubject(null);
  private connectionsTypeId:BehaviorSubject<any> = new BehaviorSubject(null);

  private  connectionsTypeName:BehaviorSubject<any> = new BehaviorSubject(null);
  private  userCorrosAddressData:BehaviorSubject<any> = new BehaviorSubject(null);

  


  constructor() { }

  //setUserCorrospondanceAddress

  setCorrospondanceAddress(data: any) {
    this.userCorrosAddressData.next(data);
  }

  getCorrospondanceAddress() {
    return this.userCorrosAddressData.asObservable();
  }


  setConnectionId(data: any) {
    this.connectionId.next(data);
  }

  getConnectionId() {
    return this.connectionId.asObservable();
  }

  setTemplateList(templates:any) {
    this.data.next(templates);
  }

  getTemplateList():Observable<any>{
  return this.data.asObservable();
  }


 setCurrentUrl(url:any) {
    this.currentUrl.next(url);
  }

  getCurrentUrl() {
    return this.currentUrl.asObservable();
  }

  setCurrentNav(data:any) {
    this.currentNav.next(data);
  }

  getCurrentNav() {
    return this.currentNav.asObservable();
  }
  setFormInfo(data:any) {
    this.formInfo.next(data);
  }

  getFormInfo():Observable<any>{
  return this.formInfo.asObservable();
  }

  
setProgressionReport(obj:any) {
  this.progressionData.next(obj);
}

getProgressionReport() {
  return this.progressionData.asObservable();
}

setStatusReport(obj:any) {
  this.statusData.next(obj);
}

getStatusReport() {
  return this.statusData.asObservable();
}

setConnectionsTypeId(obj:any) {
  this.connectionsTypeId.next(obj);
}

getConnectionsTypeId() {
  return this.connectionsTypeId.asObservable();
}

setConnectionsTypeName(obj:any) {
  this.connectionsTypeName.next(obj);
}

getConnectionsTypeName() {
  return this.connectionsTypeName.asObservable();
}


}