/*
DEPRECATED on April 2025
import { registerRawHelper } from "discourse-common/lib/helpers";

registerRawHelper("inc", incHelperFunction);

export default function incHelperFunction(value) {
    return parseInt(value) + 1;
}

GAL: replaced by this code and /common/assets.json was added
*/

import { helper } from "@ember/component/helper";

export default helper(function inc([value]) {
  return parseInt(value, 10) + 1;
});