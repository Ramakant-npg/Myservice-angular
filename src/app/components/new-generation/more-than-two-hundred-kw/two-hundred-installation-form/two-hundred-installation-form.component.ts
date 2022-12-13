import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, Input, SimpleChanges } from '@angular/core';
import { FormBuilder,FormArray,FormGroup, Validators, Form, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewGenerationService } from 'src/app/services/new-generation.service';
import { HttpService } from '../../../../services/http-service.service';

@Component({
  selector: 'app-two-hundred-installation-form',
  templateUrl: './two-hundred-installation-form.component.html',
  styleUrls: ['./two-hundred-installation-form.component.scss']
})
export class TwoHundredInstallationFormComponent implements OnInit {

selectedBsNumber:any;
isShowGroundSourceForm:Boolean = false;
installationCount:number= 1 ;
file:any;
isValidFileType: boolean = true;
allowFileType = ["doc","docx","pdf","jpg","jpeg","png", "gif"];
loading: boolean = false;
isAllGenSameSize: boolean = true;
isFormSubmitted: boolean = false;

inverterCount:number= 1 ;
isAllInvSameSize: boolean = true;
inverterFormName:any;

@Input() installationFormName!:any ;
@Input() validatedForm!:boolean;

@Output() installationFormData: EventEmitter<any> = new EventEmitter();
@Input() parentToChildFormData:any;
@Output() enableOtherFormsOnValid: EventEmitter<any> = new EventEmitter();

@Output() inverterFormData: EventEmitter<any> = new EventEmitter();

constructor(private fb: FormBuilder, private httpService: HttpService, private _snackBar: MatSnackBar, private newGenService: NewGenerationService) { }

ngOnInit(): void {
  let formName:string =  this.installationFormName;
  console.log("Form "+ JSON.stringify(this.parentToChildFormData));
  if(this.parentToChildFormData && this.parentToChildFormData[0][this.installationFormName]) {
    this.updateFormValueOnLoad(formName);
    this.validateFormData();
  } else {
    //Create installation souce form
    this.installationFormName=  this.fb.group({
    No_Generator_Sets: this.installationCount, 
    Generator_Size: true,
    installationFormArray: this.fb.array([this.addNewInstallationForm()]),
    No_Inverters: this.inverterCount,
    inverterFormArray: this.fb.array([this.addNewInverterForm()]),
    Inverter_Design: true,
  });
  }
}

/**
 * load form data value on ngOninit if form has data
 */
updateFormValueOnLoad(formName:any):void{
        //Create installation souce form
        this.installationFormName =  this.fb.group({
          No_Generator_Sets:this.installationCount, 
          Generator_Size: true,
        installationFormArray: this.fb.array([]),
        No_Inverters:this.inverterCount,
        inverterFormArray: this.fb.array([]),
        Inverter_Design: true
      });

      if(this.parentToChildFormData[0][formName].installationFormArray.length>0) {
        this.parentToChildFormData[0][formName].installationFormArray.forEach((value:any):void=> {
        (this.installationFormName.get('installationFormArray') as FormArray).push( this.addNewInstallationForm());
        // (this.installationFormName.get('inverterFormArray') as FormArray).push( this.addNewInverterForm());
      }
      )}
      if(this.parentToChildFormData[0][formName].inverterFormArray.length>0) {
        this.parentToChildFormData[0][formName].inverterFormArray.forEach((value:any):void=> {
        // (this.installationFormName.get('installationFormArray') as FormArray).push( this.addNewInstallationForm());
        (this.installationFormName.get('inverterFormArray') as FormArray).push( this.addNewInverterForm());
      }
      )}

      if(this.parentToChildFormData[0][formName].installationFormArray.length>0) {
        
        this.parentToChildFormData[0][formName].installationFormArray.forEach((data: any) => {
          if(data) {
            data.Island_Mode = (data.Island_Mode === 1) ? true : false;
            data.Export_MPAN = (data.Export_MPAN === 1) ? true : false;
            data.Supply_Onsite_Premises = (data.Supply_Onsite_Premises === 1) ? true : false;
          }
        });
      }
      this.installationFormName.patchValue({ 
        No_Generator_Sets: this.parentToChildFormData[0][formName].No_Generator_Sets, 
        Generator_Size: (this.parentToChildFormData[0][formName].Generator_Size === 1) ? true : false,
        installationFormArray: this.parentToChildFormData[0][formName].installationFormArray,
        No_Inverters:this.parentToChildFormData[0][formName].No_Inverters,
        inverterFormArray: this.parentToChildFormData[0][formName].inverterFormArray,
        Inverter_Design: (this.parentToChildFormData[0][formName].Inverter_Design === 1) ? true : false,
      });
 
     this.installationCount =  this.parentToChildFormData[0][formName].No_Generator_Sets;
     this.inverterCount =  this.parentToChildFormData[0][formName].No_Inverters;
     this.isAllGenSameSize = (this.parentToChildFormData[0][formName].Generator_Size === 1) ? true : false;
     this.isAllInvSameSize = (this.parentToChildFormData[0][formName].No_Inverters === 1) ? true : false;
     this.installationFormData.emit(this.installationFormName.value);
}

ngOnChanges(changes: SimpleChanges) {
    if(changes['validatedForm']?.currentValue === true) {
      this.isFormSubmitted = true;
    } else {
      this.isFormSubmitted=false;
    }
}

changeValues():void {
  if(this.installationCount > 1 && this.isAllGenSameSize === true) {
    for (let i = this.installationFormArray.length - 1; i >= 1 ; i--) {
        this.installationFormArray.at(i).setValue(this.installationFormArray.value[0]);
      }
  } 
  if(this.inverterCount > 1 && this.isAllInvSameSize === true) {
    for (let i = this.inverterFormArray.length - 1; i >= 1 ; i--) {
        this.inverterFormArray.at(i).setValue(this.inverterFormArray.value[0]);
      }
  } 
  // //modify the inverterFormArray 
  //   let isCompleteFormValid = this.validateFormData();
  //   if(isCompleteFormValid) {
  //     let newInvList: number [] = [];
  //     this.installationFormName.value.inverterFormArray.forEach((obj:any)=>{
  //       newInvList.push(obj.Inverter_Rating);
  //     })
  //     this.installationFormName.value.inverterFormArray =  newInvList;
  //     console.log(JSON.stringify(this.installationFormName.value) , " after update");
  //     this.installationFormData.emit(this.installationFormName.value);
     
  //   }
  this.installationFormData.emit(this.installationFormName.value);
  let isCompleteFormValid = this.validateFormData();
  if(isCompleteFormValid) {
    this.installationFormData.emit(this.installationFormName.value);
  }
}

/**get list of dynamic generator installation */
  get installationFormArray() : FormArray {
    return this.installationFormName.get("installationFormArray") as FormArray
  }

/**get list of dynamic generator installation */
  get inverterFormArray() : FormArray {
    return this.installationFormName.get("inverterFormArray") as FormArray
  }

/**
 * add new dynamic form
 * @returns genrator
 */
  addNewInstallationForm(): FormGroup {
    return this.fb.group({
      Id: [null],
      Rated_Terminal_Voltage: [null, Validators.required],
      Rated_Terminal_Current: [null, Validators.required],
      Registered_Capacity: [null, Validators.required],
      Power_Rating: [null, Validators.required],
      Island_Mode:  [null, Validators.required],
      Export_MPAN:  [null, Validators.required],
      Supply_Onsite_Premises:  [null, Validators.required],
      Capacity_Onsite_Premises:  [null, Validators.required],
    })
  }

/**
 * add new dynamic form
 * @returns inverter
 */
  addNewInverterForm(): FormGroup {
    return this.fb.group({
      Inverter_Rating: [null, Validators.required],
    })
  }
 
 selectEleOnsiteOption(item:any, index:number):void {
this.installationFormArray.at(index).get('Supply_Onsite_Premises').setValue(item.value.Supply_Onsite_Premises);
 //this.installationFormName.get('genElectiOnsite').setValue(item.value.genElectiOnsite );
    if(item.value.Supply_Onsite_Premises ===  false) {
          this.installationFormArray.value[index]['Capacity_Onsite_Premises'] = 0;
          this.installationFormArray.updateValueAndValidity();
    } else {
     delete this.installationFormArray.value[index]['Capacity_Onsite_Premises'];
    }

 }
 

  /**
  * delete installation form by click on left icon
  */
  reduceInstallationForm(item?:string):void{
     if(item) {
      if(this.inverterCount > 0) {
      this.inverterCount = this.inverterCount - 1;
      this.installationFormName.get('No_Inverters').setValue(this.inverterCount );
      let deleteId = this.inverterFormArray.at(this.inverterCount).value.Id;
      this.deleteById(deleteId);  
      this.inverterFormArray.removeAt(this.inverterCount);
     }
    } else {
      if(this.installationCount > 0) {
      this.installationCount = this.installationCount - 1;
      this.installationFormName.get('No_Generator_Sets').setValue(this.installationCount );
      let deleteId = this.installationFormArray.at(this.installationCount).value.Id;
      this.deleteById(deleteId); 
      this.installationFormArray.removeAt(this.installationCount);
     }
    }
    
  }

  /**
  * add installation/inverter form by click on right icon
  */
  addInstallationForm(item?:string):void {
    if(item) { 
      this.inverterCount = this.inverterCount + 1;
      this.installationFormName.get('No_Inverters').setValue(this.inverterCount ); 
      if(this.inverterCount >= 1) {
      if(this.isAllInvSameSize === true && this.inverterCount !== 1 ){
      this.inverterFormArray.push(this.fb.group(this.inverterFormArray.value[0]));
      } else  { 
      this.inverterFormArray.push(this.addNewInverterForm());
       }
      }
    } else {
    this.installationCount = this.installationCount + 1;
    this.installationFormName.get('No_Generator_Sets').setValue(this.installationCount ); 
    if(this.installationCount >= 1) {
    if(this.isAllGenSameSize === true && this.installationCount !== 1 ){
    this.installationFormArray.push(this.fb.group(this.installationFormArray.value[0]));
     } else    { 
      this.installationFormArray.push(this.addNewInstallationForm());
      }
    }
  }
  }
  
/**
 * choose yes and no option from radio button
 * @param option
 */
  chooseOption(item?:any):void {
  if(item) {
  // maintain inveter form array option on yes and no
    this.isAllInvSameSize = this.installationFormName.get('Inverter_Design').value;
    if(this.inverterCount > 1 && this.isAllInvSameSize === false) {
     for (let i = this.inverterFormArray.length - 1; i >= 1 ; i--) {
        this.inverterFormArray.at(i).reset();
      } 
  } else {
   for (let i = this.inverterFormArray.length - 1; i >= 1 ; i--) {
        this.inverterFormArray.at(i).setValue(this.inverterFormArray.value[0]);
      } 
  }
  } else {
    // maintain install form array option on yes and no
  this.isAllGenSameSize = this.installationFormName.get('Generator_Size').value;
  if(this.installationCount > 1 && this.isAllGenSameSize === false) {
     for (let i = this.installationFormArray.length - 1; i >= 1 ; i--) {
        this.installationFormArray.at(i).reset();
      } 
  } else {
   for (let i = this.installationFormArray.length - 1; i >= 1 ; i--) {
        this.installationFormArray.at(i).setValue(this.installationFormArray.value[0]);
      } 
  }
}
  this.installationFormData.emit(this.installationFormName.value);
}


/**
 * validate Form Data
 */
validateFormData()  {
 let formIsValid: boolean = false ;
 this.isFormSubmitted=true;
 let isInstallFormValid:boolean = true;
  let isInvFormValid:boolean = true;
 let item:any;
 for( item of this.installationFormArray.value) {
  Object.keys(item).forEach((key:string):any=>{

    if(item['Rated_Terminal_Voltage'] === null || item['Rated_Terminal_Voltage'] === 0) {
      isInstallFormValid = false;
    }
    if(item['Power_Rating'] === null || item['Power_Rating'] === 0) {
      isInstallFormValid = false;
    }
    if(item['Island_Mode'] === null || item['Island_Mode'] === 0) {
      isInstallFormValid = false;
    }
    if(item['Export_MPAN'] === null || item['Export_MPAN'] === 0) {
      isInstallFormValid = false;
    }
    if(item['Supply_Onsite_Premises'] === null || item['Supply_Onsite_Premises'] === 0) {
      isInstallFormValid = false;
    }
    if(item['Rated_Terminal_Current'] === null || item['Rated_Terminal_Current'] === 0) {
      isInstallFormValid = false;
    }
    if(item['Registered_Capacity'] === null || item['Registered_Capacity'] === 0) {
      isInstallFormValid = false;
    }
    if(item['Supply_Onsite_Premises'] === false ) {
      if (item['Capacity_Onsite_Premises'] === null || item['Capacity_Onsite_Premises'] === 0){
        isInstallFormValid = false;
      }
    }
  })
}

 for( item of this.inverterFormArray.controls) {
  Object.keys(item.controls).forEach((key:string):any=>{
  if(item.controls[key].value === null || item.controls[key].value === 0) {
    isInvFormValid = false;
  } 
  })
}


formIsValid = (isInstallFormValid && isInvFormValid);
this.enableOtherFormsOnValid.emit(formIsValid);
return formIsValid;

}



/**
 * Delete last two hundred kw installation form from selected form by click on left arrow icon 
 * @param id
 */
 deleteById(id:number){
  this.newGenService.deleteInstallationFormById('Connection_New_Genration_200Kw/', id).subscribe(
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



}
