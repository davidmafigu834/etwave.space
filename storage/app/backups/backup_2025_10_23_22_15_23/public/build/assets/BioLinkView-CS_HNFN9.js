import{j as t,R as w}from"./ui-DwAOVm1p.js";import{n as y}from"./app-BlWi7cIv.js";import _ from"./BioLinkPreview-wTC_ried.js";import"./vendor-CxtKjBZA.js";import"./utils-DBYZG17H.js";import"./index-BD2kI5zs.js";import"./SocialIcon-B3KlezrG.js";function C({bioLink:e}){var m,d,l,p,g,f,i,u,x;const s=((d=(m=e==null?void 0:e.config)==null?void 0:m.seo)==null?void 0:d.title)||(e==null?void 0:e.name)||"Bio Link",a=((p=(l=e==null?void 0:e.config)==null?void 0:l.seo)==null?void 0:p.description)||`Bio Link for ${(e==null?void 0:e.name)||"User"}`,o=((f=(g=e==null?void 0:e.config)==null?void 0:g.seo)==null?void 0:f.keywords)||"",r=((u=(i=e==null?void 0:e.config)==null?void 0:i.seo)==null?void 0:u.og_image)||"";return e?(w.useEffect(()=>{var h;const n=(h=e.config)==null?void 0:h.analytics;if(n!=null&&n.google_analytics){const c=document.createElement("script");c.async=!0,c.src=`https://www.googletagmanager.com/gtag/js?id=${n.google_analytics}`,document.head.appendChild(c);const j=document.createElement("script");j.innerHTML=`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${n.google_analytics}');
      `,document.head.appendChild(j)}if(n!=null&&n.facebook_pixel){const c=document.createElement("script");c.innerHTML=`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${n.facebook_pixel}');
        fbq('track', 'PageView');
      `,document.head.appendChild(c)}if(n!=null&&n.custom_code){const c=document.createElement("script");c.innerHTML=n.custom_code,document.head.appendChild(c)}return()=>{document.querySelectorAll('script[src*="googletagmanager.com"]').forEach(c=>c.remove()),document.querySelectorAll('script[src*="connect.facebook.net"]').forEach(c=>c.remove())}},[(x=e.config)==null?void 0:x.analytics]),t.jsxs(t.Fragment,{children:[t.jsxs(y,{children:[t.jsx("title",{children:s}),t.jsx("meta",{name:"description",content:a}),o&&t.jsx("meta",{name:"keywords",content:o}),t.jsx("meta",{property:"og:title",content:s}),t.jsx("meta",{property:"og:description",content:a}),r&&t.jsx("meta",{property:"og:image",content:r}),t.jsx("meta",{property:"og:type",content:"website"}),t.jsx("meta",{name:"twitter:card",content:"summary_large_image"}),t.jsx("meta",{name:"twitter:title",content:s}),t.jsx("meta",{name:"twitter:description",content:a}),r&&t.jsx("meta",{name:"twitter:image",content:r})]}),t.jsx("div",{className:"min-h-screen flex justify-center",children:t.jsx("div",{className:"w-full max-w-md",children:t.jsx(_,{data:e,isPublic:!0})})})]})):t.jsx("div",{className:"min-h-screen flex items-center justify-center",children:t.jsxs("div",{className:"text-center",children:[t.jsx("h1",{className:"text-xl font-semibold mb-2",children:"Bio Link Not Found"}),t.jsx("p",{className:"text-gray-500",children:"The requested bio link could not be found."})]})})}export{C as default};
