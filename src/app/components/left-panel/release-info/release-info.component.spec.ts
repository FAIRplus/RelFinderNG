import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxBootstrapModule } from './../../../../shared/ngx-bootstrap.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ReleaseInfoComponent } from './release-info.component';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('ReleaseInfoComponent', () => {
  let component: ReleaseInfoComponent;
  let fixture: ComponentFixture<ReleaseInfoComponent>;

  const dialogMock = {
    updateSize: () => { },
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReleaseInfoComponent],
      imports: [
        NgxBootstrapModule,
        MatDialogModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogMock
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#closeDialog should close the dialog.', () => {
    spyOn(component.dialogRef, "close").and.callThrough();
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('#onPolicyClick should display the policies.', () => {
    spyOn(component, "onPolicyClick").and.callThrough();
    component.releases.links.privacyPolicy = 'Dummy policies for testing.';
    component.onPolicyClick();
    expect(component.onPolicyClick).toHaveBeenCalled();
  });

  it('#onTermsClick should display the terms of use.', () => {
    spyOn(component, "onTermsClick").and.callThrough();
    component.releases.links.TermsOfUse = 'Dummy Terms Of Use for testing.';
    component.onTermsClick();
    expect(component.onTermsClick).toHaveBeenCalled();
  });
});
