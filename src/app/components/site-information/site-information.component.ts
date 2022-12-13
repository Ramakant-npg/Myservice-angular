import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { SiteInformationService } from 'src/app/services/site-information.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';


@Component({
  selector: 'app-site-information',
  templateUrl: './site-information.component.html',
  styleUrls: ['./site-information.component.scss'],
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
export class SiteInformationComponent implements OnInit, OnDestroy {

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

  Site_Water_Flag!: number;
  Site_Preservation_Flag!: number;
  Site_Hazard_Flag!: number;
  Site_Classification_Flag!: number;
  Site_Flooding_Flag!: number;
  Site_Digging_Flag!: number;
  Site_Water_Details!: string;
  Site_Preservation_Details!: string;
  Site_Classification_Details!: string;
  Site_Hazard_Details!: string;
  formSubmitted: boolean=false;
  siteInfoSubs!: Subscription;
  connectionId: number;
  isNewData: boolean =false;
  options = [
              {
                id: 0,
                name: 'Yes'
              },
              {
                id: 1,
                name: 'No'
              },
              {
                id: 2,
                name: "Don't Know"
              }
            ];
  diffOptions= [
    {
      id: 0,
      name: 'Low'
    },
    {
      id: 1,
      name: 'Medium'
    },
    {
      id: 2,
      name: 'High'
    }
  ];

  constructor(private router: Router,private siteInfoService: SiteInformationService,
              private sharedService: SharedService, private httpService: HttpService,
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
  

    this.siteInfoService.getSiteInformation(this.connectionId).subscribe(res => {
      if(res) {
        this.isNewData=true;
       this.connectionId = res.Connection_Id;
         this.Site_Water_Flag = res.Site_Water_Flag;
         this.Site_Water_Details = res.Site_Water_Details;
         this.Site_Preservation_Flag = res.Site_Preservation_Flag;
         this.Site_Preservation_Details = res.Site_Preservation_Details;
        this.Site_Hazard_Flag = res.Site_Hazard_Flag;
        this.Site_Hazard_Details = res.Site_Hazard_Details;
         this.Site_Classification_Flag = res.Site_Classification_Flag
        this.Site_Classification_Details = res.Site_Classification_Details
        this.Site_Flooding_Flag=   res.Site_Flooding_Flag;
        this.Site_Digging_Flag = res.Site_Digging_Flag;
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
  

  validateCheck(): boolean {
    if(this.Site_Hazard_Flag == null || this.Site_Preservation_Flag == null 
      || this.Site_Classification_Flag == null || this.Site_Digging_Flag == null 
      || this.Site_Flooding_Flag == null 
      || this.Site_Water_Flag == null) {
        return true;
      }
    if((this.Site_Water_Flag == 0 && this.Site_Water_Details == null)
       || (this.Site_Hazard_Flag == 0 && this.Site_Hazard_Details == null)
       || (this.Site_Preservation_Flag == 0 && this.Site_Preservation_Details == null)
       || (this.Site_Classification_Flag == 0 && this.Site_Classification_Details == null)) {
        return true;
      }
      return false;
  }

  onSubmit(type:string, status:string) {
    this.formSubmitted=true;
    if(this.validateCheck() == false){
    this.updateProgressionStatus(status);
    }
    // console.log(siteInfoData);
    if(this.validateCheck() == false && this.isNewData === false) {
      const siteInfoData = {
        Connection_Id: this.connectionId,
        Site_Water_Flag: this.Site_Water_Flag,
        Site_Water_Details: this.Site_Water_Details,
        Site_Preservation_Flag: this.Site_Preservation_Flag,
        Site_Preservation_Details: this.Site_Preservation_Details,
        Site_Hazard_Flag: this.Site_Hazard_Flag,
        Site_Hazard_Details: this.Site_Hazard_Details,
        Site_Classification_Flag: this.Site_Classification_Flag,
        Site_Classification_Details: this.Site_Classification_Details,
        Site_Flooding_Flag: this.Site_Flooding_Flag,
        Site_Digging_Flag: this.Site_Digging_Flag
      }
      this.siteInfoService.saveSiteInformationData(siteInfoData).subscribe((res) => {
        if(res) {
          if(res.message){
            this._snackBar.open("Data Inserted Successfully", "OK", {
              duration: 3000,
              });
            }
          }
      });
    }
    else {
      const siteInfoData = {
        // Connection_Id: this.connectionId,
        Site_Water_Flag: this.Site_Water_Flag,
        Site_Water_Details: this.Site_Water_Details,
        Site_Preservation_Flag: this.Site_Preservation_Flag,
        Site_Preservation_Details: this.Site_Preservation_Details,
        Site_Hazard_Flag: this.Site_Hazard_Flag,
        Site_Hazard_Details: this.Site_Hazard_Details,
        Site_Classification_Flag: this.Site_Classification_Flag,
        Site_Classification_Details: this.Site_Classification_Details,
        Site_Flooding_Flag: this.Site_Flooding_Flag,
        Site_Digging_Flag: this.Site_Digging_Flag
      }
      this.siteInfoService.updateSiteInformation(siteInfoData, this.connectionId).subscribe(
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
