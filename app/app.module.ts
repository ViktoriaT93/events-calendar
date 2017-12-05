import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MomentPipe } from './pipes/moment.pipe';
import { FormsModule } from '@angular/forms';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventsService } from './services/events.service';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ModalModule } from "ng2-modal";

@NgModule({
  imports: [ BrowserModule, FormsModule, ModalModule ],
  declarations: [ AppComponent, EventFormComponent, MomentPipe, ClickOutsideDirective ],
  providers: [EventsService],
  bootstrap: [ AppComponent ]
})
export class AppModule {}