import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingConfirmationComponent } from './voting-confirmation.component';

describe('VotingConfirmationComponent', () => {
  let component: VotingConfirmationComponent;
  let fixture: ComponentFixture<VotingConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
