import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectricalEquipmentService {

  private electricHeaterdata: BehaviorSubject<any> = new BehaviorSubject(null);
  private electricEquipmentdata: BehaviorSubject<any> = new BehaviorSubject(null);
  private Electrical_Equipment_API=' http://10.50.41.25:3000/connectionJob/Connection_Electrical_Equipment';
  private Electrical_Equipment_GET_PUT_API = environment.baseUrl+'connectionJob/Connection_Electrical_Equipment/';
  private Delete_Welder_Equipment_API = environment.baseUrl+'connectionJob/Connection_Electrical_Equipment/Welder/'
  private Delete_Motor_Equipment_API = environment.baseUrl+'connectionJob/Connection_Electrical_Equipment/Motor/';
  private Delete_Air_Equipment_API = environment.baseUrl+'connectionJob/Connection_Electrical_Equipment/AirPump/';
  private Delete_Ground_Equipment_API = environment.baseUrl+'connectionJob/Connection_Electrical_Equipment/GroundPump/';

  constructor(private http: HttpClient) { }

  setElectricHeaterData(data: any) {
    this.electricHeaterdata.next(data);
  }

  getElectricHeaterData() {
    return this.electricHeaterdata.asObservable();
  }

  setElectricEquipmentdata(data: any){
    this.electricEquipmentdata.next(data);
  }
  getElectricEquipmentdata(){
    return this.electricEquipmentdata.asObservable();
  }


  public submitElectricalEquipment(data: any): Observable<any> {
      return this.http.post(this.Electrical_Equipment_API, data).pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          
            console.log('Failed to create Electrical Information : ', err);
          throw err as HttpErrorResponse;
        })
      );
  }

  public getElectricalEquipment(connectionId: number): Observable<any> {

    let getElectricalEquipmentUrl = this.Electrical_Equipment_GET_PUT_API + connectionId;
    return this.http.get(getElectricalEquipmentUrl).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to create Electrical Information : ', err);
        throw err as HttpErrorResponse;
      })
    );
  }

  public updateElectricalEquipment(data: any, connectionId: number): Observable<any> {
    let updateElectricalEquipmentUrl = this.Electrical_Equipment_GET_PUT_API + connectionId;
    return this.http.put(updateElectricalEquipmentUrl, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        
          console.log('Failed to update Electrical Information : ', err);
        throw err as HttpErrorResponse;
      })
    );
  } 

  
  //delete welder equipment By Id
  public deleteWelderEquipmentById( id: number): Observable<any> {
    let url = this.Delete_Welder_Equipment_API + id;
    return this.http.delete(url).pipe(map(response => response));
  }

  //delete motor equipment By Id
  public deleteMotorEquipmentById( id: number): Observable<any> {
    let url = this.Delete_Motor_Equipment_API + id;
    return this.http.delete(url).pipe(map(response => response));
  }

   //delete air equipment By Id
   public deleteAirEquipmentById( id: number): Observable<any> {
    let url = this.Delete_Air_Equipment_API + id;
    return this.http.delete(url).pipe(map(response => response));
  }

    //delete ground equipment By Id
    public deleteGroundEquipmentById( id: number): Observable<any> {
      let url = this.Delete_Ground_Equipment_API + id;
      return this.http.delete(url).pipe(map(response => response));
    }

}