import Component from "@glimmer/component";
import { service } from "@ember/service";

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

  <template>
    {{#if this.showSidebar}}
      <div class="tc-right-sidebar gjs-added">
        <RightSidebarBlocksGjs />
      </div>
    {{/if}}
  </template>
}
