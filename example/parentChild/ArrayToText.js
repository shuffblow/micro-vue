import { h,ref } from "../../lib/guide-micro-vue.esm.js";
const prevChild = "prevChild";
const nextChild = [h("div",{},"A"),h("div",{},"B")];
export const ArrayToText = {
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