import Component from "@glimmer/component";
import { getOwner } from "@ember/application";
import { tracked } from "@glimmer/tracking";

export default class RightSidebarBlocks extends Component {
  @tracked blocks = [];
  debugForAdmins = false;

  constructor() {
    this.debugForAdmins = settings?.enable_debug_for_admins; //from settings.yml
    super(...arguments);

    const blocksArray = [];

    JSON.parse(settings.blocks).forEach((block) => {
      if (getOwner(this).hasRegistration(`component:${block.name}`)) {
        block.classNames = `rs-component rs-${block.name}`;
        block.parsedParams = {};
        if (block.params) {
          block.params.forEach((p) => {
            block.parsedParams[p.name] = p.value;
          });
        }
        if (this.debugForAdmins) {
          console.log(`Block "${block.name}" parsedParams:`, block.parsedParams);
        }
        blocksArray.push(block);
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `The component "${block.name}" was not found, please update the configuration for discourse-right-sidebar-blocks.`
        );
      }
    });

    this.blocks = blocksArray;
  }
}
