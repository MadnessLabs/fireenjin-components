import{r as t,c as i,h as o}from"./p-f1147c95.js";async function n(t,i,o=500){return new Promise((async(e,a)=>{i&&"function"==typeof i||a("Callback function is required!");try{e(i())}catch(e){t>1?(await(s=o,new Promise((t=>setTimeout(t,s)))),n(t-1,i,2*o)):a(e)}var s}))}const e=class{constructor(o){t(this,o),this.fireenjinFetch=i(this,"fireenjinFetch",7),this.data={},this.template={},this.html=""}componentWillLoad(){var t;(null===(t=window)||void 0===t?void 0:t.Handlebars)||async function(){new Promise(((t,i)=>{const o=document.createElement("script");o.async=!0,o.src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js",o.addEventListener("load",t),o.addEventListener("error",(()=>i("Error loading script."))),o.addEventListener("abort",(()=>i("Script loading aborted."))),document.head.appendChild(o)}))}(),this.templateId&&this.fireenjinFetch.emit({endpoint:"findTemplate",params:{id:this.templateId}})}componentDidLoad(){n(10,this.renderTemplate.bind(this)),n(10,this.setPartials.bind(this))}async setPartials(t){const i=(null===localStorage||void 0===localStorage?void 0:localStorage.getItem)?JSON.parse(localStorage.getItem("enjin-editor-partials")):null;this.partials=t||i||[];for(const t of this.partials)t.html&&window.Handlebars.registerPartial(t.id,t.html);(null===localStorage||void 0===localStorage?void 0:localStorage.setItem)&&localStorage.setItem("enjin-editor-partials",JSON.stringify(this.partials))}async renderTemplate(){var t,i;this.html=window.Handlebars.compile((null===(t=this.template)||void 0===t?void 0:t.html)?null===(i=this.template)||void 0===i?void 0:i.html:"")(this.data?this.data:{})}onSuccess(t){var i,o,n;"findTemplate"===(null===(i=null==t?void 0:t.detail)||void 0===i?void 0:i.endpoint)&&(this.template=(null===(n=null===(o=null==t?void 0:t.detail)||void 0===o?void 0:o.data)||void 0===n?void 0:n.template)?t.detail.data.template:null)}onTemplateId(){this.fireenjinFetch.emit({endpoint:"findTemplate",params:{id:this.templateId}})}onData(){n(10,this.renderTemplate.bind(this))}onTemplate(){n(10,this.renderTemplate.bind(this))}render(){return o("div",{innerHTML:this.html})}static get watchers(){return{templateId:["onTemplateId"],data:["onData"],template:["onTemplate"]}}};export{e as fireenjin_render_template}