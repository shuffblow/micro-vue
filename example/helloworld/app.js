import { h } from "../../lib/guide-micro-vue.esm.js";
import { Foo } from "./Foo.js";
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
                onClick(){
                    console.log("click");
                }
            },
            // "hi, " + this.msg
            [
                h("div",{}, "hi,"+this.msg), 
                h(Foo, {
                    count:1
                })
            ]
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