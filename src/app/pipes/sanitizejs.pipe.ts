import {Pipe, PipeTransform} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'sanitizecf',
    pure: true
})
export class Sanitize implements PipeTransform {

    constructor(private domSanitizer: DomSanitizer) { }


    handleExternalScriptsInHtmlString(s: string) {

        let that = this;
        let parser = new DOMParser();
        let scripts = parser.parseFromString(s, 'text/html').getElementsByTagName('script');

        let results:any = [];

        for (let i = 0; i < scripts.length; i++) {
            let src = scripts[i].getAttribute('src');
            if (src.length && results.indexOf(src) === -1) {
                results.push(src);
                that.addScript(src);
            }
            let script = document.createElement('script');
            script.innerHTML = scripts[i].innerHTML;
            document.body.appendChild(script);
        }
    }

    addScript(src: string) {
        let script = document.createElement('script');
        script.setAttribute('src', src);
        document.body.appendChild(script);
    }


    transform(htmlContent: any) {
        let sanitizeHtmlContent = this.domSanitizer.bypassSecurityTrustHtml(htmlContent);

        this.handleExternalScriptsInHtmlString(htmlContent);

        return sanitizeHtmlContent;
    }
}