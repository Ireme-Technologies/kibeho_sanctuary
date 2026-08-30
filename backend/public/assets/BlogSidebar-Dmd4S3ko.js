import{c as r,u as w,x as _,r as x,j as e,L as j,y as b}from"./index-BpoYK89j.js";/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=r("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=r("Tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=r("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]),y="Search here...",v="Popular Posts",P="Popular Tags",C="_sidebar_hwowm_1",I="_widget_hwowm_7",f="_searchBox_hwowm_13",k="_searchIcon_hwowm_32",L="_widgetTitle_hwowm_50",D="_popularList_hwowm_57",S="_popularItem_hwowm_64",B="_popularThumb_hwowm_70",A="_popularDate_hwowm_78",U="_popularTitle_hwowm_85",M="_tagCloud_hwowm_98",q="_tagPill_hwowm_104",a={sidebar:C,widget:I,searchBox:f,searchIcon:k,widgetTitle:L,popularList:D,popularItem:S,popularThumb:B,popularDate:A,popularTitle:U,tagCloud:M,tagPill:q},E=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];function R(o){const l=new Date(o);return{day:l.getDate(),month:E[l.getMonth()]}}function J({excludeId:o,initialQuery:l="",onSearch:c}){const{blogPosts:n}=w(),p=_(),[i,h]=x.useState(l),d=[...n].filter(s=>s.id!==o).sort((s,t)=>t.comments.length-s.comments.length).slice(0,3),u=s=>{const t=s.target.value;h(t),c&&c(t)},m=s=>{s.preventDefault(),c||p(`/blog?q=${encodeURIComponent(i.trim())}`)};return e.jsxs("aside",{className:a.sidebar,children:[e.jsx("div",{className:a.widget,children:e.jsxs("form",{className:a.searchBox,onSubmit:m,children:[e.jsx("input",{type:"text",value:i,onChange:u,placeholder:y,"aria-label":"Search blog posts"}),e.jsx("button",{type:"submit",className:a.searchIcon,"aria-label":"Search",children:e.jsx(N,{size:16})})]})}),e.jsxs("div",{className:a.widget,children:[e.jsx("h4",{className:a.widgetTitle,children:v}),e.jsx("ul",{className:a.popularList,children:d.map(s=>{const{day:t,month:g}=R(s.publishedAt);return e.jsx("li",{children:e.jsxs(j,{to:`/news/${s.slug}`,className:a.popularItem,children:[e.jsx("img",{src:s.coverImage,alt:"",className:a.popularThumb}),e.jsxs("div",{children:[e.jsxs("span",{className:a.popularDate,children:[t," ",g]}),e.jsx("p",{className:a.popularTitle,children:s.title})]})]})},s.id)})})]}),e.jsxs("div",{className:a.widget,children:[e.jsx("h4",{className:a.widgetTitle,children:P}),e.jsx("div",{className:a.tagCloud,children:b.map(s=>e.jsxs("span",{className:a.tagPill,children:[e.jsx(T,{size:11})," ",s]},s))})]})]})}export{J as B,H as U};
