import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InstallerDetailsService } from 'src/app/services/installer-details.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';
import { UtilityHelper } from 'src/app/services/utility-helper';

@Component({
  selector: 'app-multiple-installer-details',
  templateUrl: './multiple-installer-details.component.html',
  styleUrls: ['./multiple-installer-details.component.scss']
})
export class MultipleInstallerDetailsComponent implements OnInit {
  @ViewChild('multipleInstallerForm') multipleInstallerForm: NgForm = <any>{};
  multipleInstallerDetail:any = {};
  formSubmitted:boolean = false;
  Multiple_customer_Reference: string = '';
  connectionId: number;
  isNewData: boolean = false;


  postCodePattern = /^(([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2}))$/g;
  mobilePattern = new RegExp('[0-9]');
  emailPattern = new RegExp("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}");

  // contactDetail = {
  //   First_Name: 'Admin',
  //   Surname: 'Admin',
  //   Site_Name: 'B204',
  //   Street: 'Karad',
  //   City_Region: 'Satara',
  //   Postcode: 'ne27 0lp',
  //   Telephone: '7565434567',
  //   Email_Address: 'abc@tcs.com'
  // }

  contactDetail: any;

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

  titleCheck: boolean = true;
  alphaCheckFirst: boolean = true;
  alphaCheckLast: boolean = true;
  compCheck: boolean =true;
  natureBusinessCheck: boolean =true;
  siteCheck: boolean =true;
  streetCheck: boolean =true;
  cityCheck: boolean =true;
  projectCheck: boolean = true;
  postCodeCheck: boolean = true;
  emailCheck: boolean =true;

  constructor(private router: Router, private installerService: InstallerDetailsService,private httpService: HttpService,
    private sharedService: SharedService, private _snackBar: MatSnackBar,
    private utilService: UtilityHelper) { }

  ngOnInit(): void {
    this.sharedService.setCurrentNav(this.router.url);
    this.sharedService.getCorrospondanceAddress().subscribe((data:any)=>{
      this.contactDetail = data;
       console.log(data);
     })

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

    this.installerService.getMultipleInstallerData(this.connectionId).subscribe(res => {
      if(res) {
        this.isNewData=true;
    this.Multiple_customer_Reference = res.Multiple_customer_Reference
    this.multipleInstallerDetail.Multiple_Installer_Title =res.Multiple_Installer_Title;
    this.multipleInstallerDetail.Multiple_Installer_First_Name = res.Multiple_Installer_First_Name
    this.multipleInstallerDetail.Multiple_Installer_Surname =res.Multiple_Installer_Surname;
    this.multipleInstallerDetail.Multiple_Installer_Company_Name =res.Multiple_Installer_Company_Name;
    this.multipleInstallerDetail.Multiple_Nature_Of_Business =res.Multiple_Nature_Of_Business;
    this.multipleInstallerDetail.Multiple_Installer_Site_Name =res.Multiple_Installer_Site_Name;
    this.multipleInstallerDetail.Multiple_Installer_Street =res.Multiple_Installer_Street;
    this.multipleInstallerDetail.Multiple_Installer_City_Region =res.Multiple_Installer_City_Region;
    this.multipleInstallerDetail.Multiple_Installer_Postcode =res.Multiple_Installer_Postcode;
    this.multipleInstallerDetail.Multiple_Installer_Telephone =res.Multiple_Installer_Telephone;
    this.multipleInstallerDetail.Multiple_Installer_Mobile = res.Multiple_Installer_Mobile;
    this.multipleInstallerDetail.Multiple_Installer_Email_Address =res.Multiple_Installer_Email_Address;
    this.Multiple_customer_Reference = res.Multiple_customer_Reference;

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

  
  contactDetailClick() {
    this.multipleInstallerDetail.Multiple_Installer_Title = this.contactDetail.title;
    this.multipleInstallerDetail.Multiple_Installer_First_Name = this.contactDetail.custFirstName;
    this.multipleInstallerDetail.Multiple_Installer_Surname = this.contactDetail.custSurName;
    this.multipleInstallerDetail.Multiple_Installer_Site_Name = this.contactDetail.Site_Name;
    this.multipleInstallerDetail.Multiple_Installer_Street = this.contactDetail.Site_Street;
    this.multipleInstallerDetail.Multiple_Installer_City_Region = this.contactDetail.Site_City;
    this.multipleInstallerDetail.Multiple_Installer_Postcode = this.contactDetail.Site_Postcode;
    this.multipleInstallerDetail.Multiple_Installer_Telephone = this.contactDetail.custContactTel;
    this.multipleInstallerDetail.Multiple_Installer_Email_Address = this.contactDetail.email;
    this.multipleInstallerDetail.Multiple_Installer_Company_Name= this.contactDetail.custCompanyName;

    this.checkAlphabetAndDot(String(this.multipleInstallerDetail.Installer_First_Name), 'first');
    this.checkAlphabetAndDot(String(this.multipleInstallerDetail.Installer_Surname), 'sur');
    this.checkAddress(String(this.multipleInstallerDetail.Installer_Site_Number), 'site');
    this.checkAddress(String(this.multipleInstallerDetail.Installer_Street), 'street');
    this.checkAlphabet(String(this.multipleInstallerDetail.Installer_City_Region), 'city');
    this.checkTitle(String(this.multipleInstallerDetail.Multiple_Installer_Title));
    this.checkPostCode(String(this.multipleInstallerDetail.Multiple_Installer_Postcode));
  }

  onSave(type:string, status:string) {
    this.formSubmitted = true;
    if(this.multipleInstallerForm.invalid) {
      return;
    }
    if(this.multipleInstallerForm.valid) {
    this.formSubmitted = false;
    this.multipleInstallerDetail.Multiple_customer_Reference = this.Multiple_customer_Reference;
    this.updateProgressionStatus(status);
    if(this.isNewData === false) {
    this.multipleInstallerDetail.Connection_Id=this.connectionId;
    // console.log(this.multipleInstallerDetail);
    this.installerService.submitMultipleInstallerData(this.multipleInstallerDetail).subscribe(res => {
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
    this.installerService.updateMultipleInstallerData(this.multipleInstallerDetail, this.connectionId).subscribe(res => {
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

/**Validation */


checkTitle(data: string) {
    
  if(data === '') {
    this.titleCheck=true;
  }
  else {
    this.titleCheck = this.utilService.validateTitle(data);
  }
}
checkNature(data: string) {
    
  if(data === '') {
    this.natureBusinessCheck=true;
  }
  else {
    this.natureBusinessCheck = this.utilService.validateName(data);
  }
}
checkAlphabet(data: string, type: string) {
  
  if(type === 'city') {
    if(data === '') {
      this.cityCheck=true; 
    }
    else {
      this.cityCheck=this.utilService.validateonlyAlphabet(data);
    }
    
  }
  
}
checkAddress(data: string, type: string) {
  if(type === 'site') {
    if(data === '') {
      this.siteCheck=true; 
    }
    else {
      this.siteCheck = this.utilService.validateAddress(data);
    }
    
  }
  if(type === 'street') {
    if(data === '') {
      this.streetCheck=true; 
    }
    else {
      this.streetCheck=this.utilService.validateAddress(data);
    }
    
  }
}
checkAlphabetAndDot(data: string, type: string) {
  if(type === 'proj') {
    if(data === '') {
      this.projectCheck=true; 
    }
    else {
      this.projectCheck = this.utilService.validateDegree(data);
    }
    
  }
  if(type === 'comp') {
    if(data === '') {
      this.compCheck=true; 
    }
    else {
      this.compCheck = this.utilService.validateDegree(data);
    }
    
  }
  if(type === 'first') {
    if(data === '') {
      this.alphaCheckFirst=true; 
    }
    else {
      this.alphaCheckFirst=this.utilService.validateName(data);
    }
    
  }
  if(type === 'sur') {
    if(data === '') {
      this.alphaCheckLast=true; 
    }
    else {
      this.alphaCheckLast=this.utilService.validateName(data);
    }
    
  }
  
}

checkPostCode(data: string) {
  if(data  === '') {
    this.postCodeCheck=true;
  }
  else {
    this.postCodeCheck=this.utilService.validatePostCode(data);
  }
}

// checkEmail(data: string) {
//   if(data === '') {
//     this.emailCheck=true;
//   }
//   else {
//     this.emailCheck= this.utilService.validateEmail(data);
//   }
// }

}
