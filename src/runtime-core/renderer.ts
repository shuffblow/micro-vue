import { effect } from "../reactivity/effect";
import { isObject } from "../shared";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";


export function createRenderer(options) {
    const { hostCreateElement, hostPatchProps, hostInsert, hostRemove, hostSetElementText } = options;

    function render(vnode, container) {
        // 调用patch方法(方便后续递归处理)
        patch(null, vnode, container, null, null);
    }

    // n1->old vnode,n2->new vnode
    function patch(n1, n2, container, parentComponent,anchor) {
        // 去处理组件
        // TODO 判断是不是element类型,如何区分是elenment类型还是component类型
        // processElement(vnode, container);

        //  Fragment -> 只渲染所有children
        const { type, shapeFlag } = n2;
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent,anchor)
                break;

            case Text:
                processText(n1, n2, container)
                break;


            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent,anchor);
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent,anchor);
                }
                break;
        }

    }

    function processFragment(n1, n2: any, container: any, parentComponent,anchor) {
        mountChildren(n2, container, parentComponent,anchor);
    }

    function processText(n1, n2: any, container: any) {
        const { children } = n2;
        const textNode = (n2.el = document.createTextNode(children));
        container.append(textNode)

    }

    function processElement(n1, n2: any, container: any, parentComponent,anchor) {
        if (!n1) {
            mountElement(n2, container, parentComponent,anchor);
        } else {
            patchElement(n1, n2, container,parentComponent,anchor);
        }

    }

    function patchElement(n1, n2, container,parentComponent,anchor) {
        console.log("patchElemnt");
        console.log("n1-", n1);
        console.log("n2-", n2);

        const el = (n2.el = n1.el);

        const oldProps = n1.props || {};
        const newProps = n2.props || {};

        patchChildren(n1,n2,el,parentComponent,anchor);
        patchProps(el,oldProps,newProps);
    }

    function patchChildren(n1: any, n2: any,container,parentComponent,anchor) {
        const prevShapeFlag = n1.shapeFlag;
        const shapeFlag = n2.shapeFlag;
        const c2 = n2.children;
        const c1 = n1.children;

        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
                // 1. 把老的children清空
                unmountChildren(n1.children);
            }
            if(c1 !== c2){
                // 2.设置text
                hostSetElementText(container, c2);
            }
        }else{
            if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){
                hostSetElementText(container,"");
                mountChildren(c2, container, parentComponent,anchor);
            }else{
                // array diff children
                patchKeyedChildren(c1,c2,container,parentComponent,anchor);
            }
        }
    }
    

    function patchKeyedChildren(c1,c2,container,parentComponent,parentAnchor) {
        let i = 0;
        const l2 = c2.length;
        let e1 = c1.length - 1;
        let e2 = l2 - 1;

        function isSameVnodeType(n1: any, n2: any) {
            return n1.type === n2.type && n1.key === n2.key;
        }

        // 左侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = c2[i];
            if(isSameVnodeType(n1,n2)){
                patch(n1,n2,container,parentComponent,parentAnchor)
            }else{
                break;
            }

            i++;
        }

        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];
            if(isSameVnodeType(n1,n2)){
                patch(n1,n2,container,parentComponent,parentAnchor)
            }else{
                break;
            }

            e1--;
            e2--;
        }

        // 新的比老的长 创建节点
        if(i > e1){
            if(i <= e2){
                const nextPos = i + 1;
                const anchor = i+1 < l2 ? c2[nextPos].el : null;
                while(i <= e2){
                    patch(null,c2[i],container,parentComponent,anchor);
                    i++;
                }
            }
        }else if(i > e2){
            // 老的比新的长 删除节点
            while(i <= e1){
                hostRemove(c1[i].el);
                i++;
            }
        }



    }



    function unmountChildren(children){
        for(let i = 0; i < children.length; i++){
            const el = children[i].el;
            hostRemove(el);
        }
    }

    function patchProps(el,oldProps,newProps){
        if(oldProps !== newProps){
            for (const key in newProps) {
                const prevProp = oldProps[key];
                const nextProp = newProps[key]; 
    
                if(prevProp !== nextProp){
                    hostPatchProps(el,key,prevProp,nextProp);
                }
            }
    
            for(const key in oldProps){
                if(!(key in newProps)){
                    hostPatchProps(el,key,oldProps[key],null);
                }
            }
        }

    }

    function mountElement(vnode: any, container: any, parentComponent,anchor) {

        // createElement
        const el = (vnode.el = hostCreateElement(vnode.type));

        // string array
        const { children, shapeFlag } = vnode;
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children;
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(vnode.children, el, parentComponent,anchor)
        }

        // props
        const { props } = vnode;
        for (const key in props) {
            const val = props[key];

            hostPatchProps(el, key, null, val)

        }

        hostInsert(el, container,anchor)
    }

    function mountChildren(children, container, parentComponent,anchor) {
        // children里面每个都是一个vnode，每个都要调用patch
        children.forEach((v) => {
            patch(null, v, container, parentComponent,anchor)
        })
    }

    function processComponent(n1, n2: any, container: any, parentComponent,anchor) {
        mountComponent(n2, container, parentComponent,anchor);
    }
    function mountComponent(initialVnode: any, container: any, parentComponent,anchor) {
        const instance = createComponentInstance(initialVnode, parentComponent);
        setupComponent(instance);

        setupRenderEffect(instance, initialVnode, container,anchor);
    }

    function setupRenderEffect(instance: any, initialVnode, container, anchor) {
        effect(() => {

            if (!instance.isMounted) {
                // 进行元素的初始化
                const { proxy } = instance;
                const subTree = (instance.subTree = instance.render.call(proxy));
                console.log(subTree)
                // vnode -> patch
                // vnode -> element -> mountElement
                patch(null, subTree, container, instance,anchor)

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

                patch(prevSubTree, subTree, container, instance,anchor);
            }
        })
    }





    return {
        createApp: createAppAPI(render)
    }
}



