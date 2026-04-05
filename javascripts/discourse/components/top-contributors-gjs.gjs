import avatar from "discourse/helpers/avatar";
import icon from "discourse/helpers/d-icon";
import { i18n } from "discourse-i18n";
import Component from "@glimmer/component";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";

export default class TopContributorsGjs extends Component {
  @tracked topContributors = null;

  constructor() {
    super(...arguments);

    const count = this.args?.params?.count || 5;

    ajax("/directory_items.json?period=yearly&order=likes_received").then(
      (data) => {
        this.topContributors = data.directory_items.slice(0, count);
      }
    );
  }

  get headingLabel() {
    return i18n(themePrefix("top_contributors.heading"));
  }

  get viewAllLabel() {
    return i18n(themePrefix("top_contributors.view_all"));
  }

  willDestroy() {
    this.topContributors = null;
  }

  <template>
    <h3 class="top-contributors-heading gjs-added">
      {{this.headingLabel}}
    </h3>

    <div class="top-contributors--container gjs-added">
      {{#each this.topContributors as |item|}}
        <div class="top-contributors--user gjs-added">
          <span
            data-user-card={{item.user.username}}
            class="top-contributors--user-badge gjs-added"
          >
            {{avatar item.user imageSize="small"}}
            {{item.user.username}}
          </span>
          <span class="top-contributors--user-likes gjs-added">
            {{icon "heart"}} {{item.likes_received}}
          </span>
        </div>
      {{/each}}
    </div>

    <a class="top-contributors--view-all gjs-added" href="/u?order=likes_received&period=yearly">
      {{this.viewAllLabel}}
    </a>
  </template>
}
