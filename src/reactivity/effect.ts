import { extend } from "../shared";

let shouldTrack = false;
let activateEffect;
export class ReactiveEffect{
    private _fn: any;
    deps = [];
    active = true;
    onStop?:() => void;
    public scheduler: Function | undefined;
    constructor(fn, scheduler?: Function){
        this._fn = fn;
        this.scheduler = scheduler;
    }

    run(){
        activateEffect = this;
        // 1.会收集依赖
        //  shouldTrack来做区分
        if(!this.active){
            return this._fn()
        }
        shouldTrack = true;
        activateEffect = this;

        const result = this._fn()
        shouldTrack = false;
        return result;
    }

    stop(){
        // 删除对应的effect
        if(this.active){
            cleanupEffect(this)
            if(this.onStop){
                this.onStop();
            }
            this.active = false;
        }
    }
}

function cleanupEffect(effect){
    effect.deps.forEach((dep:any) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}

const targetMap = new Map();
export function track(target, key) {
    if(!isTracking()) return;
    //选择set这个数据结构 target -> key -> dep
    let depsMap = targetMap.get(target);
    if(!depsMap){
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if(!dep){
        dep = new Set();
        depsMap.set(key, dep);
    }

    trackEffects(dep);
}

export function trackEffects(dep){
    if (dep.has(activateEffect)) return;
    dep.add(activateEffect);
    activateEffect.deps.push(dep)
}

export function isTracking() {
    return shouldTrack && activateEffect !== undefined;
}

export function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffects(dep);
}

export function triggerEffects(dep){
    for (const effect of dep) {
        if(effect.scheduler){
            effect.scheduler();
        }else{
            effect.run();
        }

    }
}

export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    // extend
    extend(_effect, options);
    _effect.run();

    const runner:any = _effect.run.bind(_effect)
    runner.effect = _effect;
    return runner;
}

export function stop(runner){
    runner.effect.stop()
}