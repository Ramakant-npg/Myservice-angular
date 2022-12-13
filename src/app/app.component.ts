import { Component, OnInit } from '@angular/core';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    let connectionId = 2;
    this.sharedService.setConnectionId(connectionId);
  }
}
