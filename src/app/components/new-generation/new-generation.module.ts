
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import { EnergyStorageComponent } from './energy-storage/energy-storage.component';
import { MoreThanFiveMinComponent } from './more-than-five-min/more-than-five-min.component';
import { ThreeKwInstallationFormComponent } from './more-than-three-kw/three-kw-installation-form/three-kw-installation-form.component';
import { MoreThanThreeKwComponent } from './more-than-three-kw/more-than-three-kw.component';
import { MoreThanTwoHundredKwComponent } from './more-than-two-hundred-kw/more-than-two-hundred-kw.component';
import { TwoHundredInstallationFormComponent } from './more-than-two-hundred-kw/two-hundred-installation-form/two-hundred-installation-form.component';
import { MwOrKwComponent } from './mw-or-kw/mw-or-kw.component';
import { NewGenerationComponent } from './new-generation.component';
import { StandbyComponent } from './standby/standby.component';
import { MwKwInstallationFormComponent } from './mw-or-kw/mw-kw-installation-form/mw-kw-installation-form.component';


@NgModule({
  declarations: [
    NewGenerationComponent,
    MoreThanThreeKwComponent,
    MoreThanTwoHundredKwComponent,
    StandbyComponent,
    MoreThanFiveMinComponent,
    MwOrKwComponent,
    EnergyStorageComponent,
    ThreeKwInstallationFormComponent,
    TwoHundredInstallationFormComponent,
    MwKwInstallationFormComponent
    ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSelectModule,
    MatDividerModule
  ],
  exports:[
    NewGenerationComponent,
    MoreThanThreeKwComponent,
    MoreThanTwoHundredKwComponent,
    StandbyComponent,
    MoreThanFiveMinComponent,
    MwOrKwComponent,
    EnergyStorageComponent,
    ThreeKwInstallationFormComponent,
    TwoHundredInstallationFormComponent,
    MwKwInstallationFormComponent
  ],
    
})
export class NewGenerationModuleModule { }
