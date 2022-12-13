import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder,FormArray,FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ElectricalEquipmentService } from 'src/app/services/electrical-equipment.service';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.scss'],
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
export class MotorComponent implements OnInit {

  
motorInfo:any;
  isSourcePumpComply:boolean= false;
  isShowMotorForm:Boolean = false;
  wanttoShowMotorForm: boolean=false;
  motorCount:number= 0 ;
  // tempMotorCount:number =0;
  // formSubmitted: boolean =false;

  phaseList= [
    {
      id: 0,
      name: 'Single'
    },
    {
      id: 1,
      name: 'Three Phase'
    }
  ];

  phaseTypeList= [
    {
      id: 0,
      name: 'Soft Start'
    },
    {
      id: 1,
      name: 'Direct on line '
    },
    {
      id: 2,
      name: 'Star delta'
    }
  ]; 

  @Output() motorFormData: EventEmitter<any> = new EventEmitter();
  @Output() enableMotor: EventEmitter<any> = new EventEmitter();
  @Input() enableDisableMotorButton: boolean=false;
  @Input() formSubmitted: boolean=false;
  motorSourceSub:Subscription;

  constructor(private fb: FormBuilder,  private electricSerivce: ElectricalEquipmentService, private _snackBar: MatSnackBar) {}

   ngOnInit(): void {
    this.motorSourceSub =this.electricSerivce.getElectricEquipmentdata().subscribe(electricEquipmentData=> {

    if( electricEquipmentData && Object.keys(electricEquipmentData?.motorData).length != 0 ) {
      let data =  electricEquipmentData.motorData;
      this.isShowMotorForm = (data.Install_Motor === 1) ? true : false;
      this.wanttoShowMotorForm = (this.isShowMotorForm === true) ? true : false;
      this.motorSourceForm =  this.fb.group({
        Install_Motor: null,
        No_Motor: 0,
        motorFormArray: this.fb.array([]),
      });

     if(data?.motorFormArray?.length > 0) {
      data.motorFormArray.forEach((value:any)=>{
        value.Hourly_Motor_Start = (value.Hourly_Motor_Start === 1 ? true: false);
      })
      data.motorFormArray.forEach((value:any):void=> {
        (this.motorSourceForm.get('motorFormArray') as FormArray).push( this.addNewMotorForm());
      }
      )}

      this.motorSourceForm.patchValue({ 
        Install_Motor: data.Install_Motor,
        No_Motor: data.No_Motor,
        motorFormArray: data.motorFormArray,
      });
      this.motorCount = data.No_Motor;
      this.motorFormData.emit(this.motorSourceForm.value);
    }

    else {
      this.motorSourceForm =  this.fb.group({
        Install_Motor: null,
        No_Motor: 0,
        motorFormArray: this.fb.array([]),
    
      });
      this.motorFormData.emit(this.motorSourceForm.value);
    }
    });
   }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['enableDisableMotorButton']?.currentValue === true) {
      if(this.validateFormFieldMotor() === true && this.motorCount >= 1) {
        this.isShowMotorForm=true;
      }
      this.wanttoShowMotorForm=false;
    }
    // if(changes['formSubmitted']?.currentValue === false) {
    //  this.motorSourceForm.get('Install_Motor').setValue(false);
    //   this.isShowMotorForm=false;
    //   this.motorFormData.emit(this.motorSourceForm.value);
    // }
  }
  
 changeValues():void{
   this.motorFormData.emit(this.motorSourceForm.value)
    if(this.isShowMotorForm === false) {
      this.enableMotor.emit(false);
    }
    this.validateForm();
  }

  validateForm() {
    if(this.isShowMotorForm === true) {
      this.formSubmitted=true;
      this.motorFormData.emit(this.motorSourceForm.value);
      if(this.validateFormFieldMotor() === true && this.motorCount > 0 ) {
        this.enableMotor.emit(true);
      }
      else {
        this.enableMotor.emit(false);
      }
      
    }
  }

  validateFormFieldMotor(): boolean {
    let item: any;
    let formValid: boolean = false;
    for(item of this.motorFormArray.value) {
      Object.keys(item).forEach((key: string):any => {
        if(item[key] === null && key == 'Current_Motor') {
          formValid=true;
        }
        if(item[key] === null && key == 'Rating_Motor') {
          formValid=true;
        }
      });
    }
    return formValid;
  }
  

  showMotorForm(value:boolean):void{
    if(value){ 
      this.isShowMotorForm = true;
      this.motorSourceForm.get('Install_Motor').setValue(true);
      this.wanttoShowMotorForm=true;
    }
    else { 
      this.isShowMotorForm = false;
     this.motorSourceForm.get('Install_Motor').setValue(false);
      this.wanttoShowMotorForm=false;
      this.motorCount = 0;
      this.motorSourceForm=  this.fb.group({
        Install_Motor: null,
        No_Motor: 0,
        motorFormArray: this.fb.array([]),
     
      });
    }
  }

  //Create motor souce form
  motorSourceForm=  this.fb.group({
    Install_Motor: null,
    No_Motor: 0,
    motorFormArray: this.fb.array([]),
  });


  get motorFormArray() : FormArray {
    return this.motorSourceForm.get("motorFormArray") as FormArray
  }

  addNewMotorForm(): FormGroup {
    return this.fb.group({
      Id:null,
      Phase_Motor: [this.phaseList[0].id],
      Type_Motor: [this.phaseTypeList[0].id],
      Current_Motor: [null, Validators.pattern('^[0-9]*$')],
      Rating_Motor: [null, Validators.pattern('^[0-9]*$')],
      Hourly_Motor_Start: [this.isSourcePumpComply, Validators.required],
    })
  }

 
  reduceMotorForm(item:string):void{
   if(item === 'motor' && this.motorCount > 0 ){
      this.motorCount = this.motorCount - 1;
      this.motorSourceForm.get('No_Motor').setValue(this.motorCount);
      let deleteId = this.motorFormArray.at(this.motorCount).value.Id;
      this.deleteById(deleteId);
      this.motorFormArray.removeAt(this.motorCount);
    } 
  }

  addMotorForm(item:string):void{
    if(item === 'motor' ){
      this.motorCount = this.motorCount + 1;
      this.motorSourceForm.get('No_Motor').setValue(this.motorCount);
      this.motorFormArray.push(this.addNewMotorForm());
    } 
  }

     
ngOnDestroy() {
  if(this.motorSourceSub) {
    this.motorSourceSub.unsubscribe();
  }
}

 /**
 * Delete last motor equipment by click on left arrow icon 
 * @param id
 */
  deleteById(id:number) {
    this.electricSerivce.deleteMotorEquipmentById(id).subscribe(
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



