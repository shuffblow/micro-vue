import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl{
    private _value: any;
    private _rawValue: any;
    public dep;
    public __v_isRef = true;
    constructor(value){
        this._rawValue = value;
        this._value = convert(value);
        this.dep = new Set();
    }

    get value() {
        // get value时进行依赖收集
        trackRefValue(this);
        // 没有通过，说明是一个普通数据，直接return值就好
        return this._value;
    }

    set value(newValue) {
        // set value时触发依赖,先修改value的值，再进行通知
        // 如果值发生改变，要进行依赖触发
        if(hasChanged(newValue, this._rawValue)){
            this._rawValue = newValue;
            this._value = convert(newValue)
            triggerEffects(this.dep);
        }
    }
}

function convert(value){
    return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref){
        // isTracking为true，证明是一个activateEffect
        if(isTracking()){
            trackEffects(ref.dep);
        }
}

export function ref(value){
    return new RefImpl(value);
}

export function isRef(raw){
    // return raw instanceof RefImpl;
    return !!raw.__v_isRef;
}

export function unRef(ref) {
    // 看是否是ref-> ref。value
    // ref
    return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
    // get ref return .value
    // not ref return self
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target,key));
        },
        // set -> ref 修改.value
        set(target, key, value) {
            if(isRef(target[key]) && !isRef(value)){
                return (target[key].value = value);
            }else{
                return Reflect.set(target,key,value);
            }
        },
    });
}