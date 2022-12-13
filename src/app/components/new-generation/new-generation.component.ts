import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewGenerationService } from 'src/app/services/new-generation.service';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';
import { trigger, transition, animate, style } from '@angular/animations';


@Component({
  selector: 'app-new-generation',
  templateUrl: './new-generation.component.html',
  styleUrls: ['./new-generation.component.scss'],
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
export class NewGenerationComponent implements OnInit {

  newGenInfo:any;
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

//show and hide section by click on yes and no radio button 
  // isConnectGenEqup:string= 'yes';
  // isGenEqupMoreThanThree:string = 'yes';
  // isGenEqupMoreThanTwoHun: string = 'yes';
  // isGenEqupMForStandby: string = 'no';
  // isGenRunMoreThanFiveMin: string = 'yes';
  // isApplyInMwOrKw: string = 'no';
  isConnectGenEqup:string;
  isGenEqupMoreThanThree:string;
  isGenEqupMoreThanTwoHun: string;
  isGenEqupMForStandby: string;
  isGenRunMoreThanFiveMin: string;
  isApplyInMwOrKw: string;
  preferConVoltage:number;

  //show and hide gen section based on choose option
  isShowAllGenOption :boolean = false;
  isShowMoreThanTwoHunOption:boolean = false;
  isShowStandbyOption :boolean = false;
  isShowRunMoreThanFiveMinOption:boolean = false;
  isShowApplyInMwOrKwOption: boolean = false;

  //show and hide form based on choose option
  isShowMoreThanThreeForm: boolean = false
  isShowMoreThanTwoHunForm: boolean = false;
  isShowStandbyForm :boolean = false;
  isShowRunMoreThanFiveMinForm:boolean = false;
  isShowApplyInMwOrKwForm:boolean = false;


  //to hold the data of all form 
  moreThanTwoHundresData:any;
  moreThanThreeHundresData: any;
  connectionId: number;
  formSubmitted: boolean = false;
  isNewData: boolean=false;
  parentSubmitAPI:Subscription;


  constructor(private router: Router, private newGenService: NewGenerationService,
    private sharedService: SharedService, private httpService: HttpService,
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

    this.newGenService.getYesNoButtonAPI(this.connectionId).subscribe(res => {
      if(res) {
        this.isNewData=true;
        this.isConnectGenEqup = (res.Connecting_Generation === null) ? null : ((res.Connecting_Generation === 1) ? 'yes' : 'no');
        this.isGenEqupMoreThanThree = (res.Connecting_Generation_3_68kw === null) ? null : ((res.Connecting_Generation_3_68kw === 1) ? 'yes' : 'no');
        this.isGenEqupMoreThanTwoHun = (res.Connecting_Generation_200kw === null) ? null : ((res.Connecting_Generation_200kw === 1) ? 'yes' : 'no');
        this.isGenEqupMForStandby = (res.Connecting_Generation_Standby === null) ? null : ((res.Connecting_Generation_Standby === 1) ? 'yes' : 'no');
        this.isGenRunMoreThanFiveMin = (res.Connecting_Generation_5min === null) ? null : ((res.Connecting_Generation_5min === 1) ? 'yes' : 'no');
        this.isApplyInMwOrKw = (res.Connecting_Generation_KW_MW === null) ? null : ((res.Connecting_Generation_KW_MW === 1) ? 'mw' : 'kw');
        this.preferConVoltage = res.KW_MW_Connection_Point;
        if(this.isConnectGenEqup != null) {
          this.chooseOptionFromFirst(this.isConnectGenEqup);
        }
        if(this.isGenEqupMoreThanThree != null) {
          this.chooseOptionFromSecond(this.isGenEqupMoreThanThree);
        }
        if(this.isGenEqupMoreThanTwoHun != null) {
          this.chooseOptionFromThird(this.isGenEqupMoreThanTwoHun);
        }
        if(this.isGenEqupMForStandby != null) {
          this.chooseOptionFromFourth(this.isGenEqupMForStandby);
        }
        if(this.isGenRunMoreThanFiveMin != null) {
          this.chooseOptionFromFive(this.isGenRunMoreThanFiveMin);
        }
        if(this.isApplyInMwOrKw != null) {
          this.showMwKwForm();
        }
        
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

chooseOptionFromFirst(value:string):void{
 if( value === 'no'){
    this.isShowAllGenOption = false;
    this.isGenEqupMoreThanThree=null;
    this.isGenEqupMoreThanTwoHun=null;
    this.isGenEqupMForStandby=null;
    this.isGenRunMoreThanFiveMin=null;
    this.isApplyInMwOrKw=null;
    this.preferConVoltage=null;
  } else {
    this.isShowAllGenOption = true;
    this.isShowMoreThanThreeForm=false;
    this.isShowMoreThanTwoHunForm=false;
  }
}


chooseOptionFromSecond(value:string):void{
 if(value === 'no'){
    this.isShowMoreThanThreeForm = true;
    this.isShowMoreThanTwoHunOption = false;
    this.isShowStandbyOption = false;
    this.isShowRunMoreThanFiveMinOption = false;
    this.isShowApplyInMwOrKwOption = false;
    this.isGenEqupMoreThanTwoHun=null;
    this.isGenEqupMForStandby=null;
    this.isGenRunMoreThanFiveMin=null;
    this.isApplyInMwOrKw=null;
    this.preferConVoltage=null;
  } else {
    this.isShowMoreThanThreeForm = false;
    this.isShowMoreThanTwoHunOption = true;
    this.isShowRunMoreThanFiveMinOption = false;
    this.isShowApplyInMwOrKwOption = false;
  }
}

chooseOptionFromThird(value:string):void{
if(  value === 'no'){
    this.isShowMoreThanTwoHunForm = true;
    this.isShowStandbyOption = false;
    this.isShowRunMoreThanFiveMinOption = true;
    this.isShowRunMoreThanFiveMinOption = false;
    this.isGenEqupMForStandby=null;
    this.isGenRunMoreThanFiveMin=null;
    this.isApplyInMwOrKw=null;
    this.preferConVoltage=null;
  } else{
    this.isShowMoreThanTwoHunForm = false;
    this.isShowStandbyOption = true;
    this.isShowRunMoreThanFiveMinOption = false;
  }
}


chooseOptionFromFourth(value:string):void{
 if(  value === 'no'){
    this.isShowStandbyForm = false;
    this.isShowRunMoreThanFiveMinOption = true;
  } else {
    this.isShowStandbyForm = true;
    this.isShowStandbyOption = true;
    this.isShowRunMoreThanFiveMinOption = false;
    this.isGenRunMoreThanFiveMin=null;
    this.isApplyInMwOrKw=null;
    this.preferConVoltage=null;
  }
}


chooseOptionFromFive(value:string):void{
     if(value === 'no'){
    this.isShowRunMoreThanFiveMinForm = true;
    this.isShowApplyInMwOrKwOption = false;
    this.isShowApplyInMwOrKwForm = false;
    this.isApplyInMwOrKw=null;
    this.preferConVoltage=null;
  } else  {
    this.isShowRunMoreThanFiveMinForm = false;
    this.isShowApplyInMwOrKwOption = true;
  }
}

mwOrKwData: any;
showMwKwForm():void{
this.isShowApplyInMwOrKwForm = true;
}


getAllFormData(data:any):void{
 this.moreThanTwoHundresData = data;
}

getAllMwOrKwFormData(data: any): void {
 
  if(data[0]['undefined'] == undefined){
    delete data[0]['undefined'];
  }
  this.mwOrKwData = data;
}

getAllThreeHunFormData(data: any): void {
  // console.log(data);
  this.moreThanThreeHundresData=data;
  // console.log("Data");
  // console.log(this.moreThanThreeHundresData);

}

//As per Tamal Requirment, If installationArray is null then when we need to set Id as null in order to insert the data.
modifyPayload(data: any) {
  console.log(data);
  let cloneData = Object.assign([], data);
  // cloneData.forEach((item: any) => {
  //   console.log(item);
  // });
  return cloneData.forEach((item: any) => {
    
    if(item['pvPhotoVoltaicForm']?.installationFormArray.length == 0) {
      item['pvPhotoVoltaicForm']?.installationFormArray.push({Id: null});
    }
    if(item['windForm']?.installationFormArray.length == 0) {
      item['windForm']?.installationFormArray.push({Id: null});
    }
    if(item['hydroForm']?.installationFormArray.length == 0) {
      item['hydroForm']?.installationFormArray.push({Id: null});
    }
    if(item['biomassForm']?.installationFormArray.length == 0) {
      item['biomassForm']?.installationFormArray.push({Id: null});
    }
    if(item['CHPCombinedHeatandPowerForm']?.installationFormArray.length == 0) {
      item['CHPCombinedHeatandPowerForm']?.installationFormArray.push({Id: null});
    }
    // if(item['energyForm']?.installationFormArray.length == 0) {
    //   item['energyForm']?.installationFormArray.push({Id: null});
    // }
    if(item['otherForm']?.installationFormArray.length == 0) {
      item['otherForm']?.installationFormArray.push({Id: null});
    }
  });
}

/**
 * modify 200kw data
 * @param cloneTwoHundresData
 */
modifyTwoHundredData = (cloneTwoHundresData:any) =>{
    Object.entries(cloneTwoHundresData[0]).forEach(([key, value]:any, index)=>{
      console.log(key, value, index);
      let newInvList: number [] = [];
      value?.inverterFormArray?.forEach((obj:any)=>{
      newInvList.push(obj.Inverter_Rating);
    })
    value.inverterFormArray =  newInvList;
    })
}


saveAndContinue(type:string, status:string):void {
this.formSubmitted=true;
const data = {
  Connecting_Generation : (this.isConnectGenEqup == null || this.isConnectGenEqup == undefined) ? null : ((this.isConnectGenEqup == 'yes') ? true : false),
  Connecting_Generation_3_68kw : (this.isGenEqupMoreThanThree === null || this.isGenEqupMoreThanThree === undefined) ? null : ((this.isGenEqupMoreThanThree === 'yes') ? true : false),
  Connecting_Generation_200kw : (this.isGenEqupMoreThanTwoHun === null || this.isGenEqupMoreThanTwoHun === undefined) ? null : ((this.isGenEqupMoreThanTwoHun === 'yes') ? true : false),
  Connecting_Generation_Standby : (this.isGenEqupMForStandby === null || this.isGenEqupMForStandby === undefined) ? null : ((this.isGenEqupMForStandby === 'yes') ? true : false),
  Connecting_Generation_5min : (this.isGenRunMoreThanFiveMin === null || this.isGenRunMoreThanFiveMin === undefined) ? null :((this.isGenRunMoreThanFiveMin === 'yes') ? true : false),
  Connecting_Generation_KW_MW : (this.isApplyInMwOrKw === null || this.isApplyInMwOrKw === undefined) ? null : ((this.isApplyInMwOrKw === 'mw') ? 1 : 2),
  Connection_Id: this.connectionId,
  KW_MW_Connection_Point : this.preferConVoltage
};


if(this.isConnectGenEqup != null || this.isConnectGenEqup != undefined) {
  this.formSubmitted=false;
  // console.log("Data "+ JSON.stringify(this.moreThanThreeHundresData));
  this.updateProgressionStatus(status);
  if(this.isNewData === false) {
    this.parentSubmitAPI = this.newGenService.submitYesNoButtonAPI(data).subscribe(res => {
      let cond1 = (data.Connecting_Generation === true && data.Connecting_Generation_3_68kw === false);
      let cond2 = (data.Connecting_Generation === true && data.Connecting_Generation_3_68kw === true && data.Connecting_Generation_200kw === false);
      let cond3 = (data.Connecting_Generation === true && data.Connecting_Generation_3_68kw === true && data.Connecting_Generation_200kw === true &&( data.Connecting_Generation_KW_MW ===1 ||  data.Connecting_Generation_KW_MW===2) );
        
    if(res) {
          if(cond1) {
            let cloneThreeHundresData = Object.assign([], this.moreThanThreeHundresData);
            cloneThreeHundresData[0]['Connection_Id'] = this.connectionId;
            this.SaveNewGenData('Connection_New_Generation_3_68kw', cloneThreeHundresData);
          }
          else if(cond2){
            let cloneTwoHundresData = Object.assign([], this.moreThanTwoHundresData);
           
            if(cloneTwoHundresData) {
              //cloneTwoHundresData = this.modifyTwoHundredData(cloneTwoHundresData);
              Object.entries(cloneTwoHundresData[0]).forEach(([key, value]:any, index)=>{
                console.log(key, value, index);
                let newInvList: number [] = [];
                value.inverterFormArray.forEach((obj:any)=>{
                newInvList.push(obj.Inverter_Rating);
              })
              value.inverterFormArray =  newInvList;
              })
            
            }
            cloneTwoHundresData[0]['Connection_Id'] = this.connectionId;
            console.log(JSON.stringify(cloneTwoHundresData) + 'after modify===');

            this.SaveNewGenData('Connection_New_Generation_200kw', cloneTwoHundresData);
          }
          else if(cond3) {
            let clonemwOrkwData = Object.assign([], this.mwOrKwData);
            console.log("Data for MW"+ JSON.stringify(clonemwOrkwData));
            //clonemwOrkwData[0]['Connection_Id'] = this.connectionId;
            console.log("Data for MW"+ JSON.stringify(clonemwOrkwData));
          //  clonemwOrkwData=this.modifyPayload(clonemwOrkwData);
            
            this.SaveNewGenData('Connection_New_Generation_KW_MW', clonemwOrkwData);
          }

      if(res.message){
        this._snackBar.open("Data Created Successfully", "OK", {
          duration: 3000,
          
        });
        }
      }
    }, () => {
      this._snackBar.open("Bad Request", "OK", {
        duration: 3000
    });
    }
  
  );
  }
  else {
    this.newGenService.updateYesNoButtonAPI(data, this.connectionId).subscribe(res => {
      if(res) {

        let cond1 = (data.Connecting_Generation === true && data.Connecting_Generation_3_68kw === false);
        let cond2 = (data.Connecting_Generation === true && data.Connecting_Generation_3_68kw === true && data.Connecting_Generation_200kw === false);
        let cond3 = (data.Connecting_Generation === true && data.Connecting_Generation_3_68kw === true && data.Connecting_Generation_200kw === true &&( data.Connecting_Generation_KW_MW ===1 ||  data.Connecting_Generation_KW_MW===2) );
        
        if(cond1) {
          // console.log("Da")
          let cloneThreeHundresData = Object.assign([], this.moreThanThreeHundresData);
          cloneThreeHundresData[0]['Connection_Id'] = this.connectionId;
          this.UpdateNewGenData('Connection_New_Generation_3_68kw/' + this.connectionId, cloneThreeHundresData);
        }
        else if(cond2){
          let cloneTwoHundresData = Object.assign([], this.moreThanTwoHundresData);
            if(cloneTwoHundresData) {
              //cloneTwoHundresData = this.modifyTwoHundredData(cloneTwoHundresData);
              // console.log(cloneTwoHundresData[0]['']);
              if(!cloneTwoHundresData[0]['energyForm']) {
                Object.entries(cloneTwoHundresData[0]).forEach(([key, value]:any, index)=>{
                  console.log(key, value, index);
                  let newInvList: number [] = [];
                  value.inverterFormArray.forEach((obj:any)=>{
                  newInvList.push(obj.Inverter_Rating);
                })
                value.inverterFormArray =  newInvList;
                });
              }
            }
            cloneTwoHundresData[0]['Connection_Id'] = this.connectionId;
            console.log(JSON.stringify(cloneTwoHundresData) + 'after modify===');
          this.UpdateNewGenData('Connection_New_Generation_200kw/' + this.connectionId, cloneTwoHundresData);
        }
        else if(cond3) {
          let clonemwOrkwData = Object.assign([], this.mwOrKwData);
        if(clonemwOrkwData){
         clonemwOrkwData[0]['Connection_Id'] = this.connectionId;
          console.log("MW Or KW Data " + JSON.stringify(clonemwOrkwData));
          //clonemwOrkwData=this.modifyPayload(clonemwOrkwData);
          console.log("after modify MW Or KW Data " + JSON.stringify(clonemwOrkwData));
        }
          
          this.UpdateNewGenData('Connection_New_Generation_KW_MW/' + this.connectionId, clonemwOrkwData);
        }
        if(res.message){
          this._snackBar.open("Data Updated Successfully", "OK", {
            duration: 3000
            
          });
          }
        }
      }, () => {
        this._snackBar.open("Bad Request", "OK", {
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


SaveNewGenData(url:string, data:any){
  this.newGenService.saveInstallationForm(url, data).subscribe(res => {
    if(res.message){
      this._snackBar.open("Installation form saved Successfully", "OK", {
        duration: 3000,
        
      });
      // this.nextUrl = "/"+this.templateList[this.navIndex+1].Name;
      // this.router.navigate([this.nextUrl], {
      //   queryParams:{
      //     type: ConnectionTypeConfig.connection_type
      //   }
      //  })
      }

  }, () => {
    this._snackBar.open("Bad Request", "OK", {
      duration: 3000
    });
  })
  
}

UpdateNewGenData(url:string, data:any){
  console.log(JSON.stringify(data));
  this.newGenService.updateInstallationForm(url, data).subscribe(res => {
    if(res.message){
      this._snackBar.open("Installation form update Successfully", "OK", {
        duration: 3000,
        
      });
      // this.nextUrl = "/"+this.templateList[this.navIndex+1].Name;
      // this.router.navigate([this.nextUrl], {
      //   queryParams:{
      //     type: ConnectionTypeConfig.connection_type
      //   }
      //  })
      }

  }, () => {
    this._snackBar.open("Bad Request", "OK", {
      duration: 3000
    });
  })
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
