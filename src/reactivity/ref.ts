import { hasChanged } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";

class RefImpl{
    private _value: any;
    public dep;
    constructor(value){
        this._value = value;
        this.dep = new Set();
    }

    get value() {
        // get value时进行依赖收集
        // isTracking为true，证明是一个activateEffect
        if(isTracking()){
            trackEffects(this.dep);
        }
        // 没有通过，说明是一个普通数据，直接return值就好
        return this._value;
    }

    set value(newValue) {
        // set value时触发依赖,先修改value的值，再进行通知
        // 如果值发生改变，要进行依赖触发
        if(hasChanged(newValue, this._value)){
            this._value = newValue;
            triggerEffects(this.dep);
        }
    }
}

export function ref(value){
    return new RefImpl(value);
}