import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrmService } from 'src/app/services/crm/crm.service';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
import { VotingService } from 'src/app/services/voting/voting.service';

@Component({
  selector: 'app-voting-results',
  templateUrl: './voting-results.component.html',
  styleUrls: ['./voting-results.component.scss']
})
export class VotingResultsComponent implements OnInit {
  votingType: any[] = []

  constructor(private votingService: VotingService, private router: Router, private crmservice: CrmService, private dataSharingService: DataSharingService) { 
    this.getData() 
  }

  ngOnInit() {
  }

  getData() {
    this.votingService.getAllVoteTypes().subscribe((res: any) => {
      this.votingType = res.recordset
      console.log(res)
    })
  }

  public gotoVotingDetails(url, code,category, year) {
    var myurl = `${url}/${code}/${category}/${year}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
  }

}
