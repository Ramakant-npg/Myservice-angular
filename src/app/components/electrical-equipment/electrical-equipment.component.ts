import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ElectricShowerHeaterComponent } from './electric-shower-heater/electric-shower-heater.component';
import { GroundSourceHeatPumpComponent } from './ground-source-heat-pump/ground-source-heat-pump.component';
import { AirSourceHeatPumpComponent } from './air-source-heat-pump/air-source-heat-pump.component';
import {MotorComponent } from './motor/motor.component'
import {WelderComponent} from './welder/welder.component';
import{HarmonicComponent} from './harmonic/harmonic.component';
import { SharedService } from 'src/app/services/shared.service';
import { ElectricalEquipmentService } from 'src/app/services/electrical-equipment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-electrical-equipment',
  templateUrl: './electrical-equipment.component.html',
  styleUrls: ['./electrical-equipment.component.scss']
})

export class ElectricalEquipmentComponent implements OnInit {
  @ViewChild(ElectricShowerHeaterComponent) elecricFormComponent!: ElectricShowerHeaterComponent;
  @ViewChild(GroundSourceHeatPumpComponent) groundSourceHeatPumpComponent!: GroundSourceHeatPumpComponent;

  @ViewChildren('one') myValue:QueryList<GroundSourceHeatPumpComponent> | undefined;
  
  airSource:any;
  motorData: any;
  welderData: any;
  harmonicData: any;
  groundPump: any;
  electricShowerData: any;

  previousUrl:string= null;
  currentUrl:string = null;
  navIndex:number = null;
  templateList: any = [];
  nextUrl:any
  templateListSub: Subscription;
  currentUrlSub:Subscription;
  progressionStatusId: any;
  connectionTypeId:any;
  progress_status_payload:any;
  progressionSub:Subscription;
  connectionIdSub:Subscription

  validateForm: boolean=false;
  disableElectricOtherField: boolean=false;
  disableGroundOtherField: boolean=false;
  disableAirHeatOtherField: boolean=false;
  disableMotorOtherField: boolean=false;
  disabledWelderOtherField: boolean=false;
  disableHarmonicOtherField: boolean=false;
  electricOtherField: boolean=false;
  groundOtherField: boolean=false;
  airHeatOtherField: boolean=false;
  motorOtherField: boolean=false;
  welderOtherField: boolean=false;
  connectionId: number;
  isNewData: boolean = false;
  Electrical_Equipment_Id:number;

constructor(public router: Router, 
  private sharedService: SharedService, 
  private electricalEquipmentService: ElectricalEquipmentService,
  private _snackBar: MatSnackBar,
  private httpService: HttpService,){}

  ngOnInit(): void {

    this.sharedService.setCurrentNav(this.router.url);
    
    // get the current url from service
  this.currentUrlSub = this.sharedService.getCurrentUrl().subscribe((data)=>{
    this.currentUrl =  data.split('?')[0].split('/')[1];
    })

    // //get the list of template and index of current url from template list
    this.templateListSub = this.sharedService.getTemplateList().subscribe((data)=>{
      this.templateList = data;
      this.navIndex = data?.findIndex((item:any) => item.Name === this.currentUrl);
      
    });

    this.sharedService.getConnectionId().subscribe(data => {
      this.connectionId=data;
    });

    this.connectionIdSub = this.sharedService.getConnectionsTypeId().subscribe((id)=>{
      this.connectionTypeId = id;
      this.getProgressionStatus(this.connectionTypeId);
    })
    
    //get the progression id status based on current url template
    this.progressionSub = this.sharedService.getProgressionReport().subscribe((data)=>{
      let progressionStatusList = data;
      data?.findIndex((item:any) => {
        if(item.Progression_Status === this.currentUrl){
          this.progressionStatusId =  item.Id;
        }
      });
    });

    this.electricalEquipmentService.getElectricalEquipment(this.connectionId).subscribe(res => {
      if(res) {
        this.isNewData=true;
        this.Electrical_Equipment_Id = res.Electrical_Equipment_Id;
        this.electricalEquipmentService.setElectricEquipmentdata(res);
      }
    });
  }

  ngOnDestroy():void{
    this.currentUrlSub.unsubscribe();
     this.templateListSub.unsubscribe();
    this.progressionSub.unsubscribe();
     this.connectionIdSub.unsubscribe();
  }

  /**
   * Go to previous template by click on back button
   */
backToPreviousTemplate():void {
let backUrl = "/"+this.templateList[this.navIndex-1].Name;
this.router.navigateByUrl(backUrl);
}


goToCallBackTemplate():void{
    
this.router.navigate(['/Call_Back'], {
      queryParams:{
        type: ConnectionTypeConfig.connection_type
      }
     })

}


  enableElectricOtherFields(data: boolean) {
    this.electricOtherField=data;
    if(this.electricOtherField === true) {
      this.disableElectricOtherField=false;
      this.disableAirHeatOtherField=true;
      this.disableGroundOtherField=true;
      this.disableMotorOtherField=true;
      this.disabledWelderOtherField=true;
      this.disableHarmonicOtherField=true;
    }
    else if(this.electricOtherField === false) {
      this.disableElectricOtherField=false;
      this.disableAirHeatOtherField=false;
      this.disableGroundOtherField=false;
      this.disableMotorOtherField=false;
      this.disabledWelderOtherField=false;
      this.disableHarmonicOtherField=false;
    }
    
  }
  enableGroundOtherFields(data:boolean) {
    this.groundOtherField=data;
    if(this.groundOtherField === true) {
      this.disableElectricOtherField=true;
      this.disableAirHeatOtherField=true;
      this.disableGroundOtherField=false;
      this.disableMotorOtherField=true;
      this.disabledWelderOtherField=true;
      this.disableHarmonicOtherField=true;
    }
    else if(this.groundOtherField === false) {
      this.disableElectricOtherField=false;
      this.disableAirHeatOtherField=false;
      this.disableGroundOtherField=false;
      this.disableMotorOtherField=false;
      this.disabledWelderOtherField=false;
      this.disableHarmonicOtherField=false;
    }
    
  }
  enableAirSourceHeatOtherFields(data: boolean) {
    this.airHeatOtherField=data;
    if(this.airHeatOtherField === true) {
      this.disableElectricOtherField=true;
      this.disableAirHeatOtherField=false;
      this.disableGroundOtherField=true;
      this.disableMotorOtherField=true;
      this.disabledWelderOtherField=true;
      this.disableHarmonicOtherField=true;
    }
    else if(this.airHeatOtherField === false) {
      this.disableElectricOtherField=false;
      this.disableAirHeatOtherField=false;
      this.disableGroundOtherField=false;
      this.disableMotorOtherField=false;
      this.disabledWelderOtherField=false;
      this.disableHarmonicOtherField=false;
    }
    
  }
  enableMotorButtonOtherFields(data: boolean) {
    this.motorOtherField=data;
    if(this.motorOtherField === true) {
      this.disableElectricOtherField=true;
      this.disableAirHeatOtherField=true;
      this.disableGroundOtherField=true;
      this.disableMotorOtherField=false;
      this.disabledWelderOtherField=true;
      this.disableHarmonicOtherField=true;
    }
    else if(this.motorOtherField === false) {
      this.disableElectricOtherField=false;
      this.disableAirHeatOtherField=false;
      this.disableGroundOtherField=false;
      this.disableMotorOtherField=false;
      this.disabledWelderOtherField=false;
      this.disableHarmonicOtherField=false;
    }
    
  }
  enableWelderButtonOtherFields(data: boolean) {
    this.welderOtherField=data;
    if(this.welderOtherField === true) {
      this.disableElectricOtherField=true;
      this.disableAirHeatOtherField=true;
      this.disableGroundOtherField=true;
      this.disableMotorOtherField=true;
      this.disabledWelderOtherField=false;
      this.disableHarmonicOtherField=true;
    }
    else if(this.welderOtherField === false) {
      this.disableElectricOtherField=false;
      this.disableAirHeatOtherField=false;
      this.disableGroundOtherField=false;
      this.disableMotorOtherField=false;
      this.disabledWelderOtherField=false;
      this.disableHarmonicOtherField=false;
    }
    
  }
  enableHarmonicButtonOtherFields(data: boolean) {
    console.log("Harmonic Button Other "+ data);
  }

  validateComponents(): boolean {
    let isFormValid: boolean=false;
    if(this.electricOtherField === true ||
      this.groundOtherField === true ||
      this.airHeatOtherField === true ||
      this.motorOtherField === true ||
      this.welderOtherField === true) {
            isFormValid=true;
          }
    return isFormValid;
  }
  electricShowerFormData(data: string): void {

    this.electricShowerData=data;
  }
  grounSourcePumpData(data: string): void{
      this.groundPump = data;
  }

  airSourceFormData(data:any):void {
    this.airSource = data;
  }

  motorFormData(data:any):void {
    this.motorData = data;
  }

  welderFormData(data:any):void {
    this.welderData = data;
  }

  harmonicFormData(data:any):void {
    this.harmonicData = data;
  }

  saveData(type:string, status:string):void {
    this.validateForm=true;
   let elecricFormData = this.elecricFormComponent.getElectricShowerData();
    let electricalEquipmentData = {};
    if(this.validateComponents() === false && this.electricShowerData != null) {
      let electricalData = {
        Connection_Id: this.connectionId,
        Electrical_Equipment_Id: this.Electrical_Equipment_Id,
        //"electricHeaterData": this.electricShowerData,
        "electricHeaterData": elecricFormData,
        "groundPumpData": this.groundPump,
        "airPumpData": this.airSource,
        "motorData": this.motorData,
        "welderData": this.welderData,
        "harmonicData": this.harmonicData
      };

      this.updateProgressionStatus(status);
      if(this.isNewData === false) {
        this.electricalEquipmentService.submitElectricalEquipment(electricalData).subscribe(res => {
          if(res) {
            if(res.message){
              this._snackBar.open("Data Inserted Successfully", "OK", {
                duration: 3000,
                
               });
              }
            }
          }, () => {
            this._snackBar.open("Bad Request", "OK", {
              duration: 3000
          });
        });
      }
      else {
        this.electricalEquipmentService.updateElectricalEquipment(electricalData, this.connectionId).subscribe(res => {
          if(res) {
            if(res.message){
              this._snackBar.open("Data Updated Successfully", "OK", {
                duration: 3000,
                
               });
              }
            }
          }, () => {
            this._snackBar.open("Bad Request", "OK", {
              duration: 3000
          });
        });
      }
      this.nextUrl = "/"+this.templateList[this.navIndex+1].Name;
      if(type === 'isSubmit'){
        this.router.navigate([this.nextUrl], {
        queryParams:{
          type: ConnectionTypeConfig.connection_type
        }
       })
      } else if(type === 'saveForLater') {
         this.router.navigateByUrl('/home');
      }

    }
    

  }

  
/**
 * Should save progrssion report on save and continue and save for later button
 * @param Object
 */
 getProgressionStatus(id:number) {
  this.httpService.getConnectionProgressStaus( id).subscribe((res)=>{
    if(res){
      this.progress_status_payload =  res;
    }
    this._snackBar.open("successfully get connection progression staus ", "OK", {
      duration: 3000
  });
  },(error)=>{
    this._snackBar.open("Bad Request", "OK", {
      duration: 3000
  });
  })
}

/**
 * Should save progrssion report on save and continue and save for later button
 * @param Object
 */
 updateProgressionStatus(status:string) {
  this.progress_status_payload[0].Connection_Type = this.connectionTypeId;
  this.progress_status_payload[0].Status = this.getStatusId(status);
  this.progress_status_payload[0].Progression = this.progressionStatusId;
  this.httpService.updateConnectionProgressStaus(this.progress_status_payload, this.connectionId).subscribe((res)=>{
    if(res){
      //this.connectionId =  res[0].Connection_Id;
    }
    this._snackBar.open("successfully update connection progression staus ", "OK", {
      duration: 3000
  });
  },(error)=>{
    this._snackBar.open("Bad Request", "OK", {
      duration: 3000
  });
  })

}

getStatusId(status:string){
  let statusId:number = null;
  this.sharedService.getStatusReport().subscribe((data)=>{
    data?.findIndex((item:any) => {
      if(item.Connection_Status === status){
        statusId = item.Id;
      }
    });
  });
  return statusId;
}

}
