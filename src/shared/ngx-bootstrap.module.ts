import { NgModule } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule, MatDividerModule } from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
    imports: [
        AccordionModule.forRoot(),
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        PopoverModule.forRoot(),
        TooltipModule.forRoot(),
        BrowserAnimationsModule,
        MatSnackBarModule,
        MatMenuModule,
        MatIconModule,
        MatDividerModule
    ],
    exports: [
        AccordionModule,
        BsDropdownModule,
        ModalModule,
        TabsModule,
        PopoverModule,
        BrowserAnimationsModule,
        TooltipModule,
        MatSnackBarModule,
        MatMenuModule,
        MatIconModule,
        MatDividerModule
    ],
    declarations: [],
    providers: []
})

export class NgxBootstrapModule {

}