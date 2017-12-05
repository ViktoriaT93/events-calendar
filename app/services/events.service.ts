export class EventsService {

    private eventsKey:string = 'calendar_events';

    public save(content) {
        localStorage.setItem(this.eventsKey, JSON.stringify(content));
    }

    public getEvents() {
        return JSON.parse(localStorage.getItem(this.eventsKey)) || [];
    }

}