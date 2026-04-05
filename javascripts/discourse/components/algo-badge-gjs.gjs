import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { notEmpty } from "@ember/object/computed";
import { service } from "@ember/service";
import { ajax } from "discourse/lib/ajax";
import User from "discourse/models/user";

const EXPLORER_BADGE_IDS = [
  108, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
  124, 125, 126, 127, 128,
];

export default class AlgoBadgeGjs extends Component {
  @service site;

  @notEmpty("args.username")
  usernameIsSet;

  @tracked badgeRequest = null;
  @tracked algoBadgeInfo = null;
  @tracked algoBadgeName = null;
  @tracked algoBadgeUrl = null;
  @tracked algoBadgeGrants = null;

  component_enable = false;
  debug = false;
  component_debug = false;
  showOnlyToAdmins = false;
  debug4All = false;
  debugForUsers = false;

  async getUserAlgoBadgeWithCoreApi(username) {
    if (this.debug) {
      console.log(`getUserAlgoBadgeWithCoreApi: ${username}`);
    }

    return ajax(`/user-badges/${encodeURIComponent(username)}.json`, {
      type: "GET",
    }).then((response) => {
      const badges = response?.badges || [];
      const userBadges = response?.user_badges || [];
      if (badges.length === 0 || userBadges.length === 0) {
        return;
      }

      const badgeIdSet = new Set(EXPLORER_BADGE_IDS);
      const badgeById = new Map(
        badges
          .map((badge) => [Number(badge?.id), badge])
          .filter(([id]) => !Number.isNaN(id))
      );

      const matchingGrants = userBadges
        .filter((grant) => badgeIdSet.has(Number(grant?.badge_id)))
        .map((grant) => {
          const badgeId = Number(grant.badge_id);
          return { grant, badge: badgeById.get(badgeId) };
        })
        .filter((entry) => entry.badge?.image_url);

      if (matchingGrants.length === 0) {
        return;
      }

      matchingGrants.sort((a, b) => {
        const badgeIdDelta =
          Number(a.grant.badge_id) - Number(b.grant.badge_id);
        if (badgeIdDelta !== 0) {
          return badgeIdDelta;
        }

        const grantIdDelta = Number(a.grant.id || 0) - Number(b.grant.id || 0);
        if (grantIdDelta !== 0) {
          return grantIdDelta;
        }

        return String(a.grant.granted_at || "").localeCompare(
          String(b.grant.granted_at || "")
        );
      });

      const selectedBadge = matchingGrants[0].badge;
      if (!selectedBadge?.id || !selectedBadge?.image_url) {
        return;
      }

      this.algoBadgeInfo = true;
      this.algoBadgeName = selectedBadge.name;
      this.algoBadgeUrl = selectedBadge.image_url;
      this.algoBadgeGrants = selectedBadge.slug
        ? `/badges/${selectedBadge.id}/${selectedBadge.slug}`
        : `/badges/${selectedBadge.id}`;
    });
  }

  async getUserAlgoBadge(username) {
    if (!username) {
      if (this.debug) {
        console.log("AlgoBadge: username missing");
      }
      return;
    }

    return this.getUserAlgoBadgeWithCoreApi(username);
  }

  constructor() {
    super(...arguments);

    this.component_enable = settings?.enable_algobadge_component;
    this.component_debug = settings?.enable_debug_for_algobadge_component;
    this.showOnlyToAdmins = settings?.enable_component_only_for_admins;
    this.debugForAdmins = settings?.enable_debug_for_admins;
    this.debug4All = settings?.enable_debug_for_all;
    this.debugForUsers = settings?.enable_debug_for_user_ids;
    const debugForIDs = this.debugForUsers
      ? this.debugForUsers.split("|")
      : null;
    this.debug = false;

    this.debug = !!this.component_debug;

    let showOnlyForAdmins = false;

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
    if (this.debug) {
      console.log(
        "algoBadge constructor:",
        this.args?.userId,
        this.args?.username,
        this.usernameIsSet
      );
    }

    if (this.component_enable && this.usernameIsSet && !showOnlyForAdmins) {
      this.getUserAlgoBadge(this.args?.username).then(() => {
        if (this.debug) {
          console.log("got badge for:", this.args.userId);
        }
      });
    }
  }

  willDestroy() {
    this.algoBadge = null;
  }

  <template>
    {{#if this.algoBadgeInfo}}
      <span class="algobadge-wrap gjs-added">
        <a href={{this.algoBadgeGrants}}>
          <img src={{this.algoBadgeUrl}} title={{this.algoBadgeName}} />
        </a>
      </span>
    {{/if}}
  </template>
}
