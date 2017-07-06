import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'sanitizecf',
    pure: true
})
export class Sanitize {

    constructor(private domSanitizer: DomSanitizer) { }


    handleExternalScriptsInHtmlString(s: string) {

        let that = this;
        var parser = new DOMParser();
        var scripts = parser.parseFromString(s, 'text/html').getElementsByTagName('script');

        //var results = [];

        for (var i = 0; i < scripts.length; i++) {
            // var src = scripts[i].getAttribute('src');
            // if (src.length && results.indexOf(src) === -1) {
            //     //results.push(src);
            //     //that.addScript(src);
            // }
            var script = document.createElement('script');
            script.innerHTML = scripts[i].innerHTML;
            document.body.appendChild(script);
        }

        //return results;
    }

    // addScript(src: string) {
    //     var script = document.createElement('script');
    //     script.setAttribute('src', src);
    //     document.body.appendChild(script);
    // }


    transform(htmlContent: any) {
        let sanitizeHtmlContent = this.domSanitizer.bypassSecurityTrustHtml(htmlContent);

        this.handleExternalScriptsInHtmlString(htmlContent);

        return sanitizeHtmlContent;
    }
}