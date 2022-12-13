import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactPreferenceService } from 'src/app/services/contact-preference.service';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';


@Component({
  selector: 'app-contact-preference',
  templateUrl: './contact-preference.component.html',
  styleUrls: ['./contact-preference.component.scss']
})
export class ContactPreferenceComponent implements OnInit {

  Contact_Preference!: number;
  Receive_Quotation_Information!: number;
  formSubmitted: boolean=false;
  connectionId: number;
  isNewData: boolean=false;

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
  connectionIdSub:Subscription

  options= [
    {
    id: 0,
    name: 'Email'
  },
  {
    id: 1,
    name: 'Telephone'
  }
  ];
  diffOptions= [
    {
    id: 0,
    name: 'Email'
  },
  {
    id: 1,
    name: 'Post'
  },
  {
    id: 2,
    name: 'Both'
  }
  ];

  constructor(private router: Router, private contactPreferenceService: ContactPreferenceService,
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

    this.contactPreferenceService.getContactPreferenceData(this.connectionId).subscribe(res => {
      if(res) {
        this.isNewData=true;
        this.Contact_Preference = res[0].Contact_Preference;
        this.Receive_Quotation_Information = res[0].Receive_Quotation_Information;
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

    if(this.Contact_Preference != null && this.Receive_Quotation_Information != null) {
      let contacPrefData = {
        Connection_Id: this.connectionId,
        Contact_Preference: this.Contact_Preference,
        Receive_Quotation_Information: this.Receive_Quotation_Information
      }
      this.updateProgressionStatus(status);
      if(this.isNewData === false) {
        this.contactPreferenceService.submitContactPreferenceData(contacPrefData).subscribe(res => {
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
        this.contactPreferenceService.updateContactPreferenceData(contacPrefData, this.connectionId).subscribe(res => {
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
