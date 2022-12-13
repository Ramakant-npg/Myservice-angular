import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/shared.service';
import { SiteContactDetailsService } from 'src/app/services/site-contact-details.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';
import { UtilityHelper } from 'src/app/services/utility-helper';

@Component({
  selector: 'app-site-contact-details',
  templateUrl: './site-contact-details.component.html',
  styleUrls: ['./site-contact-details.component.scss']
})
export class SiteContactDetailsComponent implements OnInit {
  @ViewChild('siteContactForm') public siteContactForm:NgForm = <any>{};
  @ViewChild('siteAddressForm') public siteAddressForm:NgForm = <any>{};
  public siteContactDetail:any = {};
  public siteAddressDetail:any = {};
  public formSubmitted:boolean = false;
  public postCodePattern = /^(([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2}))$/g;
  public mobilePattern = new RegExp('[0-9]');
  public emailPattern = new RegExp("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}");
  Customer_Reference: string;
  connectionId: number;
  isNewData: boolean = false;

  // public correspondAddress = {
  //   Site_Name: 'B204',
  //   Site_Street: 'Karad',
  //   Site_City: 'Karad',
  //   Site_Postcode: 'ne27 0lp'
  // }

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
  siteCheck: boolean =true;
  streetCheck: boolean =true;
  cityCheck: boolean =true;
  projectCheck: boolean=true;
  alphaCompanyName: boolean=true;
  postCheck: boolean =true;
  correspondAddress:any;
  
  constructor(  private httpService: HttpService, private router: Router, private siteContactService: SiteContactDetailsService,
              private sharedService: SharedService,
              private _snackBar: MatSnackBar, private utilService: UtilityHelper) { }

  ngOnInit(): void {

  // get the current url from service
  this.currentUrlSub = this.sharedService.getCurrentUrl().subscribe((data)=>{
    this.currentUrl =  data.split('?')[0].split('/')[1];
    })

    // //get the list of template and index of current url from template list
    this.templateListSub = this.sharedService.getTemplateList().subscribe((data)=>{
      this.templateList = data;
      this.navIndex = data?.findIndex((item:any) => item.Name === this.currentUrl);

    });
    this.sharedService.getCorrospondanceAddress().subscribe((data:any)=>{
      this.correspondAddress = data;
       console.log(data);
     })
    
    this.sharedService.setCurrentNav(this.router.url);
    this.sharedService.getConnectionId().subscribe(data => {
      this.connectionId=data;
    });

    
    this.sharedService.getConnectionId().subscribe(data => {
      this.connectionId=data;
    });

    this.connectionIdSub = this.sharedService.getConnectionsTypeId().subscribe((id)=>{
      this.connectionTypeId = id;
      this.getProgressionStatus(this.connectionTypeId);
    }) 

    this.siteContactService.getSiteInformation(this.connectionId).subscribe(res => {
      if(res) {
        this.isNewData=true;
        console.log("Res"+ JSON.stringify(res));
        this.Customer_Reference=res.Customer_Reference;
        this.siteContactDetail.title=res.Customer_Title;
        this.siteContactDetail.firstName=res.Customer_Firstname;
        this.siteContactDetail.surname=res.Customer_Surname;
        this.siteContactDetail.Company_Name=res.Company_Name;
        this.siteContactDetail.telephone=res.Customer_Telephone;
        this.siteContactDetail.mobile=res.Customer_Mobile;
        this.siteContactDetail.Email=res.Customer_Email;
        this.siteAddressDetail.Site_Name=res.Site_Name;
        this.siteAddressDetail.Site_Street=res.Site_Street;
        this.siteAddressDetail.Site_City=res.Site_City;
        this.siteAddressDetail.Site_Postcode=res.Site_Postcode;
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
  
  public correspondAddressClick() {
    // this.siteContactDetail = JSON.parse(JSON.stringify(this.correspondAddress));
    this.siteAddressDetail = JSON.parse(JSON.stringify(this.correspondAddress));
    this.checkAddress(String(this.siteAddressDetail.Site_Name), 'site');
    this.checkAddress(String(this.siteAddressDetail.Site_Street), 'street');
    this.checkAlphabet(String(this.siteAddressDetail.Site_City), 'city');
    this.checkPostCode(String(this.siteAddressDetail.Site_Postcode));

  }

  public onSave(type:string, status:string){
    this.formSubmitted = true;
    if(this.siteAddressForm.invalid || this.siteContactForm.invalid) {
      return;
    }

    if(this.siteAddressForm.valid || this.siteContactForm.valid) {
      this.updateProgressionStatus(status);
      if(this.isNewData === false) {
        let siteContactDetails = {
          Connection_Id: this.connectionId,
          Customer_Reference: this.Customer_Reference,
          Customer_Title: this.siteContactForm.controls['title'].value,
          Customer_Firstname: this.siteContactForm.controls['FirstName'].value,
          Customer_Surname: this.siteContactForm.controls['Surname'].value,
          Company_Name: this.siteContactForm.controls['companyName'].value,
          Customer_Telephone: this.siteContactForm.controls['Telephone'].value,
          Customer_Mobile: this.siteContactForm.controls['Mobile'].value,
          Customer_Email: this.siteContactForm.controls['email'].value,
          Site_Name: this.siteAddressForm.controls['siteName'].value,
          Site_Street: this.siteAddressForm.controls['SiteStreet'].value,
          Site_City: this.siteAddressForm.controls['City'].value,
          Site_Postcode: this.siteAddressForm.controls['Postcode'].value
        }
        this.siteContactService.saveSiteContactDetails(siteContactDetails).subscribe(res => {
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
        let siteContactDetails = {
          // Connection_Id: this.connectionId,
          Customer_Reference: this.Customer_Reference,
          Customer_Title: this.siteContactForm.controls['title'].value,
          Customer_Firstname: this.siteContactForm.controls['FirstName'].value,
          Customer_Surname: this.siteContactForm.controls['Surname'].value,
          Company_Name: this.siteContactForm.controls['companyName'].value,
          Customer_Telephone: this.siteContactForm.controls['Telephone'].value,
          Customer_Mobile: this.siteContactForm.controls['Mobile'].value,
          Customer_Email: this.siteContactForm.controls['email'].value,
          Site_Name: this.siteAddressForm.controls['siteName'].value,
          Site_Street: this.siteAddressForm.controls['SiteStreet'].value,
          Site_City: this.siteAddressForm.controls['City'].value,
          Site_Postcode: this.siteAddressForm.controls['Postcode'].value
        }
        this.siteContactService.updateSiteInformation(siteContactDetails, this.connectionId).subscribe(res => {
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
    this.formSubmitted = false;
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

/** Validation */

checkName(data: string, type: string) {
  if(type === 'project') {
    if(data  === '') {
      this.projectCheck=true;
    }
    else {
      this.projectCheck=this.utilService.validateDegree(data);
    }
  }
}
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

  if(type  === 'comp') {
    if(data === '') {
      this.alphaCompanyName=true;
    }
    else {
      this.alphaCompanyName=this.utilService.validateDegree(data);
    }
  }
  
}

checkPostCode(data: string) {
  if(data === '') {
    this.postCheck=true;
  }
  else {
    this.postCheck=this.utilService.validatePostCode(data);
  }
}

}
