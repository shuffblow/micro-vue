import { h,createTextVNode } from "../../lib/guide-micro-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export const App = {
    render(){
        const app = h("p",{},"app")
        const foo = h(
            Foo,
            {},
            {
                header :  () => [
                    h("p",{},"header"),
                    createTextVNode("你好呀")
            ],
                footer: (age) => h("p", {}, "footer" + age)
            })
        // ui
        return h(
            "div", {}, [app,foo]
        );
    },

    setup(){
        // composition api
        return {
        }
    }
}