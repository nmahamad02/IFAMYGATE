import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrmService } from 'src/app/services/crm/crm.service';
import { VotingService } from 'src/app/services/voting/voting.service';

import { ChartConfiguration } from 'chart.js';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-voting-results-details',
  templateUrl: './voting-results-details.component.html',
  styleUrls: ['./voting-results-details.component.scss']
})
export class VotingResultsDetailsComponent implements OnInit {
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
      } else {
        this.agmBool = true;
      }

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

  ngOnInit() {
  }
}
