import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InstallerDetailsService } from 'src/app/services/installer-details.service';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';
import { UtilityHelper } from 'src/app/services/utility-helper';

@Component({
  selector: 'app-installer-details',
  templateUrl: './installer-details.component.html',
  styleUrls: ['./installer-details.component.scss']
})
export class InstallerDetailsComponent implements OnInit {
  customerRef:string = '';
  @ViewChild('installerDetailsForm') installerDetailsForm:NgForm = <any>{};
  formSubmitted:boolean = false;
  connectionId: number;
  isNewData: boolean = false;
  installerDetail:any = {};
  // contactDetail = {
  //   Installer_First_Name: 'Asmita',
  //   Installer_Surname: 'Nalawade',
  //   Installer_Site_Number: 'R345',
  //   Installer_Street: 'karad',
  //   Installer_City_Region: 'karad', 
  //   Installer_Postcode: 'ne27 0lp',
  //   Installer_Email_Address: 'pattern@tcs.com',
  //   Installer_Telephone: '7578630765'
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

  titleCheck: boolean = true;
  alphaCheckFirst: boolean = true;
  alphaCheckLast: boolean = true;
  qualCheck: boolean =true;
  siteCheck: boolean =true;
  streetCheck: boolean =true;
  cityCheck: boolean =true;
  postCheck: boolean =true;
  
  progressionSub:Subscription;
  connectionIdSub:Subscription;

  public postCodePattern = /^(([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2}))$/g;
  public mobilePattern = new RegExp(/[0-9]/);
  public emailPattern = new RegExp("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}");

  constructor(private router: Router, private installerService: InstallerDetailsService,
    private sharedService: SharedService,private httpService: HttpService,
    private _snackBar: MatSnackBar,
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

    this.installerDetail.Installer_Declairation = false;
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

    this.installerService.getSingleInstallerData(this.connectionId).subscribe(res => {
      if(res) {
        this.isNewData=true;
        this.installerDetail.Installer_Title = res.Installer_Title;
        this.installerDetail.Installer_First_Name = res.Installer_First_Name;
        this.installerDetail.Installer_Surname = res.Installer_Surname;
        this.installerDetail.Installer_Site_Number =  res.Installer_Site_Number;
        this.installerDetail.Installer_Street =  res.Installer_Street;
        this.installerDetail.Installer_City_Region =  res.Installer_City_Region;
        this.installerDetail.Installer_Postcode =  res.Installer_Postcode;
        this.installerDetail.Installer_Email_Address =  res.Installer_Email_Address;
        this.installerDetail.Installer_Telephone =  res.Installer_Telephone;
        this.installerDetail.Installer_Accreditation_Qualification =  res.Installer_Accreditation_Qualification;
        this.installerDetail.Installer_Declairation =  res.Installer_Declairation;
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
  contactDetailsClick() {

    //Need to change the name for contactDetail
    this.installerDetail.Installer_Title = this.contactDetail.title;
    this.installerDetail.Installer_First_Name = this.contactDetail.custFirstName;
    this.installerDetail.Installer_Surname = this.contactDetail.custSurName;
    this.installerDetail.Installer_Site_Number = this.contactDetail.Site_Name;
    this.installerDetail.Installer_Street = this.contactDetail.Site_Street;
    this.installerDetail.Installer_City_Region = this.contactDetail.Site_City;
    this.installerDetail.Installer_Postcode = this.contactDetail.Site_Postcode;
    this.installerDetail.Installer_Email_Address = this.contactDetail.email;
    this.installerDetail.Installer_Telephone = this.contactDetail.custContactTel;
    // this.Customer_Name=this.dummyContactDetails.custFirstName + ' '+ this.dummyContactDetails.custSurName;
    // this.Company_Name=this.dummyContactDetails.custCompanyName;
    // this.Customer_Property_Name=this.dummyContactDetails.Site_Name;
    // this.Customer_Address=this.dummyContactDetails.Site_Street;
    // this.Customer_Town=this.dummyContactDetails.Site_City;
    // this.Customer_Postcode=this.dummyContactDetails.Site_Postcode;

    this.checkAlphabetAndDot(String(this.installerDetail.Installer_First_Name), 'first');
    this.checkAlphabetAndDot(String(this.installerDetail.Installer_Surname), 'sur');
    this.checkAddress(String(this.installerDetail.Installer_Site_Number), 'site');
    this.checkAddress(String(this.installerDetail.Installer_Street), 'street');
    this.checkAlphabet(String(this.installerDetail.Installer_City_Region), 'city');
    this.checkPostcode(String(this.installerDetail.Installer_Postcode));
    
  }

  check(event: any) {
     this.installerDetail.Installer_Declairation = event.target.checked;
  }

  onSave(type:string, status:string) {
    this.formSubmitted = true;
    // console.log(this.installerDetail);
    // console.log(this.installerDetail.Installer_Declairation)
    if(this.installerDetailsForm.invalid || !this.installerDetail.Installer_Declairation) {
      return;
    }
    if(this.installerDetailsForm.valid) {
      this.updateProgressionStatus(status);
    if(this.isNewData === false) {
    this.installerDetail.Connection_Id=this.connectionId;
    this.installerService.submitSingleInstallerData(this.installerDetail).subscribe(res => {
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
    this.installerService.updateSingleInstallerData(this.installerDetail, this.connectionId).subscribe(res => {
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

/* Validation
**/

checkTitle(data: string) {
    
  if(data === '') {
    this.titleCheck=true;
  }
  else {
    this.titleCheck = this.utilService.validateTitle(data);
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
  if(type === 'qual') {
    if(data === '') {
      this.qualCheck=true; 
    }
    else {
      this.qualCheck = this.utilService.validateDegree(data);
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

checkPostcode(data: string) {
  if(data === '') {
    this.postCheck=true;
  }
  else {
    this.postCheck=this.utilService.validatePostCode(data);
  }
}

}
