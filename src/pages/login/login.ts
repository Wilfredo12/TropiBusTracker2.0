import { Component } from '@angular/core';
import { NavController, AlertController  } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  registerCredentials = {username: '', password: ''};
  userID:number;
  constructor(public navCtrl: NavController,public auth:AuthProvider,public alertCtrl:AlertController) {
    //if driver was already logged in, go to home page
    // let driver_ID=Number(localStorage.getItem("userID"));
    // if(driver_ID!=null&&driver_ID>=0){
    //   this.navCtrl.setRoot(HomePage);
    // }
  }

 //this method is used to login drivers into application
  login(){ 
    //called authentication provider and send username and password
    this.auth.login(this.registerCredentials)
    .subscribe(data=>{
        //if response is not -1 it means the credentials are correct   
        if(data.driver_id!=-1) {          
          localStorage.setItem('userID',String(data.driver_id));
          this.navCtrl.setRoot(HomePage);
          
        }
        else {
          //if credentials are not correct show alert stating userame and password is invalid
          this.presentAlert("Username or Password Invalid","Please re-enter your credentials");
          
        }
    },
    err => {
        if(err.status==0){
          //if service could not connect to server show network connection error
          this.presentAlert("No Internet Connection","Please establish a connection and try again");
          
        }
        
    })
  }
  //this method presents an alert with the title and subtitle passed as parameters
  presentAlert(title,subTitle){
    let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['Dismiss']
          });
  alert.present();
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
