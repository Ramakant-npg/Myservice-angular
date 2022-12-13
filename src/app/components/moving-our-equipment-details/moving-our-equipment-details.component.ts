import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovingOurEquipmentDetailsService } from 'src/app/services/moving-our-equipment-details.service';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-moving-our-equipment-details',
  templateUrl: './moving-our-equipment-details.component.html',
  styleUrls: ['./moving-our-equipment-details.component.scss']
})
export class MovingOurEquipmentDetailsComponent implements OnInit {
  equipmentForm: FormGroup = <any>{};

  public equipmentList = [{
    id: 1,
    name: 'Electricity cables',
    isSelected: false
  }, {
    id: 2,
    name: 'Overhead lines',
    isSelected: false
  }, {
    id: 3,
    name: 'Substation plant',
    isSelected: false
  }, {
    id: 4,
    name: 'Service termination equipment',
    isSelected: false
  }]

  public unknownList = {
    id: 5,
    name: 'unknown',
    isSelected: false
  }
  navIndex: any;
  nextUrl:any
  currentUrl: any;
  templateList: any;
  templateListSub: Subscription;
  currentUrlSub:Subscription;

  progressionStatusId: any;
  connectionTypeId:any;
  progress_status_payload:any;
  progressionSub:Subscription;
  connectionIdSub:Subscription;

  Proposed_Works_Description:string;
  Equipment_Value:boolean = false;
  submittedForm:boolean = false;
  connectionId: number;
  isNewData: boolean = false;
  Equipment_ValArray = new Array();
  Unknown_ValArray = new Array();

  constructor(private router: Router, private fb: FormBuilder,
              private equipmentService: MovingOurEquipmentDetailsService,
              private sharedService: SharedService, private httpService: HttpService,
              private _snackBar: MatSnackBar) {
    this.equipmentForm = this.fb.group({
      Proposed_Works_Description: [null, Validators.required],
    })
  }

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

    
    this.sharedService.getConnectionId().subscribe(data => {
      this.connectionId=data;
    });

    this.equipmentService.getEquipmentDetail(this.connectionId).subscribe(res => {
      if(res) {
        this.isNewData=true;
        this.equipmentForm.get('Proposed_Works_Description').setValue(res.Proposed_Works_Description);
        
        if(res.Equipment_Require_Moving[0] === 5) {
          this.unknownList.isSelected = true;
          this.Unknown_ValArray=res.Equipment_Require_Moving;
        }
        else {
          this.unknownList.isSelected = false;
          this.Equipment_ValArray=res.Equipment_Require_Moving; 
          res.Equipment_Require_Moving.forEach((id: any)=> {
            this.equipmentList.forEach(data => {
              if(id === data.id) {
                data.isSelected=true;
              }
            });
          });
        }
      }
    });
  }

  ngOnDestroy():void{
    this.currentUrlSub.unsubscribe();
     this.templateListSub.unsubscribe();
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
  
  onCheckboxChange(id: number, event: any) {
    if(event.target.checked === true) {
      this.Equipment_ValArray.push(id);
      let id_new = id-1;
      this.equipmentList.forEach((data: any) => {
        if(data.id === id) {
          data.isSelected=true;
        }
      });
      this.unknownList.isSelected=false;
      this.Unknown_ValArray=[];
  
    } else if(event.target.checked === false) {
      let index = this.Equipment_ValArray.indexOf(id);
      if(this.Equipment_ValArray.includes(id)) {
        this.Equipment_ValArray.splice(index,1);
      }
      this.equipmentList.forEach((data: any) => {
        if(data.id === id) {
          data.isSelected=false;
        }
      });
      this.unknownList.isSelected=false;
      this.Unknown_ValArray=[];
    }
  }

  onUnknownCheckbox(id:number, event:any) {
    if(event.target.checked === true) {
      this.Unknown_ValArray.push(id);
      this.unknownList.isSelected=true;
      this.Equipment_ValArray=[];
      this.equipmentList.forEach((data: any) => {
        data.isSelected=false;
      });
  
    } else if(event.target.checked === false) {
      let index = this.Unknown_ValArray.indexOf(id);
      if(this.Unknown_ValArray.includes(id)) {
        this.Unknown_ValArray.splice(index,1);
      }
      this.equipmentList.forEach((data: any) => {
        data.isSelected=false;
      });
      this.Equipment_ValArray=[];
    }
    
  }

  onSave(type:string, status:string){
    let setOptionsIstrue=false;
    this.submittedForm = true;
    const data:any = {
      Connection_Id: this.connectionId,
      Equipment_Require_Moving: null,
      Proposed_Works_Description: this.equipmentForm.controls['Proposed_Works_Description'].value
    }
    if(this.Equipment_ValArray.length >= 1) {
      data.Equipment_Require_Moving=this.Equipment_ValArray;
      setOptionsIstrue=true;
    }
    else if(this.Unknown_ValArray.length >= 1){
      data.Equipment_Require_Moving = this.Unknown_ValArray
      setOptionsIstrue=true;
    }
    if(setOptionsIstrue === false || data.Proposed_Works_Description === null || data.Proposed_Works_Description == ''){
      return;
    }
    if(setOptionsIstrue === true || data.Proposed_Works_Description != null) {
      this.submittedForm = false;
      this.updateProgressionStatus(status);
      if(this.isNewData === false) {
      this.equipmentService.submitEquipmentDetail(data).subscribe(res => {
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
      this.equipmentService.updateEquipmentDetail(data, this.connectionId).subscribe(res => {
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
