import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { empty, equal, notEmpty } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { ajax } from "discourse/lib/ajax";

export default class AlgoBadge extends Component {
  @service site;
  
  @notEmpty("args.userId")
  userIdIsSet;

  @tracked algoBadge = null;

  debug = false;
  showOnlyToAdmins = false;
  debug4All = false;
  debugForUsers = false;

  objectifyResponse(response){    
    var info = {};
    var keys = response.columns;
    var values = response.rows[0];
    for(var i = 0; i < keys.length; i++){ info[keys[i]] = values[i]; }
    if(this.debug){console.log('objectifyResponse: ',info);} 
    return info;
  }

  async getUserAlgoBadge(user_id){ 
    if(this.debug){console.log('getUserAlgoBadge: '+ user_id);}  
    ajax(`/admin/plugins/explorer/queries/11/run`, {
      type: "POST",
      headers: { "Api-Username": "system", "Api-Key": "d0082b555db3459e85fee2d29b29b79edc689d8767a80fef33761ef16869d83c" }, //Data Explorer Ready Only - query 11
      data: {"params": "{\"user_id\": \""+user_id+"\"}"}
    })
    .then((response) => {        
      //if(this.debug){console.log(response);}
      return this.objectifyResponse(response);    
    });
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
    if(this.debug){ console.log('algoBadge constructor:', this.args?.userId, this.userIdIsSet); }  

    if(this.userIdIsSet){
      this.algoBadge = true;
      console.log(this.getUserAlgoBadge(this.args?.userId));      
    }
    
  }

  willDestroy() {
    this.algoBadge = null;
  }
}
