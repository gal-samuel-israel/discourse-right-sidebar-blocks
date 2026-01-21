import Component from "@glimmer/component";
import { htmlSafe } from '@ember/template';
import { tracked } from "@glimmer/tracking";
import { service } from "@ember/service";
export default class CustomHtml extends Component {
    @tracked content = null;
    @service site;
    constructor() {
        super(...arguments);
              
        const rawContent = this.args?.params?.content;
        this.content = rawContent ? htmlSafe(rawContent) : null;

        console.log('custom-html constructor called');
        console.log('custom-html this.args:', this.args);
        console.log('custom-html this.args.params:', this.args?.params);
        console.log('custom-html this.args.params.content:', this.args?.params?.content);
        
    }

    willDestroy() {
        this.content = null;
    }
}
