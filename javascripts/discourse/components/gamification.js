import Component from "@glimmer/component";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { popupAjaxError } from "discourse/lib/ajax-error";
import User from "discourse/models/user";

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

    this.component_debug = settings?.enable_debug_for_gamification_component; //from settings.yml 
    this.showOnlyToAdmins = settings?.enable_component_only_for_admins; //from settings.yml
    this.debugForAdmins = settings?.enable_debug_for_admins; //from settings.yml
    this.debug4All = settings?.enable_debug_for_all; //from settings.yml    
    this.debugForUsers = settings?.enable_debug_for_user_ids; //from settings.yml       
    this.debug = false;
    
    var debugForIDs = (this.debugForUsers) ? this.debugForUsers.split("|") : null; 
    
    var groups;
    
    const currentUser = User.current();
    if(this.component_debug && currentUser.admin && this.debugForAdmins){ this.debug = true; }
    if(this.component_debug && debugForIDs && debugForIDs.includes(currentUser.id.toString())) { this.debug = true; }
    if(this.component_debug && this.debug4All){ this.debug = true; } 

    groups = currentUser.groups;
    if (typeof groups !== 'object' && Object.prototype.toString.call(groups) !== '[object Object]') {
      groups = {};
    }

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
