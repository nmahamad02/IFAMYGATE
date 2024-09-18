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
  memberList: any[] = []

  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  mCYear = new Date().getFullYear();

  uC = JSON.parse(localStorage.getItem('userid'));

  public pieChartLabels: Label[] = ['Members who voted', 'Members who did not vote'];
  public pieChartData: any  = []
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
        this.votingList[i].chartDataReady = false
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
            const data: SingleDataSet = [this.votingList[i].VOTEDMEMBERS,this.votingList[i].NOTVOTEDMEMBERS]
            this.pieChartData.push(data)
            this.votingList[i].chartDataReady = true
          })
        })    
      }
    })
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.votingService.getNominationList().subscribe((res: any)=> {
      this.memberList = res.recordset;
      console.log(res.recordset)
      for(let i=0; i<this.memberList.length; i++) {
        var imgVal: string = this.memberList[i].imagename;
        console.log(imgVal)
        if ((this.memberList[i].imagename === null) || (this.memberList[i].imagename === "")) {
          this.memberList[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/imgNaN.png";
        } else if (this.memberList[i].imagename != null) {
          console.log(this.memberList[i].imagename);
          if (imgVal.includes("fakepath")) {
            var imgName: string = imgVal.slice(12);
            console.log(imgName);
            this.memberList[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgName;
          } else {
            this.memberList[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgVal;
          }
        }
        this.crmservice.getLandlordWiseProperties(this.memberList[i].memberno).subscribe((resp: any) => {
          var prop = []
          for(let j=0;j<resp.recordset.length;j++) {
            prop.push(resp.recordset[j].house_flat_no)
          }
          this.memberList[i].properties = prop
        })
      }
    })
    console.log(this.memberList)
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
