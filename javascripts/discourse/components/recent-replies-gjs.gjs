import avatar from "discourse/helpers/avatar";
import formatDate from "discourse/helpers/format-date";
import { i18n } from "discourse-i18n";
import Component from "@glimmer/component";
import { trustHTML } from "@ember/template";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";

function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function trustText(text) {
  const element = document.createElement("div");
  element.textContent = text || "";
  return trustHTML(element.innerHTML);
}

export default class RecentRepliesGjs extends Component {
  @tracked replies = null;

  constructor() {
    super(...arguments);
    const excerptLimit = this.args?.params?.excerptLimit || 150;
    const count = this.args?.params?.count || 5;

    ajax("/posts.json").then((data) => {
      let results = [];

      results = data.latest_posts.filter((post) => post.post_type === 1);
      results = results.filter((post) => post.post_number !== 1);

      results.forEach((reply) => {
        reply.excerpt = stripHtml(reply.cooked);
        reply.safeTopicTitle = trustText(reply.topic_title);

        if (reply.excerpt.length > excerptLimit) {
          reply.excerpt =
            reply.excerpt.substring(0, excerptLimit).trim(this) + "...";
        }
      });
      this.replies = results.slice(0, count);
    });
  }

  get headingLabel() {
    return i18n(themePrefix("recent_replies.heading"));
  }

  replyUrl(reply) {
    return `/t/${reply.topic_slug}/${reply.topic_id}/${reply.post_number}`;
  }

  willDestroy() {
    this.replies = null;
  }

  <template>
    <h3 class="recent-replies--heading gjs-added">
      {{this.headingLabel}}
    </h3>

    <div class="recent-replies--container gjs-added">
      {{#each this.replies as |reply|}}
        <div class="recent-replies--reply gjs-added">
          <div class="recent-replies--col gjs-added">
            {{avatar reply imageSize="small"}}
          </div>
          <div class="recent-replies--col gjs-added">
            <div class="recent-replies--excerpt gjs-added">
              {{reply.excerpt}}
            </div>
            <div class="recent-replies--topic-title gjs-added">
              <a class="recent-replies--topic-link gjs-added" href={{this.replyUrl reply}}>
                {{reply.safeTopicTitle}}
              </a>
            </div>
          </div>
          <div class="recent-replies--col gjs-added">
            <span class="recent-replies--date gjs-added">
              {{formatDate reply.created_at}}
            </span>
          </div>
        </div>
      {{/each}}
    </div>
  </template>
}
