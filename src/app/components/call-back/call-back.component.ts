import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { SharedService } from 'src/app/services/shared.service';
import {ConnectionTypeConfig} from 'src/app/app.config';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-call-back',
  templateUrl: './call-back.component.html',
  styleUrls: ['./call-back.component.scss']
})
export class CallBackComponent implements OnInit {
  navIndex: any;
  nextUrl:any
  currentUrl: any;
  previousUrl:string=null;
  templateList: any;
  templateListSub: Subscription;
  currentUrlSub:Subscription;

  constructor(private router: Router, private sharedService: SharedService,) { }

  ngOnInit(): void {
    //get the previous selected template
    this.sharedService.getCurrentNav().subscribe((data)=>{
      this.previousUrl = data.split('?')[0].split('/')[1];;
    });
  }

  goToPreviousTemplate() {
    //this.router.navigateByUrl(this.previousUrl );
    this.router.navigate([this.previousUrl], {
      queryParams:{
        type: ConnectionTypeConfig.connection_type
      }
    })
  }

}
