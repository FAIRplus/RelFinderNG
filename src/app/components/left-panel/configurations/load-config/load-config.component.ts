import { Utils } from 'src/app/services/util/common.utils';
import { ClearConfirmationDialogService } from 'src/app/services/dialogs/clear-confirmation-dialog.service';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';
import { LoadConfigService, ErrorMessage } from 'src/app/services/configurations/load-config.service';

@Component({
  selector: 'app-load-config',
  templateUrl: './load-config.component.html',
  styleUrls: ['./load-config.component.css']
})
export class LoadConfigComponent implements OnInit {

  readonly boldStart: string = '<span class="boldInfo">';
  readonly boldEnd: string = '</span>';
  readonly newLine: string = "<br>";

  fileContent: string | ArrayBuffer;
  alertMsg: ErrorMessage = { type: '', message: '', messageList: [] };
  confirmDisable = true;
  validateDisable = true;
  @ViewChild('myFileInput', { static: false }) myFileInput;
  fileName = '';
  loadingBar = false;
  dragAreaClass = "col-md-6";
  files: any[] = [];
  progress = 0;
  uploadPercent: any = 0;
  isError: boolean = false;
  validClick: boolean = true;
  firstErrBegin: string = '';
  firstErrEnd: string = '';

  constructor(
    public dialogRef: MatDialogRef<LoadConfigComponent>,
    private configService: ConfigurationsService,
    private loadConfigService: LoadConfigService,
    private dialogService: ClearConfirmationDialogService) { }

  ngOnInit() {
    this.setDialogSize();
  }

  setDialogSize() {
    // To set size of the dialog.
    this.dialogRef.updateSize('816px', '390px');
  }

  public closeMe() {
    this.dialogRef.close();
  }

  //This method will be called on file upload.
  public uploadFile(fileList: FileList): void {
    this.clearErrMsgs();
    this.isError = false;
    this.fileContent = '';
    this.loadingBar = true;
    this.alertMsg = { type: '', message: '', messageList: [] };
    let file = fileList[0];
    if (file) {
      this.alertMsg = this.loadConfigService.validateFileProps(file);
      if (this.alertMsg && this.alertMsg.type === 'error') {
        this.isError = true;
      }
      this.files = [];
      this.progress = 0;
      this.files.push(file);
      this.uploadFilesSimulator(0);

      if (this.alertMsg.message.length === 0) {
        let fileReader: FileReader = new FileReader();
        let self = this;
        fileReader.onloadend = function (x) {
          self.confirmDisable = true; //disable confirm button if upload file again.
          self.fileContent = fileReader.result;
          self.validateDisable = false;
          self.loadingBar = false;
        }
        fileReader.readAsText(file);
        this.fileName = this.shrinkText(file.name);
        this.myFileInput.nativeElement.value = '';// clear value so that we can upload same file.
        return;
      } else {
        this.loadingBar = false;
      }
    }
    this.validClick = true;
    return;
  }

  replaceConfig() {
    let result = this.configService.replaceConfigWithUserData(this.fileContent);
    if (result) {
      this.closeMe();
      this.dialogService.openSnackBar('DB Sources are Added ', 'Successfully ', 'Close', '');
    }
  }

  validateFile() {
    this.alertMsg = this.loadConfigService.validateFile(this.fileContent);
    this.validClick = false;
    if (this.alertMsg && this.alertMsg.type === '' && this.alertMsg.messageList.length === 0) {
      this.confirmDisable = false;
      this.alertMsg = { type: 'success', message: this.boldStart + 'Success!' + this.boldEnd + ' Click Upload to proceed' };
      this.isError = false;
    } else if (this.alertMsg && this.alertMsg.type === 'error') {
      this.isError = true;
      if (this.alertMsg.messageList && this.alertMsg.messageList.length > 0) {
        let arr = this.alertMsg.messageList[0].message.split("!");
        if (arr.length > 1) {
          this.firstErrBegin = arr[0] + '!'; + this.newLine;
          this.firstErrEnd = arr[1].trim();
        } else {
          this.firstErrBegin = arr[0] + '!';
        }
      }
      if (this.alertMsg.messageList.length > 1) {
        this.alertMsg.messageList.shift();
      }
    };
  }

  // file drag and drop functions
  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("drop", ["$event"]) onDrop(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      let files: FileList = event.dataTransfer.files;
      this.saveFiles(files);
    }
  }

  saveFiles(files: FileList) {
    if (files.length > 1) {
      this.alertMsg = { type: '', message: 'Only one file at time allow' };
    } else {
      this.alertMsg = { type: '', message: '' };
      this.uploadFile(files);
    }
  }

  formatBytes(bytes) {
    // formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    // const dm = decimals <= 0 ? 0 : decimals || 2;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.progress += 10;
            this.uploadPercent = this.formatBytes((this.files[0].size) * (this.progress / 100));
          }
        }, 100);
      }
    }, 500);
  }

  deleteFile(file) {
    this.files = [];
    this.uploadPercent = 0;
    this.progress = 0;
    this.validClick = true;
    this.clearErrMsgs();
  }

  shrinkText(txt: string) {
    if (txt.length > 20) {
      txt = Utils.truncateString(txt, 20, 'middle');
    }
    return txt;
  }

  resetValidClick() {
    this.validClick = true;
    this.deleteFile(0);
  }

  clearErrMsgs() {
    this.firstErrEnd = '';
    this.firstErrBegin = '';
    this.alertMsg = undefined;
    this.loadConfigService.errorMsg = new ErrorMessage('', '', []);
  }
}
