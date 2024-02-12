import {  mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHanddlers";

export const enum ReactiveFlags {
    IS_REACTIVE = "_v_isReactive",
    IS_READONLY = "_v_isReadonly"
}
export function reactive(raw){
    return createActiveObject(raw,mutableHandlers);
}

// reactive的只读版本
export function readonly(raw){
    return createActiveObject(raw,readonlyHandlers);
}

export function shallowReadonly(raw) {
    return createActiveObject(raw,shallowReadonlyHandlers);
}

export function isReactive(value){
    return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value){
    return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value){
    return isReactive(value) || isReadonly(value)
}
function createActiveObject(raw:any, baseHandlers){
    return new Proxy(raw,baseHandlers);
}