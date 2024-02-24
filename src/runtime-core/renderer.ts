import { isObject } from "../shared";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment,Text } from "./vnode";

export function render(vnode, container){
    // 调用patch方法(方便后续递归处理)
    patch(vnode, container);
}

function patch(vnode, container){
    // 去处理组件
    // TODO 判断是不是element类型,如何区分是elenment类型还是component类型
    // processElement(vnode, container);

    //  Fragment -> 只渲染所有children
    const {type, shapeFlag} = vnode;
    switch (type) {
        case Fragment:
            processFragment(vnode, container)
            break;

        case Text:
            processText(vnode, container)
            break;
    
    
        default:
            if(shapeFlag & ShapeFlags.ELEMENT){
                processElement(vnode, container);
            }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
                processComponent(vnode, container);
            }
            break;
    }
    
}

function processElement(vnode: any, container: any) {
    mountElement(vnode,container);
}

function mountElement(vnode: any, container: any) {
    const el = (vnode.el = document.createElement(vnode.type));

    // string array
    const {children, shapeFlag} = vnode;
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
        el.textContent = children;
    }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
        mountChildren(vnode, el)
    }

    // props
    const {props} = vnode;
    for (const key in props) {
        const val = props[key];

        const isOn = (key:string) => /^on[A-Z]/.test(key);
        if(isOn(key)){
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, val)
        }else{
            el.setAttribute(key, val);
        }

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
function mountComponent(initialVnode: any,container:any) {
    const instance = createComponentInstance(initialVnode);
    setupComponent(instance);

    setupRenderEffect(instance,initialVnode, container);
}

function setupRenderEffect(instance, initialVnode, container) {
    const {proxy} = instance;
    const subTree = instance.render.call(proxy);

    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree,container)

    // 所有element都已经处理完成
    initialVnode.el = subTree.el
}



function processFragment(vnode: any, container: any) {
    mountChildren(vnode, container);
}

function processText(vnode: any, container: any) {
    const {children} = vnode;
    const textNode = (vnode.el = document.createTextNode(children)) ;
    container.append(textNode)

}

