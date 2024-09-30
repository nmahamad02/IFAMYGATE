import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrmService } from 'src/app/services/crm/crm.service';
import { VotingService } from 'src/app/services/voting/voting.service';
import { ChartConfiguration, ChartData, ChartDataSets } from 'chart.js';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-voting-results-details',
  templateUrl: './voting-results-details.component.html',
  styleUrls: ['./voting-results-details.component.scss']
})
export class VotingResultsDetailsComponent implements OnInit {

  //@ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  mAgmCode = this.route.snapshot.params.agmcode
  mCat = this.route.snapshot.params.category
  mYear = this.route.snapshot.params.year
  resultList: any[] = []
  sumYes = 0; 
  sumNo = 0;
  sumArea: number;
  area: number;

  agmBool = false;
  electionBool = false;

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Yes', 'No'];
  public pieChartData: any = []
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors: Array < any > = [{
    backgroundColor: ['#5f9c5f', '#b52424'],
    borderColor: []
  }];  
  public pieChartPlugins = [];
  
  public barChartLabels: Label[] = [];
  public barChartData: any = []
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = false;
  public barChartColors: Array < any > = [{
    backgroundColor: ['#eb4034','#eb7d34','#ebe534','#83eb34','#34eba1','#34a8eb','#3437eb','#8634eb','brown','black'],
    borderColor: []
  }]; 
  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero:true,
          max: 100
        }
      }],
        yAxes: [{
          ticks: {

          }
        }]
    },
      tooltips:{
        mode: 'point'
      }
  };
  public barChartPlugins = [];

  constructor(private route:ActivatedRoute, private crmService:CrmService, private votingservice: VotingService) { 
    /*this.votingservice.getVotingQuestionWiseResults(this.mCat).subscribe((res: any) => {
      console.log(res.recordset)
      this.resultList = res.recordset;
      for(let i=0; i<res.recordset.length; i++) {
        const data: SingleDataSet = [res.recordset[i].voTedYES,res.recordset[i].votedNO]
        this.pieChartData.push(data)
      }
    })*/

    if(this.mCat === 'ELECTION') {
      this.electionBool = true;
      this.votingservice.getelectionresults(this.mAgmCode).subscribe((res: any) => {
        console.log(res.recordset)
        this.resultList = res.recordset;
        for(let i=0; i<res.recordset.length; i++) {
          this.crmService.getMemberFromCPR(this.resultList[i].BLITEM).subscribe((respo: any) => {
            console.log(respo)
            this.barChartData.push(res.recordset[i].VOTE)
            this.resultList[i].NAME = respo.recordset[0].NAME
            this.barChartLabels.push(respo.recordset[0].NAME)
            var imgVal: string = respo.recordset[0].IMAGENAME;
            if ((respo.recordset[0].IMAGENAME === null) || (respo.recordset[0].IMAGENAME === "")) {
              this.resultList[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/imgNaN.png";
            } else if (respo.recordset[0].IMAGENAME != null) {
              console.log(respo.recordset[0].IMAGENAME);
              if (imgVal.includes("fakepath")) {
                var imgName: string = imgVal.slice(12);
                console.log(imgName);
                this.resultList[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgName;
              } else {
                this.resultList[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgVal;
              }              
            }
            console.log(this.resultList)
          })
        }
      })
      monkeyPatchChartJsTooltip();
      monkeyPatchChartJsLegend();
    } else {
      this.agmBool = true;
      this.votingservice.getVotingCalculatedQuestionWiseResults(this.mCat).subscribe((res: any) => {
        console.log(res.recordset)
        this.resultList = res.recordset;
        for(let i=0; i<res.recordset.length; i++) {
          const data: SingleDataSet = [res.recordset[i].voTedYES,res.recordset[i].votedNO]
          this.pieChartData.push(data)
        }
      })
      monkeyPatchChartJsTooltip();
      monkeyPatchChartJsLegend();
    }

    
  }

  ngOnInit() {
  }
}
