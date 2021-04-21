import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GeolocationService} from '@ng-web-apis/geolocation';
import { Observable } from 'rxjs';
import {take} from "rxjs/operators";

// const API_URL = 'http://localhost:8080/api/test/';
const API_URL = 'http://3.139.61.89:8080/api/test/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

interface Location {
  longitude: number,
  latitude: number,
  timeStamp: string,
}

interface roleObj {
  name: string,
  selected: boolean,
}

interface userObj {
  id: string,
  roles: roleObj[],
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private readonly geolocation: GeolocationService
  ) { }

  locationBool: boolean = false;
  locationTimer: number = 0;

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserApp(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  getModeratorApp(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminApp(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }
  // Role management
  getAdminAppRoles(): Observable<any> {
    return this.http.get(API_URL + 'admin/manageroles', httpOptions);
  }

  putAdminAppRoles(roleData: userObj[]): Observable<any> {
    return this.http.put(API_URL + 'admin/manageroles', {
      users: roleData
    }, httpOptions);
  }
  // Location management
  getUserAppLocations(): Observable<any> {
    return this.http.get(API_URL + 'user/locations', httpOptions);
  }

  postUserAppLocation(location: Location): Observable<any> {
    return this.http.post(API_URL + 'user/location', {
      location: location
    }, httpOptions);
  }

  deleteUserAppLocation(id: string): Observable<any> {
    return this.http.request('DELETE', API_URL + 'user/location', {
      body: {
        id: id
      },
      headers: httpOptions.headers
    });
  }

  // Username Management
  putUserAppUsername(newUsername: string): Observable<any> {
    return this.http.put(API_URL + 'user/username', {
      newUsername
    }, httpOptions);
  }

  triggerLocationLogging(event: any): Observable<any> {
    if (event.checked) {
      this.locationBool = true;
      return this.logTimedUserLocation();
    } else {
      this.locationBool = false;
      clearTimeout(this.locationTimer);
      return this.logTimedUserLocation();
    }
  }

  // Log locations
  logTimedUserLocation(): any | void {
    // Stop collecting location if disabled
    if (!this.locationBool) {
      return alert('Location is no longer being logged.');
    } else {
      this.geolocation
        .pipe(take(1))
        .subscribe(
          position => {
            const locationEntry: Location = {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
              timeStamp: new Date().toString()
            };
            this.locationTimer = setTimeout(this.logTimedUserLocation, 1000 * 300);
            return this.postUserAppLocation(locationEntry);
          },
          error => {
            return alert(`An error logging your location has occurred.\n${error}`);
          })
    }
  }
}
