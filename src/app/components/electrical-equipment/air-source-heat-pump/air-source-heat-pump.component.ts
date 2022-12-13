import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder,FormArray,FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ElectricalEquipmentService } from 'src/app/services/electrical-equipment.service';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-air-source-heat-pump',
  templateUrl: './air-source-heat-pump.component.html',
  styleUrls: ['./air-source-heat-pump.component.scss'],
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
export class AirSourceHeatPumpComponent implements OnInit {
  airInfo:any;
  selectedBsNumber:any = true;
  isShowAirSourceForm:Boolean = false;
  wanttoShowAirSourceForm: boolean =false;
  airPumpCount:number= 0 ;
  phaseTypeList= [
    {
      id: 0,
      name: 'Single'
    },
    {
      id: 1,
      name: 'Three Phase'
    }
  ];

  @Output() airSourceFormData: EventEmitter<any> = new EventEmitter();
  @Output() enableAirSource: EventEmitter<any> = new EventEmitter();
  @Input() enableDisableAirSourceButton: boolean=false;
  @Input() formSubmitted: boolean=false;

  airSourceSub:Subscription;

  constructor(private fb: FormBuilder,  private electricSerivce: ElectricalEquipmentService,  private _snackBar: MatSnackBar) {}

   ngOnInit(): void {
    this.airSourceSub =this.electricSerivce.getElectricEquipmentdata().subscribe(electricEquipmentData=> {

    if( electricEquipmentData && Object.keys(electricEquipmentData?.airPumpData).length != 0 ) {
      let data =  electricEquipmentData.airPumpData;
      this.isShowAirSourceForm = (data.Install_Air_Pump === 1) ? true : false;
      this.wanttoShowAirSourceForm = (this.isShowAirSourceForm === true) ? true : false;

      this.airSourceForm =  this.fb.group({
        Install_Air_Pump: null,
        No_Air_Pump: 0,
        airFormArray: this.fb.array([])
      });

     if(data?.airFormArray?.length > 0) {

      data.airFormArray.forEach((value:any)=>{
        value.BS_BN_Air_Pump = (value.BS_BN_Air_Pump === 1 ? true: false);
      })

      data.airFormArray.forEach((value:any):void=> {
        (this.airSourceForm.get('airFormArray') as FormArray).push( this.addNewAirForm());
      }

      )}

      this.airSourceForm.patchValue({ 
        Install_Air_Pump: data.Install_Air_Pump,
        No_Air_Pump: data.No_Air_Pump,
        airFormArray: data.airFormArray
      });

      this.airPumpCount = data.No_Air_Pump;
      this.airSourceFormData.emit(this.airSourceForm.value);
    }
    else {
      this.airSourceForm =  this.fb.group({
        Install_Air_Pump: null,
        No_Air_Pump: 0,
        airFormArray: this.fb.array([])
      });
      this.airSourceFormData.emit(this.airSourceForm.value);
    }

    });

   }

  changeValues():void{
    this.airSourceFormData.emit(this.airSourceForm.value);
    if(this.isShowAirSourceForm === false) {
      this.enableAirSource.emit(false);
    }
    this.validateForm();
  }
  ngOnChanges(changes: SimpleChanges){
    if(changes['enableDisableAirSourceButton']?.currentValue === true) {
      // this.isShowAirSourceForm=false;
      if(this.validateFormField()=== true) {
        this.isShowAirSourceForm=true;
      }
      this.wanttoShowAirSourceForm=false;
    }
    // if(changes['formSubmitted']?.currentValue === false) {
    //   if(this.isDataPresent === false) 
    //   { 
    //     this.airSourceForm.get('Install_Air_Pump').setValue(false);
    //     this.isShowAirSourceForm=false;
    //     this.airSourceFormData.emit(this.airSourceForm.value);
    //   }
    //   else {
    //     console.log(this.airSourceForm.value);
    //   }
    // }
  }
  validateForm() {
    if(this.isShowAirSourceForm === true) {
      
      this.formSubmitted=true;
      if(this.validateFormField() === true) {
        this.enableAirSource.emit(true);
      }
      else {
        this.enableAirSource.emit(false);
      }
      
    }
  }

  validateFormField(): boolean {
    let item: any;
    let formValid: boolean = false;
    for(item of this.airFormArray.value) {
      Object.keys(item).forEach((key: string):any => {
        if(item[key] === null && key == 'Current_Air_Pump') {
          formValid=true;
        }
        if(item[key] === null && key == 'Rating_Air_Pump') {
          formValid=true;
        }
      });
    }
    return formValid;
  }

  showAirSourceForm(value:boolean):void{
    if(value){ 
      this.isShowAirSourceForm = true;
      this.airSourceForm.get('Install_Air_Pump').setValue(true);
      this.wanttoShowAirSourceForm=true;
    }else{ 
      this.isShowAirSourceForm = false;
      this.airSourceForm.get('Install_Air_Pump').setValue(false);
      this.wanttoShowAirSourceForm=false;
      this.airPumpCount = 0;
      this.airSourceForm=  this.fb.group({
        Install_Air_Pump: null,
        No_Air_Pump: 0,
       airFormArray: this.fb.array([])
  });
    }
  }


  //Create air souce form
  airSourceForm=  this.fb.group({
    Install_Air_Pump: null,
    No_Air_Pump: 0,
    airFormArray: this.fb.array([])
  });

  get airFormArray() : FormArray {
    return this.airSourceForm.get("airFormArray") as FormArray
  }

  addNewAirForm(): FormGroup {
    return this.fb.group({
      Id:null,
      Phase_Air_Pump: this.phaseTypeList[0].id,
      Current_Air_Pump: [null, Validators.required],
      Rating_Air_Pump: [null, Validators.required],
      Model_Air_Pump: [null, Validators.pattern('^[0-9]*$') ],
      BS_BN_Air_Pump: [true],
      
    })
  }
 
 
  reduceAirForm():void{
     if(this.airPumpCount >0){
      this.airPumpCount = this.airPumpCount - 1;
      this.airSourceForm.get('No_Air_Pump').setValue(this.airPumpCount);
      let deleteId = this.airFormArray.at(this.airPumpCount).value.Id;
      this.deleteById(deleteId);
      this.airFormArray.removeAt(this.airPumpCount);
     }
      
  }

  addAirForm():void{
    this.airPumpCount = this.airPumpCount + 1;
    this.airSourceForm.get('No_Air_Pump').setValue(this.airPumpCount);
    if(this.airPumpCount >= 1) {
    this.airFormArray.push(this.addNewAirForm());
    }
  }

  
ngOnDestroy() {
  if(this.airSourceSub) {
    this.airSourceSub.unsubscribe();
  }
}

/**
 * Delete last air equipment by click on left arrow icon 
 * @param id
 */
 deleteById(id:number){
  this.electricSerivce.deleteAirEquipmentById(id).subscribe(
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
