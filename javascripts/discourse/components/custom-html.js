import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CustomHtml extends Component {
    @tracked content = null;
    debugForAdmins = false;
    constructor() {
        super(...arguments);
        this.content = this.args?.params?.content;
        this.debugForAdmins = settings?.enable_debug_for_admins; //from settings.yml
        if (this.debugForAdmins) {
            console.log('custom-html constructor called');
            console.log('custom-html this.args:', this.args);
            console.log('custom-html this.args.params:', this.args?.params);
            console.log('custom-html this.args.params.content:', this.args?.params?.content);
        }
    }

    willDestroy() {
        this.content = null;
    }
}
