import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'src/app/services/http-service.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-energy-storage',
  templateUrl: './energy-storage.component.html',
  styleUrls: ['./energy-storage.component.scss']
})
export class EnergyStorageComponent implements OnInit {

  @Input() installationFormName!:any ;
  @Output() installationFormData: EventEmitter<any> = new EventEmitter();
  @Output() enableOtherFormsOnValid: EventEmitter<any> = new EventEmitter();
  @Input() parentToChildFormData:any;

  fileNameOperatingAttachment1:File;
  fileNameOperatingAttachment2: File;
  fileNameSupportingAttachment1: File;
  fileNameSupportingAttachment2: File;
  fileBasedId:any;
  isValidFileType: boolean = true;
  allowFileType: string [] = ["doc","docx","pdf","jpg","jpeg","png", "gif"];
  file:any;
  loading: boolean = false;
  connectionId: any;
  // OperatingFile1: any;
  // OperatingFile2: any;
  // SupportingFile1: any;
  // SupportingFile2: any;

  constructor(private fb: FormBuilder, private httpService: HttpService,  private _snackBar: MatSnackBar,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.getConnectionId().subscribe((data: any) => {
      this.connectionId=data;
    });
    let nameOfForm = this.installationFormName;
    if(this.parentToChildFormData && this.parentToChildFormData[0][this.installationFormName]) {
      this.updateFormValueOnLoad(nameOfForm);
    } else {
    this.installationFormName = this.fb.group({
      Id: [null],
      Is_Storage_Only_Or_Combined: [null],
      Storage_Technology: [null],
      Another_Technology: [null],
      Nameplate_Power_Rating: [null],
      Registered_Energy_Capacity: [null],
      Export_Firm_MW: [null],
      Export_Firm_Positive_MVAr: [null],
      Export_Firm_Negative_MVAr: [null],
      Export_Non_Firm_MW: [null],
      Export_Non_Firm_Positive_MVAr: [null],
      Export_Non_Firm_Negative_MVAr: [null],
      Export_Total_MW: [null],
      Export_Total_Positive_MVAr: [null],
      Export_Total_Negative_MVAr: [null],
      Import_Firm_MW: [null],
      Import_Firm_Positive_MVAr: [null],
      Import_Firm_Negative_MVAr: [null],
      Import_Non_Firm_MW: [null],
      Import_Non_Firm_Positive_MVAr: [null],
      Import_Non_Firm_Negative_MVAr: [null],
      Import_Total_MW: [null],
      Import_Total_Positive_MVAr: [null],
      Import_Total_Negative_MVAr: [null],
      No_Operating_Modes: [null],
      Operating_Attachment_1: [null],
      OperatingFile1: [null],
      Operating_Attachment_2: [null],
      OperatingFile2: [null],
      ESS_With_Another_Generation: [null],
      ESS_Another_Generation_Details: [null],
      Supporting_Attachment_1: [null],
      SupportingFile1: [null],
      Supporting_Attachment_2: [null],
      SupportingFile2: [null],
      Commercial_Service_Name: [null],
      Commercial_Service_Contact: [null],
      Coordinated_Other_Storage: [null],
      Coordinated_Storage_Details: [null],
      Export_Power_Ramp_Rate_Positive: [null],
      Export_Power_Ramp_Rate_Negative: [null],
      Import_Power_Ramp_Rate_Positive: [null],
      Import_Power_Ramp_Rate_Negative: [null],
      Power_Swing_MW: [null],
      Power_Swing_Up: [null],
      Power_Swing_Down: [null],
      Power_Swing_Both: [null],
      Dynamic_Requirements: [null],
      Dynamic_Requirements_Details: [null]
    });
  }
  }

  changeValues(): void {
    this.installationFormData.emit(this.installationFormName.value);
    this.enableOtherFormsOnValid.emit(true);
  }

  updateFormValueOnLoad(formName:any):void{

    this.installationFormName = this.fb.group({
      Id: [null],
      Is_Storage_Only_Or_Combined: [null],
      Storage_Technology: [null],
      Another_Technology: [null],
      Nameplate_Power_Rating: [null],
      Registered_Energy_Capacity: [null],
      Export_Firm_MW: [null],
      Export_Firm_Positive_MVAr: [null],
      Export_Firm_Negative_MVAr: [null],
      Export_Non_Firm_MW: [null],
      Export_Non_Firm_Positive_MVAr: [null],
      Export_Non_Firm_Negative_MVAr: [null],
      Export_Total_MW: [null],
      Export_Total_Positive_MVAr: [null],
      Export_Total_Negative_MVAr: [null],
      Import_Firm_MW: [null],
      Import_Firm_Positive_MVAr: [null],
      Import_Firm_Negative_MVAr: [null],
      Import_Non_Firm_MW: [null],
      Import_Non_Firm_Positive_MVAr: [null],
      Import_Non_Firm_Negative_MVAr: [null],
      Import_Total_MW: [null],
      Import_Total_Positive_MVAr: [null],
      Import_Total_Negative_MVAr: [null],
      No_Operating_Modes: [null],
      Operating_Attachment_1: [null],
      OperatingFile1: [null],
      Operating_Attachment_2: [null],
      OperatingFile2: [null],
      ESS_With_Another_Generation: [null],
      ESS_Another_Generation_Details: [null],
      Supporting_Attachment_1: [null],
      SupportingFile1: [null],
      Supporting_Attachment_2: [null],
      SupportingFile2: [null],
      Commercial_Service_Name: [null],
      Commercial_Service_Contact: [null],
      Coordinated_Other_Storage: [null],
      Coordinated_Storage_Details: [null],
      Export_Power_Ramp_Rate_Positive: [null],
      Export_Power_Ramp_Rate_Negative: [null],
      Import_Power_Ramp_Rate_Positive: [null],
      Import_Power_Ramp_Rate_Negative: [null],
      Power_Swing_MW: [null],
      Power_Swing_Up: [null],
      Power_Swing_Down: [null],
      Power_Swing_Both: [null],
      Dynamic_Requirements: [null],
      Dynamic_Requirements_Details: [null]
    });

    this.installationFormName.patchValue({
      Id: this.parentToChildFormData[0][formName].Id,
      Is_Storage_Only_Or_Combined: this.parentToChildFormData[0][formName].Is_Storage_Only_Or_Combined,
      Storage_Technology: this.parentToChildFormData[0][formName].Storage_Technology,
      Another_Technology: this.parentToChildFormData[0][formName].Another_Technology,
      Nameplate_Power_Rating: this.parentToChildFormData[0][formName].Nameplate_Power_Rating,
      Registered_Energy_Capacity: this.parentToChildFormData[0][formName].Registered_Energy_Capacity,
      Export_Firm_MW: this.parentToChildFormData[0][formName].Export_Firm_MW,
      Export_Firm_Positive_MVAr: this.parentToChildFormData[0][formName].Export_Firm_Positive_MVAr,
      Export_Firm_Negative_MVAr: this.parentToChildFormData[0][formName].Export_Firm_Negative_MVAr,
      Export_Non_Firm_MW: this.parentToChildFormData[0][formName].Export_Non_Firm_MW,
      Export_Non_Firm_Positive_MVAr: this.parentToChildFormData[0][formName].Export_Non_Firm_Positive_MVAr,
      Export_Non_Firm_Negative_MVAr: this.parentToChildFormData[0][formName].Export_Non_Firm_Negative_MVAr,
      Export_Total_MW: this.parentToChildFormData[0][formName].Export_Total_MW,
      Export_Total_Positive_MVAr: this.parentToChildFormData[0][formName].Export_Total_Positive_MVAr,
      Export_Total_Negative_MVAr: this.parentToChildFormData[0][formName].Export_Total_Negative_MVAr,
      Import_Firm_MW: this.parentToChildFormData[0][formName].Import_Firm_MW,
      Import_Firm_Positive_MVAr: this.parentToChildFormData[0][formName].Import_Firm_Positive_MVAr,
      Import_Firm_Negative_MVAr: this.parentToChildFormData[0][formName].Import_Firm_Negative_MVAr,
      Import_Non_Firm_MW: this.parentToChildFormData[0][formName].Import_Non_Firm_MW,
      Import_Non_Firm_Positive_MVAr: this.parentToChildFormData[0][formName].Import_Non_Firm_Positive_MVAr,
      Import_Non_Firm_Negative_MVAr: this.parentToChildFormData[0][formName].Import_Non_Firm_Negative_MVAr,
      Import_Total_MW: this.parentToChildFormData[0][formName].Import_Total_MW,
      Import_Total_Positive_MVAr: this.parentToChildFormData[0][formName].Import_Total_Positive_MVAr,
      Import_Total_Negative_MVAr: this.parentToChildFormData[0][formName].Import_Total_Negative_MVAr,
      No_Operating_Modes: this.parentToChildFormData[0][formName].No_Operating_Modes,
      Operating_Attachment_1: this.parentToChildFormData[0][formName].Operating_Attachment_1,
      Operating_Attachment_2: this.parentToChildFormData[0][formName].Operating_Attachment_2,
      OperatingFile1 : this.parentToChildFormData[0][formName].OperatingFile1,
      OperatingFile2 : this.parentToChildFormData[0][formName].OperatingFile2,
      ESS_With_Another_Generation: this.parentToChildFormData[0][formName].ESS_With_Another_Generation,
      ESS_Another_Generation_Details: this.parentToChildFormData[0][formName].ESS_Another_Generation_Details,
      Supporting_Attachment_1: this.parentToChildFormData[0][formName].Supporting_Attachment_1,
      Supporting_Attachment_2: this.parentToChildFormData[0][formName].Supporting_Attachment_2,
      SupportingFile1 : this.parentToChildFormData[0][formName].SupportingFile1,
      SupportingFile2 : this.parentToChildFormData[0][formName].SupportingFile2,
      Commercial_Service_Name: this.parentToChildFormData[0][formName].Commercial_Service_Name,
      Commercial_Service_Contact: this.parentToChildFormData[0][formName].Commercial_Service_Contact,
      Coordinated_Other_Storage: this.parentToChildFormData[0][formName].Coordinated_Other_Storage,

      Coordinated_Storage_Details: this.parentToChildFormData[0][formName].Coordinated_Storage_Details,

      Export_Power_Ramp_Rate_Positive: this.parentToChildFormData[0][formName].Export_Power_Ramp_Rate_Positive,
      Export_Power_Ramp_Rate_Negative: this.parentToChildFormData[0][formName].Export_Power_Ramp_Rate_Negative,

      Import_Power_Ramp_Rate_Positive: this.parentToChildFormData[0][formName].Import_Power_Ramp_Rate_Positive,
      Import_Power_Ramp_Rate_Negative: this.parentToChildFormData[0][formName].Import_Power_Ramp_Rate_Negative,

      Power_Swing_MW: this.parentToChildFormData[0][formName].Power_Swing_MW,
      Power_Swing_Up: this.parentToChildFormData[0][formName].Power_Swing_Up,
      Power_Swing_Down: this.parentToChildFormData[0][formName].Power_Swing_Down,
      Power_Swing_Both: this.parentToChildFormData[0][formName].Power_Swing_Both,
      Dynamic_Requirements: this.parentToChildFormData[0][formName].Dynamic_Requirements,
      Dynamic_Requirements_Details: this.parentToChildFormData[0][formName].Dynamic_Requirements_Details
      
    });

  }

  // fileNameOperatingAttachment1:File;
  // fileNameOperatingAttachment2: File;
  // fileNameSupportingAttachment1: File;
  // fileNameSupportingAttachment2: File;

  onChange(event: any, type: string):void {
    if(type === 'Operating1') {
      
      this.fileNameOperatingAttachment1 = event.target.files[0];
    }
    if(type === 'Operating2') {
      this.fileNameOperatingAttachment2=event.target.files[0];
    } 
    if(type === 'Supporting1') {
      this.fileNameSupportingAttachment1=event.target.files[0];
    } 
    if(type === 'Supporting2') {
      this.fileNameSupportingAttachment2=event.target.files[0];
    } 
    
  }

  
validateFileType(fileType: string){
  this.isValidFileType =  this.allowFileType.includes(fileType.toLocaleLowerCase())? true: false;
  return this.isValidFileType;
}

// OnClick of button Upload
onUpload(data: string) {
  let fileType;
  const formData = new FormData();
  formData.append('Connection_Id', this.connectionId);
  if(data === 'Operating_Attachment_1') {
    this.file = this.fileNameOperatingAttachment1;
    fileType = this.fileNameOperatingAttachment1.name.split('.');
    formData.append('file',this.fileNameOperatingAttachment1);
   }
   if(data === 'Operating_Attachment_2') {
    this.file = this.fileNameOperatingAttachment2;
    fileType = this.fileNameOperatingAttachment2.name.split('.');
    formData.append('file',this.fileNameOperatingAttachment2);
   }
   if(data === 'Supporting_Attachment_1') {
    this.file = this.fileNameSupportingAttachment1;
    fileType = this.fileNameSupportingAttachment1.name.split('.');
    formData.append('file',this.fileNameSupportingAttachment1);
   }
   if(data === 'Supporting_Attachment_2') {
    this.file = this.fileNameSupportingAttachment2;
    fileType = this.fileNameSupportingAttachment2.name.split('.');
    formData.append('file',this.fileNameSupportingAttachment2);
   }
   
   if(this.file  && this.validateFileType(fileType[1])) {
     this.loading = !this.loading;
     
    //  this.installationFormName.controls[data].setValue(this.file.name);
    
     this.httpService.upload(formData).subscribe((response: any) => {
       
       if(response.filebaseId){
         this.installationFormName.controls[data].setValue(response.filebaseId);
        // this.installationFormName.patchValue({
        //   data: response.filebaseId
        // });
        // this.installationFormData.emit(this.installationFormName.value);
        //  this.installationFormData.emit(this.installationFormName.value);
        this.changeValues();
         this._snackBar.open("File Uploaded Successfully", "OK", {
           duration: 3000,
           
          });
         }
       
     }, (error:any) => {
      //  this.installationFormData.emit(this.installationFormName.value);
       this._snackBar.open("Bad Request", "OK", {
         duration: 3000
     });
   
   });
   }
 }

}
