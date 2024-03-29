import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe('effect', () => {
    it('happy path', () => {
        const user = reactive({
            age: 10
        });

        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        });

        // 首次effect执行后，nextAge应该是11
        expect(nextAge).toBe(11);

        //  更新
        user.age++;
        // 现在nextAge应该是12
        expect(nextAge).toBe(12);
    });

    it("should return runner when call effect", ()=>{
        let foo = 10;
        const runner = effect(()=>{
            foo++;
            return "foo";
        });

        expect(foo).toBe(11);
        const r  = runner();
        expect(foo).toBe(12);
        expect(r).toBe("foo");
    });

    it("scheduler", ()=>{
        // 1.通过effect的第二个参数给定的 一个 scheduler 的 fn
        // 2.effect第一次执行的时候,还会执行fn
        // 3.当响应式对象更新时,不会执行fn,而是执行scheduler
        // 4.当执行runner时,会再次执行fn
        let dummy;
        let run: any;
        const scheduler = jest.fn(()=>{
            run = runner;
        });
        const obj = reactive({foo: 1})
        const runner = effect(()=>{
            dummy = obj.foo;
        },
        {scheduler});
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        obj.foo++;
        expect(scheduler).toHaveBeenCalled();
        expect(dummy).toBe(1);
        run();
        expect(dummy).toBe(2);
    });

    it("stop", ()=>{
        // 调用stop,停止更新
        
    })

    
});