import { h } from "../../lib/guide-micro-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export const App = {
    render(){
        window.self = this;
        // ui
        return h(
            "div", {}, [
                h("div",{},"App"),
                h(Foo, {
                    // on+Event
                    onAdd(a,b){
                        console.log(a,b);
                    }
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