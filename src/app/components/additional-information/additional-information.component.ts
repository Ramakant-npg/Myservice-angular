import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdditionalInformationService } from 'src/app/services/additional-information.service';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-additional-information',
  templateUrl: './additional-information.component.html',
  styleUrls: ['./additional-information.component.scss']
})
export class AdditionalInformationComponent implements OnInit {

  fileValid: boolean=false;
  formSubmitted: boolean=false;
  Additional_Info_Summary!: string;
  file!: File;
  Current_Upload_Additionalinfo: string = null;
  File_Name: string = '';
  Cyrrent_File_Type!: string;
  isNewData: boolean=false;
  patternFile = new RegExp('^.*\.(jpg|JPG|gif|GIF|doc|DOC|pdf|PDF|png|PNG|docx|DOCX)$');
  connectionId: any;

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
  

  constructor(private router: Router, private sharedService: SharedService,
    private addInfoService: AdditionalInformationService,private httpService: HttpService,
    private _snackBar: MatSnackBar) { }

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
    
    //get the progression id status based on current url template
    this.progressionSub = this.sharedService.getProgressionReport().subscribe((data)=>{
      let progressionStatusList = data;
      data?.findIndex((item:any) => {
        if(item.Progression_Status === this.currentUrl){
          this.progressionStatusId =  item.Id;
        }
      });
    });

    this.addInfoService.getAdditionalInformationAPI(this.connectionId).subscribe(res => {
      if(res) {
        this.isNewData=true;
        this.Additional_Info_Summary=res.Additional_Info_Summary;
        this.File_Name=res.File_Name;
        // this.FILE_NAME=res.File_Name;
      }
    });
  }

  ngOnDestroy():void{
    this.currentUrlSub.unsubscribe();
     this.templateListSub.unsubscribe();
     this.progressionSub.unsubscribe();
     this.connectionIdSub.unsubscribe();
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


  humanFileSize(size: number) 
  {
    var i = size == 0 ? 0 : Math.floor( Math.log(size) / Math.log(1024) );
    return (( size / Math.pow(1024, i) ) * 1).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }

  onChange(event: any) 
  {
    this.file = event.target.files[0];
    const formData = new FormData(); 
    // Store form name as "file" with file data
    if(this.file){
      formData.append("Connection_Id", this.connectionId);
      formData.append("file", this.file, this.file.name);
      // var fileSize = this.humanFileSize(this.file.size);
      this.Cyrrent_File_Type= this.file.name;
      this.File_Name=this.file.name;
      // This is how the data is sent
      this.httpService.upload(formData).subscribe((response: any) => {
        if(response){
          this.Current_Upload_Additionalinfo=response.filebaseId;
          this._snackBar.open("File Uploaded Successfully", "OK", {
            duration: 3000,
            
           });
          }
        
      }, () => {
        this._snackBar.open("Bad Request", "OK", {
          duration: 3000
      });
    });
    }
    
  }

  onSave(type:string, status:string){
    this.formSubmitted=true;
    if(this.file){
      if(!this.Cyrrent_File_Type.match(this.patternFile)) {
        this.fileValid=true;
      }
      else{
        this.fileValid=false;
      }
    }
    
    if(this.fileValid === false) {
      const data = {
        Connection_Id: this.connectionId,
        Additional_Info_Summary: this.Additional_Info_Summary,
        Current_Upload_Additionalinfo: this.Current_Upload_Additionalinfo
      };
      this.updateProgressionStatus(status);
      if(this.isNewData === false) {
        this.addInfoService.submitAdditionalInformationAPI(data).subscribe(res => {
          if(res) {
            if(res.message){
              this._snackBar.open("Data Inserted Successfully", "OK", {
                duration: 3000,
                
               });
              }
            }
          }, () => {
            this._snackBar.open("Bad Request", "OK", {
              duration: 3000
          });
        });
      }
      else {
        this.addInfoService.updateAdditionalInformationAPI(data, this.connectionId).subscribe(res => {
          if(res) {
            if(res.message){
              this._snackBar.open("Data Updated Successfully", "OK", {
                duration: 3000,
                
               });
              }
            }
          }, () => {
            this._snackBar.open("Bad Request", "OK", {
              duration: 3000
          });
        });
      }
      if((this.templateList.length-1) > this.navIndex){
        this.nextUrl = "/"+this.templateList[this.navIndex+1].Name;
      }else{
        this.nextUrl = "/" + this.templateList[this.navIndex].Name;
      }
      
       if(type === 'isSubmit' && status === 'InProgress'){
        this.router.navigate([this.nextUrl], {
        queryParams:{
          type: ConnectionTypeConfig.connection_type
        }
       })
      } else if(type === 'saveForLater' || status === 'Submitted') {
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


}
