import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {ToolbarComponent} from "./toolbar.component";
import {testWorkflows} from "../../../testing/data/workflows.testdata";
import {By} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {ModalModule} from "ng2-bootstrap";
import {RouterLinkStubDirective} from "../../../testing/stubs/router-stubs";
import {DebugElement} from "@angular/core";


describe('ToolbarComponent', () => {

    let comp:ToolbarComponent;
    let fixture:ComponentFixture<ToolbarComponent>;
    let linkDes:DebugElement[];
    let links:RouterLinkStubDirective[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ModalModule.forRoot()
            ],
            declarations: [RouterLinkStubDirective, ToolbarComponent],
        });
        fixture = TestBed.createComponent(ToolbarComponent);
        comp = fixture.componentInstance;
        comp.workflow = testWorkflows[0];
        comp.userWorkflows = testWorkflows;
        fixture.detectChanges(); // trigger initial data binding

        // find DebugElements with an attached RouterLinkStubDirective
        linkDes = fixture.debugElement
            .queryAll(By.directive(RouterLinkStubDirective));

        // get the attached link directive instances using the DebugElement injectors
        links = linkDes
            .map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    });

    it('should open new workflow dialog and emit signal to create after clicking', () => {
        var newWorkflowBtn = fixture.debugElement.query(By.css('#new-workflow-btn'));
        var confirmCreateBtn = fixture.debugElement.query(By.css('#create-workflow-confirm-btn'));
        var emitted:boolean = false;
        comp.createWorkflowRequest.subscribe(() => {
            emitted = true
        });

        newWorkflowBtn.triggerEventHandler('click', null);
        confirmCreateBtn.triggerEventHandler('click', null);
        expect(emitted).toBe(true);
    });

    it('should open the open workflow dialog and display the correct amount of workflows, and navigate to a clicked workflow', () => {
        var openWorkflowBtn = fixture.debugElement.query(By.css('#open-workflow-btn'));

        openWorkflowBtn.triggerEventHandler('click', null);
        expect(links.length).toBe(testWorkflows.length, 'should display all test workflows');

        linkDes[0].triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(links[0].navigatedTo).toEqual(['/editor/', testWorkflows[0].id]);
    });

    it('should open the save workflow dialog and emit the save signal after clicking', async(() => {
        var saveWorkflowBtn = fixture.debugElement.query(By.css('#save-workflow-btn'));
        var applyBtn = fixture.debugElement.query(By.css('#apply-workflow-changes-btn'));
        var emitted = false;
        comp.saveWorkflowRequest.subscribe(() => {
            emitted = true;
        });

        saveWorkflowBtn.triggerEventHandler('click', null);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            var workflowNameEl = fixture.debugElement.query(By.css('#workflow-name'));
            var workflowDescriptionEl = fixture.debugElement.query(By.css('#workflow-description'));
            var workflowIsPublicEl = fixture.debugElement.query(By.css('#workflow-is-public'));

            expect(workflowNameEl.nativeElement.value).toBe(comp.workflow.name);
            expect(workflowDescriptionEl.nativeElement.value).toBe(comp.workflow.description);
            expect(workflowIsPublicEl.nativeElement.checked).toBe(comp.workflow.is_public);

            applyBtn.triggerEventHandler('click', null);
            expect(emitted).toBe(true);
        });
    }));

    it('should emit run workflow signal when clicking the run button', ()=>{
        var runBtn = fixture.debugElement.query(By.css('#run-workflow-btn'));
        var emitted = false;
        comp.runWorkflowRequest.subscribe(() => {
            emitted = true;
        });
        runBtn.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(emitted).toBe(true);
    });
});
