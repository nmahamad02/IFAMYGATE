import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { SideMenusService } from '../side-menus/side-menus.service';
import { LoggedUserModel } from 'src/app/modules/authentication/logged-user.model';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { Router } from '@angular/router';
import { getTreeNoValidDataSourceError } from '@angular/cdk/tree';
import { CrmService } from 'src/app/services/crm/crm.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: [
    './styles/top-navbar.component.scss'
  ]
})
export class TopNavbarComponent implements OnInit {
  loggedUser: LoggedUserModel = null;
  
  message: string = "Welcome to IFAGATE - Floating City Amwaj Owners Association Members Portal.";

  fN = JSON.parse(localStorage.getItem('firstname'));
  lN = JSON.parse(localStorage.getItem('lastname'));
  uC = JSON.parse(localStorage.getItem('userclass'));
  cpr = JSON.parse(localStorage.getItem('userid'));

  imageSrc: string = "";

  // tslint:disable-next-line:variable-name
  _mode = 'expanded';

  @HostBinding('attr.mode')
  @Input()
  set mode(val: string) {
    this._mode = (val !== undefined && val !== null) ? val : 'expanded';
  }
  get mode(): string {
    return this._mode;
  }

  constructor(
    private sideMenusService: SideMenusService,
    private crmservice: CrmService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.authenticationService.loggedUserSubject.subscribe({
      next: (loggedUser) => {
        this.loggedUser = loggedUser;
      }
    });
    
  }
  
  ngOnInit() {
    this.crmservice.getMemberFromCPR(this.cpr).subscribe((res: any) => {
      console.log(res);
      console.log(res.recordset[0].IMAGENAME);
      var imgVal: string = res.recordset[0].IMAGENAME;
      if ((res.recordset[0].IMAGENAME === null) || (res.recordset[0].IMAGENAME === "")) {
        this.imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/imgNaN.png";
      } else if (res.recordset[0].IMAGENAME != null) {
        console.log(res.recordset[0].IMAGENAME);
        if (imgVal.includes("fakepath")) {
          var imgName: string = imgVal.slice(12);
          console.log(imgName);
          this.imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgName;
        } else {
          this.imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgVal;
        }
      }
      console.log(this.imageSrc);
    }, err => {
      console.log(err)
      this.imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/imgNaN.png";
    })
  }

  logout() {
    this.authenticationService.logout().subscribe(
      () => this.router.navigate(['authentication/signin'])
    );
  }

  toggleMainMenu(): void {
    this.sideMenusService.toggleMainMenuSubject.next('toggle');
  }

  toggleAltMenu(): void {
    this.sideMenusService.toggleAltMenuSubject.next('toggle');
  }

  toggleSettingsMenu(): void {
    this.sideMenusService.renderAltMenuSubject.next('settings');
    this.toggleAltMenu();
  }

  toggleNotificationsMenu(): void {
    this.sideMenusService.renderAltMenuSubject.next('notifications');
    this.toggleAltMenu();
  }
}
