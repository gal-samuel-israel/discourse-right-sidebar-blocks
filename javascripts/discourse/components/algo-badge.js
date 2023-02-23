import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { empty, equal, notEmpty } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { ajax } from "discourse/lib/ajax";

export default class AlgoBadge extends Component {
  @service site;
  
  @notEmpty("args.userId")
  userIdIsSet;

  @tracked badgeRequest = null;
  @tracked algoBadgeInfo = null;
  @tracked algoBadgeName = null;
  @tracked algoBadgeUrl = null;
  @tracked algoBadgeGrants = null;

  component_enable = false;
  debug = false;
  component_debug = false;
  showOnlyToAdmins = false;
  debug4All = false;
  debugForUsers = false;

  objectifyResponse(response){    
    var info = {};
    var keys = response.columns;
    var values = response.rows[0];
    for(var i = 0; i < keys.length; i++){ info[keys[i]] = values[i]; }
    //if(this.debug){console.log('objectifyResponse: ',info);} 
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
        if (response?.rows?.length !== 0) {
          var obj = this.objectifyResponse(response);          
          if(this.debug){console.log(obj);}
          /* {
            "user_id": 35,
            "badges": "[\"111,Apprentice\"]",
            "image_upload_id": "[145]",
            "urls": "[\"//cdck-file-uploads-europe1.s3.dualstack.eu-west-1.amazonaws.com/business20/uploads/algosec/original/1X/f716bd5a19db9db7aa93cba8eb0406405ba98e8e.png\"]"
          } */
          this.algoBadgeInfo = true;
          let badges = JSON.parse(obj.badges);
          let badgeArr = badges[0].split(',');
          this.algoBadgeName = badgeArr[1];  
          let urls = JSON.parse(obj.urls);        
          this.algoBadgeUrl = urls[0];
          this.algoBadgeGrants = '/badges/'+badgeArr[0]+'/apprentice';
        } 
    });
  }

  constructor() {
    super(...arguments);

    this.component_enable = settings?.enable_algobadge_component; //from settings.yml
    this.component_debug = settings?.enable_debug_for_algobadge_component; //from settings.yml
    this.showOnlyToAdmins = settings?.enable_component_only_for_admins; //from settings.yml
    this.debugForAdmins = settings?.enable_debug_for_admins; //from settings.yml
    this.debug4All = settings?.enable_debug_for_all; //from settings.yml    
    this.debugForUsers = settings?.enable_debug_for_user_ids; //from settings.yml
    var debugForIDs = (this.debugForUsers) ? this.debugForUsers.split("|") : null;    
    this.debug = false;
    
    if(Discourse.User.currentProp('admin') && this.debugForAdmins){ this.debug = true; }
    if(debugForIDs && debugForIDs.includes(Discourse.User.currentProp('id').toString())) { this.debug = true; }
    if(this.debug4All){ this.debug = true; }
    if(this.component_debug){ this.debug = true; } else { this.debug = false; } 
    if(this.debug){ console.log('algoBadge constructor:', this.args?.userId, this.userIdIsSet); }  

    var showOnlyForAdmins = this.showOnlyToAdmins && !Discourse.User.currentProp('admin');

    if(this.component_enable && this.userIdIsSet && !showOnlyForAdmins){      
      this.getUserAlgoBadge(this.args?.userId)
      .then(() => {
        if(this.debug){ console.log('done:', this.args.userId);}
      });   
    }
    
  }

  willDestroy() {
    this.algoBadge = null;
  }
}
