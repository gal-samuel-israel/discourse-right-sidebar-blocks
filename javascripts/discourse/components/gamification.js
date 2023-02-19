import Component from "@glimmer/component";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default class Gamification extends Component {
  @tracked page = 1;
  @tracked loading = false;
  @tracked canLoadMore = true;
  @tracked gamificatinObj = null;
  @tracked period = "all";

  debug = false;
  showOnlyToAdmins = false;
  debug4All = false;
  debugForUsers = false;

  constructor() {
    super(...arguments);    

    this.showOnlyToAdmins = settings?.enable_component_only_for_admins; //from settings.yml
    this.debugForAdmins = settings?.enable_debug_for_admins; //from settings.yml
    this.debug4All = settings?.enable_debug_for_all; //from settings.yml    

    this.debugForUsers = settings?.enable_debug_for_user_ids; //from settings.yml
    var debugForIDs = (this.debugForUsers) ? this.debugForUsers.split("|") : null;
    
    this.debug = false;
    
    //Discourse.User.currentProp('admin')
    
    if(Discourse.User.currentProp('admin') && this.debugForAdmins){ this.debug = true; }
    if(debugForIDs && debugForIDs.includes(Discourse.User.currentProp('id').toString())) { this.debug = true; }
    if(this.debug4All){ this.debug = true; }
    if(this.debug){ console.log('component gamification constructor:'); }
    
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
    const count = this.args?.params?.count || 5;
    if(this.debug){ console.log('changePeriod:' + period);  }

    return ajax(
      `/leaderboard/${this.gamificatinObj.leaderboard.id}?period=${this.period}`
    )
      .then((result) => {
        if (result.users.length === 0) {
          this.canLoadMore = false;
        }
        this.page = 1;
        this.gamificatinObj.users = result.users.slice(0, count);
      })
      .finally(() => this.loading = false)
      .catch(popupAjaxError);
  }

  @action
  scoreForWeek(event){
    event?.preventDefault();
    if(this.debug){       
      changePeriod('weekly');
    }
  }

  @action
  scoreForAll(event){
    event?.preventDefault();
    if(this.debug){ 
      changePeriod('all');
    }
  }

  willDestroy() {
    this.gamificatinObj = null;
  }
};
