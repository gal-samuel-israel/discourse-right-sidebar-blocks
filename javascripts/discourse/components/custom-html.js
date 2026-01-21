import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CustomHtml extends Component {
    @tracked content = null;

    constructor() {
        super(...arguments);
        this.content = this.args?.params?.content;
    }

    willDestroy() {
        this.content = null;
    }
}
