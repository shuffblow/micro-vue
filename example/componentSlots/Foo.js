import { h,renderSlots } from "../../lib/guide-micro-vue.esm.js";
export const Foo = {
    setup(props,{emit}){
        {}
    },
    render(){
        const foo = h("p", {}, "foo")
        console.log(this.$slots)
        // 具名插槽，获取到要渲染的元素，获取到要渲染的位置
        // 作用域插槽
        const age = 18;
        return h("div",{},[renderSlots(this.$slots, "footer", age), foo, renderSlots(this.$slots, "header")])
    }
}