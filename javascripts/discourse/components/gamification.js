import Component from "@glimmer/component";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { popupAjaxError } from "discourse/lib/ajax-error";

/*
import { registerUnbound } from "discourse-common/lib/helpers";  
registerUnbound("helperIncrement", function(value){
  return parseInt(value) + 1;
});
*/

import { registerRawHelper } from "discourse-common/lib/helpers";
registerRawHelper("helperIncrement", function(value){
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

  //for algosec users show the regular users board too
  @tracked gamificatinObj_2 = null;
  @tracked period_2 = "monthly";
  @tracked activeMonthly_2 = true;
  @tracked activeAll_2 = false;
  @tracked loading_2 = false;
  @tracked canLoadMore_2 = true;

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
    this.debug = false;
    
    var debugForIDs = (this.debugForUsers) ? this.debugForUsers.split("|") : null; 
    
    var groups;
    
    //THE OLD WAY
    if (typeof Discourse?.User?.currentProp === 'function' && typeof Discourse?.User?.currentProp('admin') !== 'undefined') {
      if(Discourse.User.currentProp('admin') && this.debugForAdmins){ this.debug = true; }
      if(debugForIDs && debugForIDs.includes(Discourse.User.currentProp('id').toString())) { this.debug = true; }
      groups = Discourse.User.currentProp('groups');      
    } else if (typeof require?.('discourse/models/user')?.getUser === 'function') {
      //THE NEW WAY
      // Use getUser() method from discourse/models/user
      const { getUser } = require('discourse/models/user');      
      if(getUser().admin && this.debugForAdmins){ this.debug = true; }
      if(debugForIDs && debugForIDs.includes(getUser().id.toString())) { this.debug = true; }
      groups = getUser().groups;
    } else {
      console.warn('getUser not in discourse/models/user');
    }

    if (typeof groups !== 'object' && Object.prototype.toString.call(groups) !== '[object Object]') {
      groups = {};
    }

    if(this.debug4All){ this.debug = true; }
    if(this.debug){ 
      console.log('component gamification constructor:'); 
      console.log('User Groups:', groups); 
    }    

    this.isAlgoSecUser = checkIfGroupIsInUserGroups('algosec', groups) ;    
    if(this.debug){ 
      console.log('isAlgoSecUser:', this.isAlgoSecUser); 
    }

    var leaderboardURL = (this.isAlgoSecUser) ? `/leaderboard/4?period=${this.period}`:`/leaderboard/?period=${this.period}`;
    var secondboardURL = (this.isAlgoSecUser) ? `/leaderboard/?period=${this.period_2}` : false;

    ajax(leaderboardURL)
    .then((scores) => {
        this.gamificatinObj = scores;
        this.gamificatinObj.users = scores.users.slice(0, this.maxUsersToShow);
        //console.log(scores);
      }
    );   

    if(secondboardURL !== false){
      ajax(secondboardURL)
      .then((scores) => {
          this.gamificatinObj_2 = scores;
          this.gamificatinObj_2.users = scores.users.slice(0, this.maxUsersToShow);
          //console.log(scores);
        }
      );  
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

  _changePeriod_2(period) {    
    this.period_2 = period;
    if(this.debug){ console.log('changePeriod:' + period);  }

    return ajax(
      `/leaderboard/${this.gamificatinObj_2.leaderboard.id}?period=${this.period_2}`
    )
      .then((result) => {
        if(this.debug){ console.log(result);  }
        if (result.users.length === 0) {
          this.canLoadMore_2 = false;
        }
        this.page_2 = 1;
        this.gamificatinObj_2 = result;
        this.gamificatinObj_2.users = result.users.slice(0, this.maxUsersToShow);
      })
      .finally(() => this.loading_2 = false)
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

  @action
  scoreForMonth_2(event){
    event?.preventDefault();
    this.activeMonthly_2 = true; this.activeAll_2 = false;  
    this._changePeriod_2('monthly');    
  }

  @action
  scoreForAll_2(event){
    event?.preventDefault();
    this.activeMonthly_2 = false; this.activeAll_2 = true;
    this._changePeriod_2('all');    
  }


  willDestroy() {
    this.gamificatinObj = null;
  }
};
