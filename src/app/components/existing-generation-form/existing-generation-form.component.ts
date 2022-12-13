import { Component, ViewChild, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExistingGenerationService } from 'src/app/services/existing-generation.service';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-existing-generation-form',
  templateUrl: './existing-generation-form.component.html',
  styleUrls: ['./existing-generation-form.component.scss']
})
export class ExistingGenerationFormComponent implements OnInit {
  @ViewChild('generationForm') generationForm:NgForm = <any>{};
  formSubmitted: boolean = false;
  Poc_Generation_Connected: number;
  Poc_Max_Export: number;
  Poc_Rated_Current: number;
  Poc_Rated_Voltage: number;
  Poc_Type_Of_Generation: number;
  Poc_Export_Mpan!: number;
  Poc_Import_Mpan!: number;
 // mpanPattern = new RegExp('[0-9]');
  mpanPattern = /^(\d{13})?$/g;
  matchmpanExportPattern: boolean = false;
  matchmpanImportPattern: boolean = false;
  mpanStartsWith: boolean = false;
  connectionId: number;
  isNewData: boolean = false;
  options= [
    {
      value: 0,
    name: 'Yes'
  },
  {
    value: 1,
    name: 'No'
  }
  ];

  
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

  constructor(public router: Router, private existingGenerationService: ExistingGenerationService,
    private sharedService: SharedService,private httpService: HttpService,
    private _snackBar: MatSnackBar) { }

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

    this.existingGenerationService.getExisitingGeneration(this.connectionId).subscribe(res => {
      if(res) {
        this.isNewData=true;
        this.Poc_Generation_Connected =  res[0].Poc_Generation_Connected;
        this.Poc_Max_Export= res[0].Poc_Max_Export ;
        this.Poc_Rated_Current = res[0].Poc_Rated_Current;
        this.Poc_Rated_Voltage = res[0].Poc_Rated_Voltage ;
        this.Poc_Type_Of_Generation = res[0].Poc_Type_Of_Generation ;
        this.Poc_Export_Mpan= res[0].Poc_Export_Mpan     ;
        this.Poc_Import_Mpan=  res[0].Poc_Import_Mpan;
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
  

  onSubmit(type:string, status:string){
    this.formSubmitted=true;
    if(this.Poc_Export_Mpan){
      var checkNum= String(this.Poc_Export_Mpan);
      if(checkNum.startsWith("15") ||  checkNum.startsWith("23")) {
        this.mpanStartsWith=false;
        if(checkNum.length === 13) {
          this.matchmpanExportPattern=false;
        }
        else {
          this.matchmpanExportPattern=true;
        }
      }
      
      else {
        this.mpanStartsWith=true;
        this.matchmpanExportPattern=true;

      }
    }
    if(this.Poc_Import_Mpan){
      var checkNum= String(this.Poc_Import_Mpan);
      if(checkNum.startsWith("15") || checkNum.startsWith("23")) {
        this.mpanStartsWith=false;
        if(checkNum.length === 13) {
          this.matchmpanImportPattern=false;
        }
        else {
          this.matchmpanImportPattern=true;
        }
      }
      else {
        this.mpanStartsWith=true;
        

      }
    }
  
    if(this.Poc_Export_Mpan == null || this.Poc_Import_Mpan == null || this.mpanStartsWith == true || this.matchmpanImportPattern == true
       || this.matchmpanExportPattern == true){
      return;
    }

    if(this.mpanStartsWith === false || this.matchmpanImportPattern === false
      || this.matchmpanExportPattern == false) {
    const data={
        Connection_Id: this.connectionId,
        Poc_Generation_Connected: this.Poc_Generation_Connected,
        Poc_Max_Export: this.Poc_Max_Export,
        Poc_Rated_Current: this.Poc_Rated_Current,
        Poc_Rated_Voltage: this.Poc_Rated_Voltage,
        Poc_Type_Of_Generation: this.Poc_Type_Of_Generation,
        Poc_Export_Mpan: this.Poc_Export_Mpan,
        Poc_Import_Mpan: this.Poc_Import_Mpan,
       
    }
    this.updateProgressionStatus(status);
    if(this.isNewData === false) {
    this.existingGenerationService.submitexistingGenerationata(data).subscribe(res => {
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
    this.existingGenerationService.updateExisitingGeneration(data, this.connectionId).subscribe(res => {
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
