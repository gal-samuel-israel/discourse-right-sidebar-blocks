import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { service } from "@ember/service";
export default class CustomHtml extends Component {
    @tracked content = null;
    @service site;
    constructor() {
        super(...arguments);
              
        this.content = this.args?.params?.content;

        console.log('custom-html constructor called');
        console.log('custom-html this.args:', this.args);
        console.log('custom-html this.args.params:', this.args?.params);
        console.log('custom-html this.args.params.content:', this.args?.params?.content);
        
    }

    willDestroy() {
        this.content = null;
    }
}
