import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import {ConnectionTypeConfig} from 'src/app/app.config';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  currentUrl: any;
  navIndex: any;
  formDetail: any;
  formDetailLocalStore: any = [];

  constructor(private sharedService: SharedService) { 
    sharedService.getConnectionsTypeName().subscribe(response => {this.connectionType = response});
    this.sharedService.getCurrentUrl().subscribe((data)=>{
      if(data) {
        this.currentUrl = data.split('?')[0].split('/')[1];
      }
    });
    this.sharedService.getTemplateList().subscribe((data)=>{
      // console.log("Is the data"+ data);
      this.templateList = data;
      if(this.templateList){
      this.templateList.map((item:any)=>{
        item.isValid = false;
      });
      this.templateList[0].isValid = true;
    }
    });
  }
  templateList:any = [];
  connectionType:string

  ngOnInit() {
  //   this.connectionType = ConnectionTypeConfig.connection_type;

  // // get the current url from service to activate the current navigation
  // this.sharedService.getCurrentUrl().subscribe((data)=>{
  //   if(data) {
  //     this.currentUrl = data.split('?')[0].split('/')[1];
  //   }
  // });

  // //get the list of template and index of current url from templist
  // // this.templateList =  JSON.parse(localStorage.getItem('templateList'));
    
  //   this.sharedService.getTemplateList().subscribe((data)=>{
  //     // console.log("Is the data"+ data);
  //     this.templateList = data;
  //     if(this.templateList){
  //     this.templateList.map((item:any)=>{
  //       item.isValid = false;
  //     });
  //     this.templateList[0].isValid = true;
  //   }
  //   });
    
    // if(this.templateList) {
    //   console.log(this.templateList);
      
    // }
    
   //get the list of template and index of current url from templist
//    this.sharedService.getFormInfo().subscribe((data)=>{
//      if(data) {
//     this.formDetail = data;
//     this.templateList.map((item:any)=>{
//         if(item.Name === this.formDetail.name){
//           item.isValid = this.formDetail.isValid;
//         }
//     });
//     // localStorage.setItem('templateList', JSON.stringify(this.templateList));
//   }
// });

}


}