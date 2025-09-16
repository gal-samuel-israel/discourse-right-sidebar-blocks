import { computed } from "@ember/object";
import { service } from "@ember/service";

export default {
  setupComponent() {
    this.reopen({
      router: service(),

      showSidebar: computed("router.currentRouteName", function () {
        const currentRouteName = this.router.currentRouteName;

        if (this.site.mobileView) {
          return false;
        }

        if (settings.show_in_routes !== "") {
          const selectedRoutes = settings.show_in_routes.split("|");
          return selectedRoutes.includes(currentRouteName);
        }

        // if theme setting is empty, show everywhere except /categories
        return currentRouteName !== "discovery.categories";
      }),
    });
  },
};
