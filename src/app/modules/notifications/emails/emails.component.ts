import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent implements OnInit {
  uC = JSON.parse(localStorage.getItem('userid'));
  emailList: any[] =[]

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.authenticationService.getAllEmails(this.uC).subscribe((res: any) => {
      this.emailList = res.recordset
      console.log(this.emailList)
    })
  }

}
