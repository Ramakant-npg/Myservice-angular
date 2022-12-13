import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder,FormArray,FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ElectricalEquipmentService } from 'src/app/services/electrical-equipment.service';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-welder',
  templateUrl: './welder.component.html',
  styleUrls: ['./welder.component.scss'],
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
export class WelderComponent implements OnInit {
 
  welderInfo:any;
  isShowWelderForm:Boolean = false;
  wanttoShowWelderForm: boolean = false;
  welderCount:number= 0 ;
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
  // formSubmitted: boolean=false;
  @Output() welderFormData: EventEmitter<any> = new EventEmitter();
  @Output() enableWelder: EventEmitter<any> = new EventEmitter();
  @Input() enableDisableWelderButton: boolean=false;
  @Input() formSubmitted: boolean=false;
  welderSourceSub:Subscription;


  constructor(private fb: FormBuilder,  private electricSerivce: ElectricalEquipmentService, private _snackBar: MatSnackBar) {}

   ngOnInit(): void {
    this.welderSourceSub =this.electricSerivce.getElectricEquipmentdata().subscribe(electricEquipmentData=> {

    if( electricEquipmentData && Object.keys(electricEquipmentData?.welderData).length != 0 ) {
      let data =  electricEquipmentData.welderData;
      this.isShowWelderForm = (data.Install_Welder === 1) ? true : false;
      this.wanttoShowWelderForm = (this.isShowWelderForm === true) ? true : false;

      this.welderForm =  this.fb.group({
        Install_Welder: null,
        No_Welder: 0,
        welderFormArray: this.fb.array([])
      });

     if(data?.welderFormArray?.length > 0) {
      data.welderFormArray.forEach((value:any):void=> {
        (this.welderForm.get('welderFormArray') as FormArray).push( this.addNewWelderForm());
        }
      )}

      this.welderForm.patchValue({ 
        Install_Welder: data.Install_Welder,
        No_Welder: data.No_Welder,
        welderFormArray: data.welderFormArray,
        
      });
      this.welderCount = data.No_Welder;
      this.welderFormData.emit(this.welderForm.value);
    }
    else {
      this.welderForm =  this.fb.group({
        Install_Welder: null,
        No_Welder: 0,
        welderFormArray: this.fb.array([])
      });
      this.welderFormData.emit(this.welderForm.value);
    }

    });
    // console.log(this.welderForm.value);
   }


  ngOnChanges(changes: SimpleChanges) {
    
    if(changes['enableDisableWelderButton']?.currentValue === true) {
      if(this.validateFormField() === true) {
        this.isShowWelderForm=true;
      }
      this.wanttoShowWelderForm=false;
    }
  //   if(changes['formSubmitted']?.currentValue === false) {
  //     this.welderForm.get('Install_Welder').setValue(false);
  //     this.isShowWelderForm=false;
  //     this.welderFormData.emit(this.welderForm.value);
  // }
  }
  
  changeValues():void{
    this.welderFormData.emit(this.welderForm.value);
    if(this.isShowWelderForm === false) {
      this.enableWelder.emit(false);
    }
    this.validate();
  }

    showWelderForm(value:boolean):void{
      if(value){ 
        this.isShowWelderForm = true;
        this.welderForm.get('Install_Welder').setValue(true);
        this.wanttoShowWelderForm=true;
      } else { 
        this.isShowWelderForm = false;
        this.welderForm.get('Install_Welder').setValue(false);
        this.wanttoShowWelderForm=false;
        this.welderCount = 0;
        this.welderForm=  this.fb.group({
        Install_Welder: null,
        No_Welder: 0,
        welderFormArray: this.fb.array([])
      });
    }
  }

  validate() {
    this.formSubmitted=true;
    if(this.isShowWelderForm === true && this.validateFormField() === true) {
      this.enableWelder.emit(true);
    }
    else {
      this.enableWelder.emit(false);
    }
  }

  validateFormField() {
    let item: any;
    let formValid: boolean = false;
    for(item of this.welderFormArray.value) {
      Object.keys(item).forEach((key: string):any => {
        if(item[key] === null && key == 'Current_Welder') {
          formValid=true;
        }
        if(item[key] === null && key == 'Voltage_Welder') {
          formValid=true;
        }
        if(item[key] === null && key == 'Rating_Welder') {
          formValid=true;
        }
      });
    }
    return formValid;
  }

  //Create ground souce form
  welderForm=  this.fb.group({
    Install_Welder: null,
    No_Welder: 0,
    welderFormArray: this.fb.array([])
  });

  get welderFormArray() : FormArray {
    return this.welderForm.get("welderFormArray") as FormArray
  }

  addNewWelderForm(): FormGroup {
    // console.log("Add " +JSON.stringify(this.welderForm.value));
    return this.fb.group({
      Id:null,
      Voltage_Welder:[null, Validators.pattern('^[0-9]*$') ],
      Current_Welder: [null, Validators.required],
      Rating_Welder: [null, Validators.required],
      Weld_Per_Minute: [null, Validators.pattern('^[0-9]*$') ],
      Phase_Welder: this.phaseTypeList[0].id,
    })
  }
 
 
  reduceWelderForm():void{
     if(this.welderCount >0){
      this.welderCount = this.welderCount - 1;
      this.welderForm.get('No_Welder').setValue(this.welderCount);
      let deleteId = this.welderFormArray.at(this.welderCount).value.Id;
      this.deleteById(deleteId);
      this.welderFormArray.removeAt(this.welderCount);
     }
  }

  addWelderForm():void{
    this.welderCount = this.welderCount + 1;
    this.welderForm.get('No_Welder').setValue(this.welderCount);
    this.welderFormArray.push(this.addNewWelderForm());
    }

     
ngOnDestroy() {
  if(this.welderSourceSub) {
    this.welderSourceSub.unsubscribe();
  }
}

/**
 * Delete last welder equipment by click on left arrow icon 
 * @param id
 */
  deleteById(id:number){
    this.electricSerivce.deleteWelderEquipmentById(id).subscribe(
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
