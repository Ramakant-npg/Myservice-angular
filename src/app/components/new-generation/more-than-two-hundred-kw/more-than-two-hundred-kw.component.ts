import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NewGenerationService } from 'src/app/services/new-generation.service';
import { SharedService } from 'src/app/services/shared.service';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-more-than-two-hundred-kw',
  templateUrl: './more-than-two-hundred-kw.component.html',
  styleUrls: ['./more-than-two-hundred-kw.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(5%)'}),
        animate('220ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('220ms ease-in', style({transform: 'translateY(5%)'}))
      ])
    ])
  ]
})
export class MoreThanTwoHundredKwComponent implements OnInit {

 
  isPvInfo:any;
isWindInfo:any;
isHydroInfo:any;
isBiomassInfo:any;
isChpInfo:any;
isEnergyStorageInfo:any;

isShowPvPhotoVoltaicForm:boolean = false;
isShowWindForm:boolean = false;
isShowHydroForm:boolean = false;
isShowBiomassForm:boolean = false;
isShowChpForm:boolean = false;
isShowEniergyForm:boolean = false;
isShowOtherForm:boolean = false;
 
formData:any=null;

disabledPvButton: boolean=false;
disabledWindButton: boolean=false;
disabledHydroButton: boolean=false;
disabledBiomassButton: boolean=false;
disabledChpButton: boolean=false;
disabledEnergyButton: boolean=false;
disabledOtherButton: boolean=false;

formName:any;
formValidtoChild:boolean = false;


parentToChildFormData: any;
mainFormData:any = [];
isEnabledorDisabled: boolean;

pvFormData= false;
windFormData= false;
hydroFormData= false;
bioMassFormData = false;
chpFormData = false;
energyFormData = false;
otherFormData= false;
connectionId: number;

@Output() allMoreThanTwoHundredData: EventEmitter<any> = new EventEmitter();

  constructor(private sharedService: SharedService, private newGenService: NewGenerationService) { }

  ngOnInit(): void {
    this.sharedService.getConnectionId().subscribe((data: any)=> {
      this.connectionId=data;
    });
    // this.connectionId=1;
    this.newGenService.getTwoHundredData(this.connectionId).subscribe((resp: any) => {
      console.log(resp);
      if(resp.length > 0) {
        this.mainFormData.push(resp[0]);
        // this.formData=this.mainFormData;
        this.isEnabledorDisabledForm(true);
        this.allMoreThanTwoHundredData.emit(this.mainFormData); 
      }
    }); 
  }

  showFormBasedOnOption(name:any):void {
    switch ( name ) {
    case 'pv':
      this.isShowPvPhotoVoltaicForm  = true;
      this.isShowWindForm = false;
      this.isShowHydroForm = false;
      this.isShowBiomassForm = false;
      this.isShowChpForm = false;
      this.isShowEniergyForm = false;
      this.isShowOtherForm = false;
      this.formName  = "pvPhotoVoltaicForm";
      this.validateForm();
       break;
   case 'wind':
      this.isShowWindForm = true;
      this.isShowPvPhotoVoltaicForm  = false;
      this.isShowHydroForm = false;
      this.isShowBiomassForm = false;
      this.isShowChpForm = false;
      this.isShowEniergyForm = false;
      this.isShowOtherForm = false;
      this.formName  = "windForm";
      this.validateForm();
       break;
   case 'hydro':
      this.isShowHydroForm = true;
      this.isShowPvPhotoVoltaicForm  = false;
      this.isShowWindForm = false;
      this.isShowBiomassForm = false;
      this.isShowChpForm = false;
      this.isShowEniergyForm = false;
      this.isShowOtherForm = false;
      this.formName  = "hydroForm";
      this.validateForm();
       break;
  case 'biomass':
      this.isShowBiomassForm = true;
      this.isShowPvPhotoVoltaicForm  = false;
      this.isShowWindForm = false;
      this.isShowHydroForm = false;
      this.isShowChpForm = false;
      this.isShowEniergyForm = false;
      this.isShowOtherForm = false;
      this.formName  = "biomassForm";
      this.validateForm();
      break;
  case 'chp':
      this.isShowChpForm = true;
      this.isShowPvPhotoVoltaicForm  = false;
      this.isShowWindForm = false;
      this.isShowHydroForm = false;
      this.isShowBiomassForm = false;
      this.isShowEniergyForm = false;
      this.isShowOtherForm = false;
      this.formName  = "CHPCombinedHeatandPowerForm";
      this.validateForm();
      break;
      case 'energy':
        this.isShowEniergyForm = true;
        this.isShowPvPhotoVoltaicForm  = false;
        this.isShowWindForm = false;
        this.isShowHydroForm = false;
        this.isShowBiomassForm = false;
        this.isShowChpForm = false;
        this.isShowOtherForm = false;
        this.formName  = "energyForm";
        // this.validateForm();
        break;
        case 'other':
          this.isShowOtherForm = true;
          this.isShowPvPhotoVoltaicForm  = false;
          this.isShowWindForm = false;
          this.isShowHydroForm = false;
          this.isShowBiomassForm = false;
          this.isShowChpForm = false;
          this.isShowEniergyForm = false;
          this.formName  = "otherForm";
          this.validateForm();
          break;
    default:
        this.isShowPvPhotoVoltaicForm  = false;
        this.isShowWindForm = false;
        this.isShowHydroForm = false;
        this.isShowBiomassForm = false;
        this.isShowChpForm = false;
        this.isShowEniergyForm = false;
        this.isShowOtherForm = false;
}
  }


   validateForm():void{
    switch ( this.formName  ) {
    case ('pvPhotoVoltaicForm'):
      if(this.isEnabledorDisabled === true && this.mainFormData[0][this.formName]) {
        this.disabledWindButton=false;
          this.disabledHydroButton=false;
          this.disabledBiomassButton=false;
          this.disabledChpButton=false;
          this.disabledEnergyButton=false;
          this.disabledOtherButton=false;
          this.disabledPvButton = false;
        }
        else {
              this.formValidtoChild = true;
              //enable all remaning option
              this.disabledWindButton=true;
              this.disabledHydroButton=true;
              this.disabledBiomassButton=true;
              this.disabledChpButton=true;
              this.disabledEnergyButton=true;
              this.disabledOtherButton=true;
        }
      break;
      case ('windForm'):
        if(this.isEnabledorDisabled === true && this.mainFormData[0][this.formName]) {
          this.disabledWindButton=false;
            this.disabledHydroButton=false;
            this.disabledBiomassButton=false;
            this.disabledChpButton=false;
            this.disabledEnergyButton=false;
            this.disabledOtherButton=false;
            this.disabledPvButton = false;
          }
          else {
              this.formValidtoChild = true;
              //enable all remaning option
              this.disabledPvButton = true;
              this.disabledHydroButton=true;
              this.disabledBiomassButton=true;
              this.disabledChpButton=true;
              this.disabledEnergyButton=true;
              this.disabledOtherButton=true;
          }
      break;

      case ('hydroForm'):
        if(this.isEnabledorDisabled === true && this.mainFormData[0][this.formName]) {
          this.disabledWindButton=false;
            this.disabledHydroButton=false;
            this.disabledBiomassButton=false;
            this.disabledChpButton=false;
            this.disabledEnergyButton=false;
            this.disabledOtherButton=false;
            this.disabledPvButton = false;
          }
          else {
              this.formValidtoChild = true;
              //enable all remaning option
              this.disabledPvButton = true;
              this.disabledWindButton=true;
              this.disabledBiomassButton=true;
              this.disabledChpButton=true;
              this.disabledEnergyButton=true;
              this.disabledOtherButton=true;
          }
          break;

        case ('biomassForm'):
          if(this.isEnabledorDisabled === true && this.mainFormData[0][this.formName]) {
            this.disabledWindButton=false;
              this.disabledHydroButton=false;
              this.disabledBiomassButton=false;
              this.disabledChpButton=false;
              this.disabledEnergyButton=false;
              this.disabledOtherButton=false;
              this.disabledPvButton = false;
            }
            else {
              this.formValidtoChild = true;
              //enable all remaning option
              this.disabledPvButton = true;
              this.disabledWindButton=true;
              this.disabledHydroButton=true;
              this.disabledChpButton=true;
              this.disabledEnergyButton=true;
              this.disabledOtherButton=true;
            }
          break;
        case ('CHPCombinedHeatandPowerForm'):
          if(this.isEnabledorDisabled === true && this.mainFormData[0][this.formName]) {
            this.disabledWindButton=false;
              this.disabledHydroButton=false;
              this.disabledBiomassButton=false;
              this.disabledChpButton=false;
              this.disabledEnergyButton=false;
              this.disabledOtherButton=false;
              this.disabledPvButton = false;
            }
            else {
                this.formValidtoChild = true;
                //enable all remaning option
                this.disabledPvButton = true;
                this.disabledWindButton=true;
                this.disabledHydroButton=true;
                this.disabledBiomassButton=true;
                this.disabledEnergyButton=true;
                this.disabledOtherButton=true;
            }
          break;
        case ('energyForm'):
          if(this.isEnabledorDisabled === true && this.mainFormData[0][this.formName]) {
            this.disabledWindButton=false;
              this.disabledHydroButton=false;
              this.disabledBiomassButton=false;
              this.disabledChpButton=false;
              this.disabledEnergyButton=false;
              this.disabledOtherButton=false;
              this.disabledPvButton = false;
            }
            else {
                  this.formValidtoChild = true;
                  //enable all remaning option
                  this.disabledPvButton = true;
                  this.disabledWindButton=true;
                  this.disabledHydroButton=true;
                  this.disabledBiomassButton=true;
                  this.disabledChpButton=true;
                  this.disabledOtherButton=true;
            }
          break;
        case ('otherForm'):
          if(this.isEnabledorDisabled === true && this.mainFormData[0][this.formName]) {
            this.disabledWindButton=false;
              this.disabledHydroButton=false;
              this.disabledBiomassButton=false;
              this.disabledChpButton=false;
              this.disabledEnergyButton=false;
              this.disabledOtherButton=false;
              this.disabledPvButton = false;
            }
            else {
                  this.formValidtoChild = true;
                  //enable all remaning option
                  this.disabledPvButton = true;
                  this.disabledWindButton=true;
                  this.disabledHydroButton=true;
                  this.disabledBiomassButton=true;
                  this.disabledChpButton=true;
                  this.disabledEnergyButton=true;
            }
          break;

    }

  }

isEnabledorDisabledForm(val: boolean) {
    this.isEnabledorDisabled = val
    if(this.isEnabledorDisabled ) {
     this.disabledWindButton=false;
      this.disabledPvButton=false;
      this.disabledHydroButton=false;
      this.disabledBiomassButton=false;
      this.disabledChpButton=false;
      this.disabledEnergyButton=false;
      this.disabledOtherButton=false;
      // console.log("More Than 200 "+ JSON.stringify(this.formData));
      if(this.mainFormData.length === 0) {
          this.mainFormData.push({[this.formName]: null });
         //this.mainFormData = [this.formName];
        }
      if(this.mainFormData[0][this.formName]) {
          this.mainFormData[0][this.formName] = this.formData;
        } else {
          if(this.formData != null) {
            this.mainFormData[0][this.formName] = this.formData;
        }
      }
      this.parentToChildFormData = this.mainFormData;
      this.allMoreThanTwoHundredData.emit(this.parentToChildFormData); //(This will send the data to the New Generation)
      this.maintainFormDataFlag();
     
    }
else if(this.isEnabledorDisabled === false && this.formName === 'pvPhotoVoltaicForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.disabledPvButton=false;
      this.disabledWindButton=true;
      this.disabledHydroButton=true;
      this.disabledBiomassButton=true;
      this.disabledChpButton=true;
      this.disabledEnergyButton=true;
      this.disabledOtherButton=true;
    }
    else if(this.isEnabledorDisabled === false && this.formName === 'windForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.disabledPvButton=true;
      this.disabledWindButton=false;
      this.disabledHydroButton=true;
      this.disabledBiomassButton=true;
      this.disabledChpButton=true;
      this.disabledEnergyButton=true;
      this.disabledOtherButton=true;
    }
    else if(this.isEnabledorDisabled === false && this.formName === 'hydroForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.disabledPvButton=true;
      this.disabledWindButton=true;
      this.disabledHydroButton=false;
      this.disabledBiomassButton=true;
      this.disabledChpButton=true;
      this.disabledEnergyButton=true;
      this.disabledOtherButton=true;
    }
    else if(this.isEnabledorDisabled === false && this.formName === 'biomassForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.disabledPvButton=true;
      this.disabledWindButton=true;
      this.disabledHydroButton=true;
      this.disabledBiomassButton=false;
      this.disabledChpButton=true;
      this.disabledEnergyButton=true;
      this.disabledOtherButton=true;
    }
    else if(this.isEnabledorDisabled === false && this.formName === 'CHPCombinedHeatandPowerForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.disabledPvButton=true;
      this.disabledWindButton=true;
      this.disabledHydroButton=true;
      this.disabledBiomassButton=true;
      this.disabledChpButton=false;
      this.disabledEnergyButton=true;
      this.disabledOtherButton=true;
    }
    else if(this.isEnabledorDisabled === false && this.formName === 'energyForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.disabledPvButton=true;
      this.disabledWindButton=true;
      this.disabledHydroButton=true;
      this.disabledBiomassButton=true;
      this.disabledChpButton=true;
      this.disabledEnergyButton=false;
      this.disabledOtherButton=true;
    }
    else if(this.isEnabledorDisabled === false && this.formName === 'otherForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.disabledPvButton=true;
      this.disabledWindButton=true;
      this.disabledHydroButton=true;
      this.disabledBiomassButton=true;
      this.disabledChpButton=true;
      this.disabledEnergyButton=true;
      this.disabledOtherButton=false;
    }
  }


maintainFormDataFlag():void{

if(this.mainFormData[0]["pvPhotoVoltaicForm"]){
    this.pvFormData = true;
}
if(this.mainFormData[0]["windForm"]){
    this.windFormData = true;
}
if(this.mainFormData[0]["hydroForm"]){
    this.hydroFormData = true;
}
if(this.mainFormData[0]["biomassForm"]){
    this.bioMassFormData = true;
}
if(this.mainFormData[0]["CHPCombinedHeatandPowerForm"]){
    this.chpFormData = true;
}
if(this.mainFormData[0]["energyForm"]){
    this.energyFormData = true;
}
if(this.mainFormData[0]["otherForm"]){
    this.otherFormData = true;
}



}
  getMainFormData(data: any) {
    
    // let length = data.length;
    // if(data.length >= 2) {
    //   if (data[length-2].formName === this.formName) {
    //     data.splice(length-2, 1);
    //   }
    // }
    // this.mainFormData=data;
    // this.parentToChildFormData = this.mainFormData;
    // console.log(this.mainFormData);
  }


/**
 * get the form data from child to parent
 * @param data
 */
  getInstallationFormData(data: any):void{
  this.formData = data;
  }

/**
* deselect, clear formdata and enable remaning option
 */
deSelectOption() {
  switch ( this.formName  ) {
    case ('pvPhotoVoltaicForm'):
      this.isShowPvPhotoVoltaicForm  = !this.isShowPvPhotoVoltaicForm;
      this.disabledWindButton=false;
      this.disabledHydroButton=false;
      this.disabledBiomassButton=false;
      this.disabledChpButton=false;
      this.disabledEnergyButton=false;
      this.disabledOtherButton=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['pvPhotoVoltaicForm'];
        this.allMoreThanTwoHundredData.emit(this.mainFormData);
        this.pvFormData = false;
      }
      break;
    case('windForm'):
      this.isShowWindForm = !this.isShowWindForm;
      this.disabledPvButton=false;
      this.disabledHydroButton=false;
      this.disabledBiomassButton=false;
      this.disabledChpButton=false;
      this.disabledEnergyButton=false;
      this.disabledOtherButton=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['windForm'];
        this.allMoreThanTwoHundredData.emit(this.mainFormData);
        this.windFormData = false;
      }
      break;
    case('hydroForm'):
      this.isShowHydroForm = !this.isShowHydroForm;
      this.disabledPvButton=false;
      this.disabledWindButton = false;
      this.disabledBiomassButton=false;
      this.disabledChpButton=false;
      this.disabledEnergyButton=false;
      this.disabledOtherButton=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['hydroForm'];
        this.allMoreThanTwoHundredData.emit(this.mainFormData);
        this.hydroFormData = false;
      }
      break;
    case('biomassForm'):
      this.isShowBiomassForm = !this.isShowBiomassForm;
      this.disabledPvButton=false;
      this.disabledWindButton = false;
      this.disabledHydroButton=false;
      this.disabledChpButton=false;
      this.disabledEnergyButton=false;
      this.disabledOtherButton=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['biomassForm'];
        this.allMoreThanTwoHundredData.emit(this.mainFormData);
        this.bioMassFormData = false;
      }
      break;
    case('CHPCombinedHeatandPowerForm'):
      this.isShowChpForm = !this.isShowChpForm;
      this.disabledPvButton=false;
      this.disabledWindButton = false;
      this.disabledHydroButton=false;
      this.disabledBiomassButton=false;
      this.disabledEnergyButton=false;
      this.disabledOtherButton=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['CHPCombinedHeatandPowerForm'];
        this.allMoreThanTwoHundredData.emit(this.mainFormData);
        this.chpFormData = false;
      }
      break;
    case('energyForm'):
      this.isShowEniergyForm = !this.isShowEniergyForm;
      this.disabledPvButton=false;
      this.disabledWindButton = false;
      this.disabledHydroButton=false;
      this.disabledBiomassButton=false;
      this.disabledChpButton=false;
      this.disabledOtherButton=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['energyForm'];
        this.allMoreThanTwoHundredData.emit(this.mainFormData);
        this.energyFormData = false;
      }
      break;
    case('otherForm'):
      this.isShowOtherForm = !this.isShowOtherForm;
      this.disabledPvButton=false;
      this.disabledWindButton = false;
      this.disabledHydroButton=false;
      this.disabledBiomassButton=false;
      this.disabledChpButton=false;
      this.disabledEnergyButton=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['otherForm'];
        this.allMoreThanTwoHundredData.emit(this.mainFormData);
        this.otherFormData = false;
      }
      break;
    default:

    }
    
  }


/**
 * 
 * @returns validate form data
 */
validateFormData()  {
 let formIsValid: boolean = true ;
 let item:any;
 for( item of this.formData.installationFormArray) {
  Object.keys(item).forEach((key:string):any=>{
  if(item[key] === null) {
    formIsValid = false;
    return formIsValid;
    } 
  })

}
  return formIsValid;
}



}
