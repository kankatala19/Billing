export type Product = { id:string; name:string; sku:string; category:string; unit:string; stock:number; cost:number; sellingPrice:number; taxRate:number; minStock:number; size?:string; colour?:string; design?:string; model?:string };
export type Customer = { id:string; name:string; phone:string; gstin:string; totalPurchases:number; outstandingCredit:number };
export type Supplier = { id:string; name:string; phone:string; gstin:string; totalPurchases:number; outstandingBalance:number };
export type LineItem = { productId:string; name:string; qty:number; price:number; cost:number; taxRate:number; discount:number };
export type Invoice = { id:string; number:string; date:string; customerId:string; items:LineItem[]; subtotal:number; discount:number; tax:number; total:number; paymentMethod:string; paymentStatus:string };
export type Purchase = { id:string; number:string; supplierId:string; date:string; items:LineItem[]; total:number; paymentStatus:string };
export type Expense = { id:string; date:string; category:string; description:string; amount:number; paymentMethod:string; recordedBy:string };
export type Staff = { id:string; name:string; role:string; contact:string; monthlySalary:number; status:string };
export type SalaryPayment = { id:string; staffId:string; month:string; salary:number; advance:number; deduction:number; paid:number; remaining:number };
export type Settings = { shopName:string; owner:string; phone:string; email:string; address:string; gstin:string; state:string; taxMode:string; defaultTax:number; invoicePrefix:string; nextInvoice:number; footer:string; paymentInstructions:string; printLayout:string; role:string };
export type StoreData = { products:Product[]; customers:Customer[]; suppliers:Supplier[]; invoices:Invoice[]; purchases:Purchase[]; expenses:Expense[]; staff:Staff[]; salaries:SalaryPayment[]; settings:Settings; movements:{id:string;date:string;productId:string;type:string;qty:number;reason:string;notes:string}[] };
export const seed:StoreData = {
 products:[
  {id:'p1',name:'Kanjivaram Silk Saree',sku:'TX-1042',category:'Sarees',unit:'piece',stock:18,cost:4200,sellingPrice:6250,taxRate:5,minStock:5,colour:'Ruby red',design:'Temple border'},
  {id:'p2',name:'Cotton Voile Fabric',sku:'FB-2088',category:'Fabric',unit:'metre',stock:124,cost:145,sellingPrice:225,taxRate:5,minStock:30,colour:'Ivory'},
  {id:'p3',name:'Basmati Rice Premium',sku:'GR-3012',category:'Grocery',unit:'kg',stock:42,cost:82,sellingPrice:112,taxRate:5,minStock:20},
  {id:'p4',name:'Glass Bangle Set',sku:'BG-4401',category:'Bangles',unit:'set',stock:7,cost:95,sellingPrice:185,taxRate:12,minStock:10,colour:'Emerald'},
  {id:'p5',name:'All-season Tyre 165/70 R14',sku:'TY-5211',category:'Tyres',unit:'piece',stock:12,cost:3150,sellingPrice:4250,taxRate:28,minStock:4,model:'RoadGrip'},
  {id:'p6',name:'Linen Blend Kurta Material',sku:'TX-1120',category:'Fabric',unit:'piece',stock:3,cost:680,sellingPrice:1190,taxRate:5,minStock:8,colour:'Indigo'},
  {id:'p7',name:'Toor Dal',sku:'GR-3170',category:'Grocery',unit:'kg',stock:31,cost:118,sellingPrice:154,taxRate:5,minStock:15},
  {id:'p8',name:'Brass Stud Bangle',sku:'BG-4416',category:'Bangles',unit:'pair',stock:24,cost:180,sellingPrice:320,taxRate:12,minStock:8},
 ],
 customers:[
  {id:'c1',name:'Meera Textiles',phone:'98765 43210',gstin:'27AABCM1234C1Z5',totalPurchases:48250,outstandingCredit:3200},
  {id:'c2',name:'Ananya Rao',phone:'98201 45678',gstin:'',totalPurchases:18750,outstandingCredit:0},
  {id:'c3',name:'Kaveri Stores',phone:'97654 32109',gstin:'27AAKFK2345Q1Z1',totalPurchases:32600,outstandingCredit:5400},
  {id:'c4',name:'Walk-in customer',phone:'',gstin:'',totalPurchases:0,outstandingCredit:0},
 ],
 suppliers:[
  {id:'s1',name:'Kaveri Silk House',phone:'98450 12345',gstin:'29AAKFK2345Q1Z9',totalPurchases:124800,outstandingBalance:18500},
  {id:'s2',name:'Shree Wholesale Mart',phone:'98220 56789',gstin:'27AABFS1234M1Z3',totalPurchases:68500,outstandingBalance:0},
  {id:'s3',name:'Metro Tyre Distributors',phone:'98901 34567',gstin:'27AABFM5566B1Z8',totalPurchases:95400,outstandingBalance:12000},
 ],
 invoices:[
  {id:'i1',number:'MS-1048',date:new Date().toISOString().slice(0,10),customerId:'c1',items:[{productId:'p1',name:'Kanjivaram Silk Saree',qty:1,price:6250,cost:4200,taxRate:5,discount:0}],subtotal:6250,discount:0,tax:312.5,total:6562.5,paymentMethod:'UPI',paymentStatus:'Paid'},
  {id:'i2',number:'MS-1047',date:new Date(Date.now()-86400000).toISOString().slice(0,10),customerId:'c2',items:[{productId:'p3',name:'Basmati Rice Premium',qty:5,price:112,cost:82,taxRate:5,discount:0}],subtotal:560,discount:0,tax:28,total:588,paymentMethod:'Cash',paymentStatus:'Paid'},
  {id:'i3',number:'MS-1046',date:new Date(Date.now()-2*86400000).toISOString().slice(0,10),customerId:'c3',items:[{productId:'p5',name:'All-season Tyre 165/70 R14',qty:2,price:4250,cost:3150,taxRate:28,discount:200}],subtotal:8500,discount:200,tax:2324,total:10624,paymentMethod:'Credit',paymentStatus:'Partial'},
 ],
 purchases:[
  {id:'pu1',number:'PO-0264',supplierId:'s1',date:new Date(Date.now()-86400000*2).toISOString().slice(0,10),items:[{productId:'p1',name:'Kanjivaram Silk Saree',qty:4,price:4200,cost:4200,taxRate:5,discount:0}],total:17640,paymentStatus:'Partial'},
  {id:'pu2',number:'PO-0263',supplierId:'s2',date:new Date(Date.now()-86400000*5).toISOString().slice(0,10),items:[{productId:'p3',name:'Basmati Rice Premium',qty:25,price:82,cost:82,taxRate:5,discount:0}],total:2152.5,paymentStatus:'Paid'},
 ],
 expenses:[
  {id:'e1',date:new Date().toISOString().slice(0,10),category:'Rent',description:'Monthly shop rent',amount:18500,paymentMethod:'Bank transfer',recordedBy:'Ravi'},
  {id:'e2',date:new Date().toISOString().slice(0,10),category:'Utilities',description:'Electricity bill',amount:2840,paymentMethod:'UPI',recordedBy:'Ravi'},
  {id:'e3',date:new Date(Date.now()-86400000*2).toISOString().slice(0,10),category:'Transport',description:'Supplier delivery',amount:1250,paymentMethod:'Cash',recordedBy:'Ravi'},
 ],
 staff:[{id:'st1',name:'Ravi Kumar',role:'Store Manager',contact:'98765 11223',monthlySalary:28000,status:'Active'},{id:'st2',name:'Pooja Nair',role:'Sales Associate',contact:'98200 55221',monthlySalary:18500,status:'Active'},{id:'st3',name:'Imran Shaikh',role:'Inventory Assistant',contact:'98900 77881',monthlySalary:16000,status:'Active'}],
 salaries:[], movements:[],
 settings:{shopName:'Mitti & Loom',owner:'Ravi Kumar',phone:'+91 98765 11223',email:'hello@mittiandloom.in',address:'12, Market Road, Pune, Maharashtra 411001',gstin:'27AABCM1234C1Z5',state:'Maharashtra',taxMode:'Exclusive',defaultTax:5,invoicePrefix:'MS',nextInvoice:1049,footer:'Thank you for shopping with us.',paymentInstructions:'UPI: mittiandloom@upi',printLayout:'A4',role:'Owner'}
};
export const loadStore = ():StoreData => { try { const saved=localStorage.getItem('mitti-retail-demo'); return saved ? {...seed,...JSON.parse(saved)} : seed; } catch { return seed; } };
export const saveStore = (data:StoreData) => localStorage.setItem('mitti-retail-demo',JSON.stringify(data));
