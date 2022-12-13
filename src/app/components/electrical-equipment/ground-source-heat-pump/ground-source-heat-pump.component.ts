import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder,FormArray,FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ElectricalEquipmentService } from 'src/app/services/electrical-equipment.service';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-ground-source-heat-pump',
  templateUrl: './ground-source-heat-pump.component.html',
  styleUrls: ['./ground-source-heat-pump.component.scss'],
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
export class GroundSourceHeatPumpComponent implements OnInit {
  selectedBsNumber:any;
  isShowGroundSourceForm: boolean;
  wanttoShowGroundSourceForm: boolean = false;
  pumpCount:number= 0 ;
  groundSourceSub: Subscription;
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
  groundInfo:any;
  @Output() grounSourcePumpData: EventEmitter<any> = new EventEmitter();
  @Output() enableGroundButton: EventEmitter<any> = new EventEmitter();
  @Input() enableDisableGroundButton: boolean=false;
  @Input() formSubmitted: boolean=false;

  constructor(private fb: FormBuilder,  private electricSerivce: ElectricalEquipmentService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.groundSourceSub =this.electricSerivce.getElectricEquipmentdata().subscribe(electricEquipmentData=> {
      
    if( electricEquipmentData && Object.keys(electricEquipmentData?.groundPumpData).length != 0 ) {
      let data =  electricEquipmentData.groundPumpData;
      this.isShowGroundSourceForm = (data.Install_Ground_Pump === 1) ? true : false;
      this.wanttoShowGroundSourceForm = (this.isShowGroundSourceForm === true) ? true : false;

      this.groundSourceForm =  this.fb.group({
        Install_Ground_Pump: null,
        No_Ground_Pump: 0,
        pumpFormArray: this.fb.array([])
      });

     if(data?.pumpFormArray?.length > 0) {

      data.pumpFormArray.forEach((value:any)=>{
        value.BS_BN_Ground_Pump = (value.BS_BN_Ground_Pump === 1 ? true: false);
      })

      data.pumpFormArray.forEach((value:any):void=> {
        (this.groundSourceForm.get('pumpFormArray') as FormArray).push( this.addNewPumpForm());
      }

      )}

      this.groundSourceForm.patchValue({ 
        Install_Ground_Pump: data.Install_Ground_Pump,
        No_Ground_Pump: data.No_Ground_Pump,
        pumpFormArray: data.pumpFormArray
      });

      this.pumpCount = data.No_Ground_Pump;
      this.grounSourcePumpData.emit(this.groundSourceForm.value);
    }
    else {   
      this.groundSourceForm =  this.fb.group({
        Install_Ground_Pump: null,
        No_Ground_Pump: 0,
        pumpFormArray: this.fb.array([])
      });
      this.grounSourcePumpData.emit(this.groundSourceForm.value);
    }
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['enableDisableGroundButton']?.currentValue === true) {
      if(this.validateFormField() === true) {
        this.isShowGroundSourceForm=true;
      }
      this.wanttoShowGroundSourceForm=false;
    }
    // if(changes['formSubmitted']?.currentValue === false) {
    //   if(!this.groundSourceSub) {
    //     this.groundSourceForm.get('Install_Ground_Pump').setValue(false);
    //     this.isShowGroundSourceForm = false;
    //     this.grounSourcePumpData.emit(this.groundSourceForm.value);
    //   }
    // }

  }

  changeValues():void{
    this.grounSourcePumpData.emit(this.groundSourceForm.value);
    if(this.isShowGroundSourceForm === false) {
      this.enableGroundButton.emit(false);
    }
    this.validateForm();
  }

/**
 * show and hide ground source form by click on yes and no button
 * @param value 
 */
  showGroundSourceForm(value:boolean):void{
    if(value) {
        this.isShowGroundSourceForm = true;
        this.groundSourceForm.get('Install_Ground_Pump').setValue(true);
        this.wanttoShowGroundSourceForm=true;
      } else { 
        this.isShowGroundSourceForm = false;
        this.groundSourceForm.get('Install_Ground_Pump').setValue(false);
        this.wanttoShowGroundSourceForm=false;
        this.pumpCount=0;
        this.groundSourceForm =  this.fb.group({
          Install_Ground_Pump: null,
          No_Ground_Pump: 0,
          pumpFormArray: this.fb.array([])
        });
      }
  }



  validateForm() {
    if(this.isShowGroundSourceForm === true) {
      
      this.formSubmitted=true;
      if(this.validateFormField() === true) {
        this.enableGroundButton.emit(true);
      }
      else {
        this.enableGroundButton.emit(false);
      }
      
    }
  }

  validateFormField(): boolean {
    let item: any;
    let formValid: boolean = false;
    for(item of this.pumpFormArray.value) {
      Object.keys(item).forEach((key: string):any => {
        if(item[key] === null && key == 'Current_Ground_Pump') {
          formValid=true;
        }
        if(item[key] === null && key == 'Rating_Ground_Pump') {
          formValid=true;
        }
      });
    }
    return formValid;
  }
  //Create ground souce form
  groundSourceForm =  this.fb.group({
    Install_Ground_Pump: null,
    No_Ground_Pump: 0,
    pumpFormArray: this.fb.array([])
  });

/**get list of dynamic ground source pump  */
  get pumpFormArray() : FormArray {
    return this.groundSourceForm.get("pumpFormArray") as FormArray
  }

/**
 * add new dynamic form
 * @returns ground
 */
  addNewPumpForm(): FormGroup {
    return this.fb.group({
      Id: null,
      Phase_Ground_Pump: this.phaseTypeList[0].id,
      Current_Ground_Pump: [null, Validators.required],
      Rating_Ground_Pump: [null, Validators.required],
      Model_Ground_Pump: [null, Validators.pattern('^[0-9]*$') ],
      BS_BN_Ground_Pump: [true, Validators.required],
    })
  }
 
 /**
  * delete ground source form by click on left icon
  */
  reducePumpForm():void{
     if(this.pumpCount >0){
      this.pumpCount = this.pumpCount - 1;
      this.groundSourceForm.get('No_Ground_Pump').setValue(this.pumpCount);
      let deleteId = this.pumpFormArray.at(this.pumpCount).value.Id;
      this.deleteById(deleteId);
      this.pumpFormArray.removeAt(this.pumpCount);
     }
      
  }

   /**
  * add ground source form by click on right icon
  */
  addPumpForm():void{
    this.pumpCount = this.pumpCount + 1;
    this.groundSourceForm.get('No_Ground_Pump').setValue(this.pumpCount);
    if(this.pumpCount >= 1){
      this.pumpFormArray.push(this.addNewPumpForm());
    }
  }

/**
 * get the ground souce pump form data
 * @returns
 */
getGroundSourcePumpData():any{
  if(this.groundSourceForm.valid){
    return this.groundSourceForm.value;
  }
}



ngOnDestroy() {
  if(this.groundSourceSub) {
    this.groundSourceSub.unsubscribe();
  }
}


/**
 * Delete last ground equipment by click on left arrow icon 
 * @param id
 */
 deleteById(id:number){
  this.electricSerivce.deleteGroundEquipmentById(id).subscribe(
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
