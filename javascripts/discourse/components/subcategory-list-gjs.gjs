import { i18n } from "discourse-i18n";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { service } from "@ember/service";
import SubCategoryItem from "discourse/components/sub-category-item";

export default class SubcategoryListGjs extends Component {
  @service router;
  @tracked parentCategory = null;

  get headingLabel() {
    return i18n(themePrefix("subcategory_list.heading"));
  }

  get shouldShowBlock() {
    const currentRoute = this.router.currentRoute;

    if (!currentRoute.attributes?.category) {
      return false;
    }

    const category = currentRoute.attributes.category;
    this.parentCategory = category;

    if (category.subcategories && this.shouldDisplay(category.id)) {
      return true;
    }

    return false;
  }

  shouldDisplay(parentCategoryId) {
    const displayInCategories = this.args?.params?.displayInCategories
      ?.split(",")
      .map(Number);

    return (
      displayInCategories === undefined ||
      displayInCategories.includes(parentCategoryId)
    );
  }

  willDestroy() {
    this.parentCategory = null;
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
