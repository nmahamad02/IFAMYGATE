import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { VotingOverviewComponent } from './voting-overview/voting-overview.component';
import { VotingResultsComponent } from './voting-results/voting-results.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card'
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from "@angular/material/sort";
import { MatExpansionModule } from '@angular/material/expansion';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatRadioModule } from '@angular/material/radio';
import { VotingDetailsComponent } from './voting-details/voting-details.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { VotingResultsDetailsComponent } from './voting-results-details/voting-results-details.component';
import { VotingAnalysisComponent } from './voting-analysis/voting-analysis.component';

export const votingRoutes = [
  {
    path: 'analysis',
    component: VotingAnalysisComponent
  },
  {
    path: 'registry',
    component: AttendanceComponent
  },
  {
    path: 'overview',
    component: VotingOverviewComponent
  },  
  {
    path: 'details/:category/:year',
    component: VotingDetailsComponent
  },
  {
    path: 'results',
    component: VotingResultsComponent
  },
  {
    path: 'results/details/:category/:year',
    component: VotingResultsDetailsComponent 
  },
];

@NgModule({
  declarations: [VotingOverviewComponent, VotingResultsComponent, VotingDetailsComponent, AttendanceComponent, VotingResultsDetailsComponent, VotingAnalysisComponent],
  imports: [
    CommonModule,
    ChartsModule,
    MatTabsModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSortModule,
    MatExpansionModule,
    PdfViewerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,

    RouterModule.forChild(votingRoutes)
  ],
  providers: [
    ThemeService
  ]
})
export class VotingModule { }
