import { Component, OnInit } from '@angular/core';
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

  constructor(
    private userService: UserService,
    private token: TokenStorageService
    ) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    if (this.currentUser) {
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
}
