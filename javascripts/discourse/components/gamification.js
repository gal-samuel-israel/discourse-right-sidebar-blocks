import Component from "@glimmer/component";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default class Gamification extends Component {
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

  willDestroy() {
    this.gamificationList = null;
  }
};
