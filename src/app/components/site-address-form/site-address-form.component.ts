import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { SiteAddressFormService } from 'src/app/services/site-address-form.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http-service.service';
import { UtilityHelper } from 'src/app/services/utility-helper';

@Component({
  selector: 'site-address-form',
  templateUrl: './site-address-form.component.html',
  styleUrls: ['./site-address-form.component.scss']
})
export class SiteAddressFormComponent implements OnInit {
  @ViewChild('siteAddressForm') public siteAddressForm: NgForm = <any>{};
  @ViewChild('ownerInfoForm') public ownerInfoForm: NgForm = <any>{};
  @Output() public jumptonext = new EventEmitter<any>();
  public postcode:string = '';
  public companyName: string = '';
  public title:string = '';
  public firstName:string = '';
  public surname: string = '';
  public propertyName:string = '';
  public addressLine2:string = '';
  public addressLine3:string = '';
  public addressLine4:string = '';
  public showOwnerInfoForm:boolean = false;
  public selectedAnswers:any = [];
  public siteAdressFormData: any = {};
  public showQuestionsError: boolean = false;
  public questionsList:any = [];
  public formSubmitted:boolean = false;
  public postCodePattern = /^(([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2}))$/g;
  // public correspondAddress = {
  //   Site_Name: 'B204',
  //   Site_Street: 'Karad',
  //   Site_City: 'Karad',
  //   Site_Postcode: 'ne27 0lp'
  // }
  correspondAddress:any;
  public Customer_Reference: string = '';

  public siteAddresQuesList = [{
    id: 1,
    question: "Are you the current owner/occupier of the premises?",
    trueAnswer: 'Yes',
    falseAnswer: 'No',
    trueDescription: "We reserve the right to request a copy of your land registry documentation at any point in the process if we deem it necessary.",
    falseDescription: "",
    nextquestion: 2,
    showQuestion: true,
    selectedAnswer: ''
  }, {
    id: 2,
    question: "If you answered 'No' to the previous question, are you applying as an agent on behalf of the current owner/occupier of the premises?",
    trueAnswer: 'Yes',
    falseAnswer: 'No',
    trueDescription: "If you are acting as an agent of the owner/occupier of the premises, we reserve the right, at any point in the process, to request a copy of the letter of authority confirming you have the right to represent the owner/occupier and a copy of the land registry documentation, if we deem it necessary. If you have a copy of this letter and or/a copy of the land registry documentation available, please include it with this application to avoid delaying your application.",
    falseDescription: "",
    nextquestion: 3,
    showQuestion: false,
    selectedAnswer: ''
  }, {
    id: 3,
    question: "If you answered 'No' to the previous question, are you applying for the connection as a future owner/occupier of the premises?",
    trueAnswer: 'Yes',
    falseAnswer: 'No',
    trueDescription: "We reserve the right to request a copy of your land registry documentation in line with the terms of the quotation we will provide",
    falseDescription: "",
    nextquestion: 4,
    showQuestion: false,
    selectedAnswer: ''
  }, {
    id: 4,
    question: "If you answered 'No' to the previous question, are you applying for the connection as an agent on behalf of a future owner/occupier of the premises?",
    trueAnswer: 'Yes',
    falseAnswer: 'No',
    trueDescription: "We reserve the right to request a copy of your land registry documentation at any point in the process if we deem it necessary.",
    falseDescription: "If you have selected No to this and previous questions, a member of our Connections team will contact you following receipt of your application to discuss further.",
    nextquestion: 5,
    showQuestion: false,
    selectedAnswer: ''
  }];

  ownerPostcodeError = false;
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
  connectionIdSub:Subscription;
  projectCheck: boolean = true;
  siteCheck: boolean =true;
  streetCheck: boolean = true;
  cityCheck: boolean = true;
  ownerFullComCheck: boolean = true;
  ownerTitleCheck: boolean = true;
  ownerFirstnameCheck: boolean = true;
  ownerSurnnameCheck: boolean =true;
  ownerProperyCheck: boolean =true;
  ownerAddress2Check: boolean =true;
  ownerAddress3Check: boolean =true;
  ownerAddress4Check: boolean =true;
  ownerWPostCode: boolean=true;

  constructor(private router: Router,  private httpService: HttpService, 
    public siteAddressService: SiteAddressFormService, private sharedService: SharedService,
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
    

    this.sharedService.getCorrospondanceAddress().subscribe((data:any)=>{
      this.correspondAddress = data;
       console.log(data);
     })

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

    //getSiteAddressDetail
    this.getSiteAddressDetails();
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
  
  getSiteAddressDetails():void {

      
      this.siteAddressService.getSiteAddessDetailsByConnId(this.connectionId).subscribe(res => {
      
      if(res) {
        console.log('your site add '+ JSON.stringify(res));
        this.isNewData=true;
        this.Customer_Reference=res[0].Customer_Reference;
        if(res[0].Are_You_Current_Owner === 0) {
          this.siteAddresQuesList[0].selectedAnswer='No';
          // this.siteAddresQuesList[1].showQuestion=true;
          // this.showOwnerInfoForm=false;
          this.onNoBtnClick('No', this.siteAddresQuesList[0]);
        }
        if(res[0].Are_You_Current_Owner === 1) {
          this.siteAddresQuesList[0].selectedAnswer='Yes';
          this.showOwnerInfoForm=true;
          this.onYesBtnClick('Yes', this.siteAddresQuesList[0]);
        }
        if(res[0].Applying_As_Agent === 0) {
          this.siteAddresQuesList[1].selectedAnswer='No';
          // this.siteAddresQuesList[2].showQuestion=true;
          // this.showOwnerInfoForm=false;
          this.onNoBtnClick('No', this.siteAddresQuesList[1]);
        }
        if(res[0].Applying_As_Agent === 1) {
          this.siteAddresQuesList[1].selectedAnswer='Yes';
          // this.showOwnerInfoForm=true;
          this.onYesBtnClick('Yes', this.siteAddresQuesList[1]);
        }
        if(res[0].Future_Owner === 0) {
          this.siteAddresQuesList[2].selectedAnswer='No';
          // this.siteAddresQuesList[3].showQuestion=true;
          // this.showOwnerInfoForm=false;
          this.onNoBtnClick('No', this.siteAddresQuesList[2]);
        }
        if(res[0].Future_Owner === 1) {
          this.siteAddresQuesList[2].selectedAnswer='Yes';
          // this.showOwnerInfoForm=true;
          this.onYesBtnClick('Yes', this.siteAddresQuesList[2]);
        }
        if(res[0].Agent_Of_Future_Owner === 0) {
          this.siteAddresQuesList[3].selectedAnswer='No';
          // this.siteAddresQuesList[4].showQuestion=true;
          // this.showOwnerInfoForm=false;
          this.onNoBtnClick('No', this.siteAddresQuesList[3]);
        }
        if(res[0].Agent_Of_Future_Owner === 1) {
          this.siteAddresQuesList[3].selectedAnswer='Yes';
          // this.showOwnerInfoForm=true;
          this.onYesBtnClick('Yes', this.siteAddresQuesList[3]);
        }
        this.companyName = res[0].Owner_Full_Company_Name;
        this.title =res[0].Owner_Title;
        this.firstName=res[0].Owner_First_Name;
        this.surname=res[0].Owner_Surname;
        this.propertyName=res[0].Owner_PropertyName;
        this.addressLine2=res[0].Owner_Address_Line2;
        this.addressLine3=res[0].Owner_Address_Line3;
        this.addressLine4=res[0].Owner_Address_Line4;
        this.postcode=res[0].Owner_Postcode;
        this.siteAdressFormData.Site_Name=res[0].Site_Name;
        this.siteAdressFormData.Site_Street =res[0].Site_Street;
        this.siteAdressFormData.Site_City=res[0].Site_City;
        this.siteAdressFormData.Site_Postcode =res[0].Site_Postcode;
        }
      }), 
      () => {
        this._snackBar.open("Bad Request", "OK", {
          duration: 3000
      });
      }

  }

  public onYesBtnClick(event: any, question:any) {
    console.log(question);
    this.showOwnerInfoForm = true;
    this.siteAddresQuesList.map(i => {
      if(question.id === i.id) {
        i.selectedAnswer = event;
      }
      if(question.nextquestion === i.id) {
        for(let i=question.nextquestion; i<=4; i++){
          this.siteAddresQuesList[i-1].showQuestion = false;
          this.siteAddresQuesList[i-1].selectedAnswer = '';
        }
      }
    })
    this.uniqueAnswer(event, question)
  }

  public onNoBtnClick(event: any, question:any) {
    this.showOwnerInfoForm = false;
    this.siteAddresQuesList.map(i => {
      if(question.id === i.id) {
        i.selectedAnswer = event;
      }
      if(question.nextquestion === i.id) {
        i.showQuestion = true;
      }
    })
    this.uniqueAnswer(event, question)
  }

  uniqueAnswer(eventValue:any, question:any) {
    let isAlreadyAnswered = false;
    let isRemoveOlderAnswer = false;

    this.selectedAnswers.map((i:any) => {
      if(i.questionId === question.id) {
        if(i.answer === eventValue) {
          isAlreadyAnswered = true;
        }else {
          isRemoveOlderAnswer = true;
        }
      }
    });

    let removableAnswerIndex = -1;
    if(isRemoveOlderAnswer) {
      this.selectedAnswers.map((i:any, index:any) => {
        if(i.questionId === question.id) {
          removableAnswerIndex = index;
        }
      });
    }

    if(removableAnswerIndex > -1) {
      this.selectedAnswers.splice(removableAnswerIndex)
    }
    if(!isAlreadyAnswered && question) {
      this.selectedAnswers.push({
        questionId: question.id,
        answer: eventValue
      });
    }
  }

  public correspondAddressClick() {
    this.siteAdressFormData = JSON.parse(JSON.stringify(this.correspondAddress));
    this.checkAddress(String(this.siteAdressFormData.Site_Name), 'site');
    this.checkAddress(String(this.siteAdressFormData.Site_Street), 'street');
    this.checkCity(String(this.siteAdressFormData.Site_City), 'city');

  }

  public onSave(type:string, status:string) {
    this.formSubmitted = true;
    this.siteAddresQuesList.forEach(i => {
        if(i.selectedAnswer === 'Yes' || i.selectedAnswer === 'No') {
          this.questionsList = [];
        }
        if(this.showOwnerInfoForm) {
          this.questionsList = [];
        }
        if(!this.showOwnerInfoForm && i.selectedAnswer === ''){
          this.questionsList.push(i.question)
          this.showQuestionsError = true;
        }
    });

    var regex = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;
    let result = regex.test(this.postcode);
    if(!result && this.postcode) {
      this.ownerPostcodeError = true;
    }else {
      this.ownerPostcodeError = false;
    }

    if(this.siteAddressForm.invalid || this.questionsList.length > 1
      || (this.showOwnerInfoForm && this.ownerInfoForm.invalid)
      || this.ownerPostcodeError) {
      return;
    }
    
    this.formSubmitted = false;
    this.questionsList = [];
    const siteAddressData:any = {
      Connection_Id: this.connectionId,
      Customer_Reference: this.Customer_Reference,
      Are_You_Current_Owner: null,
      Applying_As_Agent: null,
      Future_Owner: null,
      Agent_Of_Future_Owner: null,
      Owner_Full_Company_Name: this.companyName,
      Owner_Title: this.title,
      Owner_First_Name: this.firstName,
      Owner_Surname: this.surname,
      Owner_PropertyName: this.propertyName,
      Owner_Address_Line2: this.addressLine2,
      Owner_Address_Line3: this.addressLine3,
      Owner_Address_Line4: this.addressLine4,
      Owner_Postcode: this.postcode,
      Site_Name: this.siteAdressFormData.Site_Name,
      Site_Street: this.siteAdressFormData.Site_Street,
      Site_City: this.siteAdressFormData.Site_City,
      Site_Postcode: this.siteAdressFormData.Site_Postcode
    }

    console.log('p', this.selectedAnswers);

    this.selectedAnswers.forEach((i:any) => {
      // console.log(i);
      if(i.questionId === 1) {
        siteAddressData.Are_You_Current_Owner = (i.answer === "") ? null : (i.answer === 'Yes') ? true : false;
      }
      if(i.questionId === 2) {
        siteAddressData.Applying_As_Agent = (i.answer) ? ((i.answer === 'Yes') ? true : false) : null ;
      }
      if(i.questionId === 3) {
        siteAddressData.Future_Owner = (i.answer === "") ? null : (i.answer === 'Yes') ? true : false;
      }
      if(i.questionId === 4) {
        siteAddressData.Agent_Of_Future_Owner = (i.answer === "") ? null : (i.answer === 'Yes') ? true : false;
      }
    })
    this.updateProgressionStatus(status);
    // siteAddressData.Are_You_Current_Owner = this.selectedAnswers[0].answer;
    // siteAddressData.Applying_As_Agent = this.selectedAnswers[1].answer && this.selectedAnswers[1].questionId === 3 ?
    //                                     this.selectedAnswers[1].answer : null;
    // siteAddressData.Future_Owner = this.selectedAnswers[2].answer && this.selectedAnswers[2].questionId === 2 ?
    //                                this.selectedAnswers[2].answer : null;
    // siteAddressData.Agent_Of_Future_Owner = this.selectedAnswers[3].answer && this.selectedAnswers[3].questionId === 4 ? 
    //                             this.selectedAnswers[3].answer : null;
 // set the form information into shared service- Lata // just for testng , need to remove
//  var formInfo = {'name':'Your_Site_Address', isValid: (!this.siteAddressForm.invalid && !this.ownerInfoForm.invalid)};
//  this.sharedService.setFormInfo(formInfo);
 // set the form information into shared service- Lata
    if(this.isNewData === false) {
    this.siteAddressService.submitSiteAddessData(siteAddressData).subscribe(res => {
      // set the form information into shared service- Lata
      // var formInfo = {'name':'Your_Site_Address', isValid: (!this.siteAddressForm.invalid && !this.ownerInfoForm.invalid)};
      // this.sharedService.setFormInfo(formInfo);
      // set the form information into shared service- Lata
      this.jumptonext.emit(null);
      // console.log(res);
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
      }
     
    );
    }
    else {
      

      this.siteAddressService.updateSiteAddessData(siteAddressData,this.connectionId).subscribe(res => {
        // set the form information into shared service- Lata
        // var formInfo = {'name':'Your_Site_Address', isValid: (!this.siteAddressForm.invalid && !this.ownerInfoForm.invalid)};
        // this.sharedService.setFormInfo(formInfo);
        // set the form information into shared service- Lata
        this.jumptonext.emit(null);
        // console.log(res);
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
        }
       
      );
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

checkName(data: string, type: string) {
  if(type === 'project') {
    if(data === '') {
      this.projectCheck=true;
    }
    else {
      this.projectCheck=this.utilService.validateName(data);
    }
  }

  if(type === 'fullComName') {
    if(data === '') {
      this.ownerFullComCheck=true;
    }
    else {
      this.ownerFullComCheck=this.utilService.validateDegree(data);
    }
  }

  if(type === 'title') {
    if(data === '') {
      this.ownerTitleCheck=true;
    }
    else {
      this.ownerTitleCheck=this.utilService.validateTitle(data);
    }
  }

  if(type === 'fName') {
    if(data === '') {
      this.ownerFirstnameCheck=true;
    }
    else {
      this.ownerFirstnameCheck=this.utilService.validateName(data);
    }
  }

  if(type === 'lName') {
    if(data === '') {
      this.ownerSurnnameCheck=true;
    }
    else {
      this.ownerSurnnameCheck=this.utilService.validateName(data);
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

  if(type  === 'property') {
    if(data === '') {
      this.ownerProperyCheck=true; 
    }
    else {
      this.ownerProperyCheck=this.utilService.validateAddress(data);
    }
  }
  if(type  === 'addLine2') {
    if(data === '') {
      this.ownerAddress2Check=true; 
    }
    else {
      this.ownerAddress2Check=this.utilService.validateAddress(data);
    }
  }
  if(type  === 'addLine3') {
    if(data === '') {
      this.ownerAddress3Check=true; 
    }
    else {
      this.ownerAddress3Check=this.utilService.validateAddress(data);
    }
  }
  if(type  === 'addLine4') {
    if(data === '') {
      this.ownerAddress4Check=true; 
    }
    else {
      this.ownerAddress4Check=this.utilService.validateAddress(data);
    }
  }
  if(type  === 'ownerPost') {
    if(data === '') {
      this.ownerWPostCode=true; 
    }
    else {
      this.ownerWPostCode = this.utilService.validateEmail(data);
    }
  }
}

checkCity(data: string, type: string) {
  if(type === 'city') {
    if(data === '') {
      this.cityCheck=true; 
    }
    else {
      this.cityCheck=this.utilService.validateonlyAlphabet(data);
    }
    
  }
}


}
