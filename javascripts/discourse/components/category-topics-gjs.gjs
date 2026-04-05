import icon from "discourse/helpers/d-icon";

import CategoryTopicsLegacy from "./category-topics.js";

export default class CategoryTopicsGjs extends CategoryTopicsLegacy {
  get categoryUrl() {
    return this.category?.slug ? `/c/${this.category.slug}` : null;
  }

  <template>
    {{#if this.thumb}}
      <div class="category-topics--thumb-wrap gjs-added">
        <a href={{this.categoryUrl}} class="category-topics--thumb gjs-added">
          <img src={{this.thumb}} title={{this.category.name}} />
        </a>
      </div>
    {{/if}}

    <div class="category-topics--content gjs-added">
      {{#each this.topics as |topic|}}
        <a href={{topic.url}} class="category-topics--topic gjs-added">
          {{topic.safeTitle}}
        </a>
      {{/each}}
    </div>

    {{#if this.all_text_label}}
      <div class="category-topics--all gjs-added">
        <a href={{this.categoryUrl}}>
          {{this.all_text_label}} {{icon "angle-right"}}
        </a>
      </div>
    {{/if}}
  </template>
}
