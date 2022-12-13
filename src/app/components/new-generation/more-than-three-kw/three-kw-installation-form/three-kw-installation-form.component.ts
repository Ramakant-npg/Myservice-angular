import { HttpEventType, HttpResponse } from '@angular/common/http';
import { isNgTemplate } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output, Input, SimpleChanges } from '@angular/core';
import { FormBuilder,FormArray,FormGroup, Validators, Form, FormControl, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewGenerationService } from 'src/app/services/new-generation.service';
import { SharedService } from 'src/app/services/shared.service';
import { HttpService } from '../../../../services/http-service.service';

@Component({
  selector: 'app-three-kw-installation-form',
  templateUrl: './three-kw-installation-form.component.html',
  styleUrls: ['./three-kw-installation-form.component.scss']
})
export class ThreeKwInstallationFormComponent implements OnInit {

selectedBsNumber:any;
isShowGroundSourceForm:Boolean = false;
installationCount:number= 0 ;
file:any;
isValidFileType: boolean = true;
allowFileType = ["doc","docx","pdf","jpg","jpeg","png", "gif"];
loading: boolean = false;
Generator_Size: boolean = true;
isFormSubmitted: boolean = false;
fileBasedId:any;
connectionId:any;
fileName:any;

@Input() installationFormName!:any ;
@Input() validatedForm!:boolean;

@Output() installationFormData: EventEmitter<any> = new EventEmitter();
@Input() parentToChildFormData:any;
@Output() enableOtherFormsOnValid: EventEmitter<any> = new EventEmitter();


constructor( private sharedService: SharedService,private fb: FormBuilder, private httpService: HttpService, 
   private _snackBar: MatSnackBar, private newGenService: NewGenerationService) { }

/**
 * load the form data if form data has data
 */
ngOnInit(): void {
  this.sharedService.getConnectionId().subscribe(data => {
    this.connectionId=data;
  });
let formName:string =  this.installationFormName;
console.log("Form Value "+ JSON.stringify(this.parentToChildFormData));
  if(this.parentToChildFormData && this.parentToChildFormData[0][this.installationFormName]) {
    this.updateFormValueOnLoad(formName);
    this.validateFormData();

  } else {
    //Create installation souce form
    this.installationFormName=  this.fb.group({
    No_Generator_Sets:this.installationCount, 
    Generator_Size: true,
    Single_Line_Diagram: null,
    File_Name:null,
    installationFormArray: this.fb.array([])
  });
  }
}

 ngOnChanges(changes: SimpleChanges) {
    if(changes['validatedForm']?.currentValue === true) {
      this.isFormSubmitted = true;
    }else {
    this.isFormSubmitted=false;
    }
}

/**
 * load form data value on ngOninit if form has data
 */
updateFormValueOnLoad(formName:any):void{

this.installationFormName=  this.fb.group({
        No_Generator_Sets: null,
        Generator_Size : null,
        Single_Line_Diagram: null,
        File_Name:null,
        installationFormArray: this.fb.array([])
      });

      if(this.parentToChildFormData[0][formName].installationFormArray.length>0){
        this.parentToChildFormData[0][formName].installationFormArray.forEach((value:any):void=> {
        (this.installationFormName.get('installationFormArray') as FormArray).push( this.addNewInstallationForm());
      })}

      this.installationFormName.patchValue( { 
        Id: this.parentToChildFormData[0][formName].Id, 
        No_Generator_Sets: this.parentToChildFormData[0][formName].No_Generator_Sets, 
        Generator_Size : (this.parentToChildFormData[0][formName].Generator_Size === 1) ? true : false ,
        Single_Line_Diagram: this.parentToChildFormData[0][formName].Single_Line_Diagram,
        File_Name: this.parentToChildFormData[0][formName].File_Name,
        installationFormArray: this.parentToChildFormData[0][formName].installationFormArray
      });

     this.installationCount =  this.parentToChildFormData[0][formName].No_Generator_Sets;
     this.fileName = this.parentToChildFormData[0][formName].File_Name;
     this.Generator_Size  = (this.parentToChildFormData[0][formName].Generator_Size === 1) ? true : false;
     this.installationFormData.emit(this.installationFormName.value);
}

/**
 * get the formdata value on input change
 */
changeValues():void{
  if(this.installationCount > 1 && this.Generator_Size  === true) {
    for (let i = this.installationFormArray.length - 1; i >= 1 ; i--) {
        this.installationFormArray.at(i).setValue(this.installationFormArray.value[0]);
      } 
  } 
    this.installationFormData.emit(this.installationFormName.value);

    this.validateFormData();
}

 
/**get list of dynamic ground source pump  */
  get installationFormArray() : FormArray {
    return this.installationFormName.get("installationFormArray") as FormArray
  }

/**
 * add new dynamic form
 * @returns ground
 */
  
  addNewInstallationForm(): FormGroup {
    return this.fb.group({
      Id: [null],
      Max_Export: [null, [Validators.required]],
      Rated_Current: [null, [Validators.required]],
      Rated_Voltage: [null,[ Validators.required]],
    })
  }


// get the file info on change
  onChange(event: any):void {
  this.file = event.target.files[0];
  
  }

  
validateFileType(fileType: string){
    this.isValidFileType =  this.allowFileType.includes(fileType.toLocaleLowerCase())? true: false;
    return this.isValidFileType;
 }
 
 // OnClick of button Upload
 onUpload() {
  // this.installationFormData.emit(this.installationFormName.value);
  let fileType = this.file.name.split('.');
   if(this.file  && this.validateFileType(fileType[1])) {
     this.loading = !this.loading;
     const formData = new FormData();
      formData.append('Connection_Id', this.connectionId);
     formData.append('file',this.file);
     this.httpService.upload(formData).subscribe((response: any) => {
      if(response.filebaseId) {
        this.installationFormName.patchValue({
          Single_Line_Diagram: response.filebaseId
        });
        this.changeValues();
      }
        this._snackBar.open("File Uploaded Successfully", "OK", {
          duration: 3000,
           
        });
     }, (error:any) => {
       this._snackBar.open("Bad Request", "OK", {
         duration: 3000
     });
   
   });
   }
  //  this.installationFormData.emit(this.installationFormName.value);
 }
  
  /**
  * delete ground source form by click on left icon
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

  /**
  * add ground source form by click on right icon
  */
  addInstallationForm():void{
    this.installationCount = this.installationCount + 1;
    this.installationFormName.get('No_Generator_Sets').setValue(this.installationCount ); 
    if(this.installationCount >= 1) {
    if(this.Generator_Size  === true && this.installationCount !== 1 ){
    this.installationFormArray.push(this.fb.group(this.installationFormArray.value[0]));
     } 
    else    { 
      this.installationFormArray.push(this.addNewInstallationForm());
    }
    }
  }

/**
 * choose yes and no option from radio button
 * @param option
 */
  chooseOption(option?:string):void {
  this.Generator_Size  = this.installationFormName.get('Generator_Size').value;
  if(this.installationCount > 1 && this.Generator_Size  === false) {
     for (let i = this.installationFormArray.length - 1; i >= 1 ; i--) {
        this.installationFormArray.at(i).reset();
      } 
  } else {
   for (let i = this.installationFormArray.length - 1; i >= 1 ; i--) {
        // this.installationFormArray.at(i).setValue({
        //   Id: null
        // });
        this.installationFormArray.at(i).setValue(this.installationFormArray.value[0]);
      } 
  }
  this.installationFormData.emit(this.installationFormName.value);
}

/**
 * validate Form Data
 */
validateFormData():boolean {
 let formIsValid: boolean = false ;
 let item:any;
 for( item of this.installationFormArray.controls) {
  Object.keys(item.controls).forEach((key:string):any=>{
  if(item.controls[key].value === null || item.controls[key].value === 0) {
    return formIsValid = false
  } else {
    formIsValid = true;
  }
  })

}
 this.enableOtherFormsOnValid.emit(formIsValid);
 return formIsValid;
}


/**
 * Delete last three kw installation form from selected form by click on left arrow icon 
 * @param id
 */
 deleteById(id:number){
  this.newGenService.deleteInstallationFormById('Connection_New_Generation_3_68kw/', id).subscribe(
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
