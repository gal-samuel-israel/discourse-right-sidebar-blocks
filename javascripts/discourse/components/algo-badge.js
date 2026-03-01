import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { empty, equal, notEmpty } from "@ember/object/computed";
import { service } from "@ember/service";
import { ajax } from "discourse/lib/ajax";
import User from "discourse/models/user";

const EXPLORER_BADGE_IDS = [
  108, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
  124, 125, 126, 127, 128,
];

export default class AlgoBadge extends Component {
  @service site;
  
  @notEmpty("args.userId")
  userIdIsSet;
  @notEmpty("args.username")
  usernameIsSet;

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
  useBadgesExplorerApi = true;

  objectifyResponse(response){    
    var info = {};
    var keys = response.columns;
    var values = response.rows[0];
    for(var i = 0; i < keys.length; i++){ info[keys[i]] = values[i]; }
    //if(this.debug){console.log('objectifyResponse: ',info);} 
    return info;
  }

  async getUserAlgoBadgeWithExplorer(user_id){ 
    if(this.debug){console.log('getUserAlgoBadgeWithExplorer: '+ user_id);}  
    return ajax(`/admin/plugins/discourse-data-explorer/queries/11/run`, { // was /explorer/
      type: "POST",
      headers: { "Api-Username": "system", "Api-Key": "d0082b555db3459e85fee2d29b29b79edc689d8767a80fef33761ef16869d83c" }, //Data Explorer Ready Only - query 11
      data: {"params": "{\"user_id\": \""+user_id+"\"}"}
    })
    .then((response) => {        
        //if(this.debug){console.log(response);}    
        if (response?.rows?.length !== 0) {
          var obj = this.objectifyResponse(response);          
          //TEST LOOP SOURCE//if(this.debug){console.log(obj);}
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

  async getUserAlgoBadgeWithCoreApi(username){
    if(this.debug){console.log('getUserAlgoBadgeWithCoreApi: '+ username);}
    return ajax(`/user-badges/${encodeURIComponent(username)}.json`, { type: "GET" })
      .then((response) => {
        const badges = response?.badges || [];
        const userBadges = response?.user_badges || [];
        if (badges.length === 0 || userBadges.length === 0) {
          return;
        }

        const badgeIdSet = new Set(EXPLORER_BADGE_IDS);
        const badgeById = new Map(
          badges.map((badge) => [Number(badge?.id), badge]).filter(([id]) => !Number.isNaN(id))
        );

        const matchingGrants = userBadges
          .filter((grant) => badgeIdSet.has(Number(grant?.badge_id)))
          .map((grant) => {
            const badgeId = Number(grant.badge_id);
            return { grant, badge: badgeById.get(badgeId) };
          })
          .filter((entry) => entry.badge?.image_url);

        if (matchingGrants.length === 0) {
          return;
        }

        // Explorer query uses array_agg without ORDER BY and then picks the first element.
        // Use a deterministic order that matches typical SQL output by badge_id.
        matchingGrants.sort((a, b) => {
          const badgeIdDelta = Number(a.grant.badge_id) - Number(b.grant.badge_id);
          if (badgeIdDelta !== 0) {
            return badgeIdDelta;
          }

          const grantIdDelta = Number(a.grant.id || 0) - Number(b.grant.id || 0);
          if (grantIdDelta !== 0) {
            return grantIdDelta;
          }

          return String(a.grant.granted_at || "").localeCompare(String(b.grant.granted_at || ""));
        });

        const selectedBadge = matchingGrants[0].badge;
        if (!selectedBadge?.id || !selectedBadge?.image_url) {
          return;
        }

        this.algoBadgeInfo = true;
        this.algoBadgeName = selectedBadge.name;
        this.algoBadgeUrl = selectedBadge.image_url;
        this.algoBadgeGrants = selectedBadge.slug
          ? `/badges/${selectedBadge.id}/${selectedBadge.slug}`
          : `/badges/${selectedBadge.id}`;
      });
  }

  async getUserAlgoBadge(user_id, username){
    if (this.useBadgesExplorerApi) {
      return this.getUserAlgoBadgeWithExplorer(user_id);
    }

    if (!username) {
      if (this.debug) {
        console.log("AlgoBadge: username missing while use_badges_explorer_api=false");
      }
      return;
    }

    return this.getUserAlgoBadgeWithCoreApi(username);
  }

  constructor() {
    super(...arguments);

    this.component_enable = settings?.enable_algobadge_component; //from settings.yml
    this.component_debug = settings?.enable_debug_for_algobadge_component; //from settings.yml
    this.showOnlyToAdmins = settings?.enable_component_only_for_admins; //from settings.yml
    this.debugForAdmins = settings?.enable_debug_for_admins; //from settings.yml
    this.debug4All = settings?.enable_debug_for_all; //from settings.yml    
    this.debugForUsers = settings?.enable_debug_for_user_ids; //from settings.yml
    this.useBadgesExplorerApi = settings?.use_badges_explorer_api ?? true; //from settings.yml
    var debugForIDs = (this.debugForUsers) ? this.debugForUsers.split("|") : null;    
    this.debug = false;
    
    if(this.component_debug){ this.debug = true; } else { this.debug = false; }

    var showOnlyForAdmins = false;

    const currentUser = User.current();
    if(this.component_debug && currentUser.admin && this.debugForAdmins){ this.debug = true; }
    if(this.component_debug && debugForIDs && debugForIDs.includes(currentUser.id.toString())) { this.debug = true; }

    if(this.component_debug && this.debug4All){ this.debug = true; }    
    if(this.debug){ console.log('algoBadge constructor:', this.args?.userId, this.args?.username, this.userIdIsSet, this.usernameIsSet); }   

    if(this.component_enable && this.userIdIsSet && !showOnlyForAdmins){      
      this.getUserAlgoBadge(this.args?.userId, this.args?.username)
      .then(() => {
        if(this.debug){ console.log('got badge for:', this.args.userId); }
      });   
    }
    
  }

  willDestroy() {
    this.algoBadge = null;
  }
}
