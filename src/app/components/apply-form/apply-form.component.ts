import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {filter} from 'rxjs/operators';
import { HttpService } from 'src/app/services/http-service.service';
import { SharedService } from 'src/app/services/shared.service';
import {ConnectionTypeConfig} from 'src/app/app.config';


@Component({
  selector: 'app-apply-form',
  templateUrl: './apply-form.component.html',
  styleUrls: ['./apply-form.component.scss']
})
export class ApplyFormComponent implements OnInit {
  

  templateList:any ={};
  previousUrl:string=null;
  currentUrl:string=null;
  connectionType:string;
  
  constructor(private httpService: HttpService, private sharedService: SharedService, private router:Router) { 
    // sharedService.getConnectionId().subscribe(response => {
    //   this.connectionType = response;
    //   this.getTemplateByConnectionJob();
    // });
  }
  

  ngOnInit() {
    this.sharedService.getConnectionsTypeName().subscribe(response => {
      this.connectionType = response;
      this.getTemplateByConnectionJob();
    });
    //this.getTemplateByConnectionJob();
    this.router.events
      .pipe( filter((events:any)=> events instanceof NavigationEnd))
      .subscribe((events:NavigationEnd)=> {
      this.previousUrl = this.currentUrl;
      this.currentUrl = events.url;
      this.sharedService.setCurrentUrl(this.currentUrl);
    })
  }
  
  getTemplateByConnectionJob(){

    this.httpService.getAllPreRequiredData(this.connectionType? this.connectionType:ConnectionTypeConfig.connection_type).subscribe((res)=>{
      this.sharedService.setProgressionReport(res[0]);
      this.sharedService.setStatusReport(res[1]);
      this.sharedService.setConnectionsTypeId(res[2].Id);
      this.sharedService.
        setTemplateList(res[2].ConnectionsTemplate.filter((item: any)=> item['Visible'] === 1));
        this.sharedService.setCorrospondanceAddress(res[3]);
    },(error) => {
      console.log('Failed to get status, progressrion and connection ob', error);
    })

      //  this.httpService.getConnectionJobTemplate(ConnectionTypeConfig.connection_type).subscribe(response => {
      //   this.templateList = response.ConnectionsTemplate;
      //   if(this.templateList) {
      //   this.sharedService.
      //   setTemplateList(this.templateList.filter((item: any)=> item['Visible'] === 1));
      //   }
      //   }, (error) => {
      //   console.log('Failed to get connection job', error);
      // })
  }
 
}
