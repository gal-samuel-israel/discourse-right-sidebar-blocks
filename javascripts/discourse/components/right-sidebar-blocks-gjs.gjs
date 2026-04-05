import RightSidebarBlocksLegacy from "./right-sidebar-blocks.js";

import AlgoCustomHtmlGjs from "./algo-custom-html-gjs.gjs";
import CategoryTopicsGjs from "./category-topics-gjs.gjs";
import GamificationGjs from "./gamification-gjs.gjs";
import PopularTagsGjs from "./popular-tags-gjs.gjs";
import RecentRepliesGjs from "./recent-replies-gjs.gjs";
import SubcategoryListGjs from "./subcategory-list-gjs.gjs";
import TopContributorsGjs from "./top-contributors-gjs.gjs";

const BLOCK_COMPONENTS = {
  "algo-custom-html": AlgoCustomHtmlGjs,
  "category-topics": CategoryTopicsGjs,
  gamification: GamificationGjs,
  "popular-tags": PopularTagsGjs,
  "recent-replies": RecentRepliesGjs,
  "subcategory-list": SubcategoryListGjs,
  "top-contributors": TopContributorsGjs,
};

export default class RightSidebarBlocksGjs extends RightSidebarBlocksLegacy {
  constructor() {
    super(...arguments);

    this.blocks = this.blocks
      .filter((block) => {
        if (BLOCK_COMPONENTS[block.name]) {
          return true;
        }

        // eslint-disable-next-line no-console
        console.warn(
          `The GJS component "${block.name}" was not found, please update the configuration for discourse-right-sidebar-blocks.`
        );
        return false;
      })
      .map((block) => ({
        ...block,
        componentClass: BLOCK_COMPONENTS[block.name],
        wrapperClassNames: `${block.classNames} gjs-added`,
      }));
  }

  <template>
    {{#each this.blocks as |block|}}
      <div class={{block.wrapperClassNames}}>
        {{#let block.componentClass as |BlockComponent|}}
          <BlockComponent @params={{block.parsedParams}} />
        {{/let}}
      </div>
    {{/each}}
  </template>
}
