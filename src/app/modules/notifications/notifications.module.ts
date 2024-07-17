import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { RouterModule } from '@angular/router';
import { EmailsComponent } from './emails/emails.component';
import { MatExpansionModule } from '@angular/material/expansion';


export const notificationRoutes = [
  {
    path: 'announcements',
    component: AnnouncementsComponent
  },
  {
    path: 'emails',
    component: EmailsComponent
  },
  /*{
    path: 'downloads',
    component: DownloadsComponent
  },*/
];

@NgModule({
  declarations: [AnnouncementsComponent, DownloadsComponent, EmailsComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    RouterModule.forChild(notificationRoutes)
  ]
})
export class NotificationsModule { }
