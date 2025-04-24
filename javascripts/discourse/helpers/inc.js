/*
DEPRECATED on April 2025
import { registerRawHelper } from "discourse-common/lib/helpers";

registerRawHelper("inc", incHelperFunction);

export default function incHelperFunction(value) {
    return parseInt(value) + 1;
}
*/
import { registerHelper } from "@ember/template/helpers";
//import { htmlSafe } from "@ember/template";

function incHelperFunction(value/*, options*/) {
  const result = parseInt(value, 10) + 1;
  return result; // Simple number case
  // return htmlSafe(result.toString()); // Only if you need HTML output
}

// Export both the function and initializer
export { incHelperFunction };

export default {
  name: "inc-helper",
  initialize(container) {
    registerHelper("inc", incHelperFunction);
  }
};