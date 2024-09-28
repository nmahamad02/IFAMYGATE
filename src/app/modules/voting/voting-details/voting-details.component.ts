import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from 'src/app/services/crm/crm.service';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
import { VotingService } from 'src/app/services/voting/voting.service';

@Component({
  selector: 'app-voting-details',
  templateUrl: './voting-details.component.html',
  styleUrls: ['./voting-details.component.scss']
})
export class VotingDetailsComponent implements OnInit {
  mAgmCode = this.route.snapshot.params.agmcode
  mCat = this.route.snapshot.params.category
  mYear = this.route.snapshot.params.year
  mMode = ""
  mMembData: any;
  voteQuestions: any = [];

  VotingForm: FormGroup;

  electionBool =  false;
  agmBool = false;

  uC = JSON.parse(localStorage.getItem('userid'));

  constructor(private route: ActivatedRoute, private crmservice: CrmService, private VotingService: VotingService,  private router: Router, private datasharingservice: DataSharingService) { 
   console.log(this.mAgmCode)
    this.VotingForm = new FormGroup({ 
      votes: new FormArray([]),
    });
    this.getVotingData()
    if(this.mCat === 'ELECTION') {
      this.electionBool=true;
    } else {
      this.agmBool=true;
    }
  }

  ngOnInit() {
    console.log(this.mCat)
    console.log(this.mYear)
  }

  getVotingData() {
    this.mMembData = this.datasharingservice.getData()
    console.log( this.mMembData)
    if(this.mCat === 'ELECTION') {
      this.VotingService.checkVotingStatus(this.mMembData.membno,this.mCat,String(this.mYear)).subscribe((res: any) => {
        console.log(res)
        if(res.recordset.length === 0) {
          console.log("Voter not voted yet")
          this.mMode = "I"
          this.VotingService.getVotingQuestions(this.mCat,this.mYear).subscribe((resp: any) => {
            this.voteQuestions = resp.recordset
            for(let i=0; i<this.voteQuestions.length;i++) {
              this.crmservice.getMemberFromCPR(this.voteQuestions[i].BLITEM).subscribe((respo: any) => {
                console.log(respo)
                var imgVal: string = respo.recordset[0].IMAGENAME;
                if ((respo.recordset[0].IMAGENAME === null) || (respo.recordset[0].IMAGENAME === "")) {
                  this.voteQuestions[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/imgNaN.png";
                } else if (respo.recordset[0].IMAGENAME != null) {
                  console.log(respo.recordset[0].IMAGENAME);
                  if (imgVal.includes("fakepath")) {
                    var imgName: string = imgVal.slice(12);
                    console.log(imgName);
                    this.voteQuestions[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgName;
                  } else {
                    this.voteQuestions[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgVal;
                  }              
                }
                console.log(this.voteQuestions)
              })
              const vote = new FormGroup({
                vSlNo: new FormControl(this.voteQuestions[i].BLNO, [Validators.required]),
                vEngDesc: new FormControl(this.voteQuestions[i].BLEDESCRIPTION, [Validators.required]),
                vAraDesc: new FormControl(this.voteQuestions[i].BLADESCRIPTION, [Validators.required]),
                vDecision: new FormControl('', [Validators.required]),
              });
              this.votes.push(vote);
            }
          })
        } else {
          console.log("Voter has already voted")
          this.mMode = "U"
          this.voteQuestions = res.recordset
          for(let i=0; i<this.voteQuestions.length;i++) {
            this.crmservice.getMemberFromCPR(this.voteQuestions[i].BLITEM).subscribe((respo: any) => {
              console.log(respo)
              var imgVal: string = respo.recordset[0].IMAGENAME;
              if ((respo.recordset[0].IMAGENAME === null) || (respo.recordset[0].IMAGENAME === "")) {
                this.voteQuestions[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/imgNaN.png";
              } else if (respo.recordset[0].IMAGENAME != null) {
                console.log(respo.recordset[0].IMAGENAME);
                if (imgVal.includes("fakepath")) {
                  var imgName: string = imgVal.slice(12);
                  console.log(imgName);
                  this.voteQuestions[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgName;
                } else {
                  this.voteQuestions[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgVal;
                }              
              }
            })
            console.log(this.voteQuestions)
            const vote = new FormGroup({
              vSlNo: new FormControl(this.voteQuestions[i].BLNO, [Validators.required]),
              vEngDesc: new FormControl(this.voteQuestions[i].BLEDESCRIPTION, [Validators.required]),
              vAraDesc: new FormControl(this.voteQuestions[i].BLADESCRIPTION, [Validators.required]),
              vDecision: new FormControl(this.voteQuestions[i].VOTED, [Validators.required]),
            });
            this.votes.push(vote);
          }
        }
      }, (err: any) => {
        console.log(err)
        console.log("Voter not voted yet")
        this.mMode = "I"
        this.VotingService.getVotingQuestions(this.mCat,this.mYear).subscribe((resp: any) => {
          console.log(resp.recordset)
          this.voteQuestions = resp.recordset
          for(let i=0; i<this.voteQuestions.length;i++) {
            this.crmservice.getMemberFromCPR(this.voteQuestions[i].BLITEM).subscribe((respo: any) => {
              console.log(respo)
              var imgVal: string = respo.recordset[0].IMAGENAME;
              if ((respo.recordset[0].IMAGENAME === null) || (respo.recordset[0].IMAGENAME === "")) {
                this.voteQuestions[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/imgNaN.png";
              } else if (respo.recordset[0].IMAGENAME != null) {
                console.log(respo.recordset[0].IMAGENAME);
                if (imgVal.includes("fakepath")) {
                  var imgName: string = imgVal.slice(12);
                  console.log(imgName);
                  this.voteQuestions[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgName;
                } else {
                  this.voteQuestions[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgVal;
                }              
              }
            })
            console.log(this.voteQuestions)

            const vote = new FormGroup({
              vSlNo: new FormControl(this.voteQuestions[i].BLNO, [Validators.required]),
              vEngDesc: new FormControl(this.voteQuestions[i].BLEDESCRIPTION, [Validators.required]),
              vAraDesc: new FormControl(this.voteQuestions[i].BLADESCRIPTION, [Validators.required]),
              vDecision: new FormControl('', [Validators.required]),
            });
            this.votes.push(vote);
          }
        })
      })    
    } else {
      this.VotingService.checkVotingStatus(this.mMembData.membno,this.mCat,String(this.mYear)).subscribe((res: any) => {
        console.log(res)
        if(res.recordset.length === 0) {
          console.log("Voter not voted yet")
          this.mMode = "I"
          this.VotingService.getVotingQuestions(this.mCat,this.mYear).subscribe((resp: any) => {
            console.log(resp.recordset)
            this.voteQuestions = resp.recordset
            for(let i=0; i<this.voteQuestions.length;i++) {
              const vote = new FormGroup({
                vSlNo: new FormControl(this.voteQuestions[i].BLNO, [Validators.required]),
                vEngDesc: new FormControl(this.voteQuestions[i].BLEDESCRIPTION, [Validators.required]),
                vAraDesc: new FormControl(this.voteQuestions[i].BLADESCRIPTION, [Validators.required]),
                vDecision: new FormControl('', [Validators.required]),
              });
              this.votes.push(vote);
            }
          })
        } else {
          console.log("Voter has already voted")
          this.mMode = "U"
          this.voteQuestions = res.recordset
          for(let i=0; i<this.voteQuestions.length;i++) {
            const vote = new FormGroup({
              vSlNo: new FormControl(this.voteQuestions[i].BLNO, [Validators.required]),
              vEngDesc: new FormControl(this.voteQuestions[i].BLEDESCRIPTION, [Validators.required]),
              vAraDesc: new FormControl(this.voteQuestions[i].BLADESCRIPTION, [Validators.required]),
              vDecision: new FormControl(this.voteQuestions[i].VOTED, [Validators.required]),
            });
            this.votes.push(vote);
          }
        }
      }, (err: any) => {
        console.log(err)
        console.log("Voter not voted yet")
        this.mMode = "I"
        this.VotingService.getVotingQuestions(this.mCat,this.mYear).subscribe((resp: any) => {
          console.log(resp.recordset)
          this.voteQuestions = resp.recordset
          for(let i=0; i<this.voteQuestions.length;i++) {
            const vote = new FormGroup({
              vSlNo: new FormControl(this.voteQuestions[i].BLNO, [Validators.required]),
              vEngDesc: new FormControl(this.voteQuestions[i].BLEDESCRIPTION, [Validators.required]),
              vAraDesc: new FormControl(this.voteQuestions[i].BLADESCRIPTION, [Validators.required]),
              vDecision: new FormControl('', [Validators.required]),
            });
            this.votes.push(vote);
          }
        })
      })
    }
  }

  SubmitForm(){
    const data = this.VotingForm.value
    console.log(data)
    if(this.mMode === "I") {
      for(let i=0; i<data.votes.length; i++) {
       this.VotingService.submitVote(this.mYear,this.mMembData.membno,this.mCat,data.votes[i].vSlNo,this.voteQuestions[i].BLITEM,data.votes[i].vEngDesc,data.votes[i].vAraDesc,data.votes[i].vDecision,this.uC,this.mMembData.membtype,this.mAgmCode).subscribe((res: any) => {
          console.log(res)
          this.gotoVotingOverview();
        }, (err: any) => {
          console.log(err)
        })
      }
    } else if (this.mMode === "U") {
      for(let i=0; i<data.votes.length; i++) {
        this.VotingService.updateVote(this.mYear,this.mMembData.membno,this.mCat,data.votes[i].vSlNo,data.votes[i].vDecision,this.mAgmCode).subscribe((res: any) => {
          console.log(res)
          this.gotoVotingOverview();
        }, (err: any) => {
          console.log(err)
        })
      }
    }
    alert(`Thank you for casting your vote!`)
  }

  get f(){
    return this.VotingForm.controls;
  }

  get votes(): FormArray {
    return this.VotingForm.get('votes') as FormArray
  }

  public gotoVotingOverview() {
    var myurl = `/voting/overview`;
    this.router.navigateByUrl(myurl).then(e => {
    });
  }

}
