import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteAddressFormComponent } from './components/site-address-form/site-address-form.component';
import { YourConnectionFormComponent } from './components/your-connection-form/your-connection-form.component';
import { SiteContactDetailsComponent } from './components/site-contact-details/site-contact-details.component';
import { SiteOwnerDetailsComponent } from './components/site-owner-details/site-owner-details.component';
import { ApplyFormComponent } from './components/apply-form/apply-form.component';
import { MultiplePremisesDetailsComponent } from './components/multiple-premises-details/multiple-premises-details.component';
import { SiteInformationComponent } from './components/site-information/site-information.component';
import { SinglePremisesDetailsComponent } from './components/single-premises-details/single-premises-details.component';
import { InstallerDetailsComponent } from './components/installer-details/installer-details.component';
import  { ContactPreferenceComponent } from './components/contact-preference/contact-preference.component';
import { AdditionalInformationComponent } from './components/additional-information/additional-information.component';
import { MovingOurEquipmentDetailsComponent } from './components/moving-our-equipment-details/moving-our-equipment-details.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { ExistingGenerationFormComponent } from './components/existing-generation-form/existing-generation-form.component';
import { YourConnectionDateComponent } from './components/your-connection-date/your-connection-date.component';
import { YourSitePlanComponent } from './components/your-site-plan/your-site-plan.component';
import { YourWorkDateComponent } from './components/your-work-date/your-work-date.component';
import { MultipleInstallerDetailsComponent } from './components/multiple-installer-details/multiple-installer-details.component';
import { NewGenerationComponent } from './components/new-generation/new-generation.component';
import { ElectricalEquipmentComponent } from './components/electrical-equipment/electrical-equipment.component';
import { CallBackComponent } from './components/call-back/call-back.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {path: ' ', component: SiteAddressFormComponent}, //Done
  {path: 'Your_Site_Address', component: SiteAddressFormComponent}, //Done
  {path: 'Your_Connection', component: YourConnectionFormComponent}, //Done
  {path: 'Site_Contact_Details', component: SiteContactDetailsComponent}, //Done Ashmita
  {path: 'Site_Owner_Details', component: SiteOwnerDetailsComponent}, //Done Ahmed
  {path: 'Site_Information', component: SiteInformationComponent}, //Done
  {path: 'Single_Premises_Details', component: SinglePremisesDetailsComponent}, //Done
  {path: 'Contact_Preferences', component: ContactPreferenceComponent}, // Done
  {path: 'Invoice_Details', component: InvoiceDetailsComponent}, // Done
  {path: 'Existing_Generation', component: ExistingGenerationFormComponent}, // Done
  {path: 'Your_Connection_Date', component: YourConnectionDateComponent}, // Done
  {path: 'Your_Work_Date', component: YourWorkDateComponent}, // Done
  {path: 'Multiple_Installer_Details', component: MultipleInstallerDetailsComponent}, //Done
  {path: 'Single_Installer_Details', component: InstallerDetailsComponent},// Done
  {path: 'Multiple_Premises_Details', component: MultiplePremisesDetailsComponent}, //Done
  {path: 'Moving_Our_Equipment_Details', component: MovingOurEquipmentDetailsComponent}, //In progress
  {path: 'Electrical_Equipment', component: ElectricalEquipmentComponent}, //Done
  {path: 'Additional_Information', component: AdditionalInformationComponent}, // Need to disscuss with Tamal
  {path: 'Your_Site_Plan', component: YourSitePlanComponent}, // need to get api from tamal
  {path: 'New_Generation', component: NewGenerationComponent},  // need to get api
  {path: 'Call_Back', component: CallBackComponent},  //need to get api
  {path: 'home', component: HomeComponent}, 
    // {path: 'apply-form', component: ApplyFormComponent},
   {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

