// vue3
import { createApp,createRenderer } from "../../lib/guide-micro-vue.esm.js";
import { App } from "./App.js"

const render = createRenderer({
    createElement(type){

    },
    patchProps(el, key, val){

    },
    insert(el, parent){

    }
})


const rootContainer = document.querySelector("#app");
render.createApp(App).mount(rootContainer);