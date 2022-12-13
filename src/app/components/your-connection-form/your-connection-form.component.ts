import { Component, ViewChild, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { YourConnectionService } from 'src/app/services/your-connection.service';
import { SharedService } from 'src/app/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-your-connection-form',
  templateUrl: './your-connection-form.component.html',
  styleUrls: ['./your-connection-form.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-30%)'}),
        animate('220ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('220ms ease-in', style({transform: 'translateY(-30%)'}))
      ])
    ])
  ]
})
export class YourConnectionFormComponent implements OnInit {

  
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


  formSubmitted: boolean = false;
  Poctype: boolean = false;
  Poc_Mpan!: string;
  Existing_Load_Current_Supply: number = 0;
  Total_Increased_Load: number = 0.0;
  Reason_For_Increased_Load!: string;
  Company_Adopting_EN!: number;
  Connections_Plan_To_Install: string = "0";
  Total_Load_Required: string = "0.0";
  Poc_Contestable = new Array();
  Poc_Temporary_Connection!: number;
  Poc_Temporary_Load!: string;

  mpanPattern = /^(\d{13})?$/g;

  mpanStartsWith: boolean = false;
  mpanInfo: boolean =false;
  connectionId: number;
  isNewData: boolean = false;

  options= [
    {
    id: true,
    name: 'New Point of Connection'
  },
  {
    id: false,
    name: 'Increased Load'
  }
  ];

  dropDownOptions = [
    {
      id: undefined,
      name: '-- Please Select --'
    },
    {
      id: 0,
      name: 'Northern Powergrid'
    },
    {
      id: 1,
      name: 'IDNO'
    },
  ];

  categories = [
    {
      id: 0,
      isSelected: false,
      name: 'No, we require Northern Powergrid to undertake the final closing joint on our behalf as a contestable activity where applicable'
    },
    {
      id: 1,
      isSelected: false,
      name: 'Yes, we will undertake the contestable closing joint where applicable'
    },
    {
      id: 2,
      isSelected: false,
      name: 'We have entered in to a network access agreement with Northern Powergrid and hold the correct Northern Powergrid live jointing authorisation codes'
    }
  ];

  connections = [{
    id: 0,
    name: 'Yes'
  },
  {
    id: 1,
    name: 'No'
  }
];

  @ViewChild('connectionForm') connectionForm: NgForm =<any>{};

  constructor(private router: Router, private connectionService: YourConnectionService,
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
  

    this.connectionService.getConnection(this.connectionId).subscribe(res => {
      if(res) {
        this.isNewData=true;
        console.log(res);
        this.Poctype=((res.Poctype === 0)? false: true);
        this.Poc_Mpan=res.Poc_Mpan;
        this.Existing_Load_Current_Supply=res.Existing_Load_Current_Supply;
        this.Total_Increased_Load=res.Total_Increased_Load;
        this.Reason_For_Increased_Load=res.Reason_For_Increased_Load;
        this.Company_Adopting_EN=res.Company_Adopting_EN;
        this.Connections_Plan_To_Install=res.Connections_Plan_To_Install;
        this.Total_Load_Required=res.Total_Load_Required;
        this.Poc_Contestable = res.Poc_Contestable;
        res.Poc_Contestable.forEach((id: number) => {
          this.categories.forEach((data : any) => {
            if(data.id === id) {
              data.isSelected=true;
            }
          });
        })
        this.Poc_Temporary_Connection=res.Poc_Temporary_Connection;
        this.Poc_Temporary_Load=res.Poc_Temporary_Load;
      }
    })
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

  increase() {
    var data= +this.Connections_Plan_To_Install;
      data = data + 1;
      this.Connections_Plan_To_Install = String(data);
  }

  decrease(){
    if(this.Connections_Plan_To_Install != '0') {
      var data= +this.Connections_Plan_To_Install;
      data = data - 1;
      this.Connections_Plan_To_Install = String(data);
    }
  }

  onChange(id:number, isChecked: boolean) {
    if(isChecked === true) {
      this.Poc_Contestable.push(id);
    } else {
      let index = this.Poc_Contestable.indexOf(id);
      if(this.Poc_Contestable.includes(id)) {
        this.Poc_Contestable.splice(index,1);
      }
      
    }
}

  checkMPAN(): boolean {
    if(this.Poc_Mpan){
      var checkNum= String(this.Poc_Mpan);
      if(checkNum.startsWith("15") || checkNum.startsWith("23")) {
        return false;
      }
      else {
        return true;
      }
    }
    return false;
  }

  onSubmit(type:string, status:string) {
    
    this.formSubmitted=true;
    // console.log();
    console.log(this.Poc_Contestable);
    if(this.connectionForm.valid) {
      this.updateProgressionStatus(status);
      if((this.Poctype === false && this.checkMPAN() === false)){
        // console.log(this.connectionForm.value);
        this.Connections_Plan_To_Install="0";
        this.Total_Load_Required="0.0";
        this.Poc_Contestable=[];
        this.Poc_Temporary_Connection=null;
        this.Poc_Temporary_Load=null;
        let data= {
          Connection_Id: this.connectionId,
          Poctype: this.Poctype,
          Poc_Mpan: this.Poc_Mpan,
          Existing_Load_Current_Supply: this.Existing_Load_Current_Supply,
          Total_Increased_Load: this.Total_Increased_Load,
          Reason_For_Increased_Load: this.Reason_For_Increased_Load,
          Company_Adopting_EN: this.Company_Adopting_EN,
          Connections_Plan_To_Install: this.Connections_Plan_To_Install,
          Total_Load_Required: this.Total_Load_Required,
          Poc_Contestable: this.Poc_Contestable,
          Poc_Temporary_Connection: this.Poc_Temporary_Connection,
          Poc_Temporary_Load: this.Poc_Temporary_Load
        }
        
        if(this.isNewData === false) {
          this.connectionService.saveConnection(data).subscribe(
            res => {
              if(res) {
                if(res.message){
                  // this.formSubmitted=false;
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
          this.connectionService.updateConnection(data, this.connectionId).subscribe(
            res => {
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
      }
      else if((this.Poctype === true && this.Poc_Contestable.length >= 1)) {
        this.Poc_Mpan=null;
        this.Existing_Load_Current_Supply=0;
        this.Total_Increased_Load=0;
        // this.Poc_Contestable=[];
        this.Reason_For_Increased_Load=null;

        let data= {
          Connection_Id: this.connectionId,
          Poctype: this.Poctype,
          Poc_Mpan: this.Poc_Mpan,
          Existing_Load_Current_Supply: this.Existing_Load_Current_Supply,
          Total_Increased_Load: this.Total_Increased_Load,
          Reason_For_Increased_Load: this.Reason_For_Increased_Load,
          Company_Adopting_EN: this.Company_Adopting_EN,
          Connections_Plan_To_Install: this.Connections_Plan_To_Install,
          Total_Load_Required: this.Total_Load_Required,
          Poc_Contestable: this.Poc_Contestable,
          Poc_Temporary_Connection: this.Poc_Temporary_Connection,
          Poc_Temporary_Load: this.Poc_Temporary_Load
        }
        if(this.isNewData === false) {
          this.connectionService.saveConnection(data).subscribe(
            res => {
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
          this.connectionService.updateConnection(data, this.connectionId).subscribe(
            res => {
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