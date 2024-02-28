import { h,ref } from "../../lib/guide-micro-vue.esm.js";
import { ArrayToText } from "./ArrayToText.js";
window.self = null;
export const App = {
    render(){
        window.self = this;
        // ui
        return h(
            "div", {
                tId:1
            },[
                h("p",{},"主页"),
                h(ArrayToText)
            ]
        );
    },

    setup(){
    }
}