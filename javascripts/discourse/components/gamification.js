import Component from "@glimmer/component";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { registerUnbound } from "discourse-common/lib/helpers";

registerUnbound("inc", function(value){
  return parseInt(value) + 1;
});


export default class Gamification extends Component {
  @tracked page = 1;
  @tracked loading = false;
  @tracked canLoadMore = true;
  @tracked gamificatinObj = null;
  @tracked period = "weekly";
  @tracked activeWeekly = true;
  @tracked activeAll = false;

  debug = false;
  showOnlyToAdmins = false;
  debug4All = false;
  debugForUsers = false;

  maxUsersToShow = 8; //update teh CSS for the badge hiding if above 10

  objectifyResponse(response){
    let info = {};
    let keys = response.columns;
    let values = response.rows[0];
    for(var i = 0; i < keys.length; i++){ info[keys[i]] = values[i]; }
    return info;
};

  getUserAlgoBadge(user_id){
    var info = {};
    ajax(`/admin/plugins/explorer/queries/11/run`, {
      type: "POST",
      headers: { "Api-Username": "system", "Api-Key": "d0082b555db3459e85fee2d29b29b79edc689d8767a80fef33761ef16869d83c" }, //Data Explorer Ready Only - query 11
      data: {"params": "{\"user_id\": \""+user_id+"\"}" }
    })
    .then((response) => {        
      //console.log(response);
      info = this.objectifyResponse(response);    
    }).finally(() => {
      return info;
    })
    .catch(() => { });  
  }

  constructor() {
    super(...arguments);    

    this.showOnlyToAdmins = settings?.enable_component_only_for_admins; //from settings.yml
    this.debugForAdmins = settings?.enable_debug_for_admins; //from settings.yml
    this.debug4All = settings?.enable_debug_for_all; //from settings.yml    
    this.debugForUsers = settings?.enable_debug_for_user_ids; //from settings.yml
    var debugForIDs = (this.debugForUsers) ? this.debugForUsers.split("|") : null;    
    this.debug = false;
    
    if(Discourse.User.currentProp('admin') && this.debugForAdmins){ this.debug = true; }
    if(debugForIDs && debugForIDs.includes(Discourse.User.currentProp('id').toString())) { this.debug = true; }
    if(this.debug4All){ this.debug = true; }
    if(this.debug){ console.log('component gamification constructor:'); }    

    ajax(`/leaderboard/?period=${this.period}`)
    .then((scores) => {
        this.gamificatinObj = scores;
        this.gamificatinObj.users = scores.users.slice(0, this.maxUsersToShow);
        //console.log(scores);
      }
    );

    if(this.debug){
      let algoBadge = this.getUserAlgoBadge(2);
      console.log(algoBadge);
    }

  }

  _changePeriod(period) {    
    this.period = period;
    if(this.debug){ console.log('changePeriod:' + period);  }

    return ajax(
      `/leaderboard/${this.gamificatinObj.leaderboard.id}?period=${this.period}`
    )
      .then((result) => {
        if(this.debug){ console.log(result);  }
        if (result.users.length === 0) {
          this.canLoadMore = false;
        }
        this.page = 1;
        this.gamificatinObj = result;
        this.gamificatinObj.users = result.users.slice(0, this.maxUsersToShow);
      })
      .finally(() => this.loading = false)
      .catch(popupAjaxError);
  }

  @action
  scoreForWeek(event){
    event?.preventDefault();
    this.activeWeekly = true; this.activeAll = false;  
    this._changePeriod('weekly');    
  }

  @action
  scoreForAll(event){
    event?.preventDefault();
    this.activeWeekly = false; this.activeAll = true;
    this._changePeriod('all');    
  }

  willDestroy() {
    this.gamificatinObj = null;
  }
};
