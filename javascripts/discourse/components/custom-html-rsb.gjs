// custom-html-rsb.gjs
import { htmlSafe } from "@ember/template";

// This is a tiny, template‑only component:
// Ember/Discourse will render {{htmlSafe @content}} whenever
// block.name === "custom-html"
const CustomHtmlRsb = <template>{{htmlSafe @content}}</template>;

export default CustomHtmlRsb;