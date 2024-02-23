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
                        console.log("onAdd",a,b);
                    },
                    onAddFoo(){
                        console.log("onAddFoo")
                    }
                })
            ]
        );
    },

    setup(){
        // composition api
        return {
            msg: "micro-vue",
        }
    }
}