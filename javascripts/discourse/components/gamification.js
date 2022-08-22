import Component from "@glimmer/component";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default class Gamification extends Component {
  @tracked page = 1;
  @tracked loading = false;
  @tracked canLoadMore=true;
  @tracked gamificatinObj = null;
  @tracked period: "all";

  constructor() {
    super(...arguments);

    const count = this.args?.params?.count || 5;

    ajax(`/leaderboard`)
    .then((scores) => {
        this.gamificatinObj = scores;
        this.gamificatinObj.users = scores.users.slice(0, count);
        //console.log(scores);
      }
    );
  }

  @action
  changePeriod(period) {
    this.period = period;
    return ajax(
      `/leaderboard/${this.gamificatinObj.leaderboard.id}?period=${this.period}`
    )
      .then((result) => {
        if (result.users.length === 0) {
          this.canLoadMore = false;
        }
        this.page= 1;
        this.gamificatinObj.users = result.users.slice(0, count);
      })
      .finally(() => this.loading = false)
      .catch(popupAjaxError);
  }

  willDestroy() {
    this.gamificatinObj = null;
  }
};
