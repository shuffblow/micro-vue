import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container){
    // 调用patch方法(方便后续递归处理)
    patch(vnode, container);
}

function patch(vnode, container){
    // 去处理组件
    // TODO 判断是不是element类型,如何区分是elenment类型还是component类型
    processElement(vnode, container)
    processComponent(vnode, container);
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

