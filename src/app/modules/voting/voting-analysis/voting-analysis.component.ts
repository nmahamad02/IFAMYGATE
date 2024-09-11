import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { CrmService } from 'src/app/services/crm/crm.service';
import { VotingService } from 'src/app/services/voting/voting.service';
import * as XLSX from "xlsx";
import { ChartConfiguration } from 'chart.js';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-voting-analysis',
  templateUrl: './voting-analysis.component.html',
  styleUrls: ['./voting-analysis.component.scss']
})
export class VotingAnalysisComponent implements OnInit {
  @ViewChild('membLookupDialog', { static: false }) membLookupDialog!: TemplateRef<any>;
  @ViewChild("table1", {static: false}) table: ElementRef;
  @ViewChild("baseChart", {static: false}) chart: BaseChartDirective;

  analysisForm: FormGroup;
  membArr: any[] = [];
  attList: any[] = [];
  voteArr: any[] = [];
  proxArr: any[] = [];

  membDisplayedColumns: string[] = ["name", "cpr", "email"];
  membDataSource = new MatTableDataSource(this.membArr);

  mVoterElectorate: number = 0;
  mVotedMembers: number = 0;
  mNotVotedMembers: number = 0;

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Members who voted', 'Members who did not vote'];
  public pieChartData: SingleDataSet  = [this.mVotedMembers, this.mNotVotedMembers]
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  selectedRowIndex: any = 0;

  constructor(private crmservice: CrmService,private dialog: MatDialog,private votingservice: VotingService) {
    this.analysisForm = new FormGroup({ 
      cprno: new FormControl('', []),
      name: new FormControl('', []),
      category: new FormControl('', []),
    });
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  lookUpMembers() {
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.membLookupDialog);
    this.crmservice.getAllMembers().subscribe((res: any) => {
      this.membArr = res.recordset;
      this.membDataSource = new MatTableDataSource(this.membArr);
    }, (err: any) => {
      console.log(err);
    })
  }

  onViewCellClicked(event: any) {
    this.analysisForm.patchValue({
      cprno: event.MemberNo,
      name: event.NAME,
      category: event.Email,
    })
    let dialogRef = this.dialog.closeAll();
  }

  searchMember() {
    let data = this.analysisForm.value;
    console.log(data);
    this.votingservice.getVotingMembers(data.category,data.cprno).subscribe((res: any) => {
      this.voteArr = res.recordset
      console.log(this.voteArr)
    })
  }

  ngOnInit() {
    this.getData()
    this.getProxyData()
  }

  getData() {
    this.votingservice.getVotingAttendance().subscribe((res: any) => {
      console.log(res)
      for(let i=0; i<res.recordset.length;i++){
        let mByLaw = '', mGeneral = '';
        this.crmservice.getMemberFromCPR(res.recordset[i].MEMBERNO).subscribe((resp: any) => {
          this.votingservice.countVotingStatus(res.recordset[i].MEMBERNO,'GENERAL','2023').subscribe((respo: any) => {
            console.log(respo)
            if(respo.recordset[0].COUNT === 0) {
              mGeneral = 'N'
            } else {
              mGeneral = 'Y'
            }
            this.votingservice.countVotingStatus(res.recordset[i].MEMBERNO,'BYLAW','2023').subscribe((respon: any) => {
              console.log(respon)
              if(respon.recordset[0].COUNT === 0) {
                mByLaw = 'N'
              } else {
                mByLaw = 'Y'
              }
              const memb = {
                membNo: res.recordset[i].MEMBERNO,
                mLoginName: res.recordset[i].MEMBERNAME,
                mName: resp.recordset[0].NAME,
                mType: resp.recordset[0].MEMBTYPE,
                mEmail: resp.recordset[0].Email,
                mBylawVote: mByLaw,
                mGeneralVote: mGeneral
              } 
              this.attList.push(memb)
            })
          })
        }, (err: any) => {
          this.votingservice.countVotingStatus(res.recordset[i].MEMBERNO,'GENERAL','2023').subscribe((respo: any) => {
            console.log(respo)
            if(respo.recordset[0].COUNT === 0) {
              mGeneral = 'N'
            } else {
              mGeneral = 'Y'
            }
            this.votingservice.countVotingStatus(res.recordset[i].MEMBERNO,'BYLAW','2023').subscribe((respon: any) => {
              console.log(respon)
              if(respon.recordset[0].COUNT === 0) {
                mByLaw = 'N'
              } else {
                mByLaw = 'Y'
              }
              const memb = {
                membNo: res.recordset[i].MEMBERNO,
                mLoginName: res.recordset[i].MEMBERNAME,
                mName: 'Member not identified',
                mType: '',
                mEmail: 'Requires verification',
                mBylawVote: mByLaw,
                mGeneralVote: mGeneral
              } 
              this.attList.push(memb)
            })
          })
        })
      }
      this.mVoterElectorate = res.rowsAffected[0];
      /*this.votingservice.checkVotingNumber().subscribe((res: any) => {
        this.mVotedMembers = res.recordset[0].VOTERS
        this.mNotVotedMembers = this.mVoterElectorate - this.mVotedMembers
        this.pieChartData = [this.mVotedMembers, this.mNotVotedMembers]
      })*/
    }, (err: any) => {
      console.log(err)
    })
  }

  getProxyData(){
    this.votingservice.checkVotingProxy().subscribe((res: any) => {
      console.log(res)
      for(let i=0; i<res.recordset.length;i++){
        let mByLaw = '', mGeneral = '';
        this.crmservice.getMemberFromCPR(res.recordset[i].MEMBERNO).subscribe((resp: any) => {
          this.votingservice.getVotingMembers('GENERAL',res.recordset[i].MEMBERNO).subscribe((respo: any) => {
            console.log(respo)
            if(respo.recordset.length === 0) {
              mGeneral = 'N'
            } else {
              mGeneral = 'Y'
            }
            this.votingservice.getVotingMembers('BYLAW',res.recordset[i].MEMBERNO).subscribe((respon: any) => {
              console.log(respon)
              if(respon.recordset.length === 0) {
                mByLaw = 'N'
              } else {
                mByLaw = 'Y'
              }
              const memb = {
                membNo: res.recordset[i].MEMBERNO,
                mLoginName: res.recordset[i].MEMBERNAME,
                mName: resp.recordset[0].NAME,
                mType: resp.recordset[0].MEMBTYPE,
                mEmail: resp.recordset[0].Email,
                mBylawVote: mByLaw,
                mGeneralVote: mGeneral
              } 
              this.proxArr.push(memb)
            })
          })
        }, (err: any) => {
          this.votingservice.getVotingMembers('GENERAL',res.recordset[i].MEMBERNO).subscribe((respo: any) => {
            console.log(respo)
            if(respo.recordset.length === 0) {
              mGeneral = 'N'
            } else {
              mGeneral = 'Y'
            }
            this.votingservice.getVotingMembers('BYLAW',res.recordset[i].MEMBERNO).subscribe((respon: any) => {
              console.log(respon)
              if(respon.recordset.length === 0) {
                mByLaw = 'N'
              } else {
                mByLaw = 'Y'
              }
              const memb = {
                membNo: res.recordset[i].MEMBERNO,
                mLoginName: res.recordset[i].MEMBERNAME,
                mName: 'Member not identified',
                mType: '',
                mEmail: 'Requires verification',
                mBylawVote: mByLaw,
                mGeneralVote: mGeneral
              } 
              this.proxArr.push(memb)
            })
          })
        })
      }
    }, (err: any) => {
      console.log(err)
    })
  }


  fireEvent() {
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
    XLSX.writeFile(wb, "Voter-Attendance-List.xlsx");
  }

  get f(){
    return this.analysisForm.controls;
  }

  highlight(index: number){
    console.log(index);
    if(index >= 0 && index <= this.membArr.length - 1) {
      this.selectedRowIndex = index;
    } 
  }

  arrowUpEvent(index: number){
   this.highlight(--index);
  }

  arrowDownEvent(index: number){
    this.highlight(++index);
  }

}
