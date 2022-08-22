import Component from "@glimmer/component";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default class Gamification extends Component {

  @tracked page: 1;
  @tracked loading: false;
  @tracked canLoadMore: true;
  @tracked period: "all";
  @tracked gamificationList = null;

  constructor() {
    super(...arguments);

    const count = this.args?.params?.count || 5;

    ajax(`/leaderboard`)
    .then((scores) => {
        this.gamificationList = scores;
        this.gamificationList.users = scores.users.slice(0, count);
        console.log(scores);
      }
    );
  }

  @action
  changePeriod(period) {
    this.set("period", period);
    return ajax(
      `/leaderboard/${this.model.leaderboard.id}?period=${this.period}`
    )
      .then((result) => {
        if (result.users.length === 0) {
          this.set("canLoadMore", false);
        }
        this.set("page", 1);        
        this.set("gamificationList.users",result.users.slice(0, count));
      })
      .finally(() => this.set("loading", false))
      .catch(popupAjaxError);
  }

  willDestroy() {
    this.gamificationList = null;
  }
};
