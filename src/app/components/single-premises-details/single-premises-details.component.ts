import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PremisesDetailsService } from 'src/app/services/premises-details.service';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-single-premises-details',
  templateUrl: './single-premises-details.component.html',
  styleUrls: ['./single-premises-details.component.scss']
})
export class SinglePremisesDetailsComponent implements OnInit {
  
  navIndex: any;
  nextUrl:any
  currentUrl: any;
  templateList: any;
  templateListSub: Subscription;
  currentUrlSub:Subscription;
  progressionStatusId: any;
  connectionTypeId:any;
  progress_status_payload:any;
  progressionSub:Subscription;
  connectionIdSub:Subscription;

  formSubmitted: boolean=false;
  formValid: boolean = false;
  Micro_Generator_Connection: number = 0;
  microForm!: FormGroup;
  connectionId: number;
  isNewData: boolean =false;
  
  microGenTypes= [
    {
      id: 0,
      name: 'New'
    },
    {
      id: 1,
      name: 'Existing'
    }
  ];

  constructor(private httpService: HttpService, private router: Router, private fb:FormBuilder, private premiseService: PremisesDetailsService,
    private sharedService: SharedService, private _snackBar: MatSnackBar) { 
    this.microForm = this.fb.group({
      microGeneratorArray: this.fb.array([])
    });
  }
  get microGeneratorArray() : FormArray {
    return this.microForm.get("microGeneratorArray") as FormArray
  }
  newMicroGen(): FormGroup {
    return this.fb.group({
      Id: null,
      Phase1: [0, Validators.min(1)],
      Phase2: '',
      Phase3: '',
      TypeTestRef: ['', Validators.required],
      PrimaryEnergySource: ['', Validators.required],
      PowerFactor: [null, [Validators.required, Validators.max(1.0)]],
      MicroGenType: ['- Please Select -', Validators.required]
    })
  }

  ngOnInit(): void {
    this.sharedService.setCurrentNav(this.router.url);    
  // get the current url from service
  this.currentUrlSub = this.sharedService.getCurrentUrl().subscribe((data)=>{
    this.currentUrl =  data.split('?')[0].split('/')[1];
    })

    // //get the list of template and index of current url from template list
    this.templateListSub = this.sharedService.getTemplateList().subscribe((data)=>{
      this.templateList = data;
      this.navIndex = data?.findIndex((item:any) => item.Name === this.currentUrl);
      
    });

    this.sharedService.getConnectionId().subscribe(data => {
      this.connectionId=data;
    });

    this.connectionIdSub = this.sharedService.getConnectionsTypeId().subscribe((id)=>{
      this.connectionTypeId = id;
      this.getProgressionStatus(this.connectionTypeId);
    })

    this.premiseService.getSinglePremisesData(this.connectionId).subscribe(res => {
      if(res) {
        console.log(JSON.stringify(res));
        this.Micro_Generator_Connection=res.length;
        if(res.length > 0) {
          res.forEach((value: any) => {
            (this.microForm.get("microGeneratorArray") as FormArray).push(this.newMicroGen());
          });
        }
        this.isNewData=true;
        this.microForm.patchValue({
          microGeneratorArray: res
        });
      }
    });
  }

  
  ngOnDestroy():void{
    this.currentUrlSub.unsubscribe();
     this.templateListSub.unsubscribe();
  }

      
  /**
   * Go to previous template by click on back button
   */
   backToPreviousTemplate():void {
    let backUrl = "/"+this.templateList[this.navIndex-1].Name;
    this.router.navigateByUrl(backUrl);
  }


goToCallBackTemplate():void{
this.router.navigate(['/Call_Back'], {
      queryParams:{
        type: ConnectionTypeConfig.connection_type
      }
     })

}

  
  reduceFormField() {
    if(this.Micro_Generator_Connection > 0) {
      this.Micro_Generator_Connection = this.Micro_Generator_Connection - 1;
      let deleteId = this.microGeneratorArray.at(this.Micro_Generator_Connection).value.Id;
      this.deleteById(deleteId);
      this.microGeneratorArray.removeAt(this.Micro_Generator_Connection);
    } 
  }
  
  addFormField() {
    this.Micro_Generator_Connection = this.Micro_Generator_Connection + 1;
    if(this.Micro_Generator_Connection >= 1){
      this.microGeneratorArray.push(this.newMicroGen());
    }
  }

  validate():boolean {
    this.formValid=false;
    for(let e of this.microGeneratorArray.value) {
      if(this.formSubmitted === true && e.Phase1 == 0) {
        this.formValid=true;
      }
      if(this.formSubmitted === true && e.PowerFactor == null ) {
        this.formValid=true;
      }
      if(this.formSubmitted === true && e.PowerFactor > 1.0) {
        this.formValid=true;
      }
      if(this.formSubmitted === true && e.PrimaryEnergySource == null) {
        this.formValid=true;
      }
      if(this.formSubmitted === true && e.MicroGenType == '') {
        this.formValid=true;
      }
      if(this.formSubmitted === true && (e.MicroGenType == 'New' && e.TypeTestRef == '')) {
        this.formValid=true;
      }
    }
    return this.formValid;
  }



  onSave(type:string, status:string) {
    this.formSubmitted=true;
    
    if(this.validate() === false) {
      this.microGeneratorArray.value.forEach((i: any) => {
        i.Connection_Id=this.connectionId;
        i.Micro_Generator_Connection=this.Micro_Generator_Connection
      });
      this.updateProgressionStatus(status);
      if(this.isNewData === false) {
      this.premiseService.saveSinglePremisesData(this.microGeneratorArray.value).subscribe(
        res => {
          if(res) {
            if(res.message) {
              this._snackBar.open("Data Inserted Successfully", "OK", {
                duration: 3000,
                
               });
            }
          }
        },() => {
          this._snackBar.open("Bad Request", "OK", {
            duration: 3000
        });
      }
        
      );
    }
    else {
      this.premiseService.updateSInglePremisesData(this.microGeneratorArray.value, this.connectionId).subscribe(
        res => {
          if(res) {
            if(res.message) {
              this._snackBar.open("Data Updated Successfully", "OK", {
                duration: 3000,
                
               });
            }
          }
        },() => {
          this._snackBar.open("Bad Request for update the data", "OK", {
            duration: 3000
        });
      }
        
      );
    }
    this.nextUrl = "/"+this.templateList[this.navIndex+1].Name;
    if(type === 'isSubmit'){
      this.router.navigate([this.nextUrl], {
      queryParams:{
        type: ConnectionTypeConfig.connection_type
      }
     })
    } else if(type === 'saveForLater') {
       this.router.navigateByUrl('/home');
    }
  }
  
  }

  
/**
 * Should save progrssion report on save and continue and save for later button
 * @param Object
 */
 getProgressionStatus(id:number) {
  this.httpService.getConnectionProgressStaus( id).subscribe((res)=>{
    if(res){
      this.progress_status_payload =  res;
    }
    this._snackBar.open("successfully get connection progression staus ", "OK", {
      duration: 3000
  });
  },(error)=>{
    this._snackBar.open("Bad Request", "OK", {
      duration: 3000
  });
  })
}

/**
 * Should save progrssion report on save and continue and save for later button
 * @param Object
 */
 updateProgressionStatus(status:string) {
  this.progress_status_payload[0].Connection_Type = this.connectionTypeId;
  this.progress_status_payload[0].Status = this.getStatusId(status);
  this.progress_status_payload[0].Progression = this.progressionStatusId;
  this.httpService.updateConnectionProgressStaus(this.progress_status_payload, this.connectionId).subscribe((res)=>{
    if(res){
      //this.connectionId =  res[0].Connection_Id;
    }
    this._snackBar.open("successfully update connection progression staus ", "OK", {
      duration: 3000
  });
  },(error)=>{
    this._snackBar.open("Bad Request", "OK", {
      duration: 3000
  });
  })

}

getStatusId(status:string){
  let statusId:number = null;
  this.sharedService.getStatusReport().subscribe((data)=>{
    data?.findIndex((item:any) => {
      if(item.Connection_Status === status){
        statusId = item.Id;
      }
    });
  });
  return statusId;
}

/**
 * Delete last single permises by click on left arrow icon 
 * @param id
 */
  deleteById(id:number){
    this.premiseService.deleteSinglePermisesById(id).subscribe(
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
