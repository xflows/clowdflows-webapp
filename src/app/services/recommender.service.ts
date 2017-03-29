import {Injectable} from '@angular/core';
import {ClowdFlowsDataService} from "./clowdflows-data.service";
import {AbstractInput} from "../models/abstract-input";
import {AbstractOutput} from "../models/abstract-output";

@Injectable()
export class RecommenderService {

    // A mapping between abstract input ids and abstract output ids
    private recommenderModel:any = {};

    constructor(public clowdflowsDataService:ClowdFlowsDataService) {
        this.init();
    }

    init() {
        this.clowdflowsDataService
            .getRecommenderModel()
            .then((recommenderModel) => {
                this.recommenderModel = recommenderModel;
            })
    }

    // Recommend output ids for the given input id
    recommendOutputs(abstract_input_id:number):number[] {
        let id = abstract_input_id.toString();
        let recommendation:number[];
        if (this.recommenderModel && 'recomm_for_abstract_input_id' in this.recommenderModel) {
            recommendation = this.recommenderModel['recomm_for_abstract_input_id'][id];
        }
        if (!recommendation) {
            recommendation = [];
        }
        return recommendation;
    }

    // Recommend input ids for the given output id
    recommendInputs(abstract_output_id:number):number[] {
        let id = abstract_output_id.toString();
        let recommendation:number[];
        if (this.recommenderModel && 'recomm_for_abstract_output_id' in this.recommenderModel) {
            recommendation = this.recommenderModel['recomm_for_abstract_output_id'][id];
        }
        if (!recommendation) {
            recommendation = [];
        }
        return recommendation;
    }
}
