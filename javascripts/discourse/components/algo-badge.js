import Component from "@glimmer/component";

/*
export default class AlgoBadge extends Component {
  @service site;
  @tracked algoBadge = null;

  constructor() {
    super(...arguments);
    this.algoBadge = true;
    console.log(params);
  }

  willDestroy() {
    this.algoBadge = null;
  }
}
*/

const AlgoBadge = Component.extend({    
    algoBadge: null,

    didReceiveAttrs() {
        this._super(...arguments);
        console.log('didReceiveAttrs', arguments)
    },
  
    didRender() {
        this._super(...arguments);
        console.log('didRender', arguments)
    },

    willDestroy() {
        this.algoBadge = null;
    },
  });
  
  AlgoBadge.reopenClass({ positionalParams: ["user_id"] });
  
  export default AlgoBadge;