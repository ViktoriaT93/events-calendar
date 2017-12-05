export class Day {
    constructor(
        public date: Object,
        public disabled: boolean,
        public today: boolean,
        public events: Array<Event>
    ) { }
}