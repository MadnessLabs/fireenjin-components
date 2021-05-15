import{r as i,h as t,H as o}from"./p-722f2f18.js";import"./p-46b0784d.js";import"./p-3e19d7e0.js";import"./p-f2660943.js";import{p as n}from"./p-c537074f.js";const l=class{constructor(t){i(this,t),this.modeToggle=!1,this.displayMode="grid",this.disableSearch=!1,this.selectOptions={},this.currentFilters={}}onPaginationElChange(){this.paginationEl&&(this.displayMode=this.paginationEl.display?this.paginationEl.display:this.displayMode)}onSuccess(i){var t;"select"===(null===(t=null==i?void 0:i.detail)||void 0===t?void 0:t.name)&&(this.selectOptions[i.detail.target.name]=i.detail.data.results)}onReset(){this.filterPopoverEl&&this.filterPopoverEl.dismiss()}async onSubmit(i){var t,o,n,l;if(this.filterPopoverEl&&"filter"===(null===(t=null==i?void 0:i.detail)||void 0===t?void 0:t.name)){if((null===(o=i.detail)||void 0===o?void 0:o.data)&&Object.keys(i.detail.data).length)for(const[t,o]of this.filter.controls.entries()){if(!o.name||!(null===(n=i.detail)||void 0===n?void 0:n.data[o.name]))continue;const l=Object.assign(Object.assign({},o),{value:i.detail.data[o.name]});this.filter.controls[t]=l,this.currentFilters[o.name]=l,this.filter=Object.assign({},this.filter)}this.filterPopoverEl.dismiss(),this.paginationEl&&(await this.paginationEl.clearResults(),this.paginationEl.getResults({paramData:(null===(l=null==i?void 0:i.detail)||void 0===l?void 0:l.data)?i.detail.data:{}}))}}onChange(i){var t,o;"orderBy"===(null===(t=null==i?void 0:i.target)||void 0===t?void 0:t.name)&&(this.paginationEl.orderBy=i.detail.value),"ION-SEARCHBAR"===(null===(o=null==i?void 0:i.target)||void 0===o?void 0:o.tagName)&&(this.paginationEl.query=i.detail.value?i.detail.value:"")}async createFilterPopover(i){return this.filterPopoverEl=await n.create({component:"fireenjin-popover-filter",componentProps:this.filter,event:i||null,cssClass:"fireenjin-popover-filter-wrapper"})}async togglePaginationDisplay(){this.displayMode="grid"===this.displayMode?"list":"grid",this.paginationEl.display=this.displayMode}async openFilterPopover(i){await this.createFilterPopover(i),this.filterPopoverEl.present()}async clearFilter(i,t){i.preventDefault(),i.stopPropagation();for(const[i,o]of this.filter.controls.entries())o.name&&o.value&&o.name===t.name&&(this.filter.controls[i]=Object.assign(Object.assign({},o),{value:null}),delete this.currentFilters[t.name],this.filter=Object.assign({},this.filter),await this.paginationEl.clearParamData(o.name));await this.paginationEl.clearResults(),await this.paginationEl.getResults(await new Promise(((i,t)=>{try{const t={};for(const i of Object.values(this.currentFilters))t[i.name]=i.value;console.log(t),i(t)}catch(i){console.log(i),t({})}})))}async componentDidLoad(){this.filter&&await this.createFilterPopover()}render(){var i,n,l,s,e,r,a;return t(o,null,t("slot",{name:"before"}),t("ion-grid",null,t("ion-row",null,this.modeToggle&&t("ion-col",{class:"mode-toggle"},t("ion-button",{fill:"clear",color:"primary",onClick:()=>this.togglePaginationDisplay()},t("ion-icon",{slot:"icon-only",name:"grid"===this.displayMode?"list":"grid"}))),!this.disableSearch&&t("ion-col",null,t("ion-searchbar",null)),(null===(n=null===(i=this.filter)||void 0===i?void 0:i.controls)||void 0===n?void 0:n.length)&&t("ion-col",{class:"filter-control"},t("ion-card",{onClick:i=>this.openFilterPopover(i),class:{"has-value":this.currentFilters&&Object.keys(this.currentFilters).length>0}},t("ion-icon",{name:"funnel",class:"start-icon"}),(null===(s=null===(l=this.filter)||void 0===l?void 0:l.controls)||void 0===s?void 0:s.length)?this.filter.controls.filter((i=>{var t;return!!i.value&&((null===(t=i.options)||void 0===t?void 0:t.length)||this.selectOptions[i.name])})).map((i=>{var o;return t("ion-chip",{outline:!0,color:"primary",style:{marginTop:"0",marginBottom:"0"}},i.icon&&t("ion-icon",{name:i.icon}),t("ion-label",null,(null===(o=i.options)||void 0===o?void 0:o.length)?i.options.filter((t=>i.value.map?i.value.includes(t.value):t.value===i.value)).map((i=>i.label)).join(", "):this.selectOptions[i.name]?this.selectOptions[i.name].filter((t=>i.value.map?i.value.includes(t.id):t.id===i.value)).map((i=>i.name)).join(", "):null),t("ion-icon",{name:"close-circle",onClick:t=>this.clearFilter(t,i)}))})):null,!(null===(e=this.filter)||void 0===e?void 0:e.label)||this.currentFilters&&Object.keys(this.currentFilters).length>0?"":this.filter.label,t("ion-icon",{name:"caret-down",class:"end-icon"}))),(null===(a=null===(r=this.sort)||void 0===r?void 0:r.options)||void 0===a?void 0:a.length)&&t("ion-col",null,t("ion-card",null,t("ion-icon",{style:{height:"25px",width:"25px",padding:"5px 0px 0px 5px"},class:"ion-float-left",name:"swap-vertical"}),t("ion-select",{name:"orderBy",value:this.sort.value,okText:"Okay",cancelText:"Dismiss",interfaceOptions:{header:this.sort.header,subHeader:this.sort.subHeader,message:this.sort.message}},this.sort.options.map((i=>t("ion-select-option",{value:i.value},i.label)))))))),t("slot",{name:"after"}))}static get watchers(){return{paginationEl:["onPaginationElChange"]}}};l.style="fireenjin-filter-bar ion-col.mode-toggle{max-width:60px;padding-top:12px}fireenjin-filter-bar ion-col.filter-control ion-card{padding:12px;margin-top:8px;position:relative;padding-left:35px;cursor:pointer}fireenjin-filter-bar ion-col.filter-control ion-card.has-value{padding:5px 30px}fireenjin-filter-bar ion-col.filter-control .start-icon{position:absolute;top:10px;left:10px;height:20px;width:20px}fireenjin-filter-bar ion-col.filter-control .end-icon{position:absolute;top:15px;right:10px;opacity:0.33}";export{l as fireenjin_filter_bar}