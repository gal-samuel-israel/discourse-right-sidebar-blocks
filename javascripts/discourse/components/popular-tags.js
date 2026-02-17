import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { service } from "@ember/service";
import getURL from "discourse-common/lib/get-url";
import User from "discourse/models/user";

export default class PopularTags extends Component {
  @service site;
  @tracked topTags = null;

  debug = false;
  component_debug = false;
  debug4All = false;
  debugForUsers = false;

  constructor() {
    super(...arguments);

    this.component_debug = settings?.enable_debug_for_popular_tags_component;
    this.debugForAdmins = settings?.enable_debug_for_admins;
    this.debug4All = settings?.enable_debug_for_all;
    this.debugForUsers = settings?.enable_debug_for_user_ids;
    const debugForIDs = this.debugForUsers ? this.debugForUsers.split("|") : null;

    const currentUser = User.current();
    this.debug = this.component_debug ? true : false;

    if (this.component_debug && currentUser?.admin && this.debugForAdmins) {
      this.debug = true;
    }
    if (
      this.component_debug &&
      debugForIDs &&
      currentUser?.id &&
      debugForIDs.includes(currentUser.id.toString())
    ) {
      this.debug = true;
    }
    if (this.component_debug && this.debug4All) {
      this.debug = true;
    }

    const selectedUsersOnly = settings?.enable_popular_tags_only_for_selected_users;
    const selectedUserIdsRaw = settings?.popular_tags_visible_user_ids;
    const selectedUserIds = selectedUserIdsRaw ? selectedUserIdsRaw.split("|") : [];
    const currentUserId = currentUser?.id?.toString();

    if (
      selectedUsersOnly &&
      (!currentUserId || !selectedUserIds.includes(currentUserId))
    ) {
      if (this.debug) {
        console.log("popular-tags hidden for current user");
      }
      this.topTags = null;
      return;
    }

    const count = this.args?.params?.count || 10;
    const rawTags = this.site.get("top_tags") || [];

    this.topTags = rawTags.slice(0, count).map((tag) => {
      const name = typeof tag === "string" ? tag : tag?.id || tag?.name || tag?.text;
      return {
        name,
        url: name ? getURL(`/tag/${name}`) : null,
      };
    }).filter((tag) => tag.name && tag.url);

    if (!this.topTags.length) {
      this.topTags = null;
    }

    if (this.debug && this.topTags) {
      console.log("popular-tags topTags:", this.topTags);
    }
  }

  willDestroy() {
    this.topTags = null;
  }
}
