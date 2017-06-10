import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController,AlertController,ToastController } from 'ionic-angular';
import {Geolocation, Geoposition} from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { AuthProvider } from '../../providers/auth/auth';
import { InfoService } from '../../providers/info-service/info-service';
import { LocationService } from '../../providers/location-service/location-service';
import { LoginPage } from '../login/login';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  driver_ID:any;
  driver:any;
  routes:any;
  status=null;
  route=null;
  loggedIn:boolean;
  watch:any;
  locationEnable:boolean=true;
  constructor(public navCtrl: NavController, public geolocation:Geolocation,public zone:NgZone,public toastCtrl:ToastController,public loading:LoadingController, public auth:AuthProvider,public navParams:NavParams,public locationService:LocationService,public infoService:InfoService,
          public alertCtrl:AlertController, public backgroundGeolocation:BackgroundGeolocation) {
    //todo cuando haga el get de driver inicialzar ruta y estado con base datos
    
          
  }
  //this method runs when the page is initialize
  ngOnInit(){
  
  //loading circle is presented until information from the driver is fetched
  let loading = this.loading.create({
    content: 'Please wait...'
  });

  loading.present(loading);
    //loggedIn true to indicate driver is currently logged in
    this.loggedIn=true;
    this.driver={}
    this.driver_ID=Number(localStorage.getItem("userID"));

    //if there is no driver id push back to login
    if(this.driver_ID==null){
      this.navCtrl.setRoot(LoginPage);
    }
    //get route id and route name from server
    this.infoService.getRoutes().subscribe(response =>{
        this.routes=response;
        console.log(response)
    })
    //get driver info from server
    this.infoService.getComplete_Bus_Driver_Info(this.driver_ID).subscribe(response=>{
      console.log(response)
      this.driver=response;
      loading.dismiss();
      if(this.driver){
        this.locationCycle();
      }

    },err => {
        if(err.status==0){
          loading.dismiss();
          this.presentAlert("Error Connecting to Server","Please establish a connection and try again");
        } else{
          //a bus hasnt been assigned to a driver
            loading.dismiss();
            let alert = this.alertCtrl.create({
            title: 'Contact administrator',
            message: 'You have not been assigned to a bus',
            buttons: [
              {
                text: 'Ok',
                role: 'Ok',
                handler: () => {
                  this.logout()
                }
              }
            ]
          });
          alert.present();
        }
    })
    
    
  }
  //this method is use to either update bus status or bus route
  //it present a toast message when update is successfully completed
  update(){
    let loading = this.loading.create({
    content: 'Updating...'
    });
    loading.present()
    this.route=this.routes.filter(x => x.route_name === this.route)
    this.infoService.update(this.driver_ID,this.driver.bus_id,this.route[0],this.status).subscribe(response=>{
      this.driver=response;
      loading.dismiss();
      this.presentToast("Succesfully Updated")
    },err => {
        console.log("error status",err.status)
        if(err.status==0){
          loading.dismiss();
          this.presentAlert("Error Connecting to Server","Please establish a connection and try again");
        }  
    });
    this.route=null;
    this.status=null;
    
  }
  //this method sends the location of the bus to the server
   locationCycle(){
    

// Background Tracking
 
  let config = {
    desiredAccuracy: 0,
    stationaryRadius: 10,
    distanceFilter: 10, 
    debug: true,
    interval: 5000 
  };
 
  this.backgroundGeolocation.configure(config).subscribe((location) => { 
 
      if(this.driver.bus_status!="Inactive"){
            this.locationEnable=true;      
            let locationInfo= {driver_id:this.driver_ID,lat:location.latitude,lng: location.longitude}
            this.locationService.sendLocation(locationInfo).subscribe(success=>{
            //this.presentToastBottom("Location updated successfully")
          },err => {
            //do nothing
            
        });
      }
    
    
 
  }, (err) => {
 
    //do nothing
 
  });
 
  // Turn ON the background-geolocation system.
  this.backgroundGeolocation.start();

  let options = {
    maximumAge:5000,
    timeout:7000,
    frequency: 5000, 
    enableHighAccuracy: true
  };
 
  this.watch = this.geolocation.watchPosition(options).subscribe((position: Geoposition) => {
  
      
    
      if(this.driver.bus_status!="Inactive"){
      if (position.coords === undefined) {
          console.log(position.coords)
          this.presentToastBottom("positionError");

      } else {
        console.log(position.coords)
          this.locationEnable=true;      
            let locationInfo= {driver_id:this.driver_ID,lat:position.coords.latitude,lng: position.coords.longitude}
            this.locationService.sendLocation(locationInfo).subscribe(success=>{
            this.presentToastBottom("Location updated successfully")
          },err => {
            console.log("error on location",err)
            if(err.status===0){
              //if there is no connection to server present alert
              this.presentToastBottom("Error connecting to server");
              
            }
            
        });
      }
    }
      
       },err => {
        //if location is not enable present alert
        console.log("error on location 2",err)
        if(this.locationEnable){
         this.presentAlert('Location not enable','Please go to location settings and enable location')
         this.locationEnable=false
      }
      
      
    });
  
  }
  

  //this method logs out driver from system
  logout(){
    //call log out to server
    this.auth.logout(this.driver_ID)
    .subscribe(data=>{   
      //logout successfull          
        if(data.success==1) { 
          localStorage.setItem("userID",null);
          this.loggedIn=false;
          if(this.watch){
          this.watch.unsubscribe();
          this.backgroundGeolocation.finish();
          }
          this.presentToast("Succesfully Logged out")
          this.navCtrl.setRoot(LoginPage);          
        }
        //present alert if logout is not successful
        else this.presentAlert('Could not logged out',"Try again");
    },err => {
            if(err.status==0){
              //present alert is log out could not be process by server
              this.presentAlert("Error Connecting","Please establish a connection and try again");
              
            }
            
        })
}

//this method is used to present the alert with the desired title and subtitle
presentAlert(title,subTitle){
    let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['Dismiss']
          });
    alert.present();
}
//this method is used to present the toast with the message value
presentToast(message) {
  let toast = this.toastCtrl.create({
    message: message,
    duration: 2000,
    position: 'middle'
  });
  toast.present();
}
presentToastBottom(message) {
  let toast = this.toastCtrl.create({
    message: message,
    duration: 3000,
    position: 'bottom'
  });
  toast.present();
}
}


