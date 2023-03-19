import Component from "@glimmer/component";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { registerUnbound } from "discourse-common/lib/helpers";

registerUnbound("inc", function(value){
  return parseInt(value) + 1;
});

const  checkIfGroupIsInUserGroups = function (group, arrGroups) {
  return arrGroups.some(function(el) {
    return el.name.toLowerCase() === group;
  }); 
}

export default class Gamification extends Component {
  @tracked page = 1;
  @tracked loading = false;
  @tracked canLoadMore = true;
  @tracked gamificatinObj = null;
  @tracked period = "monthly";
  @tracked activeMonthly = true;
  @tracked activeAll = false;

  debug = false;
  showOnlyToAdmins = false;
  debug4All = false;
  debugForUsers = false;

  maxUsersToShow = 8; //update teh CSS for the badge hiding if above 10

  isAlgoSecUser = false;

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
    if(this.debug){ 
      console.log('component gamification constructor:'); 
      console.log('curerntUser groups:', Discourse.User.currentProp('groups'));
    }    

    this.isAlgoSecUser = checkIfGroupIsInUserGroups('algosec', Discourse.User.currentProp('groups')) ;
    if(this.debug){ console.log('isAlgoSecUser:', this.isAlgoSecUser); }

    var leaderboardURL = (this.isAlgoSecUser) ? `/leaderboard/4?period=${this.period}`:`/leaderboard/?period=${this.period}`;

    ajax(leaderboardURL)
    .then((scores) => {
        this.gamificatinObj = scores;
        this.gamificatinObj.users = scores.users.slice(0, this.maxUsersToShow);
        //console.log(scores);
      }
    );   

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
  scoreForMonth(event){
    event?.preventDefault();
    this.activeMonthly = true; this.activeAll = false;  
    this._changePeriod('monthly');    
  }

  @action
  scoreForAll(event){
    event?.preventDefault();
    this.activeMonthly = false; this.activeAll = true;
    this._changePeriod('all');    
  }

  willDestroy() {
    this.gamificatinObj = null;
  }
};
