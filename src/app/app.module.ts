import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EditorModule} from '@progress/kendo-angular-editor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StructuredFieldButtonComponent} from "src/app/structured-field-button.component";


@NgModule({
  declarations: [
    AppComponent, StructuredFieldButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EditorModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
