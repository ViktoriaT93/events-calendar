import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event } from '../../models/event.model';
import { EventsService } from '../../services/events.service';

@Component({
    selector: 'event-form',
    templateUrl: 'app/components/event-form/event-form.component.html'
})

export class EventFormComponent {
    @Input() model = new Event(null, '', '', '', '');
    @Input() eventsList = [];

    @Output() afterEventChanged = new EventEmitter();


    constructor(public eventsService:EventsService) {
    }

    private addEvent() {
        let event = new Event(new Date().getTime(),
            this.model.title,
            this.model.description,
            this.model.date,
            this.model.time);
        this.eventsList.push(event);
        return event;
    }

    private editEvent() {
        let event = new Event(this.model.id,
            this.model.title,
            this.model.description,
            this.model.date,
            this.model.time);
        let index = this.eventsList.indexOf(this.eventsList.filter(event => event.id == this.model.id)[0]);
        this.eventsList[index] = event;
        return event;
    }

    onSubmit() {
        let modifiedEvent;
        if(!this.model.id) {
            modifiedEvent = this.addEvent();
        }
        else {
            modifiedEvent = this.editEvent();
        }
        this.eventsService.save(this.eventsList);
        this.afterEventChanged.emit({modifiedEvent: modifiedEvent, eventsList: this.eventsList});
    }

}
