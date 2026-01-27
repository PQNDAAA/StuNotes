import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskNotificationActionPerformedComponent } from './task-notification-action-performed.component';

describe('TaskNotificationActionPerformedComponent', () => {
  let component: TaskNotificationActionPerformedComponent;
  let fixture: ComponentFixture<TaskNotificationActionPerformedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskNotificationActionPerformedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskNotificationActionPerformedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
