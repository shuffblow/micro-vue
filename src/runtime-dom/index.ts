import { createRenderer } from "../runtime-core";


function createElement(type) {
    return document.createElement(type);
}

function patchProps(el, key, preVal, nextVal) {
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, nextVal)
    } else {
        if(nextVal === undefined || nextVal === null){
            el.removeAttribute(key);
        }else{
            el.setAttribute(key, nextVal);
        }

    }
}

function insert(el, parent,anchor) {
    // parent.append(el);
    parent.insertBefore(el,anchor || null)
}

function remove(child){
    const parent = child.parentNode;
    if(parent){
        parent.removeChild(child);
    }
}

function setElementText(el,text){
    el.textContent = text;
}

const renderer:any = createRenderer({
    hostCreateElement:createElement,
    hostPatchProps:patchProps,
    hostInsert:insert,
    hostRemove:remove,
    hostSetElementText:setElementText
})

export function createApp(...args) {
    return renderer.createApp(...args);
}

export * from "../runtime-core"