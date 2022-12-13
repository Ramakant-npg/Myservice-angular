import { Component, OnInit } from '@angular/core';
import { allConnectionTypes } from '../../../app/app.config';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  connectionData: any = [];
  location: string;
  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.connectionData = allConnectionTypes;
    this.location = window.location.hostname;
  }

  setConnectionType(name:string) {
    this.sharedService.setConnectionsTypeName(name);
  }

}
