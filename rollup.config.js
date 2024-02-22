import typescript from "@rollup/plugin-typescript"

export default{
    input:"./src/index.ts",
    output:[
        {
            format:"cjs",
            file:"lib/guide-micro-vue.cjs.js"
        },
        {
            format:"es",
            file:"lib/guide-micro-vue.esm.js"
        }
    ],

    plugins:[
        typescript()
    ]
}