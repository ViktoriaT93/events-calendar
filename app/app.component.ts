import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Day } from "./models/day.model";
import { Event } from './models/event.model';
import { EventsService } from './services/events.service';
import { EventFormComponent } from './components/event-form/event-form.component';

import * as moment from 'moment';

@Component({
    selector: 'calendar-app',
    templateUrl: './app/app.component.html'
})

export class AppComponent implements OnInit {

    constructor(public eventsService:EventsService) {
    }

    @ViewChild('eventFormModal') eventFormModal:any;
    @ViewChild('eventsListModal') eventsListModal:any;

    static DISPLAY_DAYS_COUNT = 42;
    static WEEK_DAYS_COUNT = 7;
    static MIN_EVENT_SEARCH_STR_LENGTH = 3;

    weekDaysNames: Array<String> = [];
    selectedMonth: Object;
    displayDays: Array<any> = [];
    selectedRowIndex: number;
    selectedDayIndex: number;
    showEventsDropdown: boolean;
    foundEvents: Array<any> = [];

    eventFormModel = {};
    eventsList = this.eventsService.getEvents();

    ngOnInit() {
        for (let i = 1; i <= AppComponent.WEEK_DAYS_COUNT; i++) {
            this.weekDaysNames.push(moment.weekdaysShort(i));
        }
        this.displayCurrentMonth();
    }

    displayCurrentMonth() {
        this.selectedMonth = moment();
        this.displayMonth();
    }

    displayPrevMonth() {
        this.selectedMonth = moment(this.selectedMonth).subtract(1, 'month');
        this.displayMonth();
    }

    displayNextMonth() {
        this.selectedMonth = moment(this.selectedMonth).add(1, 'month');
        this.displayMonth();
    }

    displayMonth(selectedMonth = false) {
        if (selectedMonth) {
            this.selectedMonth = moment(selectedMonth);
        }
        let selectedMonthNumber = moment(this.selectedMonth).format('M'),
            firstDayOfMonth = moment(this.selectedMonth).startOf('month'),
            offset = this.weekDaysNames.indexOf(moment(firstDayOfMonth).format('ddd')),
            startDate = moment(firstDayOfMonth).subtract(offset, 'days'),
            endDate = moment(startDate).add(AppComponent.DISPLAY_DAYS_COUNT, 'days'),
            counter = 0;

        this.displayDays = [];

        for (let date = startDate; date.diff(endDate) < 0; date.add(1, 'days')) {
            if (counter % AppComponent.WEEK_DAYS_COUNT === 0) {
                if(counter > 0 && moment(date).format('M') !== moment(this.selectedMonth).format('M')) {
                    return;
                }
                this.displayDays.push([]);
            }
            this.displayDays[this.displayDays.length - 1].push(
                new Day(
                    moment(date),
                    moment(date).format('M') !== selectedMonthNumber,
                    moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'),
                    this.eventsList.filter(event => event.date === moment(date).format('YYYY-MM-DD'))
                        .sort((a, b) => a.time.localeCompare(b.time))
                )
            );
            counter++;
        }
        this.showEventsDropdown = false;
    }

    openEventAddForm(date = '') {
        if(date) {
            this.eventsListModal.close();
            date = moment(date).format('YYYY-MM-DD');
        }
        this.eventFormModel = new Event(null, '', '', date, '');
        this.eventFormModal.open();
    }

    openEventEditForm(event) {
        this.eventFormModel = new Event(event.id, event.title, event.description, event.date, event.time);
        this.eventsListModal.close();
        this.eventFormModal.open();
    }

    openEventsList(rowIndex, dayIndex) {
        this.selectedRowIndex = rowIndex;
        this.selectedDayIndex = dayIndex;
        this.eventsListModal.open();
    }

    deleteEvent(eventId) {
        let index = this.eventsList.indexOf(this.eventsList.filter(event => event.id === eventId)[0]);
        this.eventsList.splice(index, 1);
        this.eventsService.save(this.eventsList);
        this.displayMonth();
    }

    afterEventChanged(params) {
        this.eventFormModal.close();
        this.eventsList = params.eventsList;
        if (moment(params.modifiedEvent.date).format('YYYY-MM') === moment(this.selectedMonth).format('YYYY-MM')) {
            this.displayMonth();
        }
    }

    searchEvents(searchStr) {
        if(searchStr.length < AppComponent.MIN_EVENT_SEARCH_STR_LENGTH) {
            this.showEventsDropdown = false;
            return;
        }
        this.foundEvents = this.eventsList.filter(event =>
            Object.keys(event).some(k => event[k] != null &&
            event[k].toString().toLowerCase()
                .includes(searchStr.toLowerCase()))
        );
        this.showEventsDropdown = this.foundEvents.length > 0;
    }

    hideEventsDropdown() {
        this.showEventsDropdown = false;
    }

}