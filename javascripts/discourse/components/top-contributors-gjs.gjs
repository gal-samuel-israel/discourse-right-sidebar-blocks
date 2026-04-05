import avatar from "discourse/helpers/avatar";
import icon from "discourse/helpers/d-icon";
import { i18n } from "discourse-i18n";

import TopContributorsLegacy from "./top-contributors.js";

export default class TopContributorsGjs extends TopContributorsLegacy {
  get headingLabel() {
    return i18n(themePrefix("top_contributors.heading"));
  }

  get viewAllLabel() {
    return i18n(themePrefix("top_contributors.view_all"));
  }

  <template>
    <h3 class="top-contributors-heading">
      {{this.headingLabel}}
    </h3>

    <div class="top-contributors--container">
      {{#each this.topContributors as |item|}}
        <div class="top-contributors--user">
          <span
            data-user-card={{item.user.username}}
            class="top-contributors--user-badge"
          >
            {{avatar item.user imageSize="small"}}
            {{item.user.username}}
          </span>
          <span class="top-contributors--user-likes">
            {{icon "heart"}} {{item.likes_received}}
          </span>
        </div>
      {{/each}}
    </div>

    <a class="top-contributors--view-all" href="/u?order=likes_received&period=yearly">
      {{this.viewAllLabel}}
    </a>
  </template>
}
