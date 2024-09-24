import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, } from 'rxjs';
import { LoggedUserModel } from './logged-user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class AuthenticationService {
  private url = 'http://15.185.46.105:5030/api/user';

  loggedUserSubject: BehaviorSubject<LoggedUserModel>;
  loggedUser: LoggedUserModel;

  constructor(private http: HttpClient) {
    //this.setUser(); // for the purpose of this example we initialize it with a default logged user
    this.loggedUserSubject = new BehaviorSubject(this.loggedUser);
  }

  isAuthenticated() {
    return this.loggedUserSubject.asObservable();
  }

  // tslint:disable-next-line:max-line-length
  setUser(userid: string, firstname: string, lastname: string, userclass: string) {
    // this sets a default user for the template
    this.loggedUser = new LoggedUserModel();
    this.loggedUser.firstname = firstname;
    this.loggedUser.lastname = lastname;
    //this.loggedUser.image = image;
    this.loggedUser.userclass = userclass;
    localStorage.setItem('userid', JSON.stringify(userid));
    localStorage.setItem('firstname', JSON.stringify(firstname));
    localStorage.setItem('lastname', JSON.stringify(lastname));
    localStorage.setItem('userclass', JSON.stringify(userclass));
  }

  checkUser(username: string): Observable<any> {
    // your log in logic should go here
    return this.http.get(this.url + '/' + username)
  }

  getUserRole(userclass: string) {
    return this.http.get(this.url + '/roles/' + userclass)
  }

  signin(usercode: string, firstname: string, lastname: string, userclass: string): Observable<any> {
    this.setUser(usercode,firstname, lastname, userclass);
    // your log in logic should go here
    this.loggedUserSubject.next(this.loggedUser);
    return of(true);
  }

  signup(fName: string, lName: string, usrCode: string, pwd: string, cntctNbr: string, userid: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newUsr = {
      usercode: usrCode,
      password: pwd,
      firstname: fName,
      lastname: lName,
      contactno: cntctNbr,
      userid: userid
    }

    return this.http.post(this.url + 's/new', JSON.stringify(newUsr), { headers: headers })
  }

  getAllEmails(cprno: string) {
    return this.http.get(this.url + '/getAllEmails/' + cprno)
  }

  sendNewUserEmail(cprno: string, name: string, password: string, recipient: string, creatdt: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newUsr = {
      cprno: cprno,
      name: name,
      password: password,
      recipient: recipient,
      creatdt: creatdt,
    }

    return this.http.post(this.url + '/email/registration', JSON.stringify(newUsr), { headers: headers })
  }

  sendUserLoginEmail(cprno: string, name: string,recipient: string, creatdt: string, time: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newUsr = {
      cprno: cprno,
      name: name,
      recipient: recipient,
      creatdt: creatdt,
      date: creatdt,
      time: time,
    }

    return this.http.post(this.url + '/email/login', JSON.stringify(newUsr), { headers: headers })
  }

  sendUserForgotPasswordEmail(cprno: string, name: string,recipient: string, creatdt: string, time: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newUsr = {
      cprno: cprno,
      name: name,
      recipient: recipient,
      creatdt: creatdt,
      date: creatdt,
      time: time,
    }

    return this.http.post(this.url + '/email/recoverpassword', JSON.stringify(newUsr), { headers: headers })
  }

  userUploadDocument(cprno: string, name: string,recipient: string, creatdt: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newUsr = {
      cprno: cprno,
      name: name,
      recipient: recipient,
      creatdt: creatdt,
      date: creatdt,
    }

    return this.http.post(this.url + '/email/upload', JSON.stringify(newUsr), { headers: headers })
  }
  
  userAGMRegistrationDocEmail(cprno: string, agmtitle: string, name: string, recipient: string, creatdt: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newUsr = {
      cprno: cprno,
      agmtitle: agmtitle,
      name: name,
      recipient: recipient,
      creatdt: creatdt,
      date: creatdt,
    }

    return this.http.post(this.url + '/email/agmregistration', JSON.stringify(newUsr), { headers: headers })
  }
  
  userAGMRegistrationProxyEmail(cprno: string, name: string,proxname: string,agmtitle: string,recipient: string, creatdt: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newUsr = {
      cprno: cprno,
      name: name,
      proxname: proxname,
      agmtitle: agmtitle,
      recipient: recipient,
      creatdt: creatdt,
      date: creatdt,
    }

    return this.http.post(this.url + '/email/agmproxy', JSON.stringify(newUsr), { headers: headers })
  }

  userElectionNominationEmail(year: string, cprno: string, name: string, recipient: string, creatdt: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newUsr = {
      year: year,
      cprno: cprno,
      name: name,
      recipient: recipient,
      creatdt: creatdt,
      date: creatdt,
    }

    return this.http.post(this.url + '/email/electionNomination', JSON.stringify(newUsr), { headers: headers })
  }

  logout(): Observable<any> {
    this.loggedUser = null;
    localStorage.setItem('firstname', "");
    localStorage.setItem('lastname', "");
    localStorage.setItem('userclass', "");
    // your log out logic should go here
    this.loggedUserSubject.next(null);
    return of(true);
  }

  recoverPassword(usrCode: string, pwd: String) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    const newUsr = {
      usercode: usrCode,
      password: pwd
    }

    return this.http.post(this.url + '/changePassword', JSON.stringify(newUsr), { headers: headers })
  }

  changeImage(imagename: string, cprno: String) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    const newUsr = {
      imagename: imagename,
      cprno: cprno
    }

    return this.http.post(this.url + '/changeImage', JSON.stringify(newUsr), { headers: headers })
  }

  sendUserUpdateDetailsLogin(cprno: string, name: string,recipient: string, creatdt: string, time: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newUsr = {
      cprno: cprno,
      name: name,
      recipient: recipient,
      creatdt: creatdt,
      date: creatdt,
      time: time,
    }

    return this.http.post(this.url + '/email/uppdatedetails', JSON.stringify(newUsr), { headers: headers })
  }

  sendUserRequestRegisteration(cprno: string, name: string,recipient: string, creatdt: string, time: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newUsr = {
      cprno: cprno,
      name: name,
      recipient: recipient,
      creatdt: creatdt,
      date: creatdt,
      time: time,
    }

    return this.http.post(this.url + '/email/requestRegistration', JSON.stringify(newUsr), { headers: headers })
  }

}
