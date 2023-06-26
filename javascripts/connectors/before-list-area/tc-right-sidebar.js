//DEPRECATED//import discourseComputed from "discourse-common/utils/decorators";
import Computed from "@ember-decorators/object";
import { inject as service } from "@ember/service";

export default {
  setupComponent() {
    this.reopen({
      router: service(),

      @Computed("router.currentRouteName")
      showSidebar(currentRouteName) {
        if (this.site.mobileView) {
          return false;
        }

        if (settings.show_in_routes !== "") {
          const selectedRoutes = settings.show_in_routes.split("|");
          return selectedRoutes.includes(currentRouteName) ? true : false;
        }

        // if theme setting is empty, show everywhere except /categories
        return currentRouteName === "discovery.categories" ? false : true;
      },
    });
  },
};
