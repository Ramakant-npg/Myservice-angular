import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElectricalEquipmentService } from 'src/app/services/electrical-equipment.service';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-electric-shower-heater',
  templateUrl: './electric-shower-heater.component.html',
  styleUrls: ['./electric-shower-heater.component.scss'],
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
export class ElectricShowerHeaterComponent implements OnInit {
  @Input() formSubmitted: boolean=false;
  @Input() enableDisableElectricButton: boolean=false;
  @Output() enableElectricShower: EventEmitter<any> = new EventEmitter();
  @Output() electricShowerFormData: EventEmitter<any> = new EventEmitter();
  isShowElectricShowerForm: boolean;
  wanttoShowElectricShowerForm: boolean=false;
  loadingElectricSubs: Subscription;
  
  heatingInfo:any;
  constructor(private fb: FormBuilder,
    private electricSerivce: ElectricalEquipmentService) {}

  //Create electric shower form
  electricShowerForm = this.fb.group({
      Id: null,
      Install_Electric_Heater: [null],
      No_Electric_Shower: [null, Validators.pattern('^[0-9]*$')],
      Load_Electric_Shower: [null, Validators.pattern('^[0-9]*$')],
      No_Water_Heater: [null, Validators.pattern('^[0-9]*$')],
      Load_Water_Heater: [null, Validators.pattern('^[0-9]*$')],
      No_Storage_Heater: [null, Validators.pattern('^[0-9]*$')],
      Load_Storage_Heater: [null, Validators.pattern('^[0-9]*$')],
      No_DASH: [null, Validators.pattern('^[0-9]*$')],
      Load_DASH: [null, Validators.pattern('^[0-9]*$')],
      No_Other_Heater: [null, Validators.pattern('^[0-9]*$')],
      Load_Other_Heater: [null, Validators.pattern('^[0-9]*$')],
  });

  ngOnInit(): void {  
    this.loadingElectricSubs=this.electricSerivce.getElectricEquipmentdata().subscribe(electricEquipmentData=> {
      if( electricEquipmentData?.electricHeaterData != null ) {
        let data =  electricEquipmentData.electricHeaterData;
      this.isShowElectricShowerForm = (data.Install_Electric_Heater === 1) ? true : false;
      this.wanttoShowElectricShowerForm=(this.isShowElectricShowerForm === true) ? true : false;
      this.electricShowerForm.patchValue({
        Id: data.Id,
        Install_Electric_Heater: data.Install_Electric_Heater,
        No_Electric_Shower: data.No_Electric_Shower,
        Load_Electric_Shower: data.Load_Electric_Shower,
        No_Water_Heater: data.No_Water_Heater,
        Load_Water_Heater: data.Load_Water_Heater,
        No_Storage_Heater: data.No_Storage_Heater,
        Load_Storage_Heater: data.Load_Storage_Heater,
        No_DASH: data.No_DASH,
        Load_DASH: data.Load_DASH,
        No_Other_Heater: data.No_Other_Heater,
        Load_Other_Heater: data.Load_Other_Heater
      });
    }
    });
    
  }

ngOnChanges(changes: SimpleChanges){
  if(changes['enableDisableElectricButton']?.currentValue === true) {
    if(this.electricShowerForm.get('No_Electric_Shower') === null) {
      this.isShowElectricShowerForm=false;
    }
    this.wanttoShowElectricShowerForm=false;
  }
  if(changes['formSubmitted']) {
    if(!this.loadingElectricSubs){
    if(this.electricShowerForm.get('Install_Electric_Heater').value === null) {
      this.electricShowerForm.get('Install_Electric_Heater').setValue(false);
      this.isShowElectricShowerForm=false;
      this.electricShowerFormData.emit(this.electricShowerForm.value);
    }
  }
 
  }
}

changeValues() {
  if(this.isShowElectricShowerForm === true) {
    if (this.electricShowerForm.get('No_Electric_Shower').value) {
      this.enableElectricShower.emit(false);
    }
    else {
      this.enableElectricShower.emit(true);
    }
  }
  if(this.isShowElectricShowerForm === false) {
    this.enableElectricShower.emit(false);
  }
  this.electricShowerFormData.emit(this.electricShowerForm.value);
}

//show and hide electric shower form on yes and no button click
showElectricShowerForm(value:boolean){
  
  this.isShowElectricShowerForm = (value === true ? true : false);
  this.wanttoShowElectricShowerForm = (value === true ? true : false);
  if(this.isShowElectricShowerForm === true) {
    this.electricShowerForm.get('Install_Electric_Heater').setValue(true);
    this.enableElectricShower.emit(true);
  }
  else if(this.isShowElectricShowerForm === false){
    this.electricShowerForm.get('Install_Electric_Heater').setValue(false);
    this.enableElectricShower.emit(false);
  }
}

// electric form data
getElectricShowerData():any{
  if(this.electricShowerForm.valid){
   return this.electricShowerForm.value;
  }
}

ngOnDestroy() {
  if(this.loadingElectricSubs) {
    this.loadingElectricSubs.unsubscribe();
  }
}


}
