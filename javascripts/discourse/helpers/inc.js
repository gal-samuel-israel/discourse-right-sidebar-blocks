import { registerRawHelper } from "discourse-common/lib/helpers";

registerRawHelper("inc", incHelperFunction);

export default function incHelperFunction(value) {
    return parseInt(value) + 1;
}
