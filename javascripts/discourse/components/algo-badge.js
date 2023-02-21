import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { inject as service } from "@ember/service";

export default class AlgoBadge extends Component {
  @service site;
  @tracked algoBadge = null;

  constructor() {
    super(...arguments);
    this.algoBadge = true;
    console.log(this.args);
  }

  willDestroy() {
    this.algoBadge = null;
  }
}
