import Component from "@glimmer/component";
import { htmlSafe } from "@ember/template";
import { tracked } from "@glimmer/tracking";
import { service } from "@ember/service";
export default class CustomHtml extends Component {
    @tracked content = null;
    @service site;
    constructor() {
        super(...arguments);
        // debug: log site settings blocks since Discourse no longer exposes settings globally
        console.warn('custom-html site settings.blocks:', this.site?.settings?.blocks);
        const rawContent = this.args?.params?.content;
        this.content = rawContent ? htmlSafe(rawContent) : null;

        console.warn('custom-html constructor called');
        console.warn('custom-html this.args:', this.args);
        console.warn('custom-html this.args.params:', this.args?.params);
        console.warn('custom-html this.args.params.content:', this.args?.params?.content);
        
    }

    willDestroy() {
        this.content = null;
    }
}
