import { h,ref } from "../../lib/guide-micro-vue.esm.js";
const prevChild = [
    h("div",{key:"A"},"A"),
    h("div",{key:"B"},"B"),
    h("div",{key:"C"},"C"),
    h("div",{key:"D"},"D"),
    h("div",{key:"E"},"E"),
];
const nextChild = [
    h("div",{key:"A"},"A"),
    h("div",{key:"B"},"B"),
    h("div",{key:"C"},"C"),


];
export const ArrayToArray = {
    render(){
        const self = this;
        return self.isChange === true
        ? h("div",{},nextChild)
        : h("div",{},prevChild);
    },

    setup(){
        const isChange = ref(false);
        window.isChange = isChange;

        return{
            isChange
        }
    }
}