import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {

  constructor(public http: Http) {
    console.log('Hello AuthProvider Provider');
  }
  login(user){
  //server url
  let url="https://evening-crag-15118.herokuapp.com/bustrackingRoutes/login"
  //let url="http://localhost:8080/bustrackingRoutes/login"
  //calling server with user credentials
  return this.http.post(url,user).map(res=>res.json())
  
  
}
//method to logout driver from system
logout(driverid){
  var driverID={
    "driver_id":driverid
  }
  //server url
  let url="https://evening-crag-15118.herokuapp.com/bustrackingRoutes/logout"
  //let url="http://localhost:8080/bustrackingRoutes/logout"
  //calling server to logout driver with the specified driver id
  return this.http.put(url,driverID).map(res=>res.json())
  
}

}
