import { BuiltinType } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { flatMap } from 'rxjs';
import { NewGenerationService } from 'src/app/services/new-generation.service';
import { SharedService } from 'src/app/services/shared.service';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-more-than-three-kw',
  templateUrl: './more-than-three-kw.component.html',
  styleUrls: ['./more-than-three-kw.component.scss'],
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
export class MoreThanThreeKwComponent implements OnInit {


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
uploadReceived: boolean =true;

@Output() allMoreThanThreeHundredData: EventEmitter<any> = new EventEmitter();

pvFormData= false;
windFormData= false;
hydroFormData= false;
bioMassFormData = false;
chpFormData = false;
energyFormData = false;
otherFormData= false;

connectionId: number;


  constructor(private sharedService: SharedService, 
    private newGenService: NewGenerationService) { }

  ngOnInit(): void {
    this.sharedService.getConnectionId().subscribe(data => {
      this.connectionId=data;
    });
    this.newGenService.getThreeSixEightData(this.connectionId).subscribe((resp:any) => {
      if(resp.length > 0) {
        this.mainFormData.push(resp[0]);
        this.isEnabledorDisabledForm(true);
        this.allMoreThanThreeHundredData.emit(this.mainFormData); 
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


   validateForm():void {
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
        default:
         

    }

  }

isEnabledorDisabledForm(val: boolean) {
    this.isEnabledorDisabled = val;
    if(this.isEnabledorDisabled === true) {
      
     this.disabledWindButton=false;
      this.disabledPvButton=false;
      this.disabledHydroButton=false;
      this.disabledBiomassButton=false;
      this.disabledChpButton=false;
      this.disabledEnergyButton=false;
      this.disabledOtherButton=false;
      if(this.mainFormData.length === 0) {
         this.mainFormData.push({   [this.formName] : null });
        }
      if(this.mainFormData[0][this.formName]) {
          this.mainFormData[0][this.formName] = this.formData;
        } else {
          if(this.formData != null) {
            this.mainFormData[0][this.formName] = this.formData;
          }
      }
      this.parentToChildFormData = this.mainFormData;
      this.allMoreThanThreeHundredData.emit(this.parentToChildFormData);
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

if(this.mainFormData[0]["pvPhotoVoltaicForm"]!= null){
    this.pvFormData = true;
}
if(this.mainFormData[0]["windForm"]!= null){
    this.windFormData = true;
}
if(this.mainFormData[0]["hydroForm"]!= null){
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


/**
 * get the form data from child to parent
 * @param data
 */
  getInstallationFormData(data: any):void{
  this.formData = data;
  // this.uploadReceived = true;
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
        delete this.mainFormData[0]["pvPhotoVoltaicForm"];
        this.allMoreThanThreeHundredData.emit(this.mainFormData); 
        this.pvFormData = false;
      }
      break;
    case('windForm'):
      this.isShowWindForm = !this.isShowWindForm;
      // this.formData=null;
      this.disabledPvButton=false;
      this.disabledHydroButton=false;
      this.disabledBiomassButton=false;
      this.disabledChpButton=false;
      this.disabledEnergyButton=false;
      this.disabledOtherButton=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]["windForm"];
        this.allMoreThanThreeHundredData.emit(this.mainFormData); 
        this.windFormData = false;
      }
      break;
    case('hydroForm'):
      this.isShowHydroForm = !this.isShowHydroForm;
      // this.formData=null;
      this.disabledPvButton=false;
      this.disabledWindButton = false;
      this.disabledBiomassButton=false;
      this.disabledChpButton=false;
      this.disabledEnergyButton=false;
      this.disabledOtherButton=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['hydroForm'];
        this.allMoreThanThreeHundredData.emit(this.mainFormData); 
        this.hydroFormData = false;
      }
      break;
    case('biomassForm'):
      this.isShowBiomassForm = !this.isShowBiomassForm;
      // this.formData=null;
      this.disabledPvButton=false;
      this.disabledWindButton = false;
      this.disabledHydroButton=false;
      this.disabledChpButton=false;
      this.disabledEnergyButton=false;
      this.disabledOtherButton=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['biomassForm'];
        this.allMoreThanThreeHundredData.emit(this.mainFormData); 
        this.bioMassFormData = false;
      }
      break;
    case('CHPCombinedHeatandPowerForm'):
      this.isShowChpForm = !this.isShowChpForm;
      // this.formData=null;
      this.disabledPvButton=false;
      this.disabledWindButton = false;
      this.disabledHydroButton=false;
      this.disabledBiomassButton=false;
      this.disabledEnergyButton=false;
      this.disabledOtherButton=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['CHPCombinedHeatandPowerForm'];
        this.allMoreThanThreeHundredData.emit(this.mainFormData); 
        this.chpFormData = false;
      }
      break;
    case('energyForm'):
      this.isShowEniergyForm = !this.isShowEniergyForm;
      // this.formData=null;
      this.disabledPvButton=false;
      this.disabledWindButton = false;
      this.disabledHydroButton=false;
      this.disabledBiomassButton=false;
      this.disabledChpButton=false;
      this.disabledOtherButton=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['energyForm'];
        this.allMoreThanThreeHundredData.emit(this.mainFormData); 
        this.energyFormData = false;
        // console.log(this.mainFormData);
      }
      break;
    case('otherForm'):
      this.isShowOtherForm = !this.isShowOtherForm;
      // this.formData=null;
      this.disabledPvButton=false;
      this.disabledWindButton = false;
      this.disabledHydroButton=false;
      this.disabledBiomassButton=false;
      this.disabledChpButton=false;
      this.disabledEnergyButton=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['otherForm'];
        this.allMoreThanThreeHundredData.emit(this.mainFormData); 
        this.otherFormData = false;
      }
      break;
    default:
      this.pvFormData = false;
      this.otherFormData = false;
      this.energyFormData = false;
      this.chpFormData = false;
      this.bioMassFormData = false;
      this.hydroFormData = false;
      this.windFormData = false;
    }
    
  }


}



