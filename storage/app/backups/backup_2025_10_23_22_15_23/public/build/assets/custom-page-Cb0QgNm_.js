import{j as r}from"./ui-DwAOVm1p.js";import{K as _,n as k}from"./app-BlWi7cIv.js";import C from"./Header-CTSC-Lnb.js";import F from"./Footer-CaaQMt6P.js";import{u as I}from"./use-favicon-BHKlxAc6.js";import"./vendor-CxtKjBZA.js";import"./utils-DBYZG17H.js";import"./menu-DwqhxsMH.js";import"./mail-B928cX0J.js";import"./phone-4keuK80f.js";import"./map-pin-CqiFX9bE.js";import"./instagram-ByrYH2QY.js";import"./linkedin-LFnjPlyG.js";import"./twitter-Dkc7nwik.js";import"./facebook-2uncl42_.js";function B(){var p,i,l,s,g,b,u,d,y,v,x,f,h;const j=`
    /* Fix form inputs */
    .custom-page-content input:focus, 
    .custom-page-content textarea:focus {
      --tw-ring-color: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
    }
    
    /* Fix color issues */
    .custom-page-content .bg-blue-50 { background-color: rgba(var(--primary-color-rgb), 0.1) !important; }
    .custom-page-content .bg-purple-50 { background-color: rgba(var(--secondary-color-rgb), 0.1) !important; }
    .custom-page-content .bg-green-50 { background-color: rgba(var(--accent-color-rgb), 0.1) !important; }
    .custom-page-content .bg-red-50 { background-color: rgba(var(--accent-color-rgb), 0.1) !important; }
    
    .custom-page-content .text-blue-600 { color: var(--primary-color) !important; }
    .custom-page-content .text-purple-600 { color: var(--secondary-color) !important; }
    .custom-page-content .text-green-600 { color: var(--accent-color) !important; }
    .custom-page-content .text-red-600 { color: var(--accent-color) !important; }
    
    .custom-page-content .border-blue-500 { border-color: var(--primary-color) !important; }
    .custom-page-content .border-purple-500 { border-color: var(--secondary-color) !important; }
    .custom-page-content .border-green-500 { border-color: var(--accent-color) !important; }
    .custom-page-content .border-red-500 { border-color: var(--accent-color) !important; }
    
    .custom-page-content .bg-blue-600 { background-color: var(--primary-color) !important; }
    .custom-page-content .bg-purple-600 { background-color: var(--secondary-color) !important; }
    .custom-page-content .bg-green-600 { background-color: var(--accent-color) !important; }
    .custom-page-content .bg-red-500 { background-color: var(--accent-color) !important; }
    
    /* Fix border colors */
    .custom-page-content .border-blue-200 { border-color: rgba(var(--primary-color-rgb), 0.2) !important; }
    .custom-page-content .border-green-200 { border-color: rgba(var(--accent-color-rgb), 0.2) !important; }
    
    /* Fix hover states */
    .custom-page-content .hover\\:bg-blue-700:hover { background-color: var(--primary-color) !important; opacity: 0.9; }
    
    /* Fix form button */
    .custom-page-content .bg-blue-600 { background-color: var(--primary-color) !important; }
  `,{page:c,customPages:a=[],settings:o}=_().props,e=((i=(p=o==null?void 0:o.config_sections)==null?void 0:p.theme)==null?void 0:i.primary_color)||"#3b82f6",n=((s=(l=o==null?void 0:o.config_sections)==null?void 0:l.theme)==null?void 0:s.secondary_color)||"#8b5cf6",m=((b=(g=o==null?void 0:o.config_sections)==null?void 0:g.theme)==null?void 0:b.accent_color)||"#10b981";return I(),r.jsxs(r.Fragment,{children:[r.jsxs(k,{children:[r.jsx("title",{children:c.meta_title||c.title}),c.meta_description&&r.jsx("meta",{name:"description",content:c.meta_description}),r.jsx("style",{children:j})]}),r.jsxs("div",{className:"min-h-screen bg-white",style:{"--primary-color":e,"--secondary-color":n,"--accent-color":m,"--primary-color-rgb":((u=e.replace("#","").match(/.{2}/g))==null?void 0:u.map(t=>parseInt(t,16)).join(", "))||"59, 130, 246","--secondary-color-rgb":((d=n.replace("#","").match(/.{2}/g))==null?void 0:d.map(t=>parseInt(t,16)).join(", "))||"139, 92, 246","--accent-color-rgb":((y=m.replace("#","").match(/.{2}/g))==null?void 0:y.map(t=>parseInt(t,16)).join(", "))||"16, 185, 129"},children:[r.jsx(C,{settings:o,customPages:a,directoryCustomPages:a,isDirectoryContext:!0,sectionData:((x=(v=o==null?void 0:o.config_sections)==null?void 0:v.sections)==null?void 0:x.find(t=>t.key==="header"))||{},brandColor:e}),r.jsx("main",{className:"pt-16",children:r.jsx("div",{className:"custom-page-content",dangerouslySetInnerHTML:{__html:c.content}})}),r.jsx(F,{settings:o,sectionData:((h=(f=o==null?void 0:o.config_sections)==null?void 0:f.sections)==null?void 0:h.find(t=>t.key==="footer"))||{},brandColor:e})]})]})}export{B as default};
