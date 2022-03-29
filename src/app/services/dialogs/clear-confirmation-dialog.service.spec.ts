import { ClearConfirmationDialogService } from "./clear-confirmation-dialog.service";
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AutoCompleteService } from '../autocomplete.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ConfirmDialogComponent } from 'src/app/components/default/confirm-dialog/confirm-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';
import { MatSnackBarModule } from '@angular/material';

describe('ClearConfirmationDialogService', () => {
    let service: ClearConfirmationDialogService;
    let autoCompleteService: AutoCompleteService;
    let httpMock: HttpTestingController;
    let component: ConfirmDialogComponent;
    let fixture: ComponentFixture<ConfirmDialogComponent>;
    
    const mockDialogRef = {
        close: jasmine.createSpy('close')
      };
      let data = {
        title: 'Jasmine test',
        message: 'Jasmine test message'
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ConfirmDialogComponent],
            providers: [
                ClearConfirmationDialogService,
                { provide: MatDialogRef, useValue: mockDialogRef },
                { 
                  provide: MAT_DIALOG_DATA, 
                  useValue: data
                }
            ],
            imports: [MatDialogModule, HttpClientTestingModule, BrowserAnimationsModule, MatSnackBarModule]
        })
        .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ConfirmDialogComponent ] } })
        .compileComponents();;
        autoCompleteService = TestBed.get(AutoCompleteService);
        httpMock = TestBed.get(HttpTestingController);
        service =TestBed.get(ClearConfirmationDialogService);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

    afterEach(() => {
        service.dialog.closeAll();
        component.onDismiss();
        fixture.detectChanges();
        service = null;
        autoCompleteService = null;
        httpMock = null;
        component = null;
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#openDialog should be open the dialog and ask for confirmation.', (done) => {
        spyOn(service, "openDialog").and.callThrough();
        service.openDialog();
        expect(service.openDialog).toHaveBeenCalled();
        component.dialogRef.close(true);
        fixture.detectChanges();
        expect(component.dialogRef.close).toHaveBeenCalled();
        done();
    });
});