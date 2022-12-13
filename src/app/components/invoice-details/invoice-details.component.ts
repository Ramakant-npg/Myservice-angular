import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { InvoiceDetailsService } from 'src/app/services/invoice-details.service';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';
import { UtilityHelper } from 'src/app/services/utility-helper';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {

  @ViewChild('invoiceDetailsForm') public invoiceDetailsForm:NgForm = <any>{};
  Customer_Name!: string;
  Company_Name!: string;
  Customer_Property_Name!: string;
  Customer_Address!: string;
  Customer_Town!: string;
  Customer_Country!: string;
  Customer_Postcode!: string;
  postCodePattern = /^(([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2}))$/g;
  formSubmitted: boolean=false;
  connectionId: number;
  isNewData: boolean = false;

  // dummyContactDetails = {
  //   "custFirstName": "Ahmed",
  //   "custSurName": "Raja",
  //   "custCompanyName": "TCS",
  //   "siteAddr1": "Flat No 6",
  //   "siteAddr2": "Torrent Bajaj Services",
  //   "siteAddr3": "Kishore Ganj",
  //   "postCode": "BD7 1HR"
  // }

  dummyContactDetails:any;

  
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
  custNameCheck: boolean =true;
  compNameCheck: boolean =true;
  propertyCheck: boolean =true;
  address2Check: boolean=true;
  townCheck: boolean=true;
  countryCheck: boolean=true;
  postCheck: boolean = true;

  constructor( private router: Router, private invoiceService: InvoiceDetailsService,
                private sharedService: SharedService, private httpService: HttpService,
                private _snackBar: MatSnackBar,
                private utilService: UtilityHelper) { }

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

    this.sharedService.getCorrospondanceAddress().subscribe((data:any)=>{
      this.dummyContactDetails = data;
      this.Customer_Name=this.dummyContactDetails.custFirstName + ' '+ this.dummyContactDetails.custSurName;
      this.Company_Name=this.dummyContactDetails.custCompanyName;
      this.Customer_Property_Name=this.dummyContactDetails.Site_Name;
      this.Customer_Address=this.dummyContactDetails.Site_Street;
      this.Customer_Town=this.dummyContactDetails.Site_City;
      this.Customer_Postcode=this.dummyContactDetails.Site_Postcode;
       console.log(data);
       
     })

    this.invoiceService.getInvoiceDetails(this.connectionId).subscribe(res => {
      if(res) {
      this.isNewData=true;
      this.Customer_Name= res.Customer_Name;
      this.Company_Name =   res.Company_Name;
      this.Customer_Property_Name = res.Customer_Property_Name;
      this.Customer_Address = res.Customer_Address;
      this.Customer_Town =   res.Customer_Town;
      this.Customer_Country = res.Customer_Country;
      this.Customer_Postcode= res.Customer_Postcode;
      }
    })
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
  
  onSave(type:string, status:string) {
    this.formSubmitted=true;
    if(this.invoiceDetailsForm.invalid){
      return ;
    }
    if(this.invoiceDetailsForm.valid) {
      let data = {
        Connection_Id:  this.connectionId, //(Connection ID (For each new connection)),
        Customer_Name: this.Customer_Name,
        Company_Name: this.Company_Name,
        Customer_Property_Name: this.Customer_Property_Name,
        Customer_Address: this.Customer_Address,
        Customer_Town: this.Customer_Town,
        Customer_Country: this.Customer_Country,
        Customer_Postcode: this.Customer_Postcode
      }

      this.updateProgressionStatus(status);
      if(this.isNewData === false) {
      
      this.invoiceService.submitInvoiceDetails(data).subscribe(res => {
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
      this.invoiceService.updateInvoiceDetails(data, this.connectionId).subscribe(res => {
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
    if((this.templateList.length-1) > this.navIndex){
      this.nextUrl = "/"+this.templateList[this.navIndex+1].Name;
    }else{
      this.nextUrl = "/" + this.templateList[this.navIndex].Name;
    }
    if(type === 'isSubmit' && status === 'InProgress'){
      this.router.navigate([this.nextUrl], {
      queryParams:{
        type: ConnectionTypeConfig.connection_type
      }
     })
    } else if(type === 'saveForLater' || status === 'Submitted') {
       this.router.navigateByUrl('/home');
    }
     
    }
  }

  populateDetails(){
    // this.Customer_Name=this.dummyContactDetails.custFirstName + ' '+ this.dummyContactDetails.custSurName;
    // this.Company_Name=this.dummyContactDetails.custCompanyName;
    // this.Customer_Property_Name=this.dummyContactDetails.siteAddr1;
    // this.Customer_Address=this.dummyContactDetails.siteAddr2;
    // this.Customer_Town=this.dummyContactDetails.siteAddr3;
    // this.Customer_Postcode=this.dummyContactDetails.postCode;
    this.Customer_Name=this.dummyContactDetails.custFirstName + ' '+ this.dummyContactDetails.custSurName;
    this.Company_Name=this.dummyContactDetails.custCompanyName;
    this.Customer_Property_Name=this.dummyContactDetails.Site_Name;
    this.Customer_Address=this.dummyContactDetails.Site_Street;
    this.Customer_Town=this.dummyContactDetails.Site_City;
    this.Customer_Postcode=this.dummyContactDetails.Site_Postcode;
    this.checkName(String(this.Customer_Name), 'name');
    this.checkAddress(String(this.Customer_Property_Name), 'property');
    this.checkAddress(String(this.Customer_Address), 'address2');
    this.checkAddress(String(this.Customer_Town), 'town');
    this.checkPostCode(String(this.Customer_Postcode));
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


checkName(data: string, type: string) {
  if(type === 'name') {
    if(data === '') {
      this.custNameCheck = true;
    }
    else {
      this.custNameCheck = this.utilService.validateName(data);
    }
  }

  if(type === 'comp') {
    if(data === '') {
      this.compNameCheck=true;
    }
    else {
      this.compNameCheck=this.utilService.validateDegree(data);
    }
  }
}

checkAddress(data: string, type: string) {
  if(type === 'property') {
    if(data === '') {
      this.propertyCheck=true; 
    }
    else {
      this.propertyCheck = this.utilService.validateAddress(data);
    }
    
  }
  if(type === 'address2') {
    if(data === '') {
      this.address2Check=true; 
    }
    else {
      this.address2Check = this.utilService.validateAddress(data);
    }
    
  }
  if(type === 'town') {
    if(data === '') {
      this.townCheck=true; 
    }
    else {
      this.townCheck=this.utilService.validateonlyAlphabet(data);
    }
    
  }
  if(type === 'country') {
    if(data === '') {
      this.countryCheck=true; 
    }
    else {
      this.countryCheck=this.utilService.validateonlyAlphabet(data);
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
