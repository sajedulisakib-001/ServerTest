(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,73025,e=>{"use strict";var t=e.i(43476),a=e.i(71645),i=e.i(18566),o=e.i(99392);let n=a.default.memo(function({orderNumber:e,format:a,setFormat:i,zoomScale:o,setZoomScale:n,onPrint:s,onClose:r}){return(0,t.jsxs)("header",{className:"screen-toolbar",children:[(0,t.jsxs)("div",{className:"toolbar-left",children:[(0,t.jsx)("div",{className:"doc-icon-badge",children:(0,t.jsxs)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,t.jsx)("polyline",{points:"6 9 6 2 18 2 18 9"}),(0,t.jsx)("path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"}),(0,t.jsx)("rect",{x:"6",y:"14",width:"12",height:"8"})]})}),(0,t.jsxs)("div",{className:"doc-meta-info",children:[(0,t.jsxs)("div",{className:"doc-title-row",children:[(0,t.jsx)("span",{className:"doc-title",children:"Print Studio"}),(0,t.jsx)("span",{className:"doc-order-tag",children:e.startsWith("#")?e:`#${e}`})]}),(0,t.jsxs)("div",{className:"doc-size-indicator",children:[(0,t.jsx)("span",{className:"live-dot"}),(0,t.jsxs)("span",{className:"size-text",children:["invoice-a4"===a&&"A4 Full Page (210 × 297 mm)","label-3x5"===a&&'3" × 5" Thermal Roll (76 × 127 mm)',"label-4x6"===a&&'4" × 6" Shipping Sticker (102 × 152 mm)']})]})]})]}),(0,t.jsx)("div",{className:"toolbar-center",children:(0,t.jsxs)("div",{className:"format-segmented-pill",children:[(0,t.jsxs)("button",{type:"button",className:`format-tab-btn ${"invoice-a4"===a?"active":""}`,onClick:()=>i("invoice-a4"),title:"Full Customer Tax Invoice & Packing Slip (A4 Sheet)",children:[(0,t.jsx)("span",{className:"tab-emoji",children:"📄"}),(0,t.jsx)("span",{className:"tab-label",children:"A4 Invoice"})]}),(0,t.jsxs)("button",{type:"button",className:`format-tab-btn ${"label-3x5"===a?"active":""}`,onClick:()=>i("label-3x5"),title:"Standard 3 inch by 5 inch Thermal Sticker (Steadfast, Pathao, Paperfly)",children:[(0,t.jsx)("span",{className:"tab-emoji",children:"🏷️"}),(0,t.jsx)("span",{className:"tab-label",children:'3" × 5" Thermal'})]}),(0,t.jsxs)("button",{type:"button",className:`format-tab-btn ${"label-4x6"===a?"active":""}`,onClick:()=>i("label-4x6"),title:"Standard 4 inch by 6 inch Logistics Label (Universal 100x150mm sticker)",children:[(0,t.jsx)("span",{className:"tab-emoji",children:"📦"}),(0,t.jsx)("span",{className:"tab-label",children:'4" × 6" Sticker'})]})]})}),(0,t.jsxs)("div",{className:"toolbar-right",children:[(0,t.jsxs)("div",{className:"zoom-stepper",children:[(0,t.jsx)("button",{type:"button",className:"zoom-step-btn",onClick:()=>n(e=>Math.max(75,e-15)),title:"Zoom Out Screen Preview",children:"−"}),(0,t.jsxs)("span",{className:"zoom-percentage",children:[o,"%"]}),(0,t.jsx)("button",{type:"button",className:"zoom-step-btn",onClick:()=>n(e=>Math.min(150,e+15)),title:"Zoom In Screen Preview",children:"+"})]}),(0,t.jsxs)("button",{type:"button",className:"btn-print-action",onClick:s,children:[(0,t.jsxs)("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.3",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,t.jsx)("polyline",{points:"6 9 6 2 18 2 18 9"}),(0,t.jsx)("path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"}),(0,t.jsx)("rect",{x:"6",y:"14",width:"12",height:"8"})]}),"Print"]}),(0,t.jsx)("button",{type:"button",className:"btn-close-action",onClick:r,title:"Close window",children:"Close"})]})]})}),s=/[^A-Za-z0-9]/g,r=[[2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],[1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],[2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],[1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],[2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],[3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],[2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],[1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],[2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1],[1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1],[2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3],[3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1],[3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2],[1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4],[1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1],[2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1],[1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2],[1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1],[2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1],[1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1],[1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4],[2,1,1,2,3,2],[2,3,3,1,1,1,2]];function l(e,a=38){let i=(e||"WWM000101").replace(s,"").toUpperCase()||"WWM000101",o=[104],n=104;for(let e=0;e<i.length;e++){let t=i.charCodeAt(e)-32;t>=0&&t<=95&&(o.push(t),n+=t*(e+1))}let d=n%103;o.push(d),o.push(106);let c=[],p=2;o.forEach(e=>{(r[e]||r[0]).forEach((e,t)=>{t%2==0&&c.push({x:p,w:e}),p+=e})});let m=p+2;return(0,t.jsx)("svg",{className:"barcode-svg",role:"img","aria-label":`Barcode for ${i}`,viewBox:`0 0 ${m} ${a}`,preserveAspectRatio:"xMinYMin meet",xmlns:"http://www.w3.org/2000/svg",children:c.map((e,i)=>(0,t.jsx)("rect",{x:e.x,y:"0",width:e.w,height:a,fill:"#000000"},i))})}let d=a.default.memo(function({order:e,settings:a,headerBrandTitle:i,companyBinNo:o,signatureLabel:n,footerTerms:s,orderDate:r,isDhaka:d,isCod:c,totalItemCount:p,barcodeFormattedNumber:m}){return(0,t.jsxs)("div",{className:"invoice-a4-card",children:[(0,t.jsxs)("div",{className:"a4-header",children:[(0,t.jsxs)("div",{className:"a4-brand-col",children:[a.store_logo_url&&(0,t.jsx)("img",{src:a.store_logo_url,alt:"Logo",loading:"lazy",className:"a4-logo"}),(0,t.jsx)("h1",{className:"a4-brand-title",children:i}),(0,t.jsx)("div",{className:"a4-bin",children:o}),(0,t.jsx)("div",{className:"a4-address",children:a.contact_address||"Dhaka, Bangladesh"}),(0,t.jsxs)("div",{className:"a4-contact",children:["Tel: ",a.contact_phone||"+880 1700-000000"," | Email: ",a.contact_email||"support@storeforge.io"]})]}),(0,t.jsxs)("div",{className:"a4-meta-col",children:[(0,t.jsx)("div",{className:"a4-invoice-badge",children:"TAX INVOICE / BILL"}),(0,t.jsxs)("div",{className:"a4-meta-table",children:[(0,t.jsxs)("div",{className:"a4-meta-row",children:[(0,t.jsx)("span",{className:"a4-meta-label",children:"Invoice / Order #:"}),(0,t.jsx)("span",{className:"a4-meta-val font-mono font-bold",children:e.orderNumber})]}),(0,t.jsxs)("div",{className:"a4-meta-row",children:[(0,t.jsx)("span",{className:"a4-meta-label",children:"Order Date:"}),(0,t.jsx)("span",{className:"a4-meta-val",children:r})]}),(0,t.jsxs)("div",{className:"a4-meta-row",children:[(0,t.jsx)("span",{className:"a4-meta-label",children:"Payment Status:"}),(0,t.jsx)("span",{className:`a4-status-badge ${"paid"===e.paymentStatus?"status-paid":"status-pending"}`,children:(e.paymentStatus||"pending").toUpperCase()})]}),(0,t.jsxs)("div",{className:"a4-meta-row",children:[(0,t.jsx)("span",{className:"a4-meta-label",children:"Payment Method:"}),(0,t.jsx)("span",{className:"a4-meta-val font-bold",children:"bkash"===e.paymentMethod?"bKash Online":(e.paymentMethod||"COD").toUpperCase()})]})]})]})]}),(0,t.jsxs)("div",{className:"a4-details-grid",children:[(0,t.jsxs)("div",{className:"a4-box",children:[(0,t.jsx)("div",{className:"a4-box-title",children:"CUSTOMER BILLING & SHIPPING DETAILS / প্রাপক"}),(0,t.jsx)("div",{className:"a4-cust-name",children:e.customerName}),(0,t.jsxs)("div",{className:"a4-cust-line",children:[(0,t.jsx)("strong",{children:"Phone / মোবাইল:"})," ",e.phone]}),e.email&&(0,t.jsxs)("div",{className:"a4-cust-line",children:[(0,t.jsx)("strong",{children:"Email:"})," ",e.email]}),(0,t.jsxs)("div",{className:"a4-cust-line",children:[(0,t.jsx)("strong",{children:"Address / ঠিকানা:"})," ",e.address,e.areaThana?`, ${e.areaThana}`:"",e.district&&!["inside_dhaka","outside_dhaka"].includes(e.district.toLowerCase())?`, ${e.district}`:""]}),e.deliveryNote&&(0,t.jsxs)("div",{className:"a4-cust-note",children:[(0,t.jsx)("strong",{children:"Special Delivery Instructions:"})," ",e.deliveryNote]})]}),(0,t.jsxs)("div",{className:"a4-box a4-routing-box",children:[(0,t.jsx)("div",{className:"a4-box-title",children:"LOGISTICS & DISPATCH SUMMARY"}),(0,t.jsxs)("div",{className:"a4-routing-row",children:[(0,t.jsx)("span",{children:"Delivery Zone:"}),(0,t.jsx)("strong",{children:d?"INSIDE DHAKA":"OUTSIDE DHAKA"})]}),(0,t.jsxs)("div",{className:"a4-routing-row",children:[(0,t.jsx)("span",{children:"Courier Service:"}),(0,t.jsx)("strong",{children:"Express Home Delivery"})]}),(0,t.jsxs)("div",{className:"a4-routing-row",children:[(0,t.jsx)("span",{children:"Total Items:"}),(0,t.jsxs)("strong",{children:[p," Unit(s)"]})]}),(0,t.jsxs)("div",{className:"a4-barcode-container",children:[l(m,36),(0,t.jsx)("div",{className:"a4-barcode-text",children:m})]})]})]}),(0,t.jsxs)("table",{className:"a4-table",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{style:{width:"45px"},className:"text-center",children:"#"}),(0,t.jsx)("th",{children:"Product Description & Variations"}),(0,t.jsx)("th",{style:{width:"80px"},className:"text-center",children:"Qty"}),(0,t.jsx)("th",{style:{width:"130px"},className:"text-right",children:"Unit Price"}),(0,t.jsx)("th",{style:{width:"140px"},className:"text-right",children:"Total (BDT)"})]})}),(0,t.jsx)("tbody",{children:e.items&&e.items.length>0?e.items.map((e,a)=>{let i=Number(e.price||e.unitPrice||0),o=Number(e.quantity||1),n=i*o;return(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{className:"text-center font-bold text-slate-500",children:a+1}),(0,t.jsxs)("td",{children:[(0,t.jsx)("div",{className:"a4-item-title",children:e.product?.name||e.name||"StoreForge Product"}),(e.variantName||e.size||e.color)&&(0,t.jsx)("div",{className:"a4-item-var",children:[e.size?`Size: ${e.size}`:"",e.color?`Color: ${e.color}`:"",e.variantName&&!e.size&&!e.color?e.variantName:""].filter(Boolean).join(" | ")}),e.product?.sku&&(0,t.jsxs)("div",{className:"a4-item-sku",children:["SKU: ",e.product.sku]})]}),(0,t.jsx)("td",{className:"text-center font-bold",children:o}),(0,t.jsxs)("td",{className:"text-right font-mono",children:["৳ ",i.toLocaleString()]}),(0,t.jsxs)("td",{className:"text-right font-mono font-bold",children:["৳ ",n.toLocaleString()]})]},e.id||a)}):(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{className:"text-center font-bold",children:"1"}),(0,t.jsxs)("td",{children:[(0,t.jsx)("div",{className:"a4-item-title",children:"StoreForge Product"}),(0,t.jsx)("div",{className:"a4-item-var",children:"Standard Order Package"})]}),(0,t.jsx)("td",{className:"text-center font-bold",children:"1"}),(0,t.jsxs)("td",{className:"text-right font-mono",children:["৳ ",Number(e.subtotal||e.total||0).toLocaleString()]}),(0,t.jsxs)("td",{className:"text-right font-mono font-bold",children:["৳ ",Number(e.subtotal||e.total||0).toLocaleString()]})]})})]}),(0,t.jsxs)("div",{className:"a4-summary-row",children:[(0,t.jsxs)("div",{className:"a4-payment-note",children:[(0,t.jsx)("div",{className:"a4-note-head",children:c?"💵 CASH ON DELIVERY":`💳 PAID ONLINE VIA ${(e.paymentMethod||"BKASH").toUpperCase()}`}),(0,t.jsx)("div",{className:"a4-note-p",children:c?"Please collect the exact total amount in cash upon delivery.":"This order is fully paid online. Do NOT collect any extra cash."})]}),(0,t.jsxs)("div",{className:"a4-calc-box",children:[(0,t.jsxs)("div",{className:"a4-calc-line",children:[(0,t.jsx)("span",{children:"Subtotal Amount:"}),(0,t.jsxs)("span",{className:"font-mono",children:["৳ ",Number(e.subtotal||Number(e.total||0)-Number(e.deliveryCharge||0)).toLocaleString()]})]}),Number(e.discount||0)>0&&(0,t.jsxs)("div",{className:"a4-calc-line discount-text",children:[(0,t.jsxs)("span",{children:["Promo Discount ",e.promoCode?`(${e.promoCode})`:"",":"]}),(0,t.jsxs)("span",{className:"font-mono font-bold",children:["- ৳ ",Number(e.discount).toLocaleString()]})]}),(0,t.jsxs)("div",{className:"a4-calc-line",children:[(0,t.jsx)("span",{children:"Courier Delivery Charge:"}),(0,t.jsxs)("span",{className:"font-mono",children:["৳ ",Number(e.deliveryCharge||0).toLocaleString()]})]}),(0,t.jsxs)("div",{className:"a4-calc-line a4-grand-total",children:[(0,t.jsx)("span",{children:"TOTAL PAYABLE:"}),(0,t.jsxs)("span",{className:"font-mono",children:["৳ ",Number(e.total||0).toLocaleString()]})]})]})]}),(0,t.jsxs)("div",{className:"a4-footer-section",children:[(0,t.jsxs)("div",{className:"a4-terms-box",children:[(0,t.jsx)("div",{className:"a4-terms-title",children:"🛡️ Customer Guarantee & Replacement Policy"}),(0,t.jsx)("p",{className:"a4-terms-desc",children:s})]}),(0,t.jsxs)("div",{className:"a4-sig-box",children:[(0,t.jsx)("div",{className:"a4-sig-line"}),(0,t.jsx)("div",{className:"a4-sig-name",children:n}),(0,t.jsx)("div",{className:"a4-sig-company",children:i})]})]})]})}),c=a.default.memo(function({order:e,settings:a,headerBrandTitle:i,companyBinNo:o,orderDate:n,isDhaka:s,isCod:r,totalItemCount:d,parcelDescription:c,barcodeFormattedNumber:p}){return(0,t.jsxs)("div",{className:"label-3x5-card",children:[(0,t.jsxs)("div",{className:"l3-header",children:[(0,t.jsxs)("div",{className:"l3-brand-col",children:[(0,t.jsx)("div",{className:"l3-brand-name",children:i}),(0,t.jsx)("div",{className:"l3-bin",children:o}),(0,t.jsxs)("div",{className:"l3-hub",children:["Hub: ",a.contact_address||"Dhaka, Bangladesh"]}),(0,t.jsxs)("div",{className:"l3-phone",children:["Hotline: ",a.contact_phone||"+880 1700-000000"]})]}),(0,t.jsxs)("div",{className:"l3-order-col",children:[(0,t.jsx)("div",{className:"l3-order-tag",children:"ORDER NO"}),(0,t.jsx)("div",{className:"l3-order-num",children:e.orderNumber}),(0,t.jsx)("div",{className:"l3-order-date",children:n})]})]}),(0,t.jsxs)("div",{className:"l3-routing-strip",children:[(0,t.jsxs)("div",{className:"l3-route-item",children:["ZONE: ",(0,t.jsx)("strong",{children:s?"INSIDE DHAKA":"OUTSIDE DHAKA"})]}),(0,t.jsxs)("div",{className:"l3-route-item",children:["SERVICE: ",(0,t.jsx)("strong",{children:"EXPRESS HOME DELIVERY"})]})]}),(0,t.jsxs)("div",{className:"l3-recipient-box",children:[(0,t.jsxs)("div",{className:"l3-section-title",children:[(0,t.jsx)("span",{children:"DELIVER TO / প্রাপক"}),(0,t.jsx)("span",{className:"l3-city-badge",children:s?"DHAKA CITY":"OUTSIDE DHAKA"})]}),(0,t.jsx)("div",{className:"l3-cust-name",children:e.customerName}),(0,t.jsxs)("div",{className:"l3-phone-row",children:[(0,t.jsx)("span",{className:"l3-phone-label",children:"PHONE / মোবাইল:"}),(0,t.jsx)("span",{className:"l3-phone-number",children:e.phone})]}),(0,t.jsxs)("div",{className:"l3-address-text",children:[(0,t.jsx)("strong",{children:"Address:"})," ",e.address,e.areaThana?`, ${e.areaThana}`:"",e.district&&!["inside_dhaka","outside_dhaka"].includes(e.district.toLowerCase())?`, ${e.district}`:""]}),e.deliveryNote&&(0,t.jsxs)("div",{className:"l3-note-text",children:[(0,t.jsx)("strong",{children:"Note:"})," ",e.deliveryNote]})]}),(0,t.jsxs)("div",{className:"l3-payment-box",children:[(0,t.jsxs)("div",{className:"l3-pay-left",children:[(0,t.jsx)("div",{className:"l3-pay-badge",children:r?"CASH ON DELIVERY (COD)":`PREPAID ORDER (${(e.paymentMethod||"ONLINE").toUpperCase()})`}),(0,t.jsx)("div",{className:"l3-pay-sub",children:r?"Collect Cash at Doorstep":"Do NOT Collect Cash (Already Paid)"})]}),(0,t.jsxs)("div",{className:"l3-pay-right",children:[(0,t.jsx)("div",{className:"l3-amount-tag",children:"AMOUNT TO COLLECT"}),(0,t.jsxs)("div",{className:"l3-amount-val",children:["৳ ",Number(e.total||0).toLocaleString()]})]})]}),(0,t.jsxs)("div",{className:"l3-parcel-box",children:[(0,t.jsxs)("div",{className:"l3-parcel-title",children:[(0,t.jsxs)("span",{children:["PARCEL CONTENTS (",d," PCS)"]}),(0,t.jsx)("span",{children:"FRAGILE ITEM"})]}),(0,t.jsx)("div",{className:"l3-parcel-desc",children:c})]}),(0,t.jsxs)("div",{className:"l3-fragile-strip",children:[(0,t.jsx)("div",{className:"l3-fragile-main",children:"▲ FRAGILE — HANDLE WITH CARE ▲"}),(0,t.jsx)("div",{className:"l3-fragile-sub",children:"ভঙ্গুর পণ্য • সাবধানে বহন করুন • KEEP DRY • DO NOT BEND"})]}),(0,t.jsxs)("div",{className:"l3-footer",children:[(0,t.jsxs)("div",{className:"l3-barcode-col",children:[l(p,32),(0,t.jsx)("div",{className:"l3-barcode-text",children:p})]}),(0,t.jsxs)("div",{className:"l3-support-col",children:[(0,t.jsx)("div",{className:"l3-sup-title",children:"HELPLINE SUPPORT"}),(0,t.jsx)("div",{className:"l3-sup-num",children:a.contact_phone||"+880 1700-000000"}),(0,t.jsx)("div",{className:"l3-sup-url",children:a.store_name_en||a.store_name||"StoreForge"})]})]})]})}),p=a.default.memo(function({order:e,settings:a,headerBrandTitle:i,companyBinNo:o,orderDate:n,isDhaka:s,isCod:r,totalItemCount:d,barcodeFormattedNumber:c}){return(0,t.jsxs)("div",{className:"label-4x6-card",children:[(0,t.jsxs)("div",{className:"l4-header",children:[(0,t.jsxs)("div",{className:"l4-brand-info",children:[a.store_logo_url&&(0,t.jsx)("img",{src:a.store_logo_url,alt:"Logo",loading:"lazy",className:"l4-logo"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"l4-brand-title",children:i}),(0,t.jsx)("div",{className:"l4-bin",children:o}),(0,t.jsxs)("div",{className:"l4-contact",children:["Hub: ",a.contact_address||"Dhaka, Bangladesh"," | Tel: ",a.contact_phone||"+880 1700-000000"]})]})]}),(0,t.jsxs)("div",{className:"l4-order-badge",children:[(0,t.jsx)("div",{className:"l4-badge-tag",children:"CONSIGNMENT / ORDER"}),(0,t.jsx)("div",{className:"l4-badge-num",children:e.orderNumber}),(0,t.jsx)("div",{className:"l4-badge-date",children:n})]})]}),(0,t.jsxs)("div",{className:"l4-dispatch-strip",children:[(0,t.jsxs)("div",{className:"l4-dispatch-col",children:[(0,t.jsx)("span",{className:"l4-label",children:"DELIVERY DESTINATION"}),(0,t.jsx)("span",{className:"l4-val",children:s?"INSIDE DHAKA METRO":"OUTSIDE DHAKA DISTRICT"})]}),(0,t.jsxs)("div",{className:"l4-dispatch-col",children:[(0,t.jsx)("span",{className:"l4-label",children:"SERVICE TYPE"}),(0,t.jsx)("span",{className:"l4-val",children:"EXPRESS DOORSTEP COURIER"})]}),(0,t.jsxs)("div",{className:"l4-dispatch-col text-right",children:[(0,t.jsx)("span",{className:"l4-label",children:"TOTAL PARCEL WEIGHT/PCS"}),(0,t.jsxs)("span",{className:"l4-val",children:[d," Unit(s)"]})]})]}),(0,t.jsxs)("div",{className:"l4-recipient-section",children:[(0,t.jsxs)("div",{className:"l4-section-header",children:[(0,t.jsx)("span",{children:"DELIVER TO / প্রাপকের বিবরণ"}),(0,t.jsx)("span",{className:"l4-tag-zone",children:s?"DHAKA ZONE":"NATIONWIDE DELIVERY"})]}),(0,t.jsxs)("div",{className:"l4-cust-row",children:[(0,t.jsx)("div",{className:"l4-name",children:e.customerName}),(0,t.jsxs)("div",{className:"l4-phone-highlight",children:[(0,t.jsx)("span",{className:"l4-phone-tag",children:"PHONE:"}),(0,t.jsx)("span",{className:"l4-phone-text",children:e.phone})]})]}),(0,t.jsxs)("div",{className:"l4-address",children:[(0,t.jsx)("strong",{children:"Address:"})," ",e.address,e.areaThana?`, ${e.areaThana}`:"",e.district&&!["inside_dhaka","outside_dhaka"].includes(e.district.toLowerCase())?`, ${e.district}`:""]}),e.deliveryNote&&(0,t.jsxs)("div",{className:"l4-note",children:[(0,t.jsx)("strong",{children:"Special Delivery Note:"})," ",e.deliveryNote]})]}),(0,t.jsxs)("div",{className:"l4-payment-section",children:[(0,t.jsxs)("div",{className:"l4-payment-left",children:[(0,t.jsx)("div",{className:"l4-pay-status-pill",children:r?"💵 CASH ON DELIVERY (COD)":`💳 PREPAID ONLINE (${(e.paymentMethod||"BKASH").toUpperCase()})`}),(0,t.jsx)("div",{className:"l4-pay-instructions",children:r?"Please collect the exact grand total in cash before handing over the parcel.":"This consignment is fully prepaid. Do NOT collect any additional fees."})]}),(0,t.jsxs)("div",{className:"l4-payment-right",children:[(0,t.jsx)("div",{className:"l4-collect-label",children:"COLLECTABLE CASH AMOUNT"}),(0,t.jsxs)("div",{className:"l4-collect-price",children:["৳ ",Number(e.total||0).toLocaleString()]})]})]}),(0,t.jsxs)("div",{className:"l4-items-box",children:[(0,t.jsxs)("div",{className:"l4-items-header",children:[(0,t.jsx)("span",{children:"PARCEL MANIFEST & ITEMS"}),(0,t.jsxs)("span",{children:["TOTAL ",d," PCS"]})]}),(0,t.jsx)("div",{className:"l4-items-list",children:e.items&&e.items.length>0?e.items.map((e,a)=>(0,t.jsxs)("div",{className:"l4-item-line",children:[(0,t.jsxs)("span",{children:["• ",e.product?.name||e.name||"StoreForge Product"," ",e.variantName?`(${e.variantName})`:""]}),(0,t.jsxs)("strong",{children:["Qty: ",e.quantity||1]})]},a)):(0,t.jsxs)("div",{className:"l4-item-line",children:[(0,t.jsx)("span",{children:"• StoreForge Product"}),(0,t.jsx)("strong",{children:"Qty: 1"})]})})]}),(0,t.jsxs)("div",{className:"l4-fragile-box",children:[(0,t.jsx)("div",{className:"l4-fragile-text",children:"▲ FRAGILE — HANDLE WITH CARE — সাবধানে বহন করুন ▲"}),(0,t.jsx)("div",{className:"l4-fragile-sub",children:"PREMIUM QUALITY CRAFT • DO NOT CRUSH OR BEND • KEEP DRY • REPLACEMENT GUARANTEED"})]}),(0,t.jsxs)("div",{className:"l4-footer",children:[(0,t.jsxs)("div",{className:"l4-barcode-col",children:[l(c,40),(0,t.jsx)("div",{className:"l4-barcode-text",children:c})]}),(0,t.jsxs)("div",{className:"l4-support-col",children:[(0,t.jsx)("div",{className:"l4-sup-tag",children:"LOGISTICS HELPLINE"}),(0,t.jsx)("div",{className:"l4-sup-phone",children:a.contact_phone||"+880 1700-000000"}),(0,t.jsx)("div",{className:"l4-sup-email",children:a.contact_email||"support@storeforge.io"})]})]})]})}),m=a.default.memo(function({format:e}){return(0,t.jsxs)(t.Fragment,{children:["invoice-a4"===e&&(0,t.jsx)("style",{children:`
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          @media print {
            html, body {
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 auto !important;
              padding: 0 !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .doc-screen-wrapper {
              padding: 0 !important;
              margin: 0 !important;
              background: #ffffff !important;
              min-height: 0 !important;
              display: block !important;
            }
            .doc-canvas {
              padding: 0 !important;
              margin: 0 !important;
              transform: none !important;
            }
            .invoice-a4-card {
              width: 210mm !important;
              max-width: 210mm !important;
              min-height: 297mm !important;
              padding: 16mm 18mm !important;
              margin: 0 auto !important;
              border: none !important;
              box-shadow: none !important;
              box-sizing: border-box !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }
          }
        `}),"label-3x5"===e&&(0,t.jsx)("style",{children:`
          @page {
            size: 3in 5in;
            margin: 0 !important;
          }
          @media print {
            html, body {
              width: 3in !important;
              height: 5in !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              overflow: hidden !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .doc-screen-wrapper {
              padding: 0 !important;
              margin: 0 !important;
              background: #ffffff !important;
              min-height: 0 !important;
              display: block !important;
            }
            .doc-canvas {
              padding: 0 !important;
              margin: 0 !important;
              transform: none !important;
            }
            .label-3x5-card {
              width: 3in !important;
              height: 5in !important;
              max-width: 3in !important;
              max-height: 5in !important;
              min-height: 5in !important;
              box-shadow: none !important;
              border: 2px solid #000000 !important;
              margin: 0 !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }
          }
        `}),"label-4x6"===e&&(0,t.jsx)("style",{children:`
          @page {
            size: 4in 6in;
            margin: 0 !important;
          }
          @media print {
            html, body {
              width: 4in !important;
              height: 6in !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              overflow: hidden !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .doc-screen-wrapper {
              padding: 0 !important;
              margin: 0 !important;
              background: #ffffff !important;
              min-height: 0 !important;
              display: block !important;
            }
            .doc-canvas {
              padding: 0 !important;
              margin: 0 !important;
              transform: none !important;
            }
            .label-4x6-card {
              width: 4in !important;
              height: 6in !important;
              max-width: 4in !important;
              max-height: 6in !important;
              min-height: 6in !important;
              box-shadow: none !important;
              border: 2px solid #000000 !important;
              margin: 0 !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }
          }
        `}),(0,t.jsx)("style",{children:`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Kalpurush", sans-serif;
          color: #000000;
          background: #0F172A;
          line-height: 1.4;
          -webkit-font-smoothing: antialiased;
        }

        .doc-screen-wrapper {
          min-height: 100vh;
          background: #0F172A;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .screen-toolbar {
          width: 100%;
          max-width: 980px;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 8px 14px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.5);
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .doc-icon-badge {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: linear-gradient(135deg, rgba(192, 138, 70, 0.22), rgba(192, 138, 70, 0.06));
          border: 1px solid rgba(192, 138, 70, 0.35);
          color: #FBBF24;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .doc-meta-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .doc-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .doc-title {
          font-size: 12.5px;
          font-weight: 800;
          color: #F8FAFC;
          letter-spacing: -0.01em;
        }

        .doc-order-tag {
          font-size: 11px;
          font-weight: 800;
          color: #CBD5E1;
          font-family: monospace;
          background: rgba(255, 255, 255, 0.08);
          padding: 1px 5px;
          border-radius: 4px;
        }

        .doc-size-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          color: #94A3B8;
          font-weight: 600;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 6px #10B981;
          display: inline-block;
        }

        .toolbar-center {
          display: flex;
          justify-content: center;
          flex: 1;
          min-width: 0;
        }

        .format-segmented-pill {
          display: flex;
          align-items: center;
          background: rgba(2, 6, 23, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 3px;
          border-radius: 11px;
          gap: 3px;
        }

        .format-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 11.5px;
          font-weight: 700;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #94A3B8;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
        }

        .format-tab-btn:hover {
          color: #F1F5F9;
          background: rgba(255, 255, 255, 0.06);
        }

        .format-tab-btn.active {
          background: linear-gradient(135deg, #dfa858, #b0752b);
          color: #FFFFFF;
          font-weight: 800;
          box-shadow: 0 2px 8px rgba(192, 138, 70, 0.4);
        }

        .tab-emoji {
          font-size: 12px;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .zoom-stepper {
          display: flex;
          align-items: center;
          background: rgba(2, 6, 23, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 2px 4px;
        }

        .zoom-step-btn {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #94A3B8;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.15s;
        }

        .zoom-step-btn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.1);
        }

        .zoom-percentage {
          font-size: 10.5px;
          font-weight: 700;
          color: #CBD5E1;
          padding: 0 5px;
          min-width: 34px;
          text-align: center;
        }

        .btn-print-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6.5px 15px;
          background: linear-gradient(135deg, #dfa858, #b0752b);
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 800;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(192, 138, 70, 0.4);
          transition: all 0.18s ease;
        }

        .btn-print-action:hover {
          background: linear-gradient(135deg, #e5b369, #a36924);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(192, 138, 70, 0.55);
        }

        .btn-close-action {
          padding: 6.5px 12px;
          background: rgba(51, 65, 85, 0.6);
          color: #E2E8F0;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .btn-close-action:hover {
          background: rgba(71, 85, 105, 0.9);
          color: #FFFFFF;
          border-color: rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 768px) {
          .screen-toolbar {
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            padding: 10px;
          }
          .toolbar-left, .toolbar-center, .toolbar-right {
            justify-content: center;
            flex-wrap: wrap;
          }
        }

        .doc-canvas {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
          transition: transform 0.2s ease;
        }

        .invoice-a4-card {
          width: 210mm;
          min-height: 297mm;
          max-width: 210mm;
          background: #FFFFFF;
          padding: 16mm 18mm;
          border-radius: 4px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
          color: #0F172A;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
        }

        .a4-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #0F172A;
          padding-bottom: 18px;
          margin-bottom: 20px;
          gap: 20px;
        }

        .a4-brand-col { flex: 1; }

        .a4-logo {
          max-height: 52px;
          max-width: 220px;
          object-fit: contain;
          margin-bottom: 8px;
        }

        .a4-brand-title {
          font-size: 18pt;
          font-weight: 900;
          letter-spacing: -0.01em;
          line-height: 1.15;
          color: #0F172A;
        }

        .a4-bin {
          font-size: 10pt;
          font-weight: 800;
          color: #C08A46;
          font-family: monospace;
          margin-top: 3px;
        }

        .a4-address, .a4-contact {
          font-size: 9.5pt;
          color: #475569;
          margin-top: 2px;
          line-height: 1.35;
        }

        .a4-meta-col {
          text-align: right;
          min-width: 260px;
        }

        .a4-invoice-badge {
          display: inline-block;
          background: #0F172A;
          color: #FFFFFF;
          padding: 5px 14px;
          font-size: 10.5pt;
          font-weight: 900;
          border-radius: 4px;
          letter-spacing: 0.08em;
          margin-bottom: 10px;
        }

        .a4-meta-table {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 9.5pt;
        }

        .a4-meta-row {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
        }

        .a4-meta-label { color: #64748B; font-weight: 600; }
        .a4-meta-val { color: #0F172A; }

        .a4-status-badge {
          font-weight: 800;
          font-size: 8.5pt;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .status-paid { background: #DCFCE7; color: #15803D; }
        .status-pending { background: #FEF3C7; color: #B45309; }

        .a4-details-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 18px;
          margin-bottom: 22px;
        }

        .a4-box {
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          padding: 14px 16px;
          background: #F8FAFC;
          font-size: 9.5pt;
        }

        .a4-box-title {
          font-size: 8pt;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: #475569;
          border-bottom: 1.5px solid #E2E8F0;
          padding-bottom: 4px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .a4-cust-name {
          font-size: 13pt;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 4px;
        }

        .a4-cust-line { margin-bottom: 3px; color: #1E293B; line-height: 1.35; }
        .a4-cust-note {
          background: #FEF3C7;
          border-left: 3px solid #D97706;
          padding: 5px 8px;
          font-size: 9pt;
          margin-top: 6px;
          color: #92400E;
          border-radius: 0 4px 4px 0;
        }

        .a4-routing-row {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
          font-size: 9.5pt;
          color: #334155;
        }

        .a4-barcode-container {
          margin-top: 8px;
          padding-top: 6px;
          border-top: 1px dashed #94A3B8;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .a4-barcode-container .barcode-svg {
          height: 32px;
          width: auto;
          max-width: 180px;
        }

        .a4-barcode-text {
          font-family: "Courier New", Courier, monospace;
          font-size: 8.5pt;
          font-weight: bold;
          letter-spacing: 0.12em;
          margin-top: 2px;
        }

        .a4-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 22px;
          font-size: 9.5pt;
        }

        .a4-table th {
          background: #0F172A;
          color: #FFFFFF;
          padding: 9px 12px;
          font-weight: 800;
          font-size: 9pt;
          text-transform: uppercase;
          text-align: left;
        }

        .a4-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #E2E8F0;
          vertical-align: middle;
        }

        .a4-table tbody tr:nth-child(even) {
          background: #F8FAFC;
        }

        .a4-item-title { font-size: 10.5pt; font-weight: 800; color: #0F172A; }
        .a4-item-var { font-size: 8.5pt; color: #64748B; margin-top: 2px; }
        .a4-item-sku { font-family: monospace; font-size: 8pt; color: #94A3B8; margin-top: 1px; }

        .text-center { text-align: center !important; }
        .text-right { text-align: right !important; }

        .a4-summary-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .a4-payment-note {
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          padding: 12px 14px;
          background: #F8FAFC;
        }

        .a4-note-head { font-size: 10pt; font-weight: 900; color: #0F172A; margin-bottom: 4px; }
        .a4-note-p { font-size: 9pt; color: #64748B; line-height: 1.4; }

        .a4-calc-box {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 9.5pt;
        }

        .a4-calc-line {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
          color: #334155;
        }

        .discount-text { color: #059669; font-weight: 700; }

        .a4-grand-total {
          border-top: 2px solid #0F172A;
          padding-top: 8px;
          margin-top: 4px;
          font-size: 13.5pt;
          font-weight: 900;
          color: #0F172A;
        }

        .a4-footer-section {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 24px;
          border-top: 1.5px solid #CBD5E1;
          padding-top: 16px;
        }

        .a4-terms-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 10px 14px;
        }

        .a4-terms-title { font-size: 9pt; font-weight: 800; color: #0F172A; margin-bottom: 3px; }
        .a4-terms-desc { font-size: 8.5pt; color: #64748B; line-height: 1.45; }

        .a4-sig-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          text-align: center;
          padding-top: 20px;
        }

        .a4-sig-line {
          width: 180px;
          border-top: 1.5px dashed #0F172A;
          margin-bottom: 6px;
        }

        .a4-sig-name { font-size: 9.5pt; font-weight: 800; color: #0F172A; }
        .a4-sig-company { font-size: 8.5pt; color: #64748B; text-transform: uppercase; }

        .label-3x5-card {
          width: 3in;
          height: 5in;
          min-height: 5in;
          max-height: 5in;
          background: #FFFFFF;
          border: 2px solid #000000;
          padding: 2.2mm 2.5mm;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          position: relative;
          color: #000000;
          box-sizing: border-box;
        }

        .l3-header {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          border-bottom: 2px solid #000000;
          padding-bottom: 2px;
          gap: 4px;
        }

        .l3-brand-col { flex: 1; min-width: 0; }

        .l3-brand-name {
          font-size: 7.8pt;
          font-weight: 900;
          color: #000000;
          text-transform: uppercase;
          line-height: 1.1;
        }

        .l3-bin {
          font-size: 5.5pt;
          font-weight: 800;
          color: #000000;
          font-family: monospace;
          margin-top: 1px;
        }

        .l3-hub, .l3-phone {
          font-size: 5.5pt;
          font-weight: 700;
          color: #222222;
          line-height: 1.15;
        }

        .l3-order-col {
          background: #000000;
          color: #FFFFFF;
          padding: 2.5px 5px;
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-radius: 1px;
          flex-shrink: 0;
        }

        .l3-order-tag {
          font-size: 5pt;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #E2E8F0;
        }

        .l3-order-num {
          font-size: 10.5pt;
          font-weight: 900;
          color: #FFFFFF !important;
          line-height: 1.1;
        }

        .l3-order-date {
          font-size: 5.5pt;
          font-weight: 700;
          color: #E2E8F0 !important;
        }

        .l3-routing-strip {
          background: #F1F5F9;
          border: 1px solid #000000;
          padding: 2px 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 6pt;
          font-weight: 700;
          margin-top: 2px;
        }

        .l3-route-item strong {
          font-size: 6.5pt;
          font-weight: 900;
        }

        .l3-recipient-box {
          border: 1.5px solid #000000;
          padding: 2.5px 4.5px;
          margin-top: 2px;
          background: #FFFFFF;
        }

        .l3-section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 6pt;
          font-weight: 900;
          text-transform: uppercase;
          border-bottom: 1px solid #DDDDDD;
          padding-bottom: 1px;
          margin-bottom: 2px;
        }

        .l3-city-badge {
          background: #000000;
          color: #FFFFFF;
          padding: 0.5px 3px;
          font-size: 5.5pt;
          font-weight: 900;
        }

        .l3-cust-name {
          font-size: 9.5pt;
          font-weight: 900;
          color: #000000;
          line-height: 1.15;
          text-transform: capitalize;
        }

        .l3-phone-row {
          display: inline-flex;
          align-items: baseline;
          gap: 5px;
          border-bottom: 1px solid #000000;
          padding-bottom: 1px;
          margin: 1px 0 2px;
        }

        .l3-phone-label {
          font-size: 6pt;
          font-weight: 800;
          color: #333333;
        }

        .l3-phone-number {
          font-size: 10.5pt;
          font-weight: 900;
          color: #000000;
          letter-spacing: 0.02em;
        }

        .l3-address-text {
          font-size: 7.2pt;
          font-weight: 700;
          color: #000000;
          line-height: 1.25;
          word-break: break-word;
        }

        .l3-note-text {
          font-size: 6pt;
          font-weight: 700;
          color: #111111;
          font-style: italic;
          background: #F8FAFC;
          padding: 1px 4px;
          border-left: 2px solid #000000;
          margin-top: 1.5px;
        }

        .l3-payment-box {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          border: 2px solid #000000;
          margin-top: 2px;
          background: #F8FAFC;
        }

        .l3-pay-left {
          padding: 3px 5px;
          flex: 1;
        }

        .l3-pay-badge {
          font-size: 7pt;
          font-weight: 900;
          color: #000000;
        }

        .l3-pay-sub {
          font-size: 5.5pt;
          font-weight: 700;
          color: #333333;
        }

        .l3-pay-right {
          background: #000000;
          color: #FFFFFF;
          padding: 3px 6px;
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-shrink: 0;
        }

        .l3-amount-tag {
          font-size: 5pt;
          font-weight: 800;
          color: #CBD5E1;
        }

        .l3-amount-val {
          font-size: 11pt;
          font-weight: 900;
          color: #FFFFFF !important;
          line-height: 1.1;
        }

        .l3-parcel-box {
          border: 1px dashed #000000;
          padding: 2px 4px;
          margin-top: 2px;
          font-size: 6pt;
        }

        .l3-parcel-title {
          display: flex;
          justify-content: space-between;
          font-weight: 900;
          font-size: 5.5pt;
          margin-bottom: 1px;
        }

        .l3-parcel-desc {
          font-size: 6.2pt;
          font-weight: 700;
          line-height: 1.2;
        }

        .l3-fragile-strip {
          background: #000000;
          color: #FFFFFF;
          text-align: center;
          padding: 2px 3px;
          margin-top: 2px;
        }

        .l3-fragile-main {
          font-size: 7.2pt;
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        .l3-fragile-sub {
          font-size: 4.8pt;
          font-weight: 700;
          color: #CBD5E1;
        }

        .l3-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1.5px solid #000000;
          padding-top: 2px;
          margin-top: 2px;
          gap: 6px;
        }

        .l3-barcode-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .l3-barcode-col .barcode-svg {
          height: 28px;
          width: auto;
          max-width: 130px;
        }

        .l3-barcode-text {
          font-family: monospace;
          font-size: 6pt;
          font-weight: 900;
          letter-spacing: 0.08em;
          margin-top: 1px;
        }

        .l3-support-col {
          text-align: right;
          font-size: 5.5pt;
          font-weight: 700;
          flex-shrink: 0;
        }

        .l3-sup-title { font-size: 5pt; font-weight: 800; color: #444444; }
        .l3-sup-num { font-size: 6.5pt; font-weight: 900; color: #000000; }
        .l3-sup-url { font-size: 5pt; color: #555555; }

        .label-4x6-card {
          width: 4in;
          height: 6in;
          min-height: 6in;
          max-height: 6in;
          background: #FFFFFF;
          border: 2px solid #000000;
          padding: 4mm 5mm;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          position: relative;
          color: #000000;
          box-sizing: border-box;
        }

        .l4-header {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          border-bottom: 2px solid #000000;
          padding-bottom: 4px;
          gap: 8px;
        }

        .l4-brand-info {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .l4-logo {
          max-height: 38px;
          max-width: 90px;
          object-fit: contain;
        }

        .l4-brand-title {
          font-size: 10pt;
          font-weight: 900;
          color: #000000;
          text-transform: uppercase;
        }

        .l4-bin {
          font-size: 6.5pt;
          font-weight: 800;
          color: #000000;
          font-family: monospace;
        }

        .l4-contact {
          font-size: 6.5pt;
          font-weight: 700;
          color: #333333;
        }

        .l4-order-badge {
          background: #000000;
          color: #FFFFFF;
          padding: 3px 8px;
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .l4-badge-tag {
          font-size: 6pt;
          font-weight: 800;
          color: #E2E8F0;
        }

        .l4-badge-num {
          font-size: 12pt;
          font-weight: 900;
          color: #FFFFFF !important;
          line-height: 1.1;
        }

        .l4-badge-date {
          font-size: 6.5pt;
          font-weight: 700;
          color: #CBD5E1;
        }

        .l4-dispatch-strip {
          background: #F1F5F9;
          border: 1px solid #000000;
          padding: 3px 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 7pt;
          margin-top: 3px;
        }

        .l4-dispatch-col {
          display: flex;
          flex-direction: column;
        }

        .l4-dispatch-col .l4-label {
          font-size: 5.5pt;
          font-weight: 800;
          color: #475569;
        }

        .l4-dispatch-col .l4-val {
          font-size: 7pt;
          font-weight: 900;
          color: #000000;
        }

        .l4-recipient-section {
          border: 1.5px solid #000000;
          padding: 4px 6px;
          margin-top: 3px;
          background: #FFFFFF;
        }

        .l4-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 7pt;
          font-weight: 900;
          border-bottom: 1px solid #CCCCCC;
          padding-bottom: 2px;
          margin-bottom: 3px;
        }

        .l4-tag-zone {
          background: #000000;
          color: #FFFFFF;
          padding: 1px 4px;
          font-size: 6pt;
          font-weight: 900;
        }

        .l4-cust-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 2px;
        }

        .l4-name {
          font-size: 11pt;
          font-weight: 900;
          color: #000000;
          text-transform: capitalize;
        }

        .l4-phone-highlight {
          display: inline-flex;
          align-items: baseline;
          gap: 4px;
          border-bottom: 1.5px solid #000000;
        }

        .l4-phone-tag { font-size: 6.5pt; font-weight: 800; color: #333333; }
        .l4-phone-text { font-size: 11pt; font-weight: 900; color: #000000; }

        .l4-address {
          font-size: 8.5pt;
          font-weight: 700;
          color: #000000;
          line-height: 1.3;
        }

        .l4-note {
          font-size: 7pt;
          font-weight: 700;
          color: #000000;
          font-style: italic;
          background: #F8FAFC;
          padding: 2px 6px;
          border-left: 2px solid #000000;
          margin-top: 2px;
        }

        .l4-payment-section {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          border: 2px solid #000000;
          margin-top: 3px;
          background: #F8FAFC;
        }

        .l4-payment-left {
          padding: 4px 6px;
          flex: 1;
        }

        .l4-pay-status-pill {
          font-size: 8pt;
          font-weight: 900;
          color: #000000;
        }

        .l4-pay-instructions {
          font-size: 6.5pt;
          font-weight: 700;
          color: #333333;
          margin-top: 1px;
        }

        .l4-payment-right {
          background: #000000;
          color: #FFFFFF;
          padding: 4px 8px;
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-shrink: 0;
        }

        .l4-collect-label {
          font-size: 5.5pt;
          font-weight: 800;
          color: #CBD5E1;
        }

        .l4-collect-price {
          font-size: 13pt;
          font-weight: 900;
          color: #FFFFFF !important;
          line-height: 1.1;
        }

        .l4-items-box {
          border: 1px dashed #000000;
          padding: 3px 6px;
          margin-top: 3px;
          font-size: 7pt;
        }

        .l4-items-header {
          display: flex;
          justify-content: space-between;
          font-weight: 900;
          font-size: 6.5pt;
          margin-bottom: 2px;
          border-bottom: 1px dotted #AAAAAA;
          padding-bottom: 1px;
        }

        .l4-items-list {
          display: flex;
          flex-direction: column;
          gap: 1.5px;
        }

        .l4-item-line {
          display: flex;
          justify-content: space-between;
          font-size: 7pt;
          font-weight: 700;
        }

        .l4-fragile-box {
          background: #000000;
          color: #FFFFFF;
          text-align: center;
          padding: 2.5px 4px;
          margin-top: 3px;
        }

        .l4-fragile-text {
          font-size: 8.5pt;
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        .l4-fragile-sub {
          font-size: 5.5pt;
          font-weight: 700;
          color: #CBD5E1;
        }

        .l4-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 2px solid #000000;
          padding-top: 3px;
          margin-top: 3px;
          gap: 8px;
        }

        .l4-barcode-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .l4-barcode-col .barcode-svg {
          height: 34px;
          width: auto;
          max-width: 170px;
        }

        .l4-barcode-text {
          font-family: monospace;
          font-size: 7pt;
          font-weight: 900;
          letter-spacing: 0.1em;
          margin-top: 1px;
        }

        .l4-support-col {
          text-align: right;
          font-size: 6.5pt;
          font-weight: 700;
          flex-shrink: 0;
        }

        .l4-sup-tag { font-size: 5.5pt; font-weight: 800; color: #444444; }
        .l4-sup-phone { font-size: 7.5pt; font-weight: 900; color: #000000; }
        .l4-sup-email { font-size: 5.5pt; color: #555555; }
      `})]})});e.s(["f",0,function(){let e=(0,i.useParams)(),s=e?.id,[r,l]=(0,a.useState)(null),[x,h]=(0,a.useState)({}),[g,b]=(0,a.useState)(!0),[f,u]=(0,a.useState)("invoice-a4"),[j,N]=(0,a.useState)(100);(0,a.useEffect)(()=>{s&&Promise.all([(0,o._)(`/orders/${s}`),(0,o._)("/settings/public")]).then(([e,t])=>{l(e),h(t||{}),b(!1)}).catch(()=>{b(!1)})},[s]);let v=(0,a.useCallback)(()=>{window.print()},[]),F=(0,a.useCallback)(()=>{window.history.length>1?window.history.back():window.close()},[]),w=(0,a.useMemo)(()=>r?.createdAt?new Date(r.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):"",[r?.createdAt]),y=(0,a.useMemo)(()=>!!r&&("inside_dhaka"===r.district||r.district&&r.district.toLowerCase().includes("dhaka")||r.address&&r.address.toLowerCase().includes("dhaka")),[r]),k=(0,a.useMemo)(()=>!r?.paymentMethod||"cod"===r.paymentMethod,[r?.paymentMethod]),z=(0,a.useMemo)(()=>r?.items&&r.items.reduce((e,t)=>e+(Number(t.quantity)||1),0)||1,[r?.items]),E=x.barcode_prefix||"SF",C=x.invoice_header_title||x.store_name_en||x.store_name||"STOREFORGE",A=x.invoice_bin_no||"BIN: 004829103-0101",D=x.invoice_sign_label||"Authorized Store Signature",S=x.invoice_footer_note||"Thank you for your purchase! 100% replacement guarantee if damaged during courier transit. For customer care support, call +880 1700-000000 or WhatsApp.",T=(0,a.useMemo)(()=>{if(!r?.orderNumber)return E+"000101";let e=String(r.orderNumber).replace(/#/g,"").trim();return e.toUpperCase().startsWith(E.toUpperCase())?e.toUpperCase():`${E}-${e}`},[r?.orderNumber,E]),I=(0,a.useMemo)(()=>{if(!r?.items||0===r.items.length)return"3D Wooden World Map Set (1 pc)";if(r.items.length>1)return`Wooden Wall Art & Decor Set (${z} pcs / ${r.items.length} items)`;let e=r.items[0],t=e.product?.name||e.name||"3D Wooden World Map",a=e.variantName||e.size||e.color?` (${[e.size,e.color,e.variantName].filter(Boolean).join(", ")})`:"";return`${t}${a} \xd7 ${e.quantity||1}`},[r?.items,z]);return g?(0,t.jsxs)("div",{className:"min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4",children:[(0,t.jsx)("div",{className:"w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"}),(0,t.jsx)("p",{className:"text-sm font-semibold",children:"Generating High-Precision Printable Document..."})]}):r?(0,t.jsxs)("div",{className:"doc-screen-wrapper",children:[(0,t.jsx)(m,{format:f}),(0,t.jsx)(n,{orderNumber:r.orderNumber,format:f,setFormat:u,zoomScale:j,setZoomScale:N,onPrint:v,onClose:F}),(0,t.jsxs)("main",{className:"doc-canvas",style:{transform:100!==j?`scale(${j/100})`:void 0,transformOrigin:"top center"},children:["invoice-a4"===f&&(0,t.jsx)(d,{order:r,settings:x,headerBrandTitle:C,companyBinNo:A,signatureLabel:D,footerTerms:S,orderDate:w,isDhaka:y,isCod:k,totalItemCount:z,barcodeFormattedNumber:T}),"label-3x5"===f&&(0,t.jsx)(c,{order:r,settings:x,headerBrandTitle:C,companyBinNo:A,orderDate:w,isDhaka:y,isCod:k,totalItemCount:z,parcelDescription:I,barcodeFormattedNumber:T}),"label-4x6"===f&&(0,t.jsx)(p,{order:r,settings:x,headerBrandTitle:C,companyBinNo:A,orderDate:w,isDhaka:y,isCod:k,totalItemCount:z,barcodeFormattedNumber:T})]})]}):(0,t.jsxs)("div",{className:"min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 text-center",children:[(0,t.jsx)("div",{className:"text-4xl mb-2",children:"📦"}),(0,t.jsx)("h2",{className:"text-lg font-bold mb-1",children:"Order Not Found"}),(0,t.jsx)("p",{className:"text-xs text-slate-400 mb-4",children:"Could not load document data for this order ID."}),(0,t.jsx)("button",{type:"button",onClick:F,className:"px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer",children:"Go Back"})]})}],73025)}]);