import { camelize, toHanlderKey } from "../shared";

export function emit(instance, event, ...args){
    console.log("emit", event)

    // 找到instance.props，找有没有对应的event函数
    const {props} = instance;
    // add -> onAdd


    debugger;
    const handlerName = toHanlderKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
}