import { effect } from "../reactivity/effect";
import { isObject } from "../shared";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";


export function createRenderer(options) {
    const { createElement, patchProps, insert } = options;

    function render(vnode, container) {
        // 调用patch方法(方便后续递归处理)
        patch(null, vnode, container, null);
    }

    // n1->old vnode,n2->new vnode
    function patch(n1, n2, container, parentComponent) {
        // 去处理组件
        // TODO 判断是不是element类型,如何区分是elenment类型还是component类型
        // processElement(vnode, container);

        //  Fragment -> 只渲染所有children
        const { type, shapeFlag } = n2;
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent)
                break;

            case Text:
                processText(n1, n2, container)
                break;


            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent);
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent);
                }
                break;
        }

    }

    function processFragment(n1, n2: any, container: any, parentComponent) {
        mountChildren(n2, container, parentComponent);
    }

    function processText(n1, n2: any, container: any) {
        const { children } = n2;
        const textNode = (n2.el = document.createTextNode(children));
        container.append(textNode)

    }

    function processElement(n1, n2: any, container: any, parentComponent) {
        if (!n1) {
            mountElement(n2, container, parentComponent);
        } else {
            patchElement(n1, n2, container);
        }

    }

    function patchElement(n1, n2, container) {
        console.log("patchElemnt");
        console.log("n1-", n1);
        console.log("n2-", n2);
    }

    function mountElement(vnode: any, container: any, parentComponent) {

        // createElement
        const el = (vnode.el = createElement(vnode.type));

        // string array
        const { children, shapeFlag } = vnode;
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children;
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(vnode, el, parentComponent)
        }

        // props
        const { props } = vnode;
        for (const key in props) {
            const val = props[key];

            patchProps(el, key, val)

        }

        insert(el, container)
    }

    function mountChildren(vnode, container, parentComponent) {
        // children里面每个都是一个vnode，每个都要调用patch
        vnode.children.forEach((v) => {
            patch(null, v, container, parentComponent)
        })
    }

    function processComponent(n1, n2: any, container: any, parentComponent) {
        mountComponent(n2, container, parentComponent);
    }
    function mountComponent(initialVnode: any, container: any, parentComponent) {
        const instance = createComponentInstance(initialVnode, parentComponent);
        setupComponent(instance);

        setupRenderEffect(instance, initialVnode, container);
    }

    function setupRenderEffect(instance: any, initialVnode, container) {
        effect(() => {

            if (!instance.isMounted) {
                // 进行元素的初始化
                const { proxy } = instance;
                const subTree = (instance.subTree = instance.render.call(proxy));
                console.log(subTree)
                // vnode -> patch
                // vnode -> element -> mountElement
                patch(null, subTree, container, instance)

                // 所有element都已经处理完成
                initialVnode.el = subTree.el
                instance.isMounted = true;
            } else {
                // 第一次才执行上面的初始化代码，之后都是执行下面的update逻辑
                console.log("update")
                const { proxy } = instance;
                const subTree = instance.render.call(proxy);
                const prevSubTree = instance.subTree;
                instance.subTree = subTree;

                patch(prevSubTree, subTree, container, instance);
            }
        })
    }





    return {
        createApp: createAppAPI(render)
    }
}
