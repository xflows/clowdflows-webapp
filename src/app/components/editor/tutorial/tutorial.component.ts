import {
    Component
} from '@angular/core';

@Component({
    selector: 'tutorial',
    template: require('./tutorial.component.html'),
    styles: [require('./tutorial.component.css'),]
})
export class TutorialComponent {
    step = 0;

    goToStep(step: number) {
        this.step = step;
    }

    goToNextStep() {
        this.goToStep(this.step + 1);
    }

    goToPrevStep() {
        this.goToStep(this.step - 1);
    }

    activeStep(popupStep: number) {
        return popupStep == this.step
    }
}
