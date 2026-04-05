import Component from "@glimmer/component";
import { trustHTML } from "@ember/template";

export default class AlgoCustomHtmlGjs extends Component {
  constructor() {
    super(...arguments);
    const rawContent = this.args?.params?.content;
    this.content = rawContent ? trustHTML(rawContent) : null;
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.content = null;
  }

  <template>
    {{#if this.content}}
      {{this.content}}
    {{/if}}
  </template>
}
