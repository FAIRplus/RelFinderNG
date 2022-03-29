import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ProxyDialogComponent } from './proxy-dialog.component';
import { MatFormFieldModule, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatSnackBarModule } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SnackbarComponent } from 'src/app/components/default/snackbar/snackbar.component';
import { TruncateStringPipe } from 'src/app/pipes/truncate-string.pipe';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { ConfigModel } from 'src/app/models/config.model';

describe('ProxyDialogComponent', () => {
  let component: ProxyDialogComponent;
  let fixture: ComponentFixture<ProxyDialogComponent>;
  let configService: ConfigurationsService;
  let testConf: TestConfUtil = new TestConfUtil();
  let testConfigData: ConfigModel = testConf.getProdConfigData();

  const dialogMock = {
    updateSize: () => { },
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProxyDialogComponent, TruncateStringPipe, SnackbarComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDialogModule,
        HttpClientModule,
        MatSnackBarModule,
        NgSlimScrollModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogMock
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        HttpClientModule,
        ProxyDialogComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [SnackbarComponent, ProxyDialogComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxyDialogComponent);
    component = fixture.componentInstance;
    configService = TestBed.get(ConfigurationsService);
    configService.setUriConfigData(testConfigData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#closeMe should close the dialog.', () => {
    spyOn(component.dialogRef, "close").and.callThrough();
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
