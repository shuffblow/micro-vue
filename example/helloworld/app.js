import { h } from "../../lib/guide-micro-vue.esm.js";

export const App = {
    render(){
        // ui
        return h("div", "hi, " + this.msg);
    },

    setup(){
        // composition api
        return {
            msg: "micro-vue",
        }
    }
}