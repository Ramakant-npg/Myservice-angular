import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SiteAddressFormComponent } from './components/site-address-form/site-address-form.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import { YourConnectionFormComponent } from './components/your-connection-form/your-connection-form.component';
import { SiteContactDetailsComponent } from './components/site-contact-details/site-contact-details.component';
import { SiteOwnerDetailsComponent } from './components/site-owner-details/site-owner-details.component';
import { ApplyFormComponent } from './components/apply-form/apply-form.component';
import { MultiplePremisesDetailsComponent } from './components/multiple-premises-details/multiple-premises-details.component';
import { SiteInformationComponent } from './components/site-information/site-information.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { SinglePremisesDetailsComponent } from './components/single-premises-details/single-premises-details.component';
import { ContactPreferenceComponent } from './components/contact-preference/contact-preference.component';
import { AdditionalInformationComponent } from './components/additional-information/additional-information.component';
import { InstallerDetailsComponent } from './components/installer-details/installer-details.component';
import { MovingOurEquipmentDetailsComponent } from './components/moving-our-equipment-details/moving-our-equipment-details.component';
import { ExistingGenerationFormComponent } from './components/existing-generation-form/existing-generation-form.component';
import { HttpClientModule } from "@angular/common/http";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import { YourConnectionDateComponent } from './components/your-connection-date/your-connection-date.component';
import { YourSitePlanComponent } from './components/your-site-plan/your-site-plan.component';
import { YourWorkDateComponent } from './components/your-work-date/your-work-date.component';
import { MultipleInstallerDetailsComponent } from './components/multiple-installer-details/multiple-installer-details.component';
import { ElectricalEquipmentModuleModule } from './components/electrical-equipment/electrical-equipment.module';
import { NewGenerationModuleModule } from './components/new-generation/new-generation.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import {FooterComponent} from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

import { DialogComponent } from './components/dialog/dialog.component';
import { CallBackComponent } from './components/call-back/call-back.component';
import { HomeComponent } from './components/home/home.component';
import { ChangeMyAddressComponent } from './components/change-my-address/change-my-address.component';

@NgModule({
  declarations: [
    AppComponent,
    SiteAddressFormComponent,
    YourConnectionFormComponent,
    SiteContactDetailsComponent,
    SiteOwnerDetailsComponent,
    ApplyFormComponent,
    MultiplePremisesDetailsComponent,
    SiteInformationComponent,
    InvoiceDetailsComponent,
    SinglePremisesDetailsComponent,
    ContactPreferenceComponent,
    AdditionalInformationComponent,
    InstallerDetailsComponent,
    MovingOurEquipmentDetailsComponent,
    ExistingGenerationFormComponent,
    YourConnectionDateComponent,
    YourSitePlanComponent,
    YourWorkDateComponent,
    MultipleInstallerDetailsComponent,
    NavigationComponent,
    FooterComponent,
    HeaderComponent,
    DialogComponent,
    CallBackComponent,
    HomeComponent,
    ChangeMyAddressComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDialogModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ElectricalEquipmentModuleModule,
    NewGenerationModuleModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
