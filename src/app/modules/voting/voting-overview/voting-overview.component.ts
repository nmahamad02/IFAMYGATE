import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrmService } from 'src/app/services/crm/crm.service';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
import { VotingService } from 'src/app/services/voting/voting.service';

import { ChartConfiguration, ChartDataSets } from 'chart.js';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-voting-overview',
  templateUrl: './voting-overview.component.html',
  styleUrls: ['./voting-overview.component.scss']
})
export class VotingOverviewComponent implements OnInit {
  votingList: any[] = []

  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  mCYear = new Date().getFullYear();

  uC = JSON.parse(localStorage.getItem('userid'));

  public pieChartLabels: Label[] = ['Members who voted', 'Members who did not vote'];
  public pieChartData: ChartDataSets[]  = []
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartOptions: any = { legend: { display: true, labels: { fontColor: 'black' } } }
  public pieChartPlugins = [];

  constructor(private votingService: VotingService, private router: Router, private crmservice: CrmService, private dataSharingService: DataSharingService) { 
    this.getData() 
  }

  ngOnInit() {
  }

  getData() {
    this.votingService.getAGMRecord().subscribe((res: any) => {
      this.votingList = res.recordset
      for(let i=0; i<res.recordset.length; i++) {
        var mRegMemb: number, mVotedMemb: number, mNotVoted: number;
        this.votingService.getRegistrationDetail(res.recordset[i].AGMCODE).subscribe((resp: any) => {
          console.log(resp.recordset.length)
          mRegMemb = (resp.recordset.length) as number
          this.votingList[i].REGISTEREDMEMBERS = mRegMemb
          this.votingService.checkVotingNumber(res.recordset[i].AGMCODE).subscribe((respo: any) => {
            console.log(respo.recordset[0].VOTERS)
            mVotedMemb = (respo.recordset[0].VOTERS) as number
            mNotVoted = this.votingList[i].REGISTEREDMEMBERS - mVotedMemb
            this.votingList[i].VOTEDMEMBERS = mVotedMemb
            this.votingList[i].NOTVOTEDMEMBERS = mNotVoted
            var arr = [mVotedMemb, mNotVoted];
            //this.pieChartData.push(arr)
            console.log(this.pieChartData)
          })
        })    
      }
    })
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
