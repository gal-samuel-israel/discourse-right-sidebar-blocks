import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { empty, equal, notEmpty } from "@ember/object/computed";
import { inject as service } from "@ember/service";

export default class AlgoBadge extends Component {
  @service site;
  
  @notEmpty("args.userId")
  userId;

  @tracked algoBadge = null;

  constructor() {
    super(...arguments);
    this.algoBadge = true;
    console.log(this.args, userId);
  }

  willDestroy() {
    this.algoBadge = null;
  }
}
