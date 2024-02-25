import { h,createTextVNode, getCurrentInstance,provide,inject } from "../../lib/guide-micro-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export const Provider = {
    name:"Provider",
    setup(){
        const foo = provide("foo", "fooVal");
        const bar = provide("bar", "barVal");
        return {}
    },
    render(){
        return h("div",{},[h("div",{},"Provider"),h(ProviderTwo)])
    }
}

export const ProviderTwo = {
    name:"Provider2",
    setup(){
        provide("foo","fooTwo");
        const foo2 = inject("foo");
        return {foo2}
    },
    render(){
        return h("div",{},[h("div",{},"Provider"),h(Consumer)])
    }
}

export const Consumer = {
    name:"Consumer",
    setup(){
        const foo = inject("foo");
        const bar = inject("bar");
        const baz = inject("baz", () => "bazDefault")
        return {foo,bar,baz};
    },
    render(){
        return h("div",{},"Consumer-"+this.foo+"-"+this.bar+"-"+this.baz)
    }
}

export const App = {
    render(){
        const app = h("p",{},"app")
        const foo = h(
            Foo,
            {},
            {
                header :  () => [
                    h("p",{},"header"),
                    createTextVNode("你好呀"),
            ],
                footer: (age) => h("p", {}, "footer" + age)
            })
        // ui
        return h(
            "div", {}, [app,foo,h(Provider)]
        );
    },

    setup(){
        const instance = getCurrentInstance()
        console.log("App:", instance)
        // composition api
        return {}
    }
}