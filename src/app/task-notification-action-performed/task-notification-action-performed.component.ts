import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-task-notification-action-performed',
  templateUrl: './task-notification-action-performed.component.html',
  styleUrls: ['./task-notification-action-performed.component.scss'],
})
export class TaskNotificationActionPerformedComponent  implements OnInit {

  constructor(private mc: ModalController) { }

  ngOnInit() {}

}
