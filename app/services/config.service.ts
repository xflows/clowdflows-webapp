import {Injectable} from "@angular/core";

@Injectable()
export class ConfigService {
    base_url = 'http://127.0.0.1:8000';
    api_base_url = this.base_url + '/api/';
    test_token = '655454c37a7165af91880d98b8253e9416126a17';
};
