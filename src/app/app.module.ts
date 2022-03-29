import { NgxBootstrapModule } from './../shared/ngx-bootstrap.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatButtonModule, MatCardModule, MatSelectModule } from '@angular/material/';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { RightPanelComponent } from './components/right-panel/right-panel.component';
import { SearchComponent } from './components/left-panel/search/search.component';
import { FilterComponent } from './components/left-panel/filter/filter.component';
import { InfoComponent } from './components/left-panel/info/info.component';
import { VisualizationComponent } from './components/right-panel/visualization/visualization.component';
import { HeaderComponent } from './components/default/header/header.component';
import { TopPanelComponent } from './components/top-panel/top-panel.component';
import { ConfigurationsComponent } from './components/left-panel/configurations/configurations.component';
import { ConfigFormComponent } from './components/left-panel/configurations/config-form/config-form.component';
import { ConfirmDialogComponent } from './components/default/confirm-dialog/confirm-dialog.component';
import { FormInputDialogComponent } from './components/left-panel/configurations/form-input-dialog/form-input-dialog.component';
import { LoadConfigComponent } from './components/left-panel/configurations/load-config/load-config.component';
import { PrettyjsonPipe } from './pipes/prettyjson.pipe';
import { QueryToolComponent } from './components/left-panel/configurations/query-tool/query-tool.component';
import { ShareUrlComponent } from './components/left-panel/share-url/share-url.component';
import { NgSlimScrollModule, SLIMSCROLL_DEFAULTS } from 'ngx-slimscroll';
import { FilterHeading } from './pipes/filter-heading.pipe';
import { FilterIconSelection } from './pipes/filter-icon-selection.pipe';
import { ReleaseInfoComponent } from './components/left-panel/release-info/release-info.component';
import { TruncateStringPipe } from './pipes/truncate-string.pipe';
import { FirstCaseUpperPipe } from './pipes/first-case-upper.pipe';
import { SnackbarComponent } from './components/default/snackbar/snackbar.component';
import { ProxyDialogComponent } from './components/left-panel/configurations/proxy-dialog/proxy-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LeftPanelComponent,
    RightPanelComponent,
    SearchComponent,
    FilterComponent,
    InfoComponent,
    VisualizationComponent,
    HeaderComponent,
    TopPanelComponent,
    ConfigurationsComponent,
    ConfigFormComponent,
    ConfirmDialogComponent,
    FormInputDialogComponent,
    LoadConfigComponent,
    PrettyjsonPipe,
    QueryToolComponent,
    ShareUrlComponent,
    FilterHeading,
    FilterIconSelection,
    ReleaseInfoComponent,
    TruncateStringPipe,
    FirstCaseUpperPipe,
    SnackbarComponent,
    ProxyDialogComponent,
  ],
  imports: [
    AccordionModule,
    CollapseModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    AppRoutingModule,
    MatTooltipModule,
    MatChipsModule,
    NgxBootstrapModule,
    NgSlimScrollModule,
    MatSelectModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: SLIMSCROLL_DEFAULTS,
      useValue: {
        alwaysVisible: true,
        gridOpacity: '0.2', 
        barOpacity: '0.5',
        gridBackground: '#c2c2c2',
        gridWidth: '0',
        gridMargin: '2px 2px',
        barBackground: '#838383',
        barWidth: '6',
        barMargin: '2px 2px'
      }
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfigFormComponent, ConfirmDialogComponent, FormInputDialogComponent, LoadConfigComponent, QueryToolComponent, ShareUrlComponent, ReleaseInfoComponent, SnackbarComponent, ProxyDialogComponent]
})
export class AppModule { }
