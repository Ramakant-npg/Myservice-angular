import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { YourConnectionService } from 'src/app/services/your-connection.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/shared.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  },
};

@Component({
  selector: 'app-your-connection-date',
  templateUrl: './your-connection-date.component.html',
  styleUrls: ['./your-connection-date.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})

export class YourConnectionDateComponent implements OnInit, OnDestroy {

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

  minIdealDate = new Date();
  minExpectedDate = new Date();
  Ideal_Connection_Date: any;
  Expected_Connection_Date:any;
  expectedDateTime: any;
  idealDateTime: any;
  idealDateValid: boolean = true;
  expectedDateValid: boolean = true;
  idealRangeValidDate: boolean = false;
  formSubmitted: boolean = false;
  connectionSubs!: Subscription;
  connectionId: number;
  isNewData: boolean = false;

  constructor(private router: Router,private connectionService: YourConnectionService,
              private sharedService: SharedService,
              private _snackBar: MatSnackBar,
              private httpService: HttpService) { }

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

    this.minIdealDate.setDate(this.minIdealDate.getDate() - 8);

    this.minExpectedDate.setDate(this.minExpectedDate.getDate() + 1);

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
  

    this.connectionService.getConnectionDate(this.connectionId).subscribe(res => {
      if(res) {
        this.isNewData=true;
        // console.log(moment(res[0].Ideal_Connection_Date).format('DD/MM/YYYY'));
        //this.Ideal_Connection_Date = new FormControl(moment(27-5-2022).format('DD/MM/YYYY'));
        this.Ideal_Connection_Date=moment(res[0].Ideal_Connection_Date);
        this.Expected_Connection_Date = moment(res[0].Expected_Connection_Date);
      }
    });
  }

  ngOnDestroy(): void {
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
   
  onIdealDateChange(data: Date){
    // let currentDate = moment().toDate();
    moment(data).toDate();
    if((moment(data).diff(moment(this.minIdealDate)) >= 0)) {
      let time = moment().toDate().getTime();
      this.Ideal_Connection_Date= moment(data);
      this.idealDateTime = moment(this.Ideal_Connection_Date).format('YYYY-MM-DD') + ' ' + moment(time).format('hh:mm:ss');
      this.idealDateValid=moment(this.Ideal_Connection_Date).isValid();
      // console.log((moment(data).diff(moment(this.minIdealDate))));
      this.idealRangeValidDate=false;
    }
    else {
      this.idealRangeValidDate=true;
    }
    
  }

  onExpectedDateChange(data: Date){
    moment(data).toDate();
    if((moment(data).diff(moment(this.minExpectedDate)) >= 0)) {
    let time= moment().toDate().getTime();
    this.Expected_Connection_Date=moment(data);
    this.expectedDateTime = moment(this.Expected_Connection_Date).format('YYYY-MM-DD')+ ' '+ moment(time).format('hh:mm:ss');
    this.expectedDateValid=moment(this.Expected_Connection_Date).isValid();
    }
  }

  onSave(type:string, status:string) {
    this.formSubmitted=true;
    this.idealDateValid=moment(this.Ideal_Connection_Date).isValid();
    this.expectedDateValid=moment(this.Expected_Connection_Date).isValid();
    if(this.idealDateValid === true && this.expectedDateValid === true) {
       this.updateProgressionStatus(status);
      if(this.isNewData === false) {
      const connectionData = {
        Connection_Id: this.connectionId,
        Ideal_Connection_Date: this.idealDateTime,
        Expected_Connection_Date: this.expectedDateTime
      };
      this.connectionService.saveConnectionDate(connectionData).subscribe((res) => {
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
      if(this.idealDateTime == null) {
        // let time = moment().toDate().getTime();
        this.idealDateTime = moment(this.Ideal_Connection_Date).format('YYYY-MM-DD hh:mm:ss');
      }
      if(this.expectedDateTime == null) {
        // let time = moment().toDate().getTime();
        this.expectedDateTime = moment(this.Expected_Connection_Date).format('YYYY-MM-DD hh:mm:ss');
      }
      const connectionData = {
        Connection_Id: this.connectionId,
        Ideal_Connection_Date: this.idealDateTime,
        Expected_Connection_Date: this.expectedDateTime
      };
      this.connectionService.updateConnectionDate(connectionData,this.connectionId).subscribe((res) => {
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
