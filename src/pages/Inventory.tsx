import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { AlertTriangle, ArrowDownRight, Boxes, ClipboardList, PackageCheck, PackageX, Search, SlidersHorizontal } from 'lucide-react';
import type { Product, StoreData } from '@/lib/data';

type Field = {key:string;label:string;type?:string;required?:boolean;options?:string[];value?:string|number;placeholder?:string};
type Props = {
  data:StoreData;
  update:(fn:(s:StoreData)=>unknown)=>void;
  openForm:(title:string,fields:Field[],submit:(v:Record<string,string>)=>void,description?:string)=>void;
  flash:(message:string)=>void;
};

type Condition = 'In stock' | 'Low stock' | 'Out of stock';
const conditionOf = (product:Product):Condition => product.stock <= 0 ? 'Out of stock' : product.stock <= product.minStock ? 'Low stock' : 'In stock';
const money = (amount:number) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(amount)||0);
const newId = () => Math.random().toString(36).slice(2,9);
const dateToday = () => new Date().toISOString().slice(0,10);

function Metric({label,value,detail,icon:Icon,tone='green'}:{label:string;value:string;detail:string;icon:typeof Boxes;tone?:'green'|'amber'|'red'|'blue'}) {
  const tones = {
    green:'bg-emerald-50 text-emerald-700',
    amber:'bg-amber-50 text-amber-700',
    red:'bg-rose-50 text-rose-700',
    blue:'bg-sky-50 text-sky-700',
  };
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,.025)] sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div><p className="text-[10px] font-bold uppercase tracking-[.09em] text-slate-500">{label}</p><p className="mt-2 text-[22px] font-bold tracking-tight text-slate-900">{value}</p><p className="mt-1 text-[11px] text-slate-500">{detail}</p></div>
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tones[tone]}`}><Icon size={18}/></div>
    </div>
  </section>;
}

function StatusBadge({condition,productId}:{condition:Condition;productId:string}) {
  const style = condition==='In stock' ? 'bg-emerald-50 text-emerald-700' : condition==='Low stock' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-700';
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${style}`} data-testid={`status-inventory-${productId}`}>{condition}</span>;
}

export default function Inventory({data,update,openForm,flash}:Props) {
  const [query,setQuery] = useState('');
  const [condition,setCondition] = useState('All conditions');
  const [category,setCategory] = useState('All categories');
  const categories = useMemo<string[]>(()=>['All categories',...Array.from(new Set(data.products.map(p=>p.category).filter((c): c is string => Boolean(c)))).sort()], [data.products]);
  const filtered = useMemo(()=>data.products.filter(product=>{
    const matchedText = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchedCondition = condition==='All conditions' || conditionOf(product)===condition;
    const matchedCategory = category==='All categories' || product.category===category;
    return matchedText && matchedCondition && matchedCategory;
  }).sort((a,b)=>{
    const order:Record<Condition,number>={'Out of stock':0,'Low stock':1,'In stock':2};
    return order[conditionOf(a)]-order[conditionOf(b)] || a.name.localeCompare(b.name);
  }),[data.products,query,condition,category]);
  const lowCount = data.products.filter(p=>p.stock>0 && p.stock<=p.minStock).length;
  const outCount = data.products.filter(p=>p.stock<=0).length;
  const adjust = (product:Product) => openForm(`Adjust stock · ${product.name}`,[
    {key:'change',label:'Quantity change (+/-)',type:'number',required:true,placeholder:'For example: 12 or -2'},
    {key:'reason',label:'Reason',required:true,options:['Stock count correction','Damaged goods','Return to supplier','Other']},
    {key:'notes',label:'Notes',type:'textarea',placeholder:'Add context for this movement'},
  ],values=>{
    const amount=Number(values.change);
    if(!Number.isFinite(amount)||amount===0){flash('Enter a non-zero quantity change.');return}
    if(product.stock+amount<0){flash('Stock cannot be adjusted below zero.');return}
    update(store=>({
      ...store,
      products:store.products.map(item=>item.id===product.id?{...item,stock:item.stock+amount}:item),
      movements:[{id:newId(),date:dateToday(),productId:product.id,type:amount>=0?'IN':'OUT',qty:Math.abs(amount),reason:values.reason,notes:values.notes},...store.movements],
    }));
    flash('Stock movement recorded.');
  },'Record a stock movement. The product quantity and movement history will be updated together.');

  return <div className="page-enter">
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[.14em] text-emerald-700">Shop operations</div><h1 className="text-[25px] font-bold tracking-[-.035em] text-slate-900">Inventory</h1><p className="mt-1 text-[13px] text-slate-500">A clear view of what is on hand and what needs attention.</p></div>
      <Link href="/purchases" data-testid="link-inventory-purchases" className="inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2.5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"><ClipboardList size={15}/>Record a purchase</Link>
    </div>

    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <Metric label="Products" value={data.products.length.toLocaleString('en-IN')} detail="Tracked in catalog" icon={Boxes}/>
      <Metric label="Units on hand" value={data.products.reduce((sum,p)=>sum+p.stock,0).toLocaleString('en-IN')} detail="Across all products" icon={PackageCheck} tone="blue"/>
      <Metric label="Stock value" value={money(data.products.reduce((sum,p)=>sum+(p.stock*p.cost),0))} detail="Based on cost price" icon={SlidersHorizontal}/>
      <Metric label="Low stock" value={String(lowCount)} detail="At or below reorder point" icon={AlertTriangle} tone="amber"/>
      <Metric label="Out of stock" value={String(outCount)} detail="Quantity is zero or less" icon={PackageX} tone="red"/>
    </div>

    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,.025)]">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div><h2 className="text-[14px] font-bold text-slate-800">Stock position</h2><p className="mt-0.5 text-[11px] text-slate-500">{filtered.length} of {data.products.length} products match</p></div>
        <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:items-center">
          <label className="relative block"><span className="sr-only">Search products, SKU or category</span><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input data-testid="input-inventory-search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search name, SKU or category" className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-[220px]"/></label>
          <label><span className="sr-only">Filter by stock condition</span><select data-testid="select-inventory-condition" value={condition} onChange={event=>setCondition(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"><option>All conditions</option><option>In stock</option><option>Low stock</option><option>Out of stock</option></select></label>
          <label><span className="sr-only">Filter by category</span><select data-testid="select-inventory-category" value={category} onChange={event=>setCategory(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">{categories.map(item=><option key={item}>{item}</option>)}</select></label>
        </div>
      </div>
      {filtered.length===0 ? <div className="flex flex-col items-center px-6 py-12 text-center">
        <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-slate-50 text-slate-400">{data.products.length===0?<Boxes size={20}/>:<Search size={20}/>}</div>
        <p className="font-semibold text-slate-700">{data.products.length===0?'No products to track yet':'No matching stock records'}</p>
        <p className="mt-1 max-w-sm text-xs text-slate-500">{data.products.length===0?'Add products in the catalog to see their stock condition here.':'Try another search or clear one of the active filters.'}</p>
        {data.products.length>0&&<button type="button" onClick={()=>{setQuery('');setCondition('All conditions');setCategory('All categories')}} className="mt-4 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" data-testid="button-clear-inventory-filters">Clear filters</button>}
      </div> : <>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead><tr>{['Product','SKU / category','Quantity','Reorder at','Condition',''].map((label,index)=><th key={`${label}-${index}`} className="whitespace-nowrap bg-slate-50/80 px-4 py-3 text-[10px] font-bold uppercase tracking-[.08em] text-slate-500">{label}</th>)}</tr></thead>
            <tbody>{filtered.map(product=><tr key={product.id} data-testid={`row-inventory-${product.id}`} className="transition-colors hover:bg-slate-50/60">
              <td className="border-t border-slate-100 px-4 py-3.5"><p className="font-semibold text-slate-800">{product.name}</p><p className="mt-1 text-[10px] text-slate-500">{product.category}</p></td>
              <td className="border-t border-slate-100 px-4 py-3.5"><p className="font-medium text-slate-700">{product.sku}</p><p className="mt-1 text-[10px] text-slate-500">{product.category}</p></td>
              <td className="border-t border-slate-100 px-4 py-3.5 font-semibold text-slate-800">{product.stock} <span className="font-normal text-slate-500">{product.unit}</span></td>
              <td className="border-t border-slate-100 px-4 py-3.5 text-slate-600">{product.minStock} {product.unit}</td>
              <td className="border-t border-slate-100 px-4 py-3.5"><StatusBadge condition={conditionOf(product)} productId={product.id}/></td>
              <td className="border-t border-slate-100 px-4 py-3.5 text-right"><button type="button" onClick={()=>adjust(product)} aria-label={`Adjust stock for ${product.name}`} data-testid={`button-adjust-stock-${product.id}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">Adjust stock</button></td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className="divide-y divide-slate-100 md:hidden">{filtered.map(product=><article key={product.id} data-testid={`card-inventory-${product.id}`} className="p-4">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-sm font-semibold text-slate-800">{product.name}</h3><p className="mt-1 text-[11px] text-slate-500">{product.sku} · {product.category}</p></div><StatusBadge condition={conditionOf(product)} productId={product.id}/></div>
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3"><div><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Quantity</p><p className="mt-1 text-sm font-bold text-slate-800">{product.stock} <span className="text-xs font-normal text-slate-500">{product.unit}</span></p></div><div><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Reorder threshold</p><p className="mt-1 text-sm font-bold text-slate-800">{product.minStock} <span className="text-xs font-normal text-slate-500">{product.unit}</span></p></div></div>
          <button type="button" onClick={()=>adjust(product)} data-testid={`button-adjust-stock-mobile-${product.id}`} className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">Adjust stock</button>
        </article>)}</div>
      </>}
    </section>
    {(lowCount>0||outCount>0)&&<div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><ArrowDownRight size={17} className="mt-0.5 shrink-0 text-amber-700"/><div><p className="text-xs font-semibold text-amber-900">Restocking attention</p><p className="mt-1 text-[11px] text-amber-800">{outCount} out of stock and {lowCount} low-stock {lowCount===1?'item':'items'} are at or below their reorder threshold.</p></div></div><Link href="/purchases" className="shrink-0 text-xs font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-950">Go to purchases</Link></div>}
  </div>;
}
