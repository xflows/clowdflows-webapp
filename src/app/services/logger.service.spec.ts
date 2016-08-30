import { inject, TestBed } from '@angular/core/testing';
import {LoggerService} from "./logger.service";



describe('logger service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoggerService]
        });
    });

    it('should add messages of all types', inject([LoggerService], (logger:LoggerService) => {

        logger.info('info text');
        logger.warning('warning text');
        logger.error('error text');
        logger.success('success text');

        expect(logger.messages.length).toBe(4);
    }));

    it('should clear messages', inject([LoggerService], (logger:LoggerService) => {

        logger.info("info");
        logger.info("info");
        logger.info("info");
        logger.clear();

        expect(logger.messages.length).toBe(0);
    }));
});