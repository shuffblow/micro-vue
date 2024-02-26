import { h,ref } from "../../lib/guide-micro-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export const App = {
    render(){
        window.self = this;
        // ui
        return h(
            "div", {
                id:"root"
            }, [
                h("div",{},"count:"+this.foo),
                h("button",{
                    onClick: this.onClick
                },
                "click"),
                h("button", {

                })
            ]
            // [h("p", {class:"red"}, "hi"), h("p", {class:"blue"}, "micro-vue")]
        );
    },

    setup(){
        // composition api
        const foo = ref(0);
        const onClick = () => {
            foo.value++;
        }
        const props = ref({
            foo:"foo",
            bar:"bar"
        })
        const onChangePropsDemo1 = ()=>{
            props.value.foo = "new-foo";
        };

        const onChangePropsDemo2 = ()=>{
            props.value.foo = undefined;
        };

        const onChangePropsDemo3 = ()=>{
            props.value = {
                foo:"foo",
            };
        };
        
        return {
            msg: "micro-vue",
            foo,
            props,
            onClick
        }
    }
}