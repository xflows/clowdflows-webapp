import {Injectable} from '@angular/core';
import * as Collections from 'typescript-collections';
import {ClowdFlowsDataService} from "./clowdflows-data.service";
import {Widget} from "../models/widget";
import {AbstractWidget} from "../models/abstract-widget";
import {WidgetLibraryService} from "./widget-library.service";


@Injectable()
export class RecommenderService {

    // A mapping between abstract input ids and abstract output ids
    private recommenderModel: any = {};

    constructor(public clowdflowsDataService: ClowdFlowsDataService,
                public widgetLibraryService: WidgetLibraryService) {
        this.init();
    }

    init() {
        this.clowdflowsDataService
            .getRecommenderModel()
            .then((recommenderModel) => {
                this.recommenderModel = recommenderModel;
            });
    }

    // Recommend output ids for the given input id
    recommendOutputs(abstract_input_id: number): number[] {
        let id = abstract_input_id.toString();
        let recommendation: number[];
        if (this.recommenderModel && 'recomm_for_abstract_input_id' in this.recommenderModel) {
            recommendation = this.recommenderModel['recomm_for_abstract_input_id'][id];
        }
        if (!recommendation) {
            recommendation = [];
        }
        return recommendation;
    }

    // Recommend input ids for the given output id
    recommendInputs(abstract_output_id: number): number[] {
        let id = abstract_output_id.toString();
        let recommendation: number[];
        if (this.recommenderModel && 'recomm_for_abstract_output_id' in this.recommenderModel) {
            recommendation = this.recommenderModel['recomm_for_abstract_output_id'][id];
        }
        if (!recommendation) {
            recommendation = [];
        }
        return recommendation;
    }

    // Get a recommendation object, containing recommended abstract input ids and output ids
    getRecommendation(widget: Widget): WidgetRecommendation {
        let abstractOutputIds = new Collections.Set<number>();
        let abstractInputIds = new Collections.Set<number>();

        if (widget != null) {
            for (let input_obj of widget.inputs) {
                if (!input_obj.abstract_input_id) {
                    continue;
                }
                for (let abstract_output_id of this.recommendOutputs(input_obj.abstract_input_id)) {
                    abstractOutputIds.add(abstract_output_id);
                }
            }
            for (let output_obj of widget.outputs) {
                if (!output_obj.abstract_output_id) {
                    continue;
                }
                for (let abstract_input_id of this.recommendInputs(output_obj.abstract_output_id)) {
                    abstractInputIds.add(abstract_input_id);
                }
            }
        }
        return new WidgetRecommendation(this, abstractOutputIds, abstractInputIds);
    }
}

export class WidgetRecommendation {
    constructor(public recommenderService: RecommenderService,
                public recommendedAbstractOutputIds: Collections.Set<number>,
                public recommendedAbstractInputIds: Collections.Set<number>) {
    }

    isRecommendedInputWidget(candidate: AbstractWidget) {
        let isRecommended = false;
        if (candidate.outputs) {
            for (let output of candidate.outputs) {
                if (this.recommendedAbstractOutputIds.contains(output.id)) {
                    isRecommended = true;
                    break;
                }
            }
        }
        return isRecommended;
    }

    isRecommendedOutputWidget(candidate: AbstractWidget) {
        let isRecommended = false;
        if (candidate.inputs) {
            for (let input of candidate.inputs) {
                if (this.recommendedAbstractInputIds.contains(input.id)) {
                    isRecommended = true;
                    break;
                }
            }
        }
        return isRecommended;
    }

    empty() {
        return this.recommendedAbstractInputIds.size() == 0 &&
            this.recommendedAbstractOutputIds.size() == 0;
    }
}