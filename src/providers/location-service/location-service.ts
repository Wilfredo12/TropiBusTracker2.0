import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class LocationService {

  constructor(public http: Http) {
    console.log('Hello LocationService Provider');
  }
  //this method connect to the server and send the location info to the specified url
  sendLocation(locationInfo){
      console.log(locationInfo)
      let url="https://evening-crag-15118.herokuapp.com/bustrackingRoutes/updateBusLocation"
      //let url="http://localhost:5000/bustrackingRoutes/updateBusLocation"
      return this.http.put(url,locationInfo).map(res=>res.json());
  }
}
