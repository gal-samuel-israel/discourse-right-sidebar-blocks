import { i18n } from "discourse-i18n";
import SubCategoryItem from "discourse/components/sub-category-item";

import SubcategoryListLegacy from "./subcategory-list.js";

export default class SubcategoryListGjs extends SubcategoryListLegacy {
  get headingLabel() {
    return i18n(themePrefix("subcategory_list.heading"));
  }

  <template>
    {{#if this.shouldShowBlock}}
      <h3 class="subcategory-list--heading gjs-added">
        {{this.headingLabel}}
      </h3>

      <div class="subcategory-list--items gjs-added">
        {{#each this.parentCategory.subcategories as |subcat|}}
          <div class="subcategory-list--item gjs-added">
            <SubCategoryItem @category={{subcat}} />
          </div>
        {{/each}}
      </div>
    {{/if}}
  </template>
}
