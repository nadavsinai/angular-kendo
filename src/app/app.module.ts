import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EditorModule} from '@progress/kendo-angular-editor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StructuredFieldButtonComponent} from "src/app/structured-field-button.component";
import {StructuredFieldPrintButtonComponent} from "./structured-field-print-button.component";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AppComponent, StructuredFieldButtonComponent, StructuredFieldPrintButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EditorModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
