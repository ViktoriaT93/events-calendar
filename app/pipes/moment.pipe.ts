import { Pipe } from '@angular/core'
import * as moment from 'moment';

@Pipe({
    name: 'moment'
})
export class MomentPipe {
    transform (value, format) {
        return moment(value).format(format);
    }
}