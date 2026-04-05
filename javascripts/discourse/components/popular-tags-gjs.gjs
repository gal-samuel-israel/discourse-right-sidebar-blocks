import { i18n } from "discourse-i18n";

import PopularTagsLegacy from "./popular-tags.js";

export default class PopularTagsGjs extends PopularTagsLegacy {
  get headingLabel() {
    return i18n(themePrefix("popular_tags.heading"));
  }

  <template>
    {{#if this.topTags}}
      <h3 class="popular-tags-heading">
        {{this.headingLabel}}
      </h3>

      {{#each this.topTags as |tag|}}
        <a href={{tag.url}} class="popular-tags--tag">
          {{tag.name}}
        </a>
      {{/each}}
    {{/if}}
  </template>
}
