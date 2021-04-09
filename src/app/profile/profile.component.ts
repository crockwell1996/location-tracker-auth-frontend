import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  form: any = {
    newUsername: null,
  };
  newUserName: null;
  isSuccessful = false;
  isUsernameUpdateFailed = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private token: TokenStorageService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  onSubmit(): void {
    const { newUsername } = this.form;

    this.userService.putUserAppUsername(newUsername).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isUsernameUpdateFailed = false;
        this.newUserName = newUsername;
        this.successMessage = data.message;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isUsernameUpdateFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
