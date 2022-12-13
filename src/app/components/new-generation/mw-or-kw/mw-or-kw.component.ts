import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NewGenerationService } from 'src/app/services/new-generation.service';
import { SharedService } from 'src/app/services/shared.service';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-mw-or-kw',
  templateUrl: './mw-or-kw.component.html',
  styleUrls: ['./mw-or-kw.component.scss'],
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
export class MwOrKwComponent implements OnInit {

isPvInfo:any;
isWindInfo:any;
isHydroInfo:any;
isBiomassInfo:any;
isChpInfo:any;
isEnergyStorageInfo:any;


formValidtoChild!: boolean;
 
isShowPvPhotoVoltaicForm:boolean = false;
isShowWindForm:boolean = false;
isShowHydroForm:boolean = false;
isShowBiomassForm:boolean = false;
isShowChpForm:boolean = false;
isShowEniergyForm:boolean = false;
isShowOtherForm:boolean = false;
pvDisabled: boolean=false;
windDisabled: boolean=false;
hydroDisabled: boolean=false;
bioMassDisabled: boolean=false;
chpDisabled: boolean=false;
energyDisabled: boolean=false;
otherDisabled: boolean=false;
formName:any;
formData: any;
isEnabledorDisabled!: boolean;
mainFormData:any = [];
parentToChildFormData: any;
pvFormData= false;
windFormData= false;
hydroFormData= false;
bioMassFormData = false;
chpFormData = false;
energyFormData = false;
otherFormData= false;
connectionId: number;

@Output() allMWOrKwData: EventEmitter<any> = new EventEmitter();
@Input() isMworKw: string;



constructor(private sharedService: SharedService, private newGenService: NewGenerationService) { }

  ngOnInit(): void {
    this.sharedService.getConnectionId().subscribe((data: any) => {
      this.connectionId=data;
    });
    this.connectionId=2;
    this.newGenService.getkwMwData(this.connectionId).subscribe((resp: any) => {
      if(resp.length > 0) {
        this.mainFormData.push(resp[0]);
        this.isEnabledorDisabledForm(true);
        this.allMWOrKwData.emit(this.mainFormData); 
      }
    });
  }

  deSelectOption() {
    if(this.formName === 'pvPhotoVoltaicForm') {
      this.isShowPvPhotoVoltaicForm  = !this.isShowPvPhotoVoltaicForm;
      this.windDisabled=false;
      this.hydroDisabled=false;
      this.bioMassDisabled=false;
      this.chpDisabled=false;
      this.energyDisabled=false;
      this.otherDisabled=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['pvPhotoVoltaicForm'];
        this.pvFormData = false;
        this.allMWOrKwData.emit(this.mainFormData);
      }
    }
    if(this.formName === 'windForm') {
      this.isShowWindForm = !this.isShowWindForm;
      this.pvDisabled=false;
      this.hydroDisabled=false;
      this.bioMassDisabled=false;
      this.chpDisabled=false;
      this.energyDisabled=false;
      this.otherDisabled=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['windForm'];
        this.windFormData = false;
        this.allMWOrKwData.emit(this.mainFormData);
      }
    }
    if(this.formName === 'hydroForm') {
      this.isShowHydroForm = !this.isShowHydroForm;
      this.pvDisabled=false;
      this.windDisabled=false;
      this.bioMassDisabled=false;
      this.chpDisabled=false;
      this.energyDisabled=false;
      this.otherDisabled=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['hydroForm'];
        this.hydroFormData = false;
        this.allMWOrKwData.emit(this.mainFormData);
      }
    }
    if(this.formName === 'biomassForm') {
      this.isShowBiomassForm = !this.isShowBiomassForm;
      this.pvDisabled=false;
      this.windDisabled=false;
      this.hydroDisabled=false;
      this.chpDisabled=false;
      this.energyDisabled=false;
      this.otherDisabled=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['biomassForm'];
        this.bioMassFormData = false;
        this.allMWOrKwData.emit(this.mainFormData);
      }
    }
    if(this.formName === 'CHPCombinedHeatandPowerForm') {
      this.isShowChpForm = !this.isShowChpForm;
      this.pvDisabled=false;
      this.windDisabled=false;
      this.hydroDisabled=false;
      this.bioMassDisabled=false;
      this.energyDisabled=false;
      this.otherDisabled=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['CHPCombinedHeatandPowerForm'];
        this.chpFormData = false;
        this.allMWOrKwData.emit(this.mainFormData);
      }
    }
    if(this.formName === 'energyForm') {
      this.isShowEniergyForm = !this.isShowEniergyForm;
      this.pvDisabled=false;
      this.windDisabled=false;
      this.hydroDisabled=false;
      this.bioMassDisabled=false;
      this.chpDisabled=false;
      this.otherDisabled=false;
      // this.mainFormData[0][this.formName]= null;
      // this.mainFormData[0].splice(this.formName, 1);
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['energyForm'];
        this.energyFormData = false;
        this.allMWOrKwData.emit(this.mainFormData);
        // console.log(this.mainFormData);
      }
    }
    if(this.formName === 'otherForm') {
      this.isShowOtherForm = !this.isShowOtherForm;
      this.pvDisabled=false;
      this.windDisabled=false;
      this.hydroDisabled=false;
      this.bioMassDisabled=false;
      this.energyDisabled=false;
      this.chpDisabled=false;
      if(this.mainFormData.length != 0) {
        delete this.mainFormData[0]['otherForm'];
        this.otherFormData = false;
        this.allMWOrKwData.emit(this.mainFormData);
      }
    }
  }

  validateForm() {
    if(this.formName === 'pvPhotoVoltaicForm'){
      if(this.isEnabledorDisabled === true && this.mainFormData[0][this.formName]) {
        this.pvDisabled=false;
        this.windDisabled=false;
        this.hydroDisabled=false;
        this.bioMassDisabled=false;
        this.chpDisabled=false;
        this.energyDisabled=false;
        this.otherDisabled=false;
      }
      else {
      //output (Child to Parent) to Forms For Validation
      this.formValidtoChild = true;
      //Disabling
      this.windDisabled=true;
      this.hydroDisabled=true;
      this.bioMassDisabled=true;
      this.chpDisabled=true;
      this.energyDisabled=true;
      this.otherDisabled=true;
      }
    }
    if(this.formName === 'windForm'){
      if(this.isEnabledorDisabled === true && this.mainFormData[0][this.formName]) {
        this.pvDisabled=false;
        this.windDisabled=false;
        this.hydroDisabled=false;
        this.bioMassDisabled=false;
        this.chpDisabled=false;
        this.energyDisabled=false;
        this.otherDisabled=false;
      }
      else {
      this.formValidtoChild=true;
      //Disabling
      this.pvDisabled=true;
      this.hydroDisabled=true;
      this.bioMassDisabled=true;
      this.chpDisabled=true;
      this.energyDisabled=true;
      this.otherDisabled=true;
      }
    }
    if(this.formName === 'hydroForm') {
      if(this.isEnabledorDisabled === true && this.mainFormData[0][this.formName]) {
        this.pvDisabled=false;
        this.windDisabled=false;
        this.hydroDisabled=false;
        this.bioMassDisabled=false;
        this.chpDisabled=false;
        this.energyDisabled=false;
        this.otherDisabled=false;
      }
      else {
      this.formValidtoChild=true;
      //Disabling
      this.pvDisabled=true;
      this.windDisabled=true;
      this.bioMassDisabled=true;
      this.chpDisabled=true;
      this.energyDisabled=true;
      this.otherDisabled=true;
      }
    }
    if(this.formName === 'biomassForm'){
      if(this.isEnabledorDisabled === true && this.mainFormData[0][this.formName]) {
        this.pvDisabled=false;
        this.windDisabled=false;
        this.hydroDisabled=false;
        this.bioMassDisabled=false;
        this.chpDisabled=false;
        this.energyDisabled=false;
        this.otherDisabled=false;
      }
      else {
      this.formValidtoChild=true;
      //Disabling
      this.pvDisabled=true;
      this.windDisabled=true;
      this.hydroDisabled=true;
      this.chpDisabled=true;
      this.energyDisabled=true;
      this.otherDisabled=true;
      }
    }
    if(this.formName === 'CHPCombinedHeatandPowerForm') {
      if(this.isEnabledorDisabled === true && this.mainFormData[0][this.formName]) {
        this.pvDisabled=false;
        this.windDisabled=false;
        this.hydroDisabled=false;
        this.bioMassDisabled=false;
        this.chpDisabled=false;
        this.energyDisabled=false;
        this.otherDisabled=false;
      }
      else {
      this.formValidtoChild=true;
      //Disabling
      this.pvDisabled=true;
      this.windDisabled=true;
      this.hydroDisabled=true;
      this.bioMassDisabled=true;
      this.energyDisabled=true;
      this.otherDisabled=true;
      }
    }
    if(this.formName === 'otherForm') {
      if(this.isEnabledorDisabled === true && this.mainFormData[0][this.formName]) {
        this.pvDisabled=false;
        this.windDisabled=false;
        this.hydroDisabled=false;
        this.bioMassDisabled=false;
        this.chpDisabled=false;
        this.energyDisabled=false;
        this.otherDisabled=false;
      }
      else {
      this.formValidtoChild=true;
      //Disabling
      this.pvDisabled=true;
      this.windDisabled=true;
      this.hydroDisabled=true;
      this.bioMassDisabled=true;
      this.chpDisabled=true;
      this.energyDisabled=true;
      }
    }

  }

  showFormBasedOnOption(name: any):void {
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
  // this.deSelectOption();
  this.isShowOtherForm = false;
  this.isShowPvPhotoVoltaicForm  = false;
  this.isShowWindForm = false;
  this.isShowHydroForm = false;
  this.isShowBiomassForm = false;
  this.isShowChpForm = false;
  this.isShowEniergyForm = false;
  
}
}

  isEnabledorDisabledForm(val: boolean) {
    this.isEnabledorDisabled = val
    if(this.isEnabledorDisabled === true) {
      this.pvDisabled=false;
      this.windDisabled=false;
      this.hydroDisabled=false;
      this.bioMassDisabled=false;
      this.chpDisabled=false;
      this.energyDisabled=false;
      this.otherDisabled=false;
        if(this.mainFormData.length === 0) {
          this.mainFormData.push({   [this.formName] : null });
         }
       if(this.mainFormData[0][this.formName]) {
           this.mainFormData[0][this.formName] = this.formData;
         } else {
           this.mainFormData[0][this.formName] = this.formData;
       }
       this.parentToChildFormData = this.mainFormData;
      this.allMWOrKwData.emit(this.parentToChildFormData); 
      this.maintainFormDataFlag();
    }
    else if(this.isEnabledorDisabled === false && this.formName === 'pvPhotoVoltaicForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.pvDisabled=false;
      this.windDisabled=true;
      this.hydroDisabled=true;
      this.bioMassDisabled=true;
      this.chpDisabled=true;
      this.energyDisabled=true;
      this.otherDisabled=true;
    }
    else if(this.isEnabledorDisabled === false && this.formName === 'windForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.pvDisabled=true;
      this.windDisabled=false;
      this.hydroDisabled=true;
      this.bioMassDisabled=true;
      this.chpDisabled=true;
      this.energyDisabled=true;
      this.otherDisabled=true;
    }
    else if(this.isEnabledorDisabled === false && this.formName === 'hydroForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.pvDisabled=true;
      this.windDisabled=true;
      this.hydroDisabled=false;
      this.bioMassDisabled=true;
      this.chpDisabled=true;
      this.energyDisabled=true;
      this.otherDisabled=true;
    }
    else if(this.isEnabledorDisabled === false && this.formName === 'biomassForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.pvDisabled=true;
      this.windDisabled=true;
      this.hydroDisabled=true;
      this.bioMassDisabled=false;
      this.chpDisabled=true;
      this.energyDisabled=true;
      this.otherDisabled=true;
    }
    else if(this.isEnabledorDisabled === false && this.formName === 'CHPCombinedHeatandPowerForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.pvDisabled=true;
      this.windDisabled=true;
      this.hydroDisabled=true;
      this.bioMassDisabled=true;
      this.chpDisabled=false;
      this.energyDisabled=true;
      this.otherDisabled=true;
    }
    else if(this.isEnabledorDisabled === false && this.formName === 'energyForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.pvDisabled=true;
      this.windDisabled=true;
      this.hydroDisabled=true;
      this.bioMassDisabled=true;
      this.chpDisabled=true;
      this.energyDisabled=false;
      this.otherDisabled=true;
    }
    else if(this.isEnabledorDisabled === false && this.formName === 'otherForm') {
      this.mainFormData;
      this.formValidtoChild = true;
      this.pvDisabled=true;
      this.windDisabled=true;
      this.hydroDisabled=true;
      this.bioMassDisabled=true;
      this.chpDisabled=true;
      this.energyDisabled=true;
      this.otherDisabled=false;
    }
  }

  getInstallationFormData(data: any):void{
    this.formData=data;
  }

  maintainFormDataFlag():void{

    if(this.mainFormData[0]["pvPhotoVoltaicForm"] != null){
        this.pvFormData = true;
    }
    if(this.mainFormData[0]["windForm"] != null){
        this.windFormData = true;
    }
    if(this.mainFormData[0]["hydroForm"] != null){
        this.hydroFormData = true;
    }
    if(this.mainFormData[0]["biomassForm"] != null){
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

}
