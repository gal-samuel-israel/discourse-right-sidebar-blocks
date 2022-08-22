import Component from "@glimmer/component";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";

export default class Gamification extends Component {
  @tracked gamificationList = null;

  constructor() {
    super(...arguments);

    const count = this.args?.params?.count || 5;

    ajax(`/leaderboard`)
    .then((scores) => {
        this.gamificationList = scores;
        this.gamificationList.users.slice(0, count);
        console.log(scores);
      }
    );
  }

  willDestroy() {
    this.gamificationList = null;
  }
}
