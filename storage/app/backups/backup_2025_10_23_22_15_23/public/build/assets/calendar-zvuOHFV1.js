import{r as d,j as e}from"./ui-DwAOVm1p.js";import{u as U,K as W,B as b,C as j,d as y,e as v,g as N,i as R,p as H,X as K,t as m,S as X}from"./app-BlWi7cIv.js";import{P as J}from"./page-template-8tWNB1WX.js";import{F as Y,i as Z,a as ee,b as te}from"./index-pF7im5gK.js";import{A as re}from"./AppointmentReplyModal-21RLZzSk.js";import{C as u}from"./calendar-Jlwl64Lp.js";import{C as w}from"./clock-C9SI5I6F.js";import{M as G}from"./mail-B928cX0J.js";import{P as E}from"./phone-4keuK80f.js";import{B as se}from"./building--nslHNr2.js";import{M as F}from"./message-square-BEKBBgPS.js";import{S as ae}from"./sticky-note-DijIe12j.js";import"./vendor-CxtKjBZA.js";import"./utils-DBYZG17H.js";import"./textarea-DmNeUOf1.js";import"./select-DV03FLtq.js";import"./index-upgrZYbo.js";import"./chevron-up-DMuWaAmJ.js";import"./react-country-flag.esm-U4UQv2PH.js";import"./language-DYlIyiUn.js";import"./sparkles-tvpsAjMk.js";import"./loader-circle-DUfirWOF.js";import"./copy-Btm1-TBN.js";import"./chevron-right-CTYpggVz.js";import"./cookie-consent-BF1mYY4f.js";import"./globe-kYq37WGi.js";import"./chart-column-CrjmBQBc.js";import"./briefcase-AuRykhaE.js";import"./credit-card-CWCbalqR.js";import"./dollar-sign-B5K61QeY.js";import"./settings-CXB8R1cS.js";import"./users-WU9ta9Er.js";import"./wallet-z8Vgl1na.js";import"./user-D7_XmPgu.js";import"./use-favicon-BHKlxAc6.js";function Ve(){const{t:r}=U(),{appointments:l=[],business:i=null,selectedBusinessId:C=""}=W().props,[a,h]=d.useState(new Date),[x,k]=d.useState("month"),[V,f]=d.useState(!1),[o,_]=d.useState(null),[c,S]=d.useState(""),O=[{title:r("Dashboard"),href:route("dashboard")},{title:r("vCard Builder"),href:route("vcard-builder.index")},{title:(i==null?void 0:i.name)||r("Business")},{title:r("Calendar")}],A=t=>{switch(t){case"scheduled":return"bg-blue-100 text-blue-800";case"confirmed":return"bg-green-100 text-green-800";case"completed":return"bg-gray-100 text-gray-800";case"cancelled":return"bg-red-100 text-red-800";case"no_show":return"bg-orange-100 text-orange-800";default:return"bg-gray-100 text-gray-800"}},D=t=>{switch(t){case"scheduled":return"#3b82f6";case"confirmed":return"#10b981";case"completed":return"#6b7280";case"cancelled":return"#ef4444";case"no_show":return"#f59e0b";default:return"#6b7280"}},I=l.map(t=>{const s=t.date,n=t.time||"00:00";return{id:t.id.toString(),title:t.title,start:`${s}T${n}`,allDay:!t.time,backgroundColor:D(t.status),borderColor:D(t.status),extendedProps:{...t}}}),Q=t=>{const s=t.toISOString().split("T")[0];return l.filter(n=>n.date===s)},p=a&&!Array.isArray(a)?Q(a):[],M=()=>{if(!c)return p;const t=c.toLowerCase();return p.filter(s=>{var n,L,B,P,$,z;return((n=s.title)==null?void 0:n.toLowerCase().includes(t))||((L=s.email)==null?void 0:L.toLowerCase().includes(t))||((B=s.phone)==null?void 0:B.toLowerCase().includes(t))||((P=s.message)==null?void 0:P.toLowerCase().includes(t))||(($=s.business)==null?void 0:$.toLowerCase().includes(t))||((z=s.notes)==null?void 0:z.toLowerCase().includes(t))})},T=t=>t||"",g=t=>{_(t),f(!0)},q=t=>{m.loading(r("Sending reply...")),X.post(route("appointments.reply",[C,o.id]),t,{onSuccess:()=>{f(!1),m.dismiss(),m.success(r("Reply sent successfully"))},onError:s=>{m.dismiss(),m.error(`Failed to send reply: ${Object.values(s).join(", ")}`)}})};return e.jsxs(J,{title:r("Business Appointment"),url:route("vcard-builder.calendar",C),breadcrumbs:O,noPadding:!0,children:[e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"bg-white rounded-lg shadow p-4",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(u,{className:"h-5 w-5 text-primary"}),e.jsx("h2",{className:"text-lg font-semibold",children:i!=null&&i.name?`${i.name} - ${r("Calendar")}`:r("Business Calendar")})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(b,{variant:x==="month"?"default":"outline",size:"sm",onClick:()=>k("month"),children:r("Month View")}),e.jsx(b,{variant:x==="agenda"?"default":"outline",size:"sm",onClick:()=>k("agenda"),children:r("Agenda View")})]})]})}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[e.jsx("div",{className:"lg:col-span-2",children:e.jsxs(j,{children:[e.jsx(y,{children:e.jsxs(v,{className:"flex items-center gap-2",children:[e.jsx(u,{className:"h-5 w-5"}),r(x==="month"?"Monthly Calendar":"Agenda View")]})}),e.jsx(N,{children:x==="month"?e.jsx("div",{className:"fullcalendar-container",children:e.jsx(Y,{plugins:[Z,ee,te],initialView:"dayGridMonth",headerToolbar:{left:"prev,next today",center:"title",right:"dayGridMonth,timeGridWeek,timeGridDay"},events:I,height:"auto",eventClick:t=>{const s=new Date(t.event.startStr);h(s);const n=t.event.extendedProps;g(n)},dateClick:t=>{h(new Date(t.dateStr))},dayMaxEventRows:2,moreLinkText:r("more"),moreLinkClick:t=>(h(t.date),"popover"),slotMinTime:"06:00:00",slotMaxTime:"22:00:00",allDaySlot:!0,allDayText:r("All day"),slotLabelFormat:{hour:"2-digit",minute:"2-digit",hour12:!0},eventTimeFormat:{hour:"2-digit",minute:"2-digit",hour12:!0}})}):e.jsx("div",{className:"space-y-4 max-h-96 overflow-y-auto",children:l.length===0?e.jsx("div",{className:"text-center py-8 text-muted-foreground",children:r("No appointments scheduled")}):l.sort((t,s)=>new Date(t.date).getTime()-new Date(s.date).getTime()).map(t=>e.jsxs("div",{className:"border rounded-lg p-4 min-h-[120px] hover:bg-gray-50 hover:shadow-sm cursor-pointer transition-all duration-200",onClick:()=>g(t),children:[e.jsx("div",{className:"flex items-start justify-between mb-2",children:e.jsx("div",{children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h4",{className:"font-medium",children:t.title}),e.jsx(R,{className:A(t.status),children:t.status.charAt(0).toUpperCase()+t.status.slice(1).replace("_"," ")})]})})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2 mb-2",children:[e.jsxs("div",{className:"flex items-center gap-1 text-sm",children:[e.jsx(u,{className:"h-4 w-4 text-primary flex-shrink-0"}),e.jsx("span",{children:new Date(t.date).toLocaleDateString()})]}),t.time&&e.jsxs("div",{className:"flex items-center gap-1 text-sm",children:[e.jsx(w,{className:"h-4 w-4 text-primary flex-shrink-0"}),e.jsx("span",{children:T(t.time)})]}),t.email&&e.jsxs("div",{className:"flex items-center gap-1 text-sm overflow-hidden",children:[e.jsx(G,{className:"h-4 w-4 text-primary flex-shrink-0"}),e.jsx("span",{className:"truncate",children:t.email})]}),t.phone&&e.jsxs("div",{className:"flex items-center gap-1 text-sm",children:[e.jsx(E,{className:"h-4 w-4 text-primary flex-shrink-0"}),e.jsx("span",{children:t.phone})]})]}),t.message&&e.jsxs("div",{className:"text-sm text-gray-600 line-clamp-2 mb-1",children:[e.jsx("span",{className:"font-medium",children:"Message:"})," ",t.message]})]},t.id))})})]})}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs(j,{children:[e.jsxs(y,{children:[e.jsxs(v,{className:"flex items-center gap-2",children:[e.jsx(w,{className:"h-5 w-5"}),a&&!Array.isArray(a)?`${r("Appointments for")} ${a.toLocaleDateString()}`:r("Select a Date")]}),a&&!Array.isArray(a)&&p.length>0&&e.jsx("div",{className:"mt-2",children:e.jsxs("div",{className:"relative",children:[e.jsx(H,{className:"absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"}),e.jsx("input",{type:"text",placeholder:r("Search appointments..."),className:"w-full rounded-md border border-input pl-8 pr-8 py-2 text-sm",value:c,onChange:t=>S(t.target.value)}),c&&e.jsx("button",{onClick:()=>S(""),className:"absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-gray-100 flex items-center justify-center",title:r("Clear search"),children:e.jsx(K,{className:"h-3 w-3"})})]})})]}),e.jsx(N,{className:"max-h-[425px] overflow-y-auto pr-1",children:a&&!Array.isArray(a)?e.jsx("div",{className:"space-y-4",children:M().length===0?e.jsxs("div",{className:"text-center py-8 text-muted-foreground",children:[e.jsx(u,{className:"h-12 w-12 mx-auto mb-2 opacity-50"}),e.jsx("p",{children:r(c?"No appointments match your search":"No appointments on this date")})]}):M().sort((t,s)=>(t.time||"").localeCompare(s.time||"")).map(t=>e.jsxs("div",{className:"border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx("h4",{className:"font-medium text-gray-800",children:t.title}),e.jsx(R,{className:A(t.status),children:t.status.charAt(0).toUpperCase()+t.status.slice(1).replace("_"," ")})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-2 mb-3",children:[t.time&&e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx(w,{className:"h-4 w-4 text-primary"}),e.jsx("span",{children:T(t.time)})]}),t.email&&e.jsxs("div",{className:"flex items-center gap-2 text-sm overflow-hidden",children:[e.jsx(G,{className:"h-4 w-4 text-primary flex-shrink-0"}),e.jsx("span",{className:"truncate",children:t.email})]}),t.phone&&e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx(E,{className:"h-4 w-4 text-primary"}),e.jsx("span",{children:t.phone})]}),t.business&&e.jsxs("div",{className:"flex items-center gap-2 text-sm overflow-hidden",children:[e.jsx(se,{className:"h-4 w-4 text-primary flex-shrink-0"}),e.jsx("span",{className:"truncate",children:t.business})]})]}),t.message&&e.jsx("div",{className:"mb-3 bg-gray-50 p-2 rounded-md",children:e.jsxs("div",{className:"flex items-start gap-2 text-sm",children:[e.jsx(F,{className:"h-4 w-4 text-primary mt-0.5"}),e.jsx("span",{className:"text-gray-600",children:t.message})]})}),t.notes&&e.jsx("div",{className:"mb-3 bg-blue-50 p-2 rounded-md",children:e.jsxs("div",{className:"flex items-start gap-2 text-sm",children:[e.jsx(ae,{className:"h-4 w-4 text-blue-500 mt-0.5"}),e.jsx("span",{className:"text-gray-700",children:t.notes})]})}),e.jsx("div",{className:"mt-3 pt-3 border-t border-gray-100 flex justify-end",children:e.jsxs(b,{size:"sm",className:"gap-1",onClick:s=>{s.stopPropagation(),g(t)},children:[e.jsx(F,{className:"h-4 w-4"}),r("Reply")]})})]},t.id))}):e.jsxs("div",{className:"text-center py-8 text-muted-foreground",children:[e.jsx(u,{className:"h-12 w-12 mx-auto mb-2 opacity-50"}),e.jsx("p",{children:r("Click on a date to view appointments")})]})})]}),e.jsxs(j,{children:[e.jsx(y,{children:e.jsx(v,{children:r("Quick Stats")})}),e.jsx(N,{children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-muted-foreground",children:r("Total Appointments")}),e.jsx("span",{className:"font-medium",children:l.length})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-muted-foreground",children:r("Scheduled")}),e.jsx("span",{className:"font-medium text-blue-600",children:l.filter(t=>t.status==="scheduled").length})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-muted-foreground",children:r("Confirmed")}),e.jsx("span",{className:"font-medium text-green-600",children:l.filter(t=>t.status==="confirmed").length})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-muted-foreground",children:r("Completed")}),e.jsx("span",{className:"font-medium text-gray-600",children:l.filter(t=>t.status==="completed").length})]})]})})]})]})]})]}),e.jsx(re,{isOpen:V,onClose:()=>f(!1),onSubmit:q,appointment:o?{...o,appointment_date:o.date,appointment_time:o.time,business:o.business?{name:o.business}:null}:null}),e.jsx("style",{children:`
        .fullcalendar-container .fc {
          font-family: inherit;
        }
        
        .fullcalendar-container .fc-toolbar {
          margin-bottom: 1rem;
        }
        
        .fullcalendar-container .fc-button {
          background: none;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 0.5rem;
          border-radius: 0.375rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .fullcalendar-container .fc-button:hover {
          background-color: #f3f4f6 !important;
          border-color: #9ca3af !important;
        }
        
        .fullcalendar-container .fc-button:not(.fc-button-active):hover {
          background-color: #f3f4f6 !important;
          color: #374151 !important;
        }
        
        .fullcalendar-container .fc-button:focus {
          box-shadow: none;
        }
        
        .fullcalendar-container .fc-button-primary {
          background-color: #f3f4f6;
        }
        
        .fullcalendar-container .fc-today-button {
          background-color: var(--primary) !important;
          border-color: var(--primary) !important;
          color: white !important;
          text-transform: capitalize;
        }
        
        .fullcalendar-container .fc-today-button:hover {
          background-color: var(--primary) !important;
          border-color: var(--primary) !important;
          color: white !important;
          opacity: 0.9;
        }
        
        .fullcalendar-container .fc-button-active {
          background-color: var(--primary) !important;
          border-color: var(--primary) !important;
          color: white !important;
        }
        
        .fullcalendar-container .fc-button-active:hover {
          background-color: var(--primary) !important;
          border-color: var(--primary) !important;
          color: white !important;
          opacity: 0.9;
        }
        
        .fullcalendar-container .fc-daygrid-day {
          cursor: pointer;
        }
        
        .fullcalendar-container .fc-daygrid-day:hover {
          background-color: #f9fafb;
        }
        
        .fullcalendar-container .fc-daygrid-more-link {
          background-color: #f3f4f6;
          border-radius: 0.25rem;
          padding: 0.125rem 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #4b5563;
        }
        
        .fullcalendar-container .fc-daygrid-more-link:hover {
          background-color: #e5e7eb;
          color: #111827;
          text-decoration: none;
        }
        
        .fullcalendar-container .fc-event {
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
          font-size: 0.75rem;
          border: none;
        }
        
        .fullcalendar-container .fc-event-title {
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .fullcalendar-container .fc-daygrid-event {
          background-color: var(--fc-event-bg-color);
          color: white;
        }
        
        .fullcalendar-container .fc-daygrid-dot-event {
          background-color: var(--fc-event-bg-color);
        }
        
        .fullcalendar-container .fc-day-today {
          background-color: rgba(99, 102, 241, 0.05) !important;
        }
        
        /* Ensure all buttons have consistent styling */
        .fullcalendar-container .fc-prev-button,
        .fullcalendar-container .fc-next-button,
        .fullcalendar-container .fc-dayGridMonth-button,
        .fullcalendar-container .fc-timeGridWeek-button,
        .fullcalendar-container .fc-timeGridDay-button {
          text-transform: capitalize !important;
        }
        
        .fullcalendar-container .fc-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .fullcalendar-container .fc-button:disabled:hover {
          background-color: transparent !important;
          border-color: #d1d5db !important;
          color: #374151 !important;
        }
      `})]})}export{Ve as default};
