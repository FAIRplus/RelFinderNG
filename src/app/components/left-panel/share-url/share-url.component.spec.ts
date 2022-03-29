import { ConfigurationsService } from '../../../services/configurations/configurations.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ShareUrlComponent } from './share-url.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';
import { TruncateStringPipe } from 'src/app/pipes/truncate-string.pipe';
import { FirstCaseUpperPipe } from 'src/app/pipes/first-case-upper.pipe';
import { MatTooltipModule } from '@angular/material';

describe('ShareUrlComponent', () => {
  let component: ShareUrlComponent;
  let fixture: ComponentFixture<ShareUrlComponent>;
  let overlayContainerElement: HTMLElement;
  let configService: ConfigurationsService;
  let testConf : TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();

  const dialogMock = {
    updateSize: () => { },
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShareUrlComponent, FirstCaseUpperPipe, TruncateStringPipe,
      ],
      imports: [
        FormsModule,
        MatDialogModule,
        MatTooltipModule,
        HttpClientModule,
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
        {
          provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          },
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    configService = TestBed.get(ConfigurationsService);
    configService.setConfigData();
    configService.setActiveEndpoint(testConfigData.id);
    fixture = TestBed.createComponent(ShareUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#closeDialog should close the dialog.', (done) => {
    spyOn(component.dialogRef, "close").and.callThrough();
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
    done();
  });

  it('#copyToClipboard should copy the object data.', (done) => {
    spyOn(component, "copyToClipboard").and.callThrough();
    component.copyToClipboard();
    expect(component.copyToClipboard).toHaveBeenCalled();
    done();
  });

});
