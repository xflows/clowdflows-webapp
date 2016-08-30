import {
    TestBed, fakeAsync
} from '@angular/core/testing';
import {LoggingComponent} from "./logging.component";
import {LoggerService} from "../../../services/logger.service";


describe('LoggerComponent', () => {

    beforeEach(() => {
        TestBed
            .configureTestingModule({
                declarations: [
                    LoggingComponent
                ]
            })
            .compileComponents();
    });

    it('should display messages', fakeAsync(() => {
        var fixture = TestBed.createComponent(LoggingComponent);
        let logger:LoggerService = new LoggerService();
        let compInstance = fixture.debugElement.componentInstance;
        compInstance.messages = logger.messages;

        // Push some messages
        logger.info('info text');
        logger.error('error text');

        fixture.detectChanges();
        fixture.whenStable().then(()=>{
            expect(compInstance.messages.length).toBe(2);
            expect(compInstance.messages.length).toBe(compInstance.numberOfMessages);

            // Check DOM
            let elements = fixture.debugElement.nativeElement.querySelectorAll('#log li');
            expect(elements.length).toBe(2);
        });
    }));
});
