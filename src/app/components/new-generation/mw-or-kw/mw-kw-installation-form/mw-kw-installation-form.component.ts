import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, Input, SimpleChanges } from '@angular/core';
import { FormBuilder,FormArray,FormGroup, Validators, Form, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewGenerationService } from 'src/app/services/new-generation.service';
import { HttpService } from '../../../../services/http-service.service'
import { SharedService } from 'src/app/services/shared.service';;

@Component({
  selector: 'app-mw-kw-installation-form',
  templateUrl: './mw-kw-installation-form.component.html',
  styleUrls: ['./mw-kw-installation-form.component.scss']
})
export class MwKwInstallationFormComponent implements OnInit {
 
selectedBsNumber:any;
isShowGroundSourceForm:Boolean = false;
installationCount:number= 0 ;
inverterCount:number= 0 ;
file:any;
isValidFileType: boolean = true;
allowFileType: string [] = ["doc","docx","pdf","jpg","jpeg","png", "gif"];
loading: boolean = false;
isAllGenSameSize: boolean = true;
isAllInvSameSize: string = 'no';
inverterFormName:any;
formSubmitted: boolean =false;
fileNameOnSiteOperation:File;
fileNamePowerGenModule: File;
fileBasedId:any;
connectionId: any;

Operational_Diagrams_File:any;
Power_Generating_File:any;


@Input() installationFormName!:any ;
@Input() validatedForm: boolean;
@Output() installationFormData: EventEmitter<any> = new EventEmitter();
@Output() inverterFormData: EventEmitter<any> = new EventEmitter();
@Output() enableOtherFormsOnValid: EventEmitter<any> = new EventEmitter();
@Input() parentToChildFormData:any;

constructor(private sharedService: SharedService, private fb: FormBuilder, private httpService: HttpService,  private _snackBar: MatSnackBar, private newGenService: NewGenerationService) { }

ngOnInit(): void {
  this.sharedService.getConnectionId().subscribe(data => {
    this.connectionId = data;
  });
  let nameOfForm =  this.installationFormName;
  if(this.parentToChildFormData && this.parentToChildFormData[0][this.installationFormName]) {
    this.updateFormValueOnLoad(nameOfForm);
    this.validateForm();
  } else {
    //Create installation souce form
  this.installationFormName=  this.fb.group({
    No_Generator_Sets: this.installationCount,
    Generator_Size: true,
    Peak_Asymmetrical: [null],
    RMS_Value_Initial_Symmetrical_0ms: [null],
    RMS_Value_Initial_Symmetrical_100ms: [null],
    Security_Required: [null],
    Supply_Onsite_Premises: [null],
    Max_Active_Power_Imp: [null],
    Max_Reactive_Power_Imp_MVAr: [null],
    Onsite_Operational_Diagrams: [null],
    Interface_Transformer: [null],
    Exp_MPAN: [''],
    Power_Generating_Interface: [''],
    Elec_Stor_Plant_Op_Max_Power_Swing: [null],
    Impedance_Data: [''],
    No_Generating_Transformer: [null],
    Rated_Apparent_Power: [null],
    Positive_Sequence_Reactance: [null],
    Operational_Diagrams_File:[null],
    Power_Generating_File:[null],
    installationFormArray: this.fb.array([])
  });
  }
  //Create inverter installation form
  // this.inverterFormName=  this.fb.group({
  //   inverterFormArray: this.fb.array([])
  // });
  // this.installationFormData.emit(this.installationFormName);
}

changeValues():void {
    //this.inverterFormData.emit(this.installationFormName);
    // this.installationFormData.emit(this.installationFormName);
    if(this.installationCount > 1 && this.isAllGenSameSize === true) {
      for (let i = this.installationFormArray.length - 1; i >= 1 ; i--) {
          this.installationFormArray.at(i).setValue(this.installationFormArray.value[0]);
        } 
    } 
    this.installationFormData.emit(this.installationFormName.value);
    // this.inverterFormData.emit(this.inverterFormName.value);
    this.validateForm();
}

chooseOption():void{
  // this.isAllGenSameSize = this.installationFormName.get('isAllGenSameSize').value;
  // console.log(this.installationFormName.get('isAllGenSameSize'));
  this.installationFormName.patchValue({
    Generator_Size: this.isAllGenSameSize
  });
  if(this.installationCount > 1 && this.isAllGenSameSize === false) {
     for (let i = this.installationFormArray.length - 1; i >= 1 ; i--) {
        this.installationFormArray.at(i).reset();
      } 
  } else {
   for (let i = this.installationFormArray.length - 1; i >= 1 ; i--) {
        this.installationFormArray.at(i).setValue(this.installationFormArray.value[0]);
      } 
  }
  this.installationFormData.emit(this.installationFormName.value);
}
  
/**get list of dynamic generator installation */
  get installationFormArray() : FormArray {
    return this.installationFormName.get("installationFormArray") as FormArray
  }

/**get list of dynamic generator installation */
  get inverterFormArray() : FormArray {
    return this.inverterFormName.get("inverterFormArray") as FormArray
  }

/**
 * add new dynamic form
 * @returns genrator
 */
  addNewInstallationForm(): FormGroup {
    return this.fb.group({
      Id: [null],
      No_Generating_Units_Sync: [null, Validators.required],
      Type_Prime_Movers_Sync: [null, Validators.required],
      Energy_Source_Availability_Sync: [null, Validators.required],
      Technology_Production_Type_Sync: [null, Validators.required],
      No_Generating_Units_Fixed: [null, Validators.required],
      Type_Prime_Movers_Fixed: [null, Validators.required],
      Energy_Source_Availability_Fixed: [null, Validators.required],
      Technology_Production_Type_Fixed: [null, Validators.required],
      No_Generating_Units_Double: [null, Validators.required],
      Type_Prime_Movers_Double: [null, Validators.required],
      Energy_Source_Availability_Double: [null, Validators.required],
      Technology_Production_Type_Double: [null, Validators.required],
      No_Generating_Units_Series: [null, Validators.required],
      Type_Prime_Movers_Series: [null, Validators.required],
      Energy_Source_Availability_Series: [null, Validators.required],
      Technology_Production_Type_Series: [null, Validators.required],
      No_Generating_Units_Elec: [null, Validators.required],
      Type_Prime_Movers_Elec: [null, Validators.required],
      Energy_Source_Availability_Elec: [null, Validators.required],
      Technology_Production_Type_Elec: [null, Validators.required],
      Generating_Units_Other: [null, Validators.required],
      No_Generating_Units_Other: [null, Validators.required],
      Type_Prime_Movers_Other: [null, Validators.required],
      Energy_Source_Availability_Other: [null, Validators.required],
      Technology_Production_Type_Other: [null, Validators.required],
      Power_Generating_Modules_Name: [null, Validators.required],
      Sub_Transient: [null, Validators.required],
      Maximum_Fault_Level: [null, Validators.required],
      Rated_Terminal_Voltage: [null, Validators.required],
      Apparent_Power_Rating: [null, Validators.required],
      Rated_Terminal_Current: [null, Validators.required],
      Rated_Active_Power: [null, Validators.required],
      Registered_Capacity: [null, Validators.required],
      Min_Active_Power_Exp: [null, Validators.required],
      Max_Active_Power_Exp: [null, Validators.required],
      Max_Reactive_Power_Exp: [null, Validators.required],
      Max_Reactive_Power_Imp: [null, Validators.required],
     
    })
  }

/**
 * add new dynamic form
 * @returns inverter
 */
  // addNewInverterForm(): FormGroup {
  //   return this.fb.group({
  //     inverter: [null, Validators.required],
  //   })
  // }

  /**
  * delete installation form by click on left icon
  */
  reduceInstallationForm():void{
    if(this.installationCount >0){
      this.installationCount = this.installationCount - 1;
      this.installationFormName.get('No_Generator_Sets').setValue(this.installationCount ); 
      let deleteId = this.installationFormArray.at(this.installationCount).value.Id;
      this.deleteById(deleteId); 
      this.installationFormArray.removeAt(this.installationCount);
    }
    
  }

  ngOnChanges(changes: SimpleChanges) {
        
    // console.log(changes['validatedForm'].currentValue);
    if(changes['validatedForm']?.currentValue === true) {
      this.formSubmitted=true;
    }
    // 
    
}

/**
 * load form data value on ngOninit if form has data
 */
 updateFormValueOnLoad(formName:any):void{

  this.installationFormName=  this.fb.group({
    // Id: null,
    No_Generator_Sets: null,
    Generator_Size: [null],
    Peak_Asymmetrical: [null],
    RMS_Value_Initial_Symmetrical_0ms: [null],
    RMS_Value_Initial_Symmetrical_100ms: [null],
    Security_Required: [null],
    Supply_Onsite_Premises: [null],
    Max_Active_Power_Imp: [null],
    Max_Reactive_Power_Imp_MVAr: [null],
    Onsite_Operational_Diagrams: [null],
    Interface_Transformer: [null],
    Exp_MPAN: [''],
    Power_Generating_Interface: [''],
    Elec_Stor_Plant_Op_Max_Power_Swing: [null],
    Impedance_Data: [''],
    No_Generating_Transformer: [null],
    Rated_Apparent_Power: [null],
    Positive_Sequence_Reactance: [null],
    Operational_Diagrams_File:[null],
    Power_Generating_File:[null],
    installationFormArray: this.fb.array([])
  });
  
        if(this.parentToChildFormData[0][formName].installationFormArray.length>0){
          this.parentToChildFormData[0][formName].installationFormArray.forEach((value:any):void=> {
          (this.installationFormName.get('installationFormArray') as FormArray).push( this.addNewInstallationForm());
        })}
  
        this.installationFormName.patchValue( {
          No_Generator_Sets: this.parentToChildFormData[0][formName].No_Generator_Sets, 
          Generator_Size: (this.parentToChildFormData[0][formName].Generator_Size === 1) ? true : false,
          Peak_Asymmetrical: this.parentToChildFormData[0][formName].Peak_Asymmetrical,
          RMS_Value_Initial_Symmetrical_0ms: this.parentToChildFormData[0][formName].RMS_Value_Initial_Symmetrical_0ms,
          RMS_Value_Initial_Symmetrical_100ms: this.parentToChildFormData[0][formName].RMS_Value_Initial_Symmetrical_100ms,
          Security_Required: this.parentToChildFormData[0][formName].Security_Required,
          Supply_Onsite_Premises: this.parentToChildFormData[0][formName].Supply_Onsite_Premises,
          Max_Active_Power_Imp: this.parentToChildFormData[0][formName].Max_Active_Power_Imp,
          Max_Reactive_Power_Imp_MVAr: this.parentToChildFormData[0][formName].Max_Reactive_Power_Imp_MVAr,
          Onsite_Operational_Diagrams: this.parentToChildFormData[0][formName].Onsite_Operational_Diagrams,
          Interface_Transformer: this.parentToChildFormData[0][formName].Interface_Transformer,
          Exp_MPAN: this.parentToChildFormData[0][formName].Exp_MPAN,
          Power_Generating_Interface: this.parentToChildFormData[0][formName].Power_Generating_Interface,
          Elec_Stor_Plant_Op_Max_Power_Swing: this.parentToChildFormData[0][formName].Elec_Stor_Plant_Op_Max_Power_Swing,
          Impedance_Data: this.parentToChildFormData[0][formName].Impedance_Data,
          No_Generating_Transformer: this.parentToChildFormData[0][formName].No_Generating_Transformer,
          Rated_Apparent_Power: this.parentToChildFormData[0][formName].Rated_Apparent_Power,
          Positive_Sequence_Reactance: this.parentToChildFormData[0][formName].Positive_Sequence_Reactance,
          Operational_Diagrams_File: this.parentToChildFormData[0][formName].Operational_Diagrams_File,
          Power_Generating_File: this.parentToChildFormData[0][formName].Power_Generating_File,
          installationFormArray: this.parentToChildFormData[0][formName].installationFormArray
        });
  
        this.Operational_Diagrams_File=this.parentToChildFormData[0][formName].Operational_Diagrams_File;
        this.Power_Generating_File=this.parentToChildFormData[0][formName].Power_Generating_File;

       this.installationCount =  this.parentToChildFormData[0][formName].No_Generator_Sets;
       this.isAllGenSameSize = (this.parentToChildFormData[0][formName].Generator_Size === 1) ? true : false;
      this.validateForm();
      this.installationFormData.emit(this.installationFormName.value);
  }
  

  validateForm() {
    if(this.installationFormName.value.Rated_Apparent_Power != null &&
      this.installationFormName.value.Max_Reactive_Power_Imp_MVAr !=null && 
      this.installationFormName.value.Elec_Stor_Plant_Op_Max_Power_Swing !=null &&
      this.installationFormName.value.No_Generating_Transformer != null &&
      this.installationFormName.value.Positive_Sequence_Reactance != null &&
      this.validateInstallationFormField() === true ) {
        this.enableOtherFormsOnValid.emit(true);
    }
    else {
      this.enableOtherFormsOnValid.emit(false);
    }
  }
  validateInstallationFormField()  {
    let formIsValid: boolean = true ;
    let item:any;
    if(this.installationCount != 0) {
      // console.log(this.installationFormArray.value);
      for( item of this.installationFormArray.value) {
        Object.keys(item).forEach((key:string):any=>{
        //  console.log("Key "+ key+ "Value "+ item[key]); 
        if(item['Rated_Terminal_Current'] === null || item['Rated_Terminal_Current'] === 0) {
          formIsValid = false;
          // return formIsValid;
          } 
          if(item['Apparent_Power_Rating'] === null || item['Apparent_Power_Rating'] === 0) {
            formIsValid = false;
            // return formIsValid;
          }
          if(item['Min_Active_Power_Exp'] === null || item['Min_Active_Power_Exp'] === 0) {
            formIsValid = false;
            // return formIsValid;
          }
          if(item['Max_Reactive_Power_Exp'] === null || item['Max_Reactive_Power_Exp'] === 0) {
            formIsValid = false;
            // return formIsValid;
          }
          if(item['Power_Generating_Modules_Name'] === null || item['Power_Generating_Modules_Name'] === 0) {
            formIsValid = false;
            // return formIsValid;
          }
          if(item['Rated_Terminal_Voltage'] === null || item['Rated_Terminal_Voltage'] === 0) {
            formIsValid = false;
            // return formIsValid;
          }
          if(item['Rated_Active_Power'] === null || item['Rated_Active_Power'] === 0) {
            formIsValid = false;
            // return formIsValid;
          }
          if((item['Sub_Transient'] === null || item['Sub_Transient'] === 0) || (item["Maximum_Fault_Level"] === null || item["Maximum_Fault_Level"] === 0)) {
            formIsValid = false;
            // return formIsValid;
          }
          if(item['Registered_Capacity'] === null || item['Registered_Capacity'] === 0) {
            formIsValid = false;
            // return formIsValid;
          }
          if(item['Max_Reactive_Power_Imp'] === null || item['Max_Reactive_Power_Imp'] === 0) {
            formIsValid = false;
            // return formIsValid;
          }
          if(item['Max_Active_Power_Exp'] === null || item['Max_Active_Power_Exp'] === 0) {
            formIsValid = false;
            // return formIsValid;
          }
        });
      }
    }
    console.log("formis Valid" + formIsValid);
     return formIsValid;
   }
  /**
  * add installation/inverter form by click on right icon
  */
  addInstallationForm():void {
    this.installationCount = this.installationCount + 1;
    this.installationFormName.get('No_Generator_Sets').setValue(this.installationCount ); 
    if(this.installationCount >= 1) {
    if(this.isAllGenSameSize === true && this.installationCount !== 1 ){
    this.installationFormArray.push(this.fb.group(this.installationFormArray.value[0]));
     } 
    else    { 
      this.installationFormArray.push(this.addNewInstallationForm());
    }
    }
  }

  

/**
 * Delete last mw kw installation form from selected form by click on left arrow icon 
 * @param id
 */
 deleteById(id:number){
  this.newGenService.deleteInstallationFormById('Connection_New_Genration_KW_MW/', id).subscribe(
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
// fileNameOnSiteOperation:File;
// fileNamePowerGenModule: File;
onChange(event: any, type: string):void {
  if(type === 'Power_Gen') {
    this.fileNamePowerGenModule = event.target.files[0];
  }
  if(type === 'OnSite') {
    this.fileNameOnSiteOperation=event.target.files[0];
  } 
  
}

validateFileType(fileType: string){
  this.isValidFileType =  this.allowFileType.includes(fileType.toLocaleLowerCase())? true: false;
  return this.isValidFileType;
}

// OnClick of button Upload
onUpload(data: string) {
  let fileType;
  const formData = new FormData();
  if(data === 'Power_Generating_Interface') {
    this.file = this.fileNamePowerGenModule;
    fileType = this.fileNamePowerGenModule.name.split('.');
   
    formData.append('file',this.fileNamePowerGenModule);
   }
   if(data === 'Onsite_Operational_Diagrams') {
    this.file = this.fileNameOnSiteOperation;
    fileType = this.fileNameOnSiteOperation.name.split('.');

    formData.append('file',this.fileNameOnSiteOperation);
   }
   formData.append('Connection_Id', this.connectionId);
   if(this.file  && this.validateFileType(fileType[1])) {
     this.loading = !this.loading;
     
    
     this.httpService.upload(formData).subscribe((response: any) => {
       
       if(response.filebaseId){
         console.log(response);
        //  this.fileBasedId = {fileBasedId:1234}
         this.installationFormName.controls[data].setValue(response.filebaseId);
        //  this.installationFormData.emit(this.installationFormName.value);
        this.changeValues();
         this._snackBar.open("File Uploaded Successfully", "OK", {
           duration: 3000,
           
          });
         }
       
     }, (error:any) => {
       this._snackBar.open("Bad Request", "OK", {
         duration: 3000
     });
   
   });
   }
 }

}
