import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the InfoService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class InfoService {
  routes:any;
  drivers:any;
  constructor(public http: Http) {

  }
  //this method connects to server and get the driver info 
  getComplete_Bus_Driver_Info(driverID){
    console.log("entre a cojer el driver")
    // var driver_id={
    //   "driver_id":driverID
    // }
    let url="https://evening-crag-15118.herokuapp.com/bustrackingRoutes/getDriverInfo"
    //let url="http://localhost:8080/bustrackingRoutes/getDriverInfo"
    return this.http.get(url+"?driver_id="+driverID).map(res=>res.json())
    // return new Promise(resolve=>{
    //   var driver={}
    //     for(var i=0;i<this.drivers.length;i++){
    //       if(this.drivers[i].driver_ID==driverID){
    //         driver=this.drivers[i];
    //       }
    //     }
    //     resolve(driver)
    // })
    
  }
  //this method establishes a connection with the server and retrieves all the route ids and name
  getRoutes(){
    //server url
    let url="https://evening-crag-15118.herokuapp.com/bustrackingRoutes/getRoutes"
    //let url="http://localhost:8080/bustrackingRoutes/getRoutes"
    //calling server
    return this.http.get(url).map(res=>res.json())
    
    // return new Promise(resolve=>{
    //   resolve(this.routes);
    // })
     
  }

  //this method either updates the routes or the status
  update(driverid,busid,route,status){
    //if route is null it means with are updating bus status
    if(route!=null){
      //creating bus status predefined object to be recieved on server
      var info={
        "driver_id":driverid,
        "bus_id":busid,
        "route_id":route.route_id
      }
      //server url
      let url="https://evening-crag-15118.herokuapp.com/bustrackingRoutes/changeDriverRoute"
      //let url="http://localhost:8080/bustrackingRoutes/changeDriverRoute"
      //calling server
      return this.http.put(url,info).map(res=>res.json())
    }
    else {
      //creating update route predefined object to be received on server
      var info2={
        "driver_id":driverid,
        "bus_id":busid,
        "bus_status":status
      }
      //server url
      let url="https://evening-crag-15118.herokuapp.com/bustrackingRoutes/updateBusStatus"
      //let url="http://localhost:8080/bustrackingRoutes/updateBusStatus"
      //call server
      return this.http.put(url,info2).map(res=>res.json())
    }
    // return new Promise(resolve=>{
    //   if(status==null){
    //   for(var i=0;i<this.drivers.length;i++){
    //     if(this.drivers[i].driver_ID==driverID){
    //       this.drivers[i].route_ID=route.route_ID;
    //       this.drivers[i].route_name=route.route_name;
    //       alert("You have updated route to: "+route)
    //       resolve(this.drivers[i])
    //       break;
    //     }
    // }
      
    // }else{
    //   for(var i=0;i<this.drivers.length;i++){
    //   if(this.drivers[i].driver_ID==driverID){
    //     this.drivers[i].bus_status=status;
    //     alert("You have updated status to: "+status)
    //     resolve(this.drivers[i])
    //     break;
    //   }
    // }
     
    // }
    // });
    
  }

}
