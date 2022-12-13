import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
  }
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
  this.dialog.open(DialogComponent, {
      // data: {name:'lata'},
      enterAnimationDuration,
      exitAnimationDuration,
    });

   
      //this.dialog.close(DialogComponent);
    

    
  }
}



