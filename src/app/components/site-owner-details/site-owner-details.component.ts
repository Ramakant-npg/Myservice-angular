import { Component, ViewChild, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { SiteOwnerDetailsService } from 'src/app/services/site-owner-details.service';
import { SharedService } from 'src/app/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ConnectionTypeConfig } from 'src/app/app.config';
import { HttpService } from 'src/app/services/http-service.service';
import { UtilityHelper } from 'src/app/services/utility-helper';

@Component({
  selector: 'app-site-owner-details',
  templateUrl: './site-owner-details.component.html',
  styleUrls: ['./site-owner-details.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-30%)' }),
        animate('220ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('220ms ease-in', style({ transform: 'translateY(-30%)' }))
      ])
    ])
  ]
})
export class SiteOwnerDetailsComponent implements OnInit {

  @ViewChild('microGeneratorInfoForm') microGeneratorInfoForm: NgForm = <any>{};

  navIndex: any;
  nextUrl: any
  currentUrl: any;
  templateList: any;
  templateListSub: Subscription;
  currentUrlSub: Subscription;
  progressionStatusId: any;
  connectionTypeId: any;
  progress_status_payload: any;
  progressionSub: Subscription;
  connectionIdSub: Subscription;

  mpanInfo: boolean = false;
  prevRefInfo: boolean = false;
  mpanStartsWith: boolean = false;

  formSubmitted: boolean = false;
  postCodePattern = /^(([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2}))$/g;
  mpanPattern = /^(\d{13})?$/g;

  Customer_Reference!: string;
  Customer_Title!: string;
  Customer_First_Name!: string;
  Customer_Surname!: string;
  Customer_Contact_Telephone!: number;
  Site_Address1!: string;
  Site_Address2!: string;
  Site_Address3!: string;
  Site_Postcode!: string;
  Mpan!: number;
  Previous_Reference!: string;

  Owner_Title!: string;
  Owner_First_Name!: string;
  Owner_Surname!: string;
  Owner_Contact_Telephone!: number;
  Owner_Site_Address1!: string;
  Owner_Site_Address2!: string;
  Owner_Site_Address3!: string;
  Owner_Site_Postcode!: string;
  connectionId: number;
  isNewData: boolean = false;

  titleCheck: boolean = true;
  custCheckFirst: boolean = true;
  custCheckLast: boolean = true;
  custsiteCheck: boolean = true;
  custstreetCheck: boolean = true;
  custcityCheck: boolean = true;
  projectCheck: boolean = true;
  prevRef: boolean = true;
  public mobilePattern = new RegExp('[0-9]');

  ownerTitleCheck: boolean = true;
  ownerCheckFirst: boolean = true;
  ownerCheckLast: boolean = true;
  ownersiteCheck: boolean = true;
  ownerstreetCheck: boolean = true;
  ownercityCheck: boolean = true;

  sitePostCodeCheck: boolean = true;
  ownerSitePostCodeCheck: boolean = true;


  // dummyContactDetails = {
  //   "custFirstName": "Ahmed",
  //   "custSurName": "Raja",
  //   "custCompanyName": "TCS",
  //   "custContactTel": 9661941231,
  //   "email": "ahmed.raja@northernpowergrid.com",
  //   "siteAddr1": "Flat No 6",
  //   "siteAddr2": "Torrent Bajaj Services",
  //   "siteAddr3": "Kishore Ganj",
  //   "postCode": "BD7 1HR"
  // }
  dummyContactDetails: any;

  constructor(private router: Router, private siteOwnerService: SiteOwnerDetailsService,
    private sharedService: SharedService, private httpService: HttpService,
    private _snackBar: MatSnackBar, private utilService: UtilityHelper
  ) { }

  ngOnInit(): void {


    this.sharedService.setCurrentNav(this.router.url);

    // get the current url from service
    this.currentUrlSub = this.sharedService.getCurrentUrl().subscribe((data) => {
      this.currentUrl = data.split('?')[0].split('/')[1];
    })

    // //get the list of template and index of current url from template list
    this.templateListSub = this.sharedService.getTemplateList().subscribe((data) => {
      this.templateList = data;
      this.navIndex = data?.findIndex((item: any) => item.Name === this.currentUrl);
      this.nextUrl = "/" + this.templateList[this.navIndex + 1].Name;
    });


    this.sharedService.getConnectionId().subscribe(data => {
      this.connectionId = data;
    });


    this.connectionIdSub = this.sharedService.getConnectionsTypeId().subscribe((id) => {
      this.connectionTypeId = id;
      this.getProgressionStatus(this.connectionTypeId);
    })
    this.sharedService.getCorrospondanceAddress().subscribe((data: any) => {
      this.dummyContactDetails = data;
      // this.Customer_First_Name = this.dummyContactDetails?.custFirstName;
      // this.Customer_Surname = this.dummyContactDetails?.custSurName;
      // this.Customer_Contact_Telephone = this.dummyContactDetails?.custContactTel;
      // this.Site_Address1 = this.dummyContactDetails?.Site_Name;
      // this.Site_Address2 = this.dummyContactDetails?.Site_Street;
      // this.Site_Address3 = this.dummyContactDetails?.Site_City;
      // this.Site_Postcode = this.dummyContactDetails?.Site_Postcode;

      console.log(data);
    })

    //get the progression id status based on current url template
    this.progressionSub = this.sharedService.getProgressionReport().subscribe((data) => {
      let progressionStatusList = data;
      data?.findIndex((item: any) => {
        if (item.Progression_Status === this.currentUrl) {
          this.progressionStatusId = item.Id;
        }
      });
    });


    this.siteOwnerService.getSiteOwnerDetails(this.connectionId).subscribe(res => {
      if (res) {
        this.isNewData = true;
        console.log("Res" + JSON.stringify(res));
        this.Customer_Reference = res.Customer_Reference;
        this.Customer_Title = res.Customer_Title;
        this.Customer_First_Name = res.Customer_First_Name;
        this.Customer_Surname = res.Customer_Surname;
        this.Customer_Contact_Telephone = res.Customer_Contact_Telephone;
        this.Site_Address1 = res.Installer_Site_Name;
        this.Site_Address2 = res.Installer_Site_Street;
        this.Site_Address3 = res.Installer_Site_City;
        this.Site_Postcode = res.Installer_Site_Postcode;
        this.Mpan = res.Mpan;
        this.Previous_Reference = res.Previous_Reference;
        this.Owner_Title = res.Owner_Title;
        this.Owner_First_Name = res.Owner_First_Name;
        this.Owner_Surname = res.Owner_Surname;
        this.Owner_Contact_Telephone = res.Owner_Contact_Telephone;
        this.Owner_Site_Address1 = res.Owner_Site_Name;
        this.Owner_Site_Address2 = res.Owner_Site_Street;
        this.Owner_Site_Address3 = res.Owner_Site_City;
        this.Owner_Site_Postcode = res.Owner_Site_Postcode;

      }
    })
  }

  ngOnDestroy(): void {
    this.currentUrlSub.unsubscribe();
    this.templateListSub.unsubscribe();
    this.progressionSub.unsubscribe();
    this.connectionIdSub.unsubscribe();
  }


  /**
   * Go to previous template by click on back button
   */
  backToPreviousTemplate(): void {
    let backUrl = "/" + this.templateList[this.navIndex - 1].Name;
    this.router.navigateByUrl(backUrl);
  }


  goToCallBackTemplate(): void {
    this.router.navigate(['/Call_Back'], {
      queryParams: {
        type: ConnectionTypeConfig.connection_type
      }
    })

  }

  populateDetails() {
    this.Customer_First_Name = this.dummyContactDetails?.custFirstName;
    this.Customer_Surname = this.dummyContactDetails?.custSurName;
    this.Customer_Contact_Telephone = this.dummyContactDetails?.custContactTel;
    this.Site_Address1 = this.dummyContactDetails?.Site_Name;
    this.Site_Address2 = this.dummyContactDetails?.Site_Street;
    this.Site_Address3 = this.dummyContactDetails?.Site_City;
    this.Site_Postcode = this.dummyContactDetails?.Site_Postcode;
    this.checkAlphabetAndDot(this.Customer_First_Name, 'first');
    this.checkAlphabetAndDot(this.Customer_Surname, 'sur');
    this.checkAddress(this.Site_Address1, 'site');
    this.checkAddress(this.Site_Address2, 'street');
    this.checkAlphabet(this.Site_Address3, 'city');
    this.checkPostCode(this.Site_Postcode, 'sitePostCode');
  }

  populateOwnerInfo() {
    this.Owner_Title = this.dummyContactDetails?.title
    this.Owner_First_Name = this.dummyContactDetails?.custFirstName;
    this.Owner_Surname = this.dummyContactDetails.custSurName;
    this.Owner_Contact_Telephone = this.dummyContactDetails?.custContactTel;
    this.Owner_Site_Address1 = this.dummyContactDetails?.Site_Name;
    this.Owner_Site_Address2 = this.dummyContactDetails?.Site_Street;
    this.Owner_Site_Address3 = this.dummyContactDetails?.Site_City;
    this.Owner_Site_Postcode = this.dummyContactDetails?.Site_Postcode;
    this.checkOwnerTitle(this.Owner_Title);
    this.checkAlphabetAndDot(this.Owner_First_Name, 'ofirst');
    this.checkAlphabetAndDot(this.Owner_Surname, 'osur');
    this.checkAddress(this.Owner_Site_Address1, 'osite');
    this.checkAddress(this.Owner_Site_Address2, 'ostreet');
    this.checkAlphabet(this.Owner_Site_Address3, 'ocity');
    this.checkPostCode(this.Owner_Site_Postcode, 'ownerSitePostCode');

  }

  populateInstallationInfo() {
    this.Owner_Title = this.Customer_Title;
    this.Owner_First_Name = this.Customer_First_Name;
    this.Owner_Surname = this.Customer_Surname;
    this.Owner_Contact_Telephone = this.Customer_Contact_Telephone;
    this.Owner_Site_Address1 = this.Site_Address1;
    this.Owner_Site_Address2 = this.Site_Address2;
    this.Owner_Site_Address3 = this.Site_Address3;
    this.Owner_Site_Postcode = this.Site_Postcode;
    this.checkOwnerTitle(this.Owner_Title);
    this.checkAlphabetAndDot(this.Owner_First_Name, 'ofirst');
    this.checkAlphabetAndDot(this.Owner_Surname, 'osur');
    this.checkAddress(this.Owner_Site_Address1, 'osite');
    this.checkAddress(this.Owner_Site_Address2, 'ostreet');
    this.checkAlphabet(this.Owner_Site_Address3, 'ocity');
    this.checkPostCode(this.Owner_Site_Postcode, 'ownerSitePostCode');
  }

  onSubmit(type: string, status: string) {
    this.formSubmitted = true;
    if (this.Mpan) {
      var checkNum = String(this.Mpan);
      if (checkNum.startsWith("15") || checkNum.startsWith("23")) {
        this.mpanStartsWith = false;
      }
      else {
        this.mpanStartsWith = true;

      }
    }


    console.log(this.microGeneratorInfoForm);
    if (this.microGeneratorInfoForm.valid && this.mpanStartsWith == false) {

      this.updateProgressionStatus(status);

      if (this.isNewData === false) {
        const siteOwnerDetails = {
          Connection_Id: this.connectionId,
          Customer_Reference: this.Customer_Reference,
          Customer_Title: this.Customer_Title,
          Customer_First_Name: this.Customer_First_Name,
          Customer_Surname: this.Customer_Surname,
          Customer_Contact_Telephone: this.Customer_Contact_Telephone,
          Installer_Site_Name: this.Site_Address1,
          Installer_Site_Street: this.Site_Address2,
          Installer_Site_City: this.Site_Address3,
          Installer_Site_Postcode: this.Site_Postcode,
          Mpan: this.Mpan,
          Previous_Reference: this.Previous_Reference,
          Owner_Title: this.Owner_Title,
          Owner_First_Name: this.Owner_First_Name,
          Owner_Surname: this.Owner_Surname,
          Owner_Contact_Telephone: this.Owner_Contact_Telephone,
          Owner_Site_Name: this.Owner_Site_Address1,
          Owner_Site_Street: this.Owner_Site_Address2,
          Owner_Site_City: this.Owner_Site_Address3,
          Owner_Site_Postcode: this.Owner_Site_Postcode
        }
        this.siteOwnerService.submitSiteOwnerDetails(siteOwnerDetails).subscribe((res) => {
          if (res) {
            if (res.message) {
              this._snackBar.open("Data Inserted Successfully", "OK", {
                duration: 3000,
              });
            }
          }
        },
          () => {
            this._snackBar.open("Bad Request while inserting", "OK", {
              duration: 3000,
            });
          });
      }
      else {
        const siteOwnerDetails = {
          Connection_Id: this.connectionId,
          Customer_Reference: this.Customer_Reference,
          Customer_Title: this.Customer_Title,
          Customer_First_Name: this.Customer_First_Name,
          Customer_Surname: this.Customer_Surname,
          Customer_Contact_Telephone: this.Customer_Contact_Telephone,
          Installer_Site_Name: this.Site_Address1,
          Installer_Site_Street: this.Site_Address2,
          Installer_Site_City: this.Site_Address3,
          Installer_Site_Postcode: this.Site_Postcode,
          Mpan: this.Mpan,
          Previous_Reference: this.Previous_Reference,
          Owner_Title: this.Owner_Title,
          Owner_First_Name: this.Owner_First_Name,
          Owner_Surname: this.Owner_Surname,
          Owner_Contact_Telephone: this.Owner_Contact_Telephone,
          Owner_Site_Name: this.Owner_Site_Address1,
          Owner_Site_Street: this.Owner_Site_Address2,
          Owner_Site_City: this.Owner_Site_Address3,
          Owner_Site_Postcode: this.Owner_Site_Postcode
        }

        this.siteOwnerService.updateSiteOwnerDetails(siteOwnerDetails, this.connectionId).subscribe((res) => {
          if (res) {
            if (res.message) {
              this._snackBar.open("Data Updated Successfully", "OK", {
                duration: 3000,
              });
            }
          }
        },
          () => {
            this._snackBar.open("Bad Request while Updating", "OK", {
              duration: 3000,
            });
          });

      }
      this.nextUrl = "/" + this.templateList[this.navIndex + 1].Name;
      if (type === 'isSubmit') {
        this.router.navigate([this.nextUrl], {
          queryParams: {
            type: ConnectionTypeConfig.connection_type
          }
        })
      } else if (type === 'saveForLater') {
        this.router.navigateByUrl('/home');
      }

    }
    if (this.microGeneratorInfoForm.invalid || this.mpanStartsWith == true) {
      return;
    }
    this.formSubmitted = false;
  }

  saveForLaterStatus(): void {
    this.siteOwnerService.saveForLaterStatus();

    // this.siteOwnerService.saveForLaterStatus().subscribe((res:any) => {
    //   if(res) {
    //     if(res.message){
    //       this._snackBar.open("Data Inserted Successfully", "OK", {
    //         duration: 3000,
    //         });
    //       }
    //     }
    // },
    // () =>{
    //   this._snackBar.open("Bad Request while inserting", "OK", {
    //     duration: 3000,
    //     });
    //   });
  }


  /**
   * Should save progrssion report on save and continue and save for later button
   * @param Object
   */
  getProgressionStatus(id: number) {
    this.httpService.getConnectionProgressStaus(id).subscribe((res) => {
      if (res) {
        this.progress_status_payload = res;
      }
      this._snackBar.open("successfully get connection progression staus ", "OK", {
        duration: 3000
      });
    }, (error) => {
      this._snackBar.open("Bad Request", "OK", {
        duration: 3000
      });
    })
  }

  /**
   * Should save progrssion report on save and continue and save for later button
   * @param Object
   */
  updateProgressionStatus(status: string) {
    this.progress_status_payload[0].Connection_Type = this.connectionTypeId;
    this.progress_status_payload[0].Status = this.getStatusId(status);
    this.progress_status_payload[0].Progression = this.progressionStatusId;
    this.httpService.updateConnectionProgressStaus(this.progress_status_payload, this.connectionId).subscribe((res) => {
      if (res) {
        //this.connectionId =  res[0].Connection_Id;
      }
      this._snackBar.open("successfully update connection progression staus ", "OK", {
        duration: 3000
      });
    }, (error) => {
      this._snackBar.open("Bad Request", "OK", {
        duration: 3000
      });
    })

  }

  getStatusId(status: string) {
    let statusId: number = null;
    this.sharedService.getStatusReport().subscribe((data) => {
      data?.findIndex((item: any) => {
        if (item.Connection_Status === status) {
          statusId = item.Id;
        }
      });
    });
    return statusId;
  }

  /**Validation */

  checkName(data: string, type: string) {
    if (type === 'project') {
      if (data === '') {
        this.projectCheck = true;
      }
      else {
        this.projectCheck = this.utilService.validateDegree(data);
      }
    }
  }
  checkTitle(data: string) {

    if (data === '') {
      this.titleCheck = true;
    }
    else {
      this.titleCheck = this.utilService.validateTitle(data);
    }
  }

  checkOwnerTitle(data: string) {

    if (data === '') {
      this.ownerTitleCheck = true;
    }
    else {
      this.ownerTitleCheck = this.utilService.validateTitle(data);
    }
  }

  checkAlphabet(data: string, type: string) {

    if (type === 'city') {
      if (data === '') {
        this.custcityCheck = true;
      }
      else {
        this.custcityCheck = this.utilService.validateonlyAlphabet(data);
      }

    }
    if (type === 'ocity') {
      if (data === '') {
        this.ownercityCheck = true;
      }
      else {
        this.ownercityCheck = this.utilService.validateonlyAlphabet(data);
      }

    }

  }
  checkAddress(data: string, type: string) {
    if (type === 'site') {
      if (data === '') {
        this.custsiteCheck = true;
      }
      else {
        this.custsiteCheck = this.utilService.validateAddress(data);
      }

    }
    if (type === 'osite') {
      if (data === '') {
        this.ownersiteCheck = true;
      }
      else {
        this.ownersiteCheck = this.utilService.validateAddress(data);
      }

    }
    if (type === 'street') {
      if (data === '') {
        this.custstreetCheck = true;
      }
      else {
        this.custstreetCheck = this.utilService.validateAddress(data);
      }

    }

    if (type === 'ostreet') {
      if (data === '') {
        this.ownerstreetCheck = true;
      }
      else {
        this.ownerstreetCheck = this.utilService.validateAddress(data);
      }

    }
  }

  checkAlphabetAndDot(data: string, type: string) {

    if (type === 'first') {
      if (data === '') {
        this.custCheckFirst = true;
      }
      else {
        this.custCheckFirst = this.utilService.validateName(data);
      }

    }
    if (type === 'ofirst') {
      if (data === '') {
        this.ownerCheckFirst = true;
      }
      else {
        this.ownerCheckFirst = this.utilService.validateName(data);
      }

    }
    if (type === 'sur') {
      if (data === '') {
        this.custCheckLast = true;
      }
      else {
        this.custCheckLast = this.utilService.validateName(data);
      }

    }

    if (type === 'osur') {
      if (data === '') {
        this.ownerCheckLast = true;
      }
      else {
        this.ownerCheckLast = this.utilService.validateName(data);
      }

    }

    if (type === 'prev') {
      if (data === '') {
        this.prevRef = true;
      }
      else {
        this.prevRef = this.utilService.validateDegree(data);
      }
    }

  }

  checkPostCode(data: string, value: string) {
    if(value === 'sitePostCode') {
      if(data === '') {
        this.sitePostCodeCheck = true;
      }
      else {
        this.sitePostCodeCheck= this.utilService.validatePostCode(data);
      }
    }
    if(value === 'ownerSitePostCode') {
      if(data === '') {
        this.ownerSitePostCodeCheck = true;
      }
      else {
        this.ownerSitePostCodeCheck = this.utilService.validatePostCode(data);
      }
    }
  }

}
