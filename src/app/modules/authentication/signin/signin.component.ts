import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { CrmService } from 'src/app/services/crm/crm.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  title = 'IFAGATE';
  notmatched: boolean = false;

  loading = false;
  submitted = false;
  error = '';
  usrPwd: string = "";

  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  mCurTime = this.formatTime(this.utc);
  mCYear = new Date().getFullYear();

  signinForm: FormGroup;

  constructor(public router: Router,private authenticationService: AuthenticationService, private crmservice: CrmService) { 
    this.signinForm = new FormGroup({
      username: new FormControl('', [ Validators.required ]),
      password: new FormControl('', [ Validators.required ])
    });
  }

  ngOnInit() {
    
  }

  onSignin() {
    const data = this.signinForm.value;
    console.log(data);
    this.submitted = true;
    // stop here if form is invalid
    if (this.signinForm.invalid) {
      return;
    } 
    else {
      this.loading = true;
      //this.encrypt(data.password);
      this.authenticationService.checkUser(data.username).subscribe ((res: any) => {
        console.log(res.recordset[0]);
        if(data.password === res.recordset[0].PASSWORD) {
          this.error = "";
          // if signin success then:
          this.crmservice.getMemberFromCPR(res.recordset[0].USERCODE).subscribe((resp: any) => {
            this.authenticationService.signin(res.recordset[0].USERCODE, res.recordset[0].FIRSTNAME, res.recordset[0].LASTNAME, res.recordset[0].USERCLASS).subscribe((res: any) => {
              this.router.navigate(['home/dashboard']);
              //Email submit
              this.authenticationService.sendUserLoginEmail(resp.recordset[0].MemberNo, resp.recordset[0].NAME, resp.recordset[0].Email, this.mCurDate, this.mCurTime).subscribe((res: any) => {
                console.log('EMAIL SENT')
              }, (err: any) => {
                console.log(err)
              })
              this.signinForm = new FormGroup({
                username: new FormControl('', [ Validators.required ]),
                password: new FormControl('', [ Validators.required ])
              });
            })
          }, (err: any) => {
            this.authenticationService.signin(res.recordset[0].USERCODE, res.recordset[0].FIRSTNAME, res.recordset[0].LASTNAME, res.recordset[0].USERCLASS).subscribe((resP: any) => {
              this.router.navigate(['home/dashboard']);
              //Email submit
              this.authenticationService.sendUserLoginEmail(res.recordset[0].USERCODE, res.recordset[0].FIRSTNAME, 'noohmanzoor02@gmail.com', this.mCurDate, this.mCurTime).subscribe((res: any) => {
                console.log('EMAIL SENT')
              }, (err: any) => {
                console.log(err)
              })
              this.signinForm = new FormGroup({
                username: new FormControl('', [ Validators.required ]),
                password: new FormControl('', [ Validators.required ])
              });
            })
          })
        }
        else {
          this.error = "Password is incorrect!";
        }
      },
      (err: any) => {
        this.error = "Username or Password is incorrect!";
      });
    }
  }

  encrypt(pwd: string) {
    this.usrPwd = "";
    var i: number;
    var ascii: number;
    for(i = 0; i < pwd.length; i++) {
      ascii = pwd[i].charCodeAt(0)+10;
      this.usrPwd += String.fromCharCode(ascii);
    }
  }

  formatDate(date: any) {
    var d = new Date(date), day = '' + d.getDate(), month = '' + (d.getMonth() + 1), year = d.getFullYear();

    if (day.length < 2) {
      day = '0' + day;
    } 
    if (month.length < 2) {
      month = '0' + month;
    }
    return [day, month, year].join('-');
  }

  formatTime(date: any) {
    var d = new Date(date), hour = '' + d.getHours(), minute = '' + d.getMinutes(), second = '' + d.getSeconds();

    if (hour.length < 2) {
      hour = '0' + hour;
    } 
    if (minute.length < 2) {
      minute = '0' + minute;
    }
    if (second.length < 2) {
      second = '0' + second;
    }
    return [hour, minute, second].join(':');
  }

  get f() { return this.signinForm.controls; }  


}
