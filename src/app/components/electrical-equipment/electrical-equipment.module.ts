import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {ElectricalEquipmentComponent} from './electrical-equipment.component';
import {ElectricShowerHeaterComponent} from './electric-shower-heater/electric-shower-heater.component';
import { GroundSourceHeatPumpComponent } from './ground-source-heat-pump/ground-source-heat-pump.component';
import { AirSourceHeatPumpComponent } from './air-source-heat-pump/air-source-heat-pump.component';
import { MotorComponent } from './motor/motor.component';
import {WelderComponent} from './welder/welder.component';
import {HarmonicComponent} from './harmonic/harmonic.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    ElectricalEquipmentComponent,
    ElectricShowerHeaterComponent,
    GroundSourceHeatPumpComponent,
    AirSourceHeatPumpComponent,
    MotorComponent,
    WelderComponent,
    HarmonicComponent
    ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  exports:[
    ElectricalEquipmentComponent,
    ElectricShowerHeaterComponent,
    GroundSourceHeatPumpComponent,
    AirSourceHeatPumpComponent,
    MotorComponent,
    WelderComponent,
    HarmonicComponent
  ],
    
})
export class ElectricalEquipmentModuleModule { }