import { Fragment, createVNode } from "../vnode";

export function renderSlots(slots,name,props){
    const slot = slots[name];

    if(slot){
        // slot作用域插槽时，是一个function
        if(typeof slot === "function"){
            return createVNode(Fragment, {}, slot(props))
        }
    }

}