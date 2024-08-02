import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrmService } from 'src/app/services/crm/crm.service';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
import { VotingService } from 'src/app/services/voting/voting.service';

@Component({
  selector: 'app-voting-overview',
  templateUrl: './voting-overview.component.html',
  styleUrls: ['./voting-overview.component.scss']
})
export class VotingOverviewComponent implements OnInit {
  votingType: any[] = []
  memberList: any[] = []

  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  mCYear = new Date().getFullYear();

  uC = JSON.parse(localStorage.getItem('userid'));

  constructor(private votingService: VotingService, private router: Router, private crmservice: CrmService, private dataSharingService: DataSharingService) { 
    this.getData() 
  }

  ngOnInit() {
  }

  getData() {
    for(let i=this.mCYear; i>=2023; i--) {
      let record = []
      this.votingService.getAGMRecord(i.toString()).subscribe((res: any) => {
        console.log(res)
        for(let j=0; j<res.recordset.length; j++) {
          let A = {
            agmcode: res.recordset[j].AGMCODE,
            agmname: res.recordset[j].AGMNAME,
            agmdate: res.recordset[j].AGMDATE,
            status: res.recordset[j].AGMSTATUS,
          }
          record.push(A)
        }
        this.votingType.push(record)
      })
    }
    /*this.crmservice.getMemberFromCPR(this.uC).subscribe((res: any) => {
      console.log(res)
      for(let i=0; i<res.recordset.length;i++){
        if(res.recordset[i].MEMBTYPE==='O') {
          const memb = {
            memberno: res.recordset[i].MemberNo,
            membername: res.recordset[i].NAME,
            membertype: res.recordset[i].MEMBTYPE
          }
          this.memberList.push(memb)
        } else if(res.recordset[i].MEMBTYPE==='P') {
          this.crmservice.getMemberFromCPR(res.recordset[i].PRIMARYMEMBER).subscribe((resp: any) => {
            const memb = {
              memberno: resp.recordset[0].MemberNo,
              membername: resp.recordset[0].NAME,
              membertype: resp.recordset[0].MEMBTYPE
            }
            this.memberList.push(memb)
          })
        }
      }
    })*/
  }

  public gotoVotingDetails(url, category, year, membno, membname, membtype) {
    var myurl = `${url}/${category}/${year}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
    const membData = {
      membno: membno,
      membname: membname,
      membtype: membtype
    }
    this.dataSharingService.setData(membData)
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
