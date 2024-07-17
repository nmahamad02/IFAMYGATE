import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card'
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from "@angular/material/sort";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';

export const homeRoutes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'account',
    component: AccountComponent
  },
];

@NgModule({
  declarations: [DashboardComponent, AccountComponent],
  imports: [
    CommonModule,
    ChartsModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatTableModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatDividerModule,
    MatPaginatorModule,
    PdfViewerModule,
    MatDatepickerModule,
    MatSortModule,
    MatExpansionModule,
    MatButtonModule,
    MatTabsModule,
    RouterModule.forChild(homeRoutes)
  ],
  providers: [
    ThemeService
  ]
})
export class HomeModule { }
