import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/test/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

interface Location {
  location: {
    longitude: number,
    latitude: number,
    timeStamp: string,
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

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

  putAdminAppRoles(username: string, roles: string[]): Observable<any> {
    return this.http.put(API_URL + 'admin/manageroles', {
      username,
      roles
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
}
