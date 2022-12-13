import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { trigger, transition, animate, style } from '@angular/animations';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'
import { PremisesDetailsService } from 'src/app/services/premises-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';
import { UtilityHelper } from 'src/app/services/utility-helper';

@Component({
  selector: 'multiple-premises-details',
  templateUrl: './multiple-premises-details.component.html',
  styleUrls: ['./multiple-premises-details.component.scss'],
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
export class MultiplePremisesDetailsComponent implements OnInit {
  premisesForm: FormGroup = <any>{};
  @Input() formControl: FormControl = <any>{};
  public Premises:number = 0;
  public formSubmitted: boolean = false;
  public premisesData:any = {};
  public showinvalidPostcodeError:boolean = false;
  public proposedIntYearList =[{
    year: '2022'
  }, {
    year: '2023'
  }, {
    year: '2024'
  }, {
    year: '2025'
  }];

  public proposedIntQtrList =[{
    qtr: 'Q1'
  }, {
    qtr: 'Q2'
  }, {
    qtr: 'Q3'
  }, {
    qtr: 'Q4'
  }];

  mpanInfo: boolean=false;
  premisesDataList:any = [];
  showMpanError:boolean = false;
  showMpanCharLimitError:boolean = false;
  showPremisesError:boolean = false;
  connectionId: number;
  isNewData: boolean = false;

  navIndex: any;
  nextUrl:any
  currentUrl: any;
  templateList: any;
  progressionStatusId: any;
  connectionTypeId:any;
  progress_status_payload:any;
  templateListSub: Subscription;
  currentUrlSub:Subscription;
  progressionSub:Subscription;
  connectionIdSub:Subscription;

  titleCheck: boolean = true;
  alphaCheckFirst: boolean = true;
  alphaCheckLast: boolean = true;
  qualCheck: boolean =true;
  siteCheck: boolean =true;
  streetCheck: boolean =true;
  cityCheck: boolean =true;
  postCheck: boolean =true;
   public postCodePattern = /^(([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2}))$/g;
  public mobilePattern = new RegExp(/[0-9]/);
  public emailPattern = new RegExp("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}");

  constructor(private router: Router,private fb:FormBuilder,
              private premisesService: PremisesDetailsService,
              private sharedService: SharedService,
              private _snackBar: MatSnackBar,private utilService: UtilityHelper,
              private httpService: HttpService) {
    this.premisesForm = this.fb.group({
      premisesDetails: this.fb.array([]) ,
    });

    this.progress_status_payload = {
      "Connection_Type": null,
      "Completed_Date": null,
      "Submitted_Date": null,
      "Connection_Date":null,
      "Paused_Date": null,
      "Resume_Date": null,
      "Guaranteed_Standard": null, 
      "Guaranteed_Standard_Days": null,  
      "Guaranteed_Standard_Target_Date":null ,  
      "Standard_Start_Date": null,  
      "Created_Date": null, 
      "Customer_Id": null, 
      "Job_Type": null,
      "Modified_Date": null,
      "Reference": null,
      "Created_By":null,
      "Anticipate_Completing_Date": null, 
      "Requote_Requested_Date": null, 
      "Update_By": null,
      "Progression": null, 
      "Status": null 
    }
  }

  ngOnInit(): void {
    this.sharedService.setCurrentNav(this.router.url);
    
  // get the current url from service
  this.currentUrlSub = this.sharedService.getCurrentUrl().subscribe((data)=>{
    this.currentUrl =  data.split('?')[0].split('/')[1];
    })

    //get the list of template and index of current url from template list
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
  


    this.premisesService.getMultiplePremisesData(this.connectionId).subscribe(res => {
      if(res) {
        // console.log(JSON.stringify(res));
        this.isNewData=true;
        this.Premises=res[0].Premises;
        if(res.length > 0) {
          res.forEach((value: any) => {
            (this.premisesForm.get("premisesDetails") as FormArray).push(this.newQuantity());
          });
      }
      this.premisesForm.patchValue({
        premisesDetails: res
      });
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
  
  get premisesDetails() : FormArray {
    return this.premisesForm.get("premisesDetails") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      Id:null,
      Type: ['', Validators.required],
      mpan: ['', Validators.maxLength(13)],
      Site_Name: ['', Validators.required], 
      Site_City: ['', Validators.required],
      Registred_Capacity: ['', Validators.required],
      No_Of_Phases: ['', Validators.required],
      Installation_Year: ['--Please Choose--', Validators.required],
      Installation_Qtr: ['--Please Choose--', Validators.required],
      Site_Street: ['', Validators.required],
      Site_Postcode: ['', Validators.required],
      Ref_Number: ['', Validators.required],
      Inverter_Rating: ''
    })
  }

  public decreasedValue() {
    this.Premises = this.Premises > 0 ? this.Premises = this.Premises -1 : this.Premises;
    let deleteId = this.premisesDetails.at(this.Premises).value.Id;
    console.log(deleteId , 'multiple permises id');
    this.deleteById(deleteId);
    this.premisesDetails.removeAt(this.Premises); 
  }

  public increasedValue() {
    this.Premises = this.Premises + 1; 
    this.premisesDetails.push(this.newQuantity());
  }

  copyForm(i:number) {
    let premisesLength = this.premisesDetails.length;
    if(premisesLength >= 1) {     
      if(this.premisesDetails.value[i].Id != null) {
        let details = JSON.parse(JSON.stringify(this.premisesDetails.value[i-1]));
        let id=this.premisesDetails.value[i].Id;
        details.Id=id;
        this.premisesDetails.at(i).patchValue(details);
      }
      else {
        let details = JSON.parse(JSON.stringify(this.premisesDetails.value[i-1]));
        details.Id=null;
        this.premisesDetails.at(i).patchValue(details);
      }
    }
  }

  public onSave(type:string, status:string) {
    this.formSubmitted = true;
    if (this.Premises === 0) {
      this.showPremisesError = true;
    }else{
      this.showPremisesError = false;
    }
    var regex = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;
    let result:any;
    this.premisesDetails.value.forEach((i: any) => {
      i.Connection_Id= this.connectionId;
      i.Premises = this.Premises;
      result = regex.test( i.Site_Postcode);
      if(!result && i.Site_Postcode) {
        this.showinvalidPostcodeError = true;
      }else {
        this.showinvalidPostcodeError = false;
      }
      if(i.mpan){
        if(i.mpan.toString().length !== 13) {
          this.showMpanCharLimitError = true;
        }else{this.showMpanCharLimitError = false;}
        var checkNum= String(i.mpan);
        if(checkNum.startsWith("15") || checkNum.startsWith("23")) {
          this.showMpanError=false;
        }else {
          this.showMpanError=true;
  
        }
      }
    })
    // this.premisesForm.get('Id').updateValueAndValidity();
    
    if(this.premisesForm.invalid || this.showinvalidPostcodeError || this.showMpanError || this.showMpanCharLimitError) {
      console.log(this.premisesForm.invalid + " "+ this.showPremisesError);
      console.log(this.premisesForm );
      console.log(this.showMpanCharLimitError + " "+ this.showinvalidPostcodeError + " " + this.showMpanError);
      return;
    }
    this.formSubmitted = false;
    this.updateProgressionStatus(status);
    if(this.isNewData === false) {
      if(this.Premises != 0) {
    this.premisesService.submitMultiplePremisesData(this.premisesDetails.value).subscribe(res => {
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
  }
  else {
    this.premisesService.updateMultiplePremisesData(this.premisesDetails.value, this.connectionId).subscribe(
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


/**
 * Delete last multiples permises by click on left arrow icon 
 * @param id
 */
 deleteById(id:number){
  this.premisesService.deleteMultiplePermisesById(id).subscribe(
    res => {
      if(res?.message) {
        this._snackBar.open("Data Deleted Successfully", "OK", { duration: 3000 });
      }
    }),() => {
      this._snackBar.open("Bad Request", "OK", {
        duration: 3000
    });
  }
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
    this.postCheck = true;
  }
  else{
    this.postCheck=this.utilService.validatePostCode(data);
  }
}

}
