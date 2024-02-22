import { isObject } from "../shared";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container){
    // 调用patch方法(方便后续递归处理)
    patch(vnode, container);
}

function patch(vnode, container){
    // 去处理组件
    // TODO 判断是不是element类型,如何区分是elenment类型还是component类型
    // processElement(vnode, container);
    if(typeof vnode.type === "string"){
        processElement(vnode, container);
    }else if(isObject(vnode.type)){
        processComponent(vnode, container);
    }
    
}

function processElement(vnode: any, container: any) {
    mountElement(vnode,container);
}

function mountElement(vnode: any, container: any) {
    const el = document.createElement(vnode.type);

    // string array
    const {children} = vnode;
    if(typeof children === "string"){
        el.textContent = children;
    }else if(Array.isArray(children)){
        mountChildren(vnode, el)
    }

    // props
    const {props} = vnode;
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }

    container.append(el);
}

function mountChildren(vnode, container){
        // children里面每个都是一个vnode，每个都要调用patch
        vnode.children.forEach((v)=>{
            patch(v, container)
        })
}

function processComponent(vnode: any, container: any) {
    mountComponent(vnode,container);
}
function mountComponent(vnode: any,container:any) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);

    setupRenderEffect(instance,container);
}

function setupRenderEffect(instance,container) {
    const subTree = instance.render();

    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree,container)
}



