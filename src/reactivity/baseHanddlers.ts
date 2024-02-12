import { extend, isObject } from "../shared";
import { track,trigger } from "./effect";
import { ReactiveFlags, reactive, readonly, shallowReadonly } from "./reactive";

// 使用缓存技术,一直用初始化时的get,set
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isreadonly = false, shallow = false){
    return function get(target, key) {
        console.log(key);
        if(key === ReactiveFlags.IS_REACTIVE){
            return !isreadonly
        }else if(key === ReactiveFlags.IS_READONLY){
            return isreadonly
        }
        const res = Reflect.get(target, key);

        if(shallow){
            return res;
        }
        // 看看res是不是个object,如果是,就再次执行
        if(isObject(res)){
            return isreadonly ? readonly(res) : reactive(res)
        }

        if(!isreadonly){
            // 只有不是只读时,才可以进行依赖收集
            track(target,key);
        }
        return res;
    };

}

function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value)

        trigger(target, key);
        return res;
    }
}


export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get:readonlyGet,
    set(target, key, value){
        console.warn('key:${key} set 失败,因为target时readonly', target);
        return true;
    }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
})