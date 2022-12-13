import { JsonPipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder,FormArray,FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service.service';
import { Subscription } from 'rxjs';
import { ElectricalEquipmentService } from 'src/app/services/electrical-equipment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, animate, style } from '@angular/animations';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-harmonic',
  templateUrl: './harmonic.component.html',
  styleUrls: ['./harmonic.component.scss'],
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


export class HarmonicComponent implements OnInit {

  fileName:File;
fileBasedId:any;
  harmonicInfo:any;
  isValidFileType = true;
  isShowharmonicForm:Boolean = false;
  wanttoShowHarmonicForm: boolean = false;
  file:any;
  loading: boolean = false;
  uploadSuccess:boolean = false;
  percentDone!: number;
  allowFileType = ["doc","docx","pdf","jpg","jpeg","png", "gif"];
  connectionId: any;

  @Output() harmonicFormData: EventEmitter<any> = new EventEmitter();
  @Output() enableHarmonic: EventEmitter<any> = new EventEmitter();
  @Input() enableDisableHarmonicButton: boolean=false;
  @Input() formSubmitted: boolean=false;
  harmonicSourceSub:Subscription;
  constructor(private fb: FormBuilder,private electricSerivce: ElectricalEquipmentService, 
    private httpService: HttpService, private _snackBar: MatSnackBar,
    private sharedService: SharedService) {}

  changeValues():void{
    this.harmonicFormData.emit(this.harmonicForm.value);
  }
  
  ngOnInit(): void {
    this.sharedService.getConnectionId().subscribe(data => {
      this.connectionId=data;
    });
    this.harmonicSourceSub =this.electricSerivce.getElectricEquipmentdata().subscribe(electricEquipmentData=> {

    if( electricEquipmentData && Object.keys(electricEquipmentData?.harmonicData).length != 0 ) {
      let data =  electricEquipmentData.harmonicData;
      this.isShowharmonicForm = (data.Install_Harmonic_Distortion === 1) ? true : false;
      this.wanttoShowHarmonicForm = (this.isShowharmonicForm === true) ? true : false;

      
      this.harmonicForm=  this.fb.group({
        Install_Harmonic_Distortion: null,
        Details_Harmonic_Distortion: '',
        Harmonic_Data_Sheets: null,
        File_Name: null
      });

      this.harmonicForm.patchValue({ 
        Install_Harmonic_Distortion: data.Install_Harmonic_Distortion,
        Details_Harmonic_Distortion: data.Details_Harmonic_Distortion,
        Harmonic_Data_Sheets: data.Harmonic_Data_Sheets,
        File_Name: data.FileName
      });
      this.harmonicFormData.emit(this.harmonicForm.value);
    }
    else {
      this.harmonicForm=  this.fb.group({
        Install_Harmonic_Distortion: null,
        Details_Harmonic_Distortion: '',
        Harmonic_Data_Sheets: null,
        File_Name: null
      });
      this.harmonicFormData.emit(this.harmonicForm.value);
    }

    });

   }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['enableDisableHarmonicButton']?.currentValue === true) {
      this.wanttoShowHarmonicForm=false;
    }
  }

    showharmonicForm(value:boolean):void {
      if(value){ 
        this.isShowharmonicForm = true;
        this.harmonicForm.get('Install_Harmonic_Distortion').setValue(true);
        this.wanttoShowHarmonicForm = true;
      } else { 
        this.isShowharmonicForm = false;
        this.harmonicForm.get('Install_Harmonic_Distortion').setValue(false);
        this.wanttoShowHarmonicForm=false;
        this.harmonicForm=  this.fb.group({
          Install_Harmonic_Distortion: null,
          Details_Harmonic_Distortion: '',
          Harmonic_Data_Sheets:null,
          File_Name: null
      });
    }
  }

  //Create harmonic form
  harmonicForm=  this.fb.group({
    Install_Harmonic_Distortion: null,
    Details_Harmonic_Distortion: '',
    Harmonic_Data_Sheets: null,
    File_Name: null
    
  });

   // On file Select
   onChange(event: any):void {
    this.file = event.target.files[0];
    // this.harmonicForm.patchValue({
    //   Harmonic_Data_Sheets : 'abc.png'
    // });
   //this.harmonicFormData.emit(this.harmonicForm.value);
  }

validateFileType(fileType: string){
    this.isValidFileType =  this.allowFileType.includes(fileType.toLocaleLowerCase())? true: false;
    return this.isValidFileType;
 }

  // OnClick of button Upload
  onUpload() {
   let fileType = this.file.name.split('.');
    if(this.file  && this.validateFileType(fileType[1])) {
      this.loading = !this.loading;
      this.fileName = this.file.name;
      const formData = new FormData();
      //let formDetail = this.harmonicForm.get('Harmonic_Data_Sheets')?.updateValueAndValidity();
      formData.append('Connection_Id', this.connectionId)
      formData.append('file',this.file);


      // this.harmonicForm.controls['Harmonic_Data_Sheets'].setValue();
     
      this.httpService.upload(formData).subscribe((response: any) => {
        
        if(response){

          // this.fileBasedId = {fileBasedId:1234}
          this.harmonicForm.controls['Harmonic_Data_Sheets'].setValue(response.filebaseId);
          this.harmonicFormData.emit(this.harmonicForm.value)
          this._snackBar.open("File Uploaded Successfully", "OK", {
            duration: 3000,
            
           });
          }
        
      }, (error:any) => {


        // this.fileBasedId = {fileBasedId:1234};
        // this.harmonicForm.controls['Harmonic_Data_Sheets'].setValue(12);
        // this.harmonicForm.controls['File_Name'].setValue(this.file.name);
        // this.harmonicFormData.emit(this.harmonicForm.value)



        this._snackBar.open("Bad Request", "OK", {
          duration: 3000
      });
 ;
    
    });
    }
  }
    
  ngOnDestroy() {
    if(this.harmonicSourceSub) {
      this.harmonicSourceSub.unsubscribe();
    }
  }

 
}
