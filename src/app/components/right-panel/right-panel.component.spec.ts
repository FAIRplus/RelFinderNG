import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightPanelComponent } from './right-panel.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('RightPanelComponent', () => {
  let component: RightPanelComponent;
  let fixture: ComponentFixture<RightPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightPanelComponent ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
