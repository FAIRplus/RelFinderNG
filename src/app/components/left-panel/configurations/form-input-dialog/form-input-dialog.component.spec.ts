import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputDialogComponent } from './form-input-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('FormInputDialogComponent', () => {
  let component: FormInputDialogComponent;
  let fixture: ComponentFixture<FormInputDialogComponent>;
  
  let data = {
    title: 'Jasmine test'
  }

  const dialogMock = {
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInputDialogComponent ],
      imports: [        
        ReactiveFormsModule,
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
    fixture = TestBed.createComponent(FormInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onDismiss should close the dialog.', (done) => {
    spyOn(component.dialogRef, "close").and.callThrough();
    component.onDismiss();
    expect(component.dialogRef.close).toHaveBeenCalled();
    done();
  });

  it('#onSubmit, form should be invalid.', (done) => {
    component.f.uri.setValue('');
    component.onSubmit();
    expect(component.addForm.invalid).toEqual(true);
    done();
  });

  it('#onSubmit should close the dialog for valid form.', (done) => {
    spyOn(component.dialogRef, "close").and.callThrough();
    component.f.uri.setValue('test');
    component.onSubmit();
    expect(component.addForm.valid).toEqual(true);
    expect(component.dialogRef.close).toHaveBeenCalled();
    done();
  });

  it('Title should be "Jasmine test".', (done) => {
    const title = fixture.debugElement.nativeElement.querySelector('#title').innerHTML;
    expect(title.toString().trim()).toEqual('Jasmine test');
    done();
  });

});
