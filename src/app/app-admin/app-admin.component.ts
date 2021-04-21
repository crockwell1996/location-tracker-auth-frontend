import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import {TokenStorageService} from "../_services/token-storage.service";

interface roleObj {
  _id: string,
  name: string,
}

interface UserDataObj {
  roles: roleObj[],
  _id: string,
  username: string,
}

interface userRowRoleObj {
  name: string,
  checked: boolean,
}

interface userRowObj {
  username: string,
  userId: string,
  userRoles: userRowRoleObj[],
}

interface rolesTblRes {
  name: string,
  selected: boolean,
}

interface usrTblRes {
  id: string,
  roles: rolesTblRes[],
}

@Component({
  selector: 'app-app-admin',
  templateUrl: './app-admin.component.html',
  styleUrls: ['./app-admin.component.css']
})

export class AppAdminComponent implements OnInit {
  roles: roleObj[] = [];
  users: UserDataObj[] = [];
  tblRows: userRowObj[] = [];
  tblDataRes: usrTblRes[] = [];

  currentUser: null;
  userManagerAlert = '';

  constructor(
    private userService: UserService,
    private token: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    if (this.currentUser) {
      this.userService.getAdminAppRoles().subscribe(
        data => {
          this.roles = data.roles;
          this.users = data.users;
          this.shapeTable();
          console.log(this.tblRows);
        },
        err => {
          this.userManagerAlert = JSON.parse(err.error).message;
        }
      );
    }
  }

  onSubmit(): void {
    const roleTable = window.document.getElementById('roleTable');
    // @ts-ignore
    for (let i = 1; i < roleTable.rows.length; i++) {
      // @ts-ignore
      const rTblCells = roleTable.rows[i].cells;
      const userObj: usrTblRes = {
        id: '',
        roles: [],
      }
      for (let j = 0; j < rTblCells.length; j++) {
        if (j === 0) {
          userObj.id = rTblCells.item(j).innerHTML;
        }
        if (j === 2 || j === 3) {
          const roleObj: rolesTblRes = {
            name: rTblCells.item(j).children[0].children[1].innerHTML,
            selected: rTblCells.item(j).children[0].children[0].checked,
          }
          userObj.roles.push(roleObj);
        }
      }
      this.tblDataRes.push(userObj);
    }
    this.userService.putAdminAppRoles(this.tblDataRes).subscribe(
      data => {
      window.alert(data.message);
      this.reloadPage();
    },
      err => {
        window.alert(JSON.parse(err.error).message);
      }
    );
    console.log(this.tblDataRes);
  }

  shapeTable(): void {
    this.users.forEach((user) => {
      const userRow: userRowObj = {
        userId: '',
        username: "",
        userRoles: [],
      };
      userRow.username = user.username;
      userRow.userId = user._id;
      this.roles.forEach((role) => {
        const rowRoleObj: userRowRoleObj = {
          name: '',
          checked: false,
        };
        rowRoleObj.name = role.name;
        user.roles.forEach((userRole) => {
          if (userRole.name === role.name) {
            rowRoleObj.checked = true;
          }
        });
        userRow.userRoles.push(rowRoleObj);
      });
      this.tblRows.push(userRow);
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
