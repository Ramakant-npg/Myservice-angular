import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {ConnectionTypeConfig} from 'src/app/app.config';
import { SharedService } from 'src/app/services/shared.service';
import { HttpService } from 'src/app/services/http-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { YourSitePlanService } from 'src/app/services/your-site-plan.service';
declare const google: any;

@Component({
  selector: 'app-your-site-plan',
  templateUrl: './your-site-plan.component.html',
  styleUrls: ['./your-site-plan.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-30%)'}),
        animate('220ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('220ms ease-in', style({transform: 'translateY(-30%)'}))
      ])
    ])
  ]
})
export class YourSitePlanComponent implements OnInit {
    
  connectionId: any;
  navIndex: any;
  nextUrl:any
  currentUrl: any;
  templateList: any;
  progressionStatusId: any;
  connectionTypeId:any;
  progress_status_payload:any;
  templateListSub: Subscription;
  currentUrlSub:Subscription;
  progressionSub:Subscription;
  connectionIdSub:Subscription;


  @ViewChild('uploadFileForm') uploadFileForm: NgForm = <any>{};
  @ViewChild('mapElement') mapElement: any;
  mapInfo: boolean=true;
  showBoundaryInfo: boolean = false;
  showEstimateInfo: boolean = false;
  showQuotationInfo: boolean = false;
  File_Upload: any;
  File_Upload_Name: string = '';
  File_Upload_1: any;
  File_Upload_Name_1: string = '';
  File_Upload_2: any;
  File_Upload_Name_2: string = '';
  File_Upload_3: any
  File_Upload_Name_3: string = '';
  file!: File;
  upload_file_type: string ='';
  fileUploadList:any = [];
  formSubmitted: boolean = false;

  isValidFile1= true;
  isValidFile2= true;
  isValidFile3= true;
  isValidFile4= true;

  filePattern = ['jpg','jpeg','gif','doc','pdf','png','docx',
  'vnd.openxmlformats-officedocument.wordprocessingml.document','msword']

  boundaryDesc = 'So that we know where you need your connection(s) to be, we need to know the boundary of your site. You can use our handy mapping tool below or if you prefer you can upload an ordnance survey or a land registry plan.';
  boundaryDesc1 = 'If you are unable to provide this information it may delay in the processing of your quotation.';
  boundaryDesc2 = 'For assistance using our mapping tool or if you don’t have a plan available please contact our connections team on 0800 011 3433.';
  estimateDesc = 'For an estimate you only need to provide us with a site location, you can use our handy mapping tool or if you prefer you can upload an ordnance survey or a land registry plan.';
  quotationDesc = 'For a quotation you need to provide us with a site location, you can use our handy mapping tool or if you prefer you can upload an ordnance survey or a land registry plan. We also need a plan, at an appropriate scale (preferably scaled 1:500) which indicates the layout of buildings, roads and proposed metering points. If the request is for a larger site such as industrial units, then you may require a substation installed on your site, if you do we will contact you to request a plan showing the proposed location.';
  
  drawingManager: any;
  map: any;
  mapArrayLatLng: any = [];
  showMapError:boolean = false;
  polygonCordinates: any;
  polyCentreCordinat: any;
  polygonZoom: any;
  siteId: any;
  isFileData: boolean = false;
  showUploadFileError: boolean = false;

  constructor(private router: Router, 
    private sharedService: SharedService,
    private _snackBar: MatSnackBar,
    private httpService: HttpService,
    private yourSitePlanService: YourSitePlanService
   ) { }

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

  ngAfterViewInit(){
    this.fileUploadList.length = 0;
    this.yourSitePlanService.getSitePlanData(this.connectionId).subscribe(response => {
      if(response) {
        let sitePlanData = response;
        let siteData = response.SiteData;
        
        this.mapArrayLatLng = siteData.position;
        this.polyCentreCordinat = siteData.centre;
        this.polygonZoom = response.SiteData.zoom;
        this.File_Upload_Name = (sitePlanData.FileNameUpload1 ? sitePlanData.FileNameUpload1 : '');
        this.File_Upload_Name_1 = (sitePlanData.FileNameUpload2 ? sitePlanData.FileNameUpload2: '');
        this.File_Upload_Name_2 = (sitePlanData.FileNameUpload3 ? sitePlanData.FileNameUpload3 : '');
        this.File_Upload_Name_3 = (sitePlanData.FileNameUpload4 ? sitePlanData.FileNameUpload4 : '');
        this.File_Upload = sitePlanData.FileBaseId1;
        this.File_Upload_1 = sitePlanData.FileBaseId2;
        this.File_Upload_2 = sitePlanData.FileBaseId3;
        this.File_Upload_3 = sitePlanData.FileBaseId4;
        this.siteId = sitePlanData.SiteId;
        this.connectionId = sitePlanData.Connection_Id;
        this.fileUploadList.push(this.File_Upload_Name, this.File_Upload_Name_1, this.File_Upload_Name_2,this.File_Upload_Name_3);
        
        this.fileUploadList = this.fileUploadList.filter((i:any) => {
          return i !== '';
        })
        this.generateMap();
      }
      
    },
    (error) => {
      this.generateMap();
    });
    
    
    
  }

  generateMap() {
    const map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: 55.027173154145686, lng: -1.4861393530671685 },
      zoom: 14,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.HYBRID,
      disableDefaultUI: false,
      zoomControl: true,
      fullscreenControl:true,
      streetViewControl: false,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL  
      }
    });

    var geocoder = new google.maps.Geocoder();
    map.data.loadGeoJson("assets/NPGAreaData_DNO_WGS84.json");
    map.data.setStyle({
      fillColor: 'transparent',
      fillOpacity: 0,
      strokeColor: '#ab1236',
      strokeOpacity: 0.8,
      strokeWeight: 1
    });

    const infoWindow = new google.maps.InfoWindow({
      content: "",
      disableAutoPan: true,
    });
    this.drawPolygon(map);
  }

  drawPolygon(map: any) {
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      },
      polygonOptions: {
        draggable: false,
        editable: true
      }
    });

    this.drawingManager.setMap(map);
    if(this.mapArrayLatLng.length > 0) {
      this.dynamicPolygon(map);
    }else{
      google.maps.event.addListener(this.drawingManager, 'polygoncomplete', (polygon: any) => {
          const len = polygon.getPath().getLength();

          for (let i = 0; i < len; i++) {
            const vertex = polygon.getPath().getAt(i);
            const vertexLatLng = {lat: vertex.lat(), lng: vertex.lng()};
            this.mapArrayLatLng.push(vertexLatLng);
          }  
          // the last point of polygon should be always the same as the first point (math rule)
          this.mapArrayLatLng.push(this.mapArrayLatLng[0]);
          this.mapArrayLatLng.forEach((i:any) => {
            i.lat = +i.lat.toFixed(5);
            i.lng = +i.lng.toFixed(5);
          })
          // Calculated the center of the polygon
          let minLat;
          let minLng;
          let maxLat;
          let maxLng;
          const latArray: any= [];
          const lngArray: any = [];
          this.mapArrayLatLng.forEach((i:any) =>{
            latArray.push(i.lat);
            lngArray.push(i.lng);
          })
          minLat = Math.min(...latArray);
          minLng = Math.min(...lngArray);
          maxLat = Math.max(...latArray);
          maxLng = Math.max(...lngArray);
          
          let center_lat = Number(minLat) + ((Number(maxLat) - Number(minLat))/2);
          let center_lng = Number(maxLng) + ((Number(maxLng) - Number(minLng))/2);
        
          // disable edit controls
          if(this.mapArrayLatLng.length > 0) {
            this.drawingManager.setOptions({drawingControl: false});
          }

          // zoom polygon area at center, when polygon completed
          var bounds = new google.maps.LatLngBounds();
          for (var i = 0; i < this.mapArrayLatLng.length; i++) {
            bounds.extend(this.mapArrayLatLng[i]);
          }
          map.fitBounds(bounds);

          // prepare map data
          this.polygonCordinates = {
            position: this.mapArrayLatLng, 
            centre: '('+Number(center_lat).toFixed(5)+','+Number(center_lng).toFixed(5)+')',
            zoom: map.zoom
          }
      });
    }
    
  }

  dynamicPolygon(map:any) {
    let center = this.polyCentreCordinat.slice(2, 20);
    let centerPolyCo = center.split(',')
    let polygon = new google.maps.Polygon({
      paths: this.mapArrayLatLng,
      center: {lat: centerPolyCo[0], lng: centerPolyCo[1]},
      // zoom: this.polygonZoom
    })
  
    // disable edit controls
    if(this.mapArrayLatLng.length > 0) {
      this.drawingManager.setOptions({drawingControl: false});
    }
 
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < this.mapArrayLatLng.length; i++) {
      bounds.extend(this.mapArrayLatLng[i]);
    } 
    map.fitBounds(bounds);

    polygon.setMap(map);
    // prepare map data
    this.polygonCordinates = {
      position: this.mapArrayLatLng, 
      centre: this.polyCentreCordinat,
      zoom: this.polygonZoom
    }
  }

  resetMap() {
    this.mapArrayLatLng.length = 0;
    this.generateMap();
  }

  onChange(event: any, index:string) {
    this.fileUploadList.length = 0;
    this.file = event.target.files[0];
    const formData = new FormData(); 
    if(index === '0') {
      this.File_Upload_Name=this.file.name;
      let fileType = this.file.type.split('/')[1];
      if(this.filePattern.includes(fileType.toLowerCase())) {
        formData.append("Connection_Id", this.connectionId);
        formData.append("file", this.file, this.file.name);
        this.yourSitePlanService.upload(formData).subscribe((response: any) => {
            if(response){
              this.File_Upload=response.filebaseId;
              this.fileUploadList.push(this.File_Upload_Name);
              this.isValidFile1 = true;
              this._snackBar.open("File Uploaded Successfully", "OK", {
                duration: 3000,
              });
              } 
          }, () => {
            this._snackBar.open("Bad Request", "OK", {
              duration: 3000
          });
        });
      } else{
        this.isValidFile1=false;
      }
    }else if(index === '1') {
      this.File_Upload_Name_1 = this.file.name;
      let fileType = this.file.type.split('/')[1];
      if(this.filePattern.includes(fileType.toLowerCase())) {
        formData.append("Connection_Id", this.connectionId);
        formData.append("file", this.file, this.file.name);
        this.yourSitePlanService.upload(formData).subscribe((response: any) => {
            if(response){
              this.File_Upload_1=response.filebaseId;
              this.fileUploadList.push(this.File_Upload_Name_1);
              this.isValidFile2 = true;
              this._snackBar.open("File Uploaded Successfully", "OK", {
                duration: 3000,
                
              });
              } 
          }, () => {
            this._snackBar.open("Bad Request", "OK", {
              duration: 3000
          });
        });
      }else{
        this.isValidFile2 = false;
      }
    }else if(index === '2') {
      this.File_Upload_Name_2 = this.file.name;
      let fileType = this.file.type.split('/')[1];
      if(this.filePattern.includes(fileType.toLowerCase())) {
        formData.append("Connection_Id", this.connectionId);
        formData.append("file", this.file, this.file.name);
        this.yourSitePlanService.upload(formData).subscribe((response: any) => {
            if(response){
              this.File_Upload_2=response.filebaseId;
              this.fileUploadList.push(this.File_Upload_Name_2);
              this.isValidFile3 = true;
              this._snackBar.open("File Uploaded Successfully", "OK", {
                duration: 3000,
                
              });
              } 
          }, () => {
            this._snackBar.open("Bad Request", "OK", {
              duration: 3000
          });
        });
      }else{
        this.isValidFile3 = false;
      }
    }else if(index === '3') {
      this.File_Upload_Name_3 = this.file.name;
      let fileType = this.file.type.split('/')[1];
      if(this.filePattern.includes(fileType.toLowerCase())) {
        formData.append("Connection_Id", this.connectionId);
        formData.append("file", this.file, this.file.name);
        this.yourSitePlanService.upload(formData).subscribe((response: any) => {
            if(response){
              this.File_Upload_3=response.filebaseId;
              this.fileUploadList.push(this.File_Upload_Name_3);
              this.isValidFile4 = true;
              this._snackBar.open("File Uploaded Successfully", "OK", {
                duration: 3000,
                
              });
              } 
          }, () => {
            this._snackBar.open("Bad Request", "OK", {
              duration: 3000
          });
        });
      }else{
        this.isValidFile4 = false;
      }
    }else{
      this.fileUploadList.length = 0;
    }
  }

  onSave(type:string, status:string) {
    this.formSubmitted = true;
    let siteData = 
    //   {
    //   name: 'connections_siteplan.level',
    //   value: '2'
    // },{
    //   name: 'connections_mapdata.sitetype',
    //   value: '1'
    // },{
    //   name: 'connections_mapdata.temporarytype',
    //   value: '0'
    // },
    {
      SiteId: this.siteId ? this.siteId : null,
      Connection_Id: this.connectionId ? this.connectionId : null,
      Connection_Mapdata_Sitedata: this.polygonCordinates,
      Connection_Mapdata_Upload1: this.File_Upload ? this.File_Upload : null,
      Connection_Mapdata_Upload2: this.File_Upload_1 ? this.File_Upload_1 : null,
      Connection_Mapdata_Upload3: this.File_Upload_2 ? this.File_Upload_2 : null,
      Connection_Mapdata_Upload4: this.File_Upload_3 ? this.File_Upload_3 : null
    }

    this.updateProgressionStatus(status);
    
    if(this.mapArrayLatLng.length === 0) {
      this.showMapError = true;
      return;
    } 
    this.showMapError = false;
    if(!this.isValidFile1 || !this.isValidFile2 || !this.isValidFile3 || !this.isValidFile4) {
      return;
    }
    // this.isValidFile1=true;
    if(this.fileUploadList.length === 0) {
      this.showUploadFileError=true;
      return;
    }
    this.showUploadFileError = false;
    this.yourSitePlanService.submitSitePlanData(siteData).subscribe(response => {
      if (response) {
        if (response.message) {
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

ngOnDestroy(): void {
  this.currentUrlSub.unsubscribe();
   this.templateListSub.unsubscribe();
   this.progressionSub.unsubscribe();
   this.connectionIdSub.unsubscribe();
}


}
