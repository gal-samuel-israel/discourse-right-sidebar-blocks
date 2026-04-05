import Component from "@glimmer/component";
import { service } from "@ember/service";

import RightSidebarBlocksLegacy from "../../discourse/components/right-sidebar-blocks.js";
import RightSidebarBlocksGjs from "../../discourse/components/right-sidebar-blocks-gjs.gjs";

export default class TcRightSidebar extends Component {
  @service router;
  @service site;

  get showSidebar() {
    const currentRouteName = this.router.currentRouteName;

    if (this.site.mobileView) {
      return false;
    }

    if (settings.show_in_routes !== "") {
      const selectedRoutes = settings.show_in_routes.split("|");
      return selectedRoutes.includes(currentRouteName);
    }

    return currentRouteName !== "discovery.categories";
  }

  get useGjs() {
    return settings.use_gjs;
  }

  <template>
    {{#if this.showSidebar}}
      <div class="tc-right-sidebar">
        {{#if this.useGjs}}
          <RightSidebarBlocksGjs />
        {{else}}
          <RightSidebarBlocksLegacy />
        {{/if}}
      </div>
    {{/if}}
  </template>
}
