import {Component} from '@angular/core';
import {LoggerService} from "../../services/logger.service";

@Component({
    selector: 'logging',
    templateUrl: 'app/components/editor/logging.component.html',
    styleUrls: ['app/components/editor/logging.component.css',],
    directives: []
})
export class LoggingComponent {

    messages = null;

    constructor(private loggingService:LoggerService) {
        this.messages = loggingService.messages;

        // this.loggingService.info('test test info');
        // this.loggingService.error('test test error');
        // this.loggingService.warning('test test warning');
        // this.loggingService.success('test test success');
    }
}
