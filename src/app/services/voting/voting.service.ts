import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VotingService {
  private url = 'http://15.185.46.105:5030/api';

  constructor(private http:HttpClient) { }

  getAllVoteTypes() {
    return this.http.get(this.url + '/voting/types')
  }    
  
  getVoteCategories(agmcode: string) {
    return this.http.get(this.url + '/voting/categories/' + agmcode)
  }  
  
  getActiveVoteTypes() {
    return this.http.get(this.url + '/voting/active/types')
  }
  
  getVotingAttendance() {
    return this.http.get(this.url + '/voting/attendance')
  }    

  getVotingQuestions(category: string, year: string) {
    return this.http.get(this.url + '/voting/questions/' + category + '/' + year)
  }    
  
  getVotingMembers(category: string, cpr: string) {
    return this.http.get(this.url + '/voting/members/' + category + '/' + cpr)
  }    

  getVotingElectorate() {
    return this.http.get(this.url + '/voting/electorate')
  }

  getVotingQuestionWiseResults(category: string) {
    return this.http.get(this.url + '/voting/results/' + category)
  }    

  getVotingCalculatedQuestionWiseResults(category: string) {
    return this.http.get(this.url + '/voting/calculated/results/' + category)
  }  
  
  checkVotingNumber(code: string) {
    return this.http.get(this.url + '/voting/number/' + code)
  }    
  
  checkVotingProxy() {
    return this.http.get(this.url + '/voting/proxy')
  }  

  checkVotingStatus(membno: string, category: string, year: string) {
    return this.http.get(this.url + '/voting/member/check/' + membno + '/' + category + '/' + year)
  }   
  
  countVotingStatus(membno: string, category: string, year: string) {
    return this.http.get(this.url + '/voting/member/count/' + membno + '/' + category + '/' + year)
  }  

  submitVote(year: string, memberno: string, category: string, no: string, item: string, engDesc: string, araDesc: string, voted: string, votedby: string, membertype: string,agmcode: string) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
      const newTran = {
        year: year,
        memberno: memberno, 
        category: category,
        no: no,
        item: item,
        engDesc: engDesc,
        araDesc: araDesc,
        voted: voted,
        votedby: votedby,
        membertype: membertype,
        agmcode: agmcode
      }
      return this.http.post(this.url + '/vote/submit', JSON.stringify(newTran), { headers: headers })
    }

  updateVote(year: string, memberno: string, category: string, no: string, voted: string,agmcode: string) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
      const newTran = {
        year: year,
        memberno: memberno, 
        category: category,
        no: no,
        voted: voted,
        agmcode: agmcode
      }
      return this.http.post(this.url + '/vote/update', JSON.stringify(newTran), { headers: headers })
    }

    getAGMRecord() {
      return this.http.get(this.url + '/AGMmaster')
    } 

    getAGMYearwiseRecord(year) {
      return this.http.get(this.url + '/AGMmaster/Year/' + year)
    } 

    getRegistrationDetail(agmcode: string) {
      return this.http.get(this.url + '/getRegistrationDetail/' + agmcode)
    } 

    getEntitlementList(agmcode: string) {
      return this.http.get(this.url + '/getEntitlementList/' + agmcode)
    } 
    
    checkMemberRegistration(agmcode: string, cprno: string) {
      return this.http.get(this.url + '/member/registration/' + agmcode + '/' + cprno)
    } 
  
    insertMemberRegistration(agmtitle: string, cprno: string, name: string, membtype: string, email: string, createDate: string, isprimary: string, primarymember: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      agmtitle: agmtitle,
      cprno: cprno, 
      name: name,
      membtype: membtype,
      email: email,
      createDate: createDate,
      isprimary: isprimary,
      primarymember: primarymember
    }
    return this.http.post(this.url + '/insert/member/registration', JSON.stringify(newTran), { headers: headers })
  }
  
  updateRegistration(agmcode: string, memberno: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      agmcode: agmcode,
      memberno: memberno, 
    }
    return this.http.post(this.url + '/update/registration', JSON.stringify(newTran), { headers: headers })
  }

  checkMemberNomination(agmcode: string, cprno: string) {
    return this.http.get(this.url + '/member/nomination/' + agmcode + '/' + cprno)
  }
  
  getNominationList() {
    return this.http.get(this.url + '/member/get/nomination/list')
  } 

  getBoardNominationList(agmcode: string) {
    return this.http.get(this.url + '/member/get/board/nomination/list/' + agmcode)
  } 

  insertMemberNomination(year: string, category: string, blno: string, blitem: string, bleng: string, blear: string, agmtitle: string, agmcode: string) {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');

  const newTran = {
    year: year,
    category: category, 
    blno: blno,
    blitem: blitem,
    bleng: bleng,
    blear: '',
    agmtitle: agmtitle,
    agmcode: agmcode,
  }
  return this.http.post(this.url + '/insert/member/nomination', JSON.stringify(newTran), { headers: headers })
 }
}
