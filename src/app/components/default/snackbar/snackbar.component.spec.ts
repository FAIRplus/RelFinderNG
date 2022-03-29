import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TruncateStringPipe } from 'src/app/pipes/truncate-string.pipe';
import { FirstCaseUpperPipe } from 'src/app/pipes/first-case-upper.pipe';

import { SnackbarComponent } from './snackbar.component';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  let data = {
    title: 'Jasmine test',
    message: 'Jasmine test message'
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SnackbarComponent, TruncateStringPipe, FirstCaseUpperPipe],
      providers: [
        { provide: MatSnackBarRef, useValue: mockDialogRef },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: data
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
