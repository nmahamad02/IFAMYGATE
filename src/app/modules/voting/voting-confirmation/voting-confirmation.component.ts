import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from 'src/app/services/crm/crm.service';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
import { VotingService } from 'src/app/services/voting/voting.service';

@Component({
  selector: 'app-voting-confirmation',
  templateUrl: './voting-confirmation.component.html',
  styleUrls: ['./voting-confirmation.component.scss']
})
export class VotingConfirmationComponent implements OnInit {

  mAgmCode = this.route.snapshot.params.agmcode
  mCat = this.route.snapshot.params.category
  mYear = this.route.snapshot.params.year
  mMode = ""
  mMembData: any;

  propData: any = []

  agmBool = false;
  electionBool = false;
  
  uC = JSON.parse(localStorage.getItem('userid'));

  constructor(private crmService: CrmService,private route: ActivatedRoute, private VotingService: VotingService,  private router: Router, private datasharingservice: DataSharingService) { 
    console.log(this.mAgmCode)
    if(this.mCat === 'ELECTION') {
    this.electionBool = true;
   } else {
    this.agmBool = true;
   }
   this.getVotingData()
  }
  
  ngOnInit() {
  }

  getVotingData() {
    this.mMembData = this.datasharingservice.getData()
    console.log( this.mMembData)
    this.crmService.getLandlordWiseProperties(this.mMembData.membno).subscribe((res: any) => {
      console.log(res.recordset)
      for(let i=0;i<res.recordset.length;i++){
        this.VotingService.checkmembervotedata(this.mAgmCode,res.recordset[i].parcelno).subscribe((resp: any) => {
          console.log(resp.recordset)
          if(resp.recordset[0].COUNT != '0') {
            let A = {
              house: res.recordset[i].house_flat_no,  
              titledeed: res.recordset[i].parcelno,  
              plotno: res.recordset[i].plotno,
              plotarea: res.recordset[i].plotarea,
              builtuparea: res.recordset[i].BUILTUPAREA,
              status: 'Voted'
            }
            this.propData.push(A)
          } else {
            let B = {
              house: res.recordset[i].house_flat_no,  
              titledeed: res.recordset[i].parcelno,  
              plotno: res.recordset[i].plotno,
              plotarea: res.recordset[i].plotarea,
              builtuparea: res.recordset[i].BUILTUPAREA,
              status: 'Not Voted'
            }
            this.propData.push(B)
          }
        })
      }
    })
  }

  public gotoVotingDetails(agmcode, houseno, category, year) {
    const membData = {
      membno: houseno,
      membname: this.mMembData.membname,
      membtype: this.mMembData.membtype,
    }
    this.datasharingservice.setData(membData)
    console.log(membData)
    var myurl = `/voting/details/${agmcode}/${category}/${year}`;
    this.router.navigateByUrl(myurl).then(e => {});
  }


}
