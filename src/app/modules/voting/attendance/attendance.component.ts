import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CrmService } from 'src/app/services/crm/crm.service';
import { VotingService } from 'src/app/services/voting/voting.service';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  @ViewChild("table1", {static: false}) table: ElementRef;

  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  mCYear = new Date().getFullYear();

  membList: any[] = []

  constructor(private crmService: CrmService, private router: Router, private votingService: VotingService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    for(let i=this.mCYear; i>=2023; i--) {
      this.votingService.getAGMRecord(i.toString()).subscribe((res: any) => {
        console.log(res)
        for(let j=0; j<res.recordset.length; j++) {
          let record = []
          this.votingService.getRegistrationDetail(res.recordset[j].AGMCODE).subscribe((resp: any) => {
            console.log(resp)
            for(let k=0; k<resp.recordset.length; k++) {
              if(resp.recordset[k].membtype === 'O') {
                let A = {
                  agmcode: resp.recordset[k].agmcode,
                  cprno: resp.recordset[k].Memberno,
                  name: resp.recordset[k].name,
                  agmname: resp.recordset[k].agmname,
                  agmdate: resp.recordset[k].agmdate,
                  registered: resp.recordset[k].CREATEDDATE,  
                  status: resp.recordset[k].votingStatus,
                  position: resp.recordset[k].position,
                  proxy: 'N',
                  titledeed: 'Y',
                  cprdoc: 'Y',
                  balance: '0'
                }
                record.push(A)
              } else {
                let B = {
                  agmcode: resp.recordset[k].agmcode,
                  cprno: resp.recordset[k].Memberno,
                  name: resp.recordset[k].name,
                  agmname: resp.recordset[k].agmname,
                  agmdate: resp.recordset[k].agmdate,
                  registered: resp.recordset[k].CREATEDDATE,  
                  status: resp.recordset[k].votingStatus,
                  position: resp.recordset[k].position,
                  proxy: resp.recordset[k].proxy_OF,
                  titledeed: 'Y',
                  cprdoc: 'Y',
                  balance: '0'
                }
                record.push(B)
              }
            }
          })
          //break;
          this.membList.push(record)
        }
      })
    }
  }

  deregister(cprno: string, agmcode: string) {
    this.votingService.updateRegistration(agmcode, cprno).subscribe((res: any) => {
      this.getData();
    })
  }

  fireEvent() {
    console.log(this.membList)
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );

    /* new format */
    var fmt = "0.00";
    /* change cell format of range B2:D4 */
    var range = { s: { r: 1, c: 1 }, e: { r: 2, c: 100000 } };
    for (var R = range.s.r; R <= range.e.r; ++R) {
      for (var C = range.s.c; C <= range.e.c; ++C) {
        var cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (!cell || cell.t != "n") continue; // only format numeric cells
        cell.z = fmt;
      }
    }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    var fmt = "@";
    wb.Sheets["Sheet1"]["F"] = fmt;

    /* save to file */
    XLSX.writeFile(wb, "Voter-Register-List.xlsx");
  }

  public gotoPropertyDetails(url, id) {
    var myurl = `${url}/${id}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
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
}






    /*this.crmService.getAllMembers().subscribe((res: any) => {
      for(let i=0; i<res.recordset.length; i++) {
        let mCPR = '', mTd = '', mProx = '';
        this.crmService.checkCprDoc(res.recordset[i].MemberNo).subscribe((res: any) => {
          if(res.recordset[0].CPR === 0) {
            mCPR = 'N'
          } else {
            mCPR = 'Y'
          }
        }, (err: any) => {
          mCPR = 'N'
        })
        this.crmService.checkProxyDoc(res.recordset[i].MemberNo).subscribe((res: any) => {
          if(res.recordset[0].PROXYFORM === 0) {
            mProx = 'N'
          } else {
            mProx = 'Y'
          }
        }, (err: any) => {
          mProx = 'N'
        })
        this.crmService.checkTitleDeedDoc(res.recordset[i].MemberNo).subscribe((res: any) => {
          if(res.recordset[0].TITLEDEED === 0) {
            mTd = 'N'
          } else {
            mTd = 'Y'
          }
        }, (err: any) => {
          mTd = 'N'
        })
        this.crmService.getProxyFromCPR(res.recordset[i].MemberNo).subscribe((resp: any) => {
          const memb = {
            membNo: res.recordset[i].MemberNo,
            mName: res.recordset[i].NAME,
            mProxCPR: resp.recordset[0].MemberNo,
            mProxName: resp.recordset[0].NAME,
            mDate: res.recordset[i].CREATEDDATE,
            mTitleDeedStatus: mTd,
            mCPRStatus: mCPR,
            mProxyFormStatus: mProx,
            mBalance: 0,
          } 
          this.membList.push(memb)
        }, (err: any) => {
          const memb = {
            membNo: res.recordset[i].MemberNo,
            mName: res.recordset[i].NAME,
            mProxCPR: " ",
            mProxName: " ",
            mDate: res.recordset[i].CREATEDDATE,            
            mTitleDeedStatus: mTd,
            mCPRStatus: mCPR,
            mProxyFormStatus: mProx,
            mBalance: 0,
          } 
          this.membList.push(memb)
        })
      }
      console.log(this.membList)
    })*/