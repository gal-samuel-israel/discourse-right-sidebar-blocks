import Component from "@glimmer/component";
import { trustHTML } from "@ember/template";

export default class AlgoCustomHtml extends Component {

    constructor() {
        super(...arguments);
        // debug: log site settings blocks since Discourse no longer exposes settings globally
        // console.warn('custom-html site settings.blocks:', this.site?.settings?.blocks);
        const rawContent = this.args?.params?.content;
        this.content = rawContent ? trustHTML(rawContent) : null;
    }

    willDestroy() {
        super.willDestroy(...arguments);
        this.content = null;
    }
}
