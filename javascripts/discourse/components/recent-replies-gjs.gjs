import avatar from "discourse/helpers/avatar";
import formatDate from "discourse/helpers/format-date";
import { i18n } from "discourse-i18n";

import RecentRepliesLegacy from "./recent-replies.js";

export default class RecentRepliesGjs extends RecentRepliesLegacy {
  get headingLabel() {
    return i18n(themePrefix("recent_replies.heading"));
  }

  replyUrl(reply) {
    return `/t/${reply.topic_slug}/${reply.topic_id}/${reply.post_number}`;
  }

  <template>
    <h3 class="recent-replies--heading">
      {{this.headingLabel}}
    </h3>

    <div class="recent-replies--container">
      {{#each this.replies as |reply|}}
        <div class="recent-replies--reply">
          <div class="recent-replies--col">
            {{avatar reply imageSize="small"}}
          </div>
          <div class="recent-replies--col">
            <div class="recent-replies--excerpt">
              {{reply.excerpt}}
            </div>
            <div class="recent-replies--topic-title">
              <a class="recent-replies--topic-link" href={{this.replyUrl reply}}>
                {{reply.safeTopicTitle}}
              </a>
            </div>
          </div>
          <div class="recent-replies--col">
            <span class="recent-replies--date">
              {{formatDate reply.created_at}}
            </span>
          </div>
        </div>
      {{/each}}
    </div>
  </template>
}
