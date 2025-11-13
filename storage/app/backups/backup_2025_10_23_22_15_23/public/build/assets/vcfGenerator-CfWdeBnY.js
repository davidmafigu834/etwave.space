function b(o){const{name:c,title:a,email:d,phone:n,website:e,location:s}=o,R=c||"",i=a||"",l=d||"",r=n||"",f=e||"",m=s||"";let t=`BEGIN:VCARD
`;if(t+=`VERSION:3.0
`,t+=`FN:${R}
`,i&&(t+=`TITLE:${i}
`),l&&(t+=`EMAIL;TYPE=WORK:${l}
`),r){const E=r.replace(/[^\d+]/g,"");t+=`TEL;TYPE=WORK:${E}
`}return f&&(t+=`URL:${f}
`),m&&(t+=`ADR;TYPE=WORK:;;${m}
`),t+="END:VCARD",t}function C(o){const c=b(o),a=`${o.name||"contact"}.vcf`,d=new Blob([c],{type:"text/vcard"}),n=URL.createObjectURL(d),e=document.createElement("a");e.href=n,e.download=a,document.body.appendChild(e),e.click(),setTimeout(()=>{document.body.removeChild(e),URL.revokeObjectURL(n)},100)}export{C as downloadVCF,b as generateVCF};
