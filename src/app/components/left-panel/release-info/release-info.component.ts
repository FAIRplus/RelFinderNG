import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import * as data from "src/app/config/release-info.json";


@Component({
  selector: 'app-release-info',
  templateUrl: './release-info.component.html',
  styleUrls: ['./release-info.component.css']
})
export class ReleaseInfoComponent implements OnInit {

  releases: any = (data as any).default;

  constructor(public dialogRef: MatDialogRef<ReleaseInfoComponent>) { }

  ngOnInit() {
    this.dialogRef.updateSize('816px', '321px');
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onPolicyClick() {
    if (this.releases && this.releases.links && this.releases.links.privacyPolicy) {
      this.naviagteExternalLink(this.releases.links.privacyPolicy);
    }
  }

  onTermsClick() {
    if (this.releases && this.releases.links && this.releases.links.TermsOfUse) {
      this.naviagteExternalLink(this.releases.links.TermsOfUse);
    }
  }

  naviagteExternalLink(link) {
    window.open(link, "_blank");
  }

}
