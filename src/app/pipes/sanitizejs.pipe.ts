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

        let scripts =  Array.from(parser.parseFromString(s, 'text/html').getElementsByTagName('script'));

        that.loadScripts(scripts,[])
    }

    loadScripts(scripts: HTMLElement[],results:any[]){
        /* dynamically load javascript files from backend html views in proper order */
        let that=this
        let src = scripts[0].getAttribute('src') || "";
        let script = document.createElement('script');

        if (src.length && results.indexOf(src) === -1) {
            //do not load the same source multiple times
            results.push(src);
            script.setAttribute('src', src);
        }

        script.innerHTML = scripts[0].innerHTML;
        script.onload = function () {
            if (scripts.length>0) {
                that.loadScripts(scripts.slice(1, scripts.length), results)
            }
        };
        document.body.appendChild(script);
    }

    transform(htmlContent: any) {
        let sanitizeHtmlContent = this.domSanitizer.bypassSecurityTrustHtml(htmlContent); //disables default html sanitization in order to run visualization and interaction view js scripts

        this.handleExternalScriptsInHtmlString(htmlContent);

        return sanitizeHtmlContent;
    }
}