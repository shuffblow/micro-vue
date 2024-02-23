import { h } from "../../lib/guide-micro-vue.esm.js";

window.self = null;
export const App = {
    render(){
        window.self = this;
        // ui
        return h(
            "div", 
            {
                id: "root",
                class: ["red", "hard"],
            },
            "hi, " + this.msg
            // [h("p", {class:"red"}, "hi"), h("p", {class:"blue"}, "micro-vue")]
        );
    },

    setup(){
        // composition api
        return {
            msg: "micro-vue",
        }
    }
}