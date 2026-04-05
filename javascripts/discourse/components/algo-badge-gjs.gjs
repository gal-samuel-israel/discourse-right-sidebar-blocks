import AlgoBadgeLegacy from "./algo-badge.js";

export default class AlgoBadgeGjs extends AlgoBadgeLegacy {
  <template>
    {{#if this.algoBadgeInfo}}
      <span class="algobadge-wrap">
        <a href={{this.algoBadgeGrants}}>
          <img src={{this.algoBadgeUrl}} title={{this.algoBadgeName}} />
        </a>
      </span>
    {{/if}}
  </template>
}
