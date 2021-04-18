import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { UserService } from '../_services/user.service';
import {TokenStorageService} from "../_services/token-storage.service";

@Component({
  selector: 'app-app-user',
  templateUrl: './app-user.component.html',
  styleUrls: ['./app-user.component.css']
})

export class AppUserComponent implements OnInit {
  content?: string;
  currentUser: null;
  // define locations
  locations:
    {
      _id: string,
      longitude: string,
      latitude: string,
      timeStamp: string,
    }[] = [];
  locationAlert = '';

  constructor(
    private userService: UserService,
    private token: TokenStorageService
    ) { }

  // Removes alert message upon user close event
  @ViewChild('alert', { static: true }) alert: ElementRef | any;

  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    if (this.currentUser) {
      this.loadUserLocations();
      this.userService.getUserApp().subscribe(
        data => {
          this.content = data;
        },
        err => {
          this.content = JSON.parse(err.error).message;
        }
      );
    }
  }

  deleteLocation(id: string) {
    const verifyDelete =
      confirm(`Are you sure you want to delete location with id: ${id}?`);
    if (verifyDelete) {
      this.userService.deleteUserAppLocation(id).subscribe(
        data => {
          console.log(data);
          alert(data.message);
          this.reloadPage();
        },
        err => {
          alert(err.message);
        }
      )
    }
  }

  logLocation(toggle: any) {
    window.alert(toggle.checked);
    this.userService.triggerLocationLogging(toggle);
  }

  private loadUserLocations(): void {
    this.userService.getUserAppLocations().subscribe(
      data => {
        this.locations = data.locations;
      },
      err => {
        this.locationAlert = JSON.parse(err.error).message;
      }
    )
  }

  reloadPage(): void {
    window.location.reload();
  }
}

