import Category from "discourse/models/category";
import getURL from "discourse-common/lib/get-url";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { inject as service } from "@ember/service";
import User from "discourse/models/user";

export default class CategoryTopics extends Component {
  @service store;

  @tracked topics = null;
  @tracked category = null;
  @tracked thumb = null;
  @tracked all_items_label = null;

  debug = false;
  component_debug = false;
  debug4All = false;
  debugForUsers = false;

  constructor() {
    super(...arguments);

    // set debug from settings 
    this.component_debug = settings?.enable_debug_for_category_topics_component; //from settings.yml   
    this.debugForAdmins = settings?.enable_debug_for_admins; //from settings.yml
    this.debug4All = settings?.enable_debug_for_all; //from settings.yml    
    this.debugForUsers = settings?.enable_debug_for_user_ids; //from settings.yml
    var debugForIDs = (this.debugForUsers) ? this.debugForUsers.split("|") : null;    
    this.debug = false;
    
    if(this.component_debug){ this.debug = true; } else { this.debug = false; }

    const currentUser = User.current();
    if(this.component_debug && currentUser.admin && this.debugForAdmins){ this.debug = true; }
    if(this.component_debug && debugForIDs && debugForIDs.includes(currentUser.id.toString())) { this.debug = true; }
    if(this.component_debug && this.debug4All){ this.debug = true; }    
    
    // read params from the Component settings
    const count = parseInt(this.args?.params?.count,10) || 10; // count : of topics to show
    const categoryId = parseInt(this.args?.params?.id, 10); // id:  of category
    this.thumb = this.args?.params?.thumb || null; // thumb : url string
    this.all_items_label = this.args?.params?.all_items_label || null; // all_items_label : text for the all items label

    if(this.debug){ 
      console.log('Category Topics constructor:'); 
      console.log('count: ', count);
      console.log('categoryId: ', categoryId);      
      console.log('thumb: ', this.thumb);
      console.log('all_items_label: ', this.all_items_label); 
    }  

    if (!categoryId) {
      return;
    }

    const filter = "c/" + categoryId;
    this.category = Category.findById(categoryId);

    if(this.debug){       
      console.log('category: ', this.category);      
    } 

    this.store.findFiltered("topicList", { filter }).then((result) => {
      var results = result.topic_list.topics;

      results.forEach((topic) => {
        topic.url = `${getURL("/t/")}${topic.slug}/${topic.id}`;
        if (topic.last_read_post_number > 0) {
          topic.url += `/${topic.last_read_post_number}`;
        }
        // Update the title to remove 'XYZ' string
        topic.title = topic.title.replace(/Cooking Tips with Jon Ramsey /g, '');  
      });

      this.topics = results.slice(0, count);

      if(this.debug){ 
        console.log('topics: ', this.topics);
      }

    });

  }

  willDestroy() {
    this.topics = null;
  }
}
