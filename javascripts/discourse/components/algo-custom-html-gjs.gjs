import AlgoCustomHtmlLegacy from "./algo-custom-html.js";

export default class AlgoCustomHtmlGjs extends AlgoCustomHtmlLegacy {
  <template>
    {{#if this.content}}
      {{this.content}}
    {{/if}}
  </template>
}
