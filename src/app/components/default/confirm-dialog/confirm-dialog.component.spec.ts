import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  let data = {
      title: 'Jasmine test',
      message: 'Jasmine test message'
  }
  const dialogMock = {
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDialogComponent ],
      imports: [
        MatDialogModule
      ],
      providers: [
        { 
          provide: MatDialogRef,
          useValue: dialogMock
        }, 
        { 
          provide: MAT_DIALOG_DATA, 
          useValue: data
        }
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onDismiss should close the dialog.', (done) => {
    spyOn(component.dialogRef, "close").and.callThrough();
    component.onDismiss();
    fixture.detectChanges();
    expect(component.dialogRef.close).toHaveBeenCalled();
    done();
  });

  it('#onConfirm should close the dialog.', (done) => {
    spyOn(component.dialogRef, "close").and.callThrough();
    component.onConfirm();
    fixture.detectChanges();
    expect(component.dialogRef.close).toHaveBeenCalled();
    done();
  });

  xit('Title should be "Jasmine test".', (done) => {
    const title = fixture.debugElement.nativeElement.querySelector('#confirmTitle').innerHTML;
    expect(title.toString().trim()).toEqual('Jasmine test ?');
    done();
  });

});
