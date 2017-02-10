import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LoggingComponent} from "./logging.component";
import {LoggerService} from "../../../services/logger.service";


describe('LoggerComponent', () => {

    let comp:    LoggingComponent;
    let fixture: ComponentFixture<LoggingComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoggingComponent
            ]
        });
        fixture = TestBed.createComponent(LoggingComponent);
        comp = fixture.componentInstance; // BannerComponent test instance
    });

    it('should display messages', () => {
        let logger:LoggerService = new LoggerService();
        comp.messages = logger.messages;

        // Push some messages
        logger.info('info text');
        logger.error('error text');

        fixture.detectChanges();
        fixture.whenStable().then(()=> {
            expect(comp.messages.length).toBe(2);
            expect(comp.messages.length).toBe(comp.numberOfMessages);

            // Check DOM
            let elements = fixture.debugElement.nativeElement.querySelectorAll('#log li');
            expect(elements.length).toBe(2);
        });
    });
});
