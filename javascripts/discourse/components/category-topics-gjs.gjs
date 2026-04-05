import icon from "discourse/helpers/d-icon";
import Category from "discourse/models/category";
import getURL from "discourse-common/lib/get-url";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { trustHTML } from "@ember/template";
import { service } from "@ember/service";
import User from "discourse/models/user";

function trustText(text) {
  const element = document.createElement("div");
  element.textContent = text || "";
  return trustHTML(element.innerHTML);
}

export default class CategoryTopicsGjs extends Component {
  @service store;

  @tracked topics = null;
  @tracked category = null;

  thumb = null;
  all_text_label = null;

  debug = false;
  component_debug = false;
  debug4All = false;
  debugForUsers = false;

  constructor() {
    super(...arguments);

    this.component_debug = settings?.enable_debug_for_category_topics_component;
    this.debugForAdmins = settings?.enable_debug_for_admins;
    this.debug4All = settings?.enable_debug_for_all;
    this.debugForUsers = settings?.enable_debug_for_user_ids;
    const debugForIDs = this.debugForUsers
      ? this.debugForUsers.split("|")
      : null;
    this.debug = false;

    this.debug = !!this.component_debug;

    const currentUser = User.current();
    if (this.component_debug && currentUser.admin && this.debugForAdmins) {
      this.debug = true;
    }
    if (
      this.component_debug &&
      debugForIDs &&
      debugForIDs.includes(currentUser.id.toString())
    ) {
      this.debug = true;
    }
    if (this.component_debug && this.debug4All) {
      this.debug = true;
    }

    const count =
      this.args?.params?.count !== undefined
        ? parseInt(this.args?.params?.count, 10)
        : 10;
    const categoryId =
      this.args?.params !== undefined
        ? parseInt(this.args?.params?.id, 10)
        : null;
    this.thumb =
      this.args?.params?.thumb !== undefined ? this.args?.params?.thumb : null;
    this.all_text_label =
      this.args?.params?.all_topics_label !== undefined
        ? this.args?.params?.all_topics_label
        : "All Topics";

    if (this.debug) {
      console.log("Category Topics constructor:");
      console.log("args:", this.args);
      console.log("count: ", count);
      console.log("categoryId: ", categoryId);
      console.log("thumb: ", this.thumb);
      console.log("all_text: ", this.all_text_label);
    }

    if (!categoryId) {
      return;
    }

    const filter = `c/${categoryId}`;
    this.category = Category.findById(categoryId);

    if (this.debug) {
      console.log("category: ", this.category);
    }

    this.store
      .findFiltered("topicList", {
        filter,
        sort: "created_at desc",
      })
      .then((result) => {
        const results = result.topic_list.topics;

        results.forEach((topic) => {
          topic.url = `${getURL("/t/")}${topic.slug}/${topic.id}`;
          if (topic.last_read_post_number > 0) {
            topic.url += `/${topic.last_read_post_number}`;
          }
          topic.title = topic.title.replace(/Cooking Tips with Jon Ramsey /g, "");
          topic.safeTitle = trustText(topic.title);
        });

        this.topics = results.slice(0, count);

        if (this.debug) {
          console.log("topics: ", this.topics);
        }
      });
  }

  get categoryUrl() {
    return this.category?.slug ? `/c/${this.category.slug}` : null;
  }

  willDestroy() {
    this.topics = null;
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
