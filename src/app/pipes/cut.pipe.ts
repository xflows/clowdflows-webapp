import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'cut'
})
export class CutPipe implements PipeTransform {

    transform(value: any, cutoff: number) {
        let shortenedString = value;

        if (value != null && typeof value != undefined) {
            shortenedString = value.toString();
            if (shortenedString.length > cutoff) {
                shortenedString = shortenedString.substring(0, cutoff) + ' [...]';
            }
        }
        return shortenedString;
    }
}