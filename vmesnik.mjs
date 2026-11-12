import {razloziNapako,izberiRazveljavitev,vaje,razcleniSpor,sestaviSpor,preveriVajo,novoStanje,korak} from './jedro.mjs';
const en=(izbor,koren=document)=>koren.querySelector(izbor);
const vsi=(izbor,koren=document)=>[...koren.querySelectorAll(izbor)];
function ustvari(znacka,besedilo,razred){const e=document.createElement(znacka);if(besedilo!==undefined)e.textContent=besedilo;if(razred)e.className=razred;return e;}
function izpisiOdgovor(cilj,o){
 cilj.replaceChildren(ustvari('span',o.tveganje?'POTREBEN JE PREVIDEN PREGLED':'NASLEDNJI KORAK','znacka'),ustvari('h2',o.naslov),ustvari('p',o.opis));
 if(o.pregled){cilj.append(ustvari('h3','Pred odločitvijo preglej'));const pre=ustvari('pre');pre.append(ustvari('code',o.pregled.join('\n')));cilj.append(pre);}
 if(o.ukazi.length){cilj.append(ustvari('h3',o.pregled?'Učni primer, ne samodejna rešitev':'Ukazi za pregled'));const pre=ustvari('pre');pre.append(ustvari('code',o.ukazi.join('\n')));cilj.append(pre);}
 const a=ustvari('a','Preberi razlago in omejitve →','besedilna-povezava');a.href=o.povezava;cilj.append(a);cilj.hidden=false;
}
const meni=en('#preklop-menija');if(meni)meni.addEventListener('click',()=>{const odprt=meni.getAttribute('aria-expanded')==='true';meni.setAttribute('aria-expanded',String(!odprt));en('#stranska-navigacija').classList.toggle('odprto',!odprt);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&meni){meni.setAttribute('aria-expanded','false');en('#stranska-navigacija').classList.remove('odprto');}});
const pomoc=en('#obrazec-pomoc');
if(pomoc)pomoc.addEventListener('submit',e=>{e.preventDefault();izpisiOdgovor(en('#odgovor-pomoc'),razloziNapako(new FormData(pomoc).get('tezava')));});
const undo=en('#obrazec-izbira');
if(undo){
 function prikazi(){const cilj=undo.elements.cilj.value;vsi('[data-pogoj]',undo).forEach(e=>{e.hidden=!e.dataset.pogoj.split(' ').includes(cilj);});en('#odgovor-izbira').hidden=true;}
 undo.addEventListener('change',prikazi);prikazi();
 undo.addEventListener('submit',e=>{e.preventDefault();izpisiOdgovor(en('#odgovor-izbira'),izberiRazveljavitev(Object.fromEntries(new FormData(undo))));});
}
const vaja=en('#vaja');
if(vaja){let indeks=0;const vhod=en('#vhod-spora'),izhod=en('#resitev-spora'),sporocilo=en('#preverjanje-vaje');
 function nalozi(){const v=vaje[indeks];vhod.value=v.vhod;izhod.value='';en('#navodilo-vaje').textContent=v.navodilo;sporocilo.textContent='Rešitev še ni preverjena.';en('#strani-spora').replaceChildren();
  const deli=razcleniSpor(v.vhod);for(const del of deli.filter(d=>d.vrsta==='spor')){for(const [ime,napis] of [['prva','Trenutna stran'],['druga','Druga stran']]){const blok=ustvari('section');blok.append(ustvari('h3',napis),ustvari('pre',del[ime]));en('#strani-spora').append(blok);}}
 }
 en('#izbira-vaje').addEventListener('change',e=>{indeks=Number(e.target.value);nalozi();});
 vsi('[data-stran]').forEach(g=>g.addEventListener('click',()=>{izhod.value=sestaviSpor(vhod.value,g.dataset.stran);sporocilo.textContent='Vstavljena je izbrana stran. Zdaj vsebino prilagodi učnemu cilju.';}));
 en('#preveri-vajo').addEventListener('click',()=>{const r=preveriVajo(izhod.value,indeks);sporocilo.textContent=r.sporocilo;sporocilo.dataset.uspeh=String(r.uspeh);});
 en('#pokazi-resitev').addEventListener('click',()=>{izhod.value=vaje[indeks].resitev;sporocilo.textContent='Prikazana je vzorčna rešitev. Primerjaj jo z obema stranema in navodilom.';});
 en('#ponovi-vajo').addEventListener('click',nalozi);nalozi();
}
const laboratorij=en('#laboratorij');
if(laboratorij){let stanje=novoStanje();
 function osvezi(){for(const kljuc of ['delovno','priprava','glava'])en('#stanje-'+kljuc).textContent=stanje[kljuc]||'∅';en('#opis-laboratorija').textContent=stanje.sporocilo;en('#oznaka-delovno').textContent=stanje.delovno===stanje.priprava?'Enako pripravi':'Razlika do priprave';en('#oznaka-priprava').textContent=stanje.priprava===stanje.glava?'Enako HEAD':'Sprememba za potrditev';en('#zgodovina-laboratorija').replaceChildren(...stanje.potrditve.map(p=>ustvari('li',p.oznaka+' · '+p.vsebina)));}
 vsi('[data-dejanje]').forEach(g=>g.addEventListener('click',()=>{stanje=korak(stanje,g.dataset.dejanje,en('#besedilo-datoteke').value);osvezi();}));
 en('#ponastavi-laboratorij').addEventListener('click',()=>{stanje=novoStanje();en('#besedilo-datoteke').value='Drugi zapis.';osvezi();});osvezi();
}
const iskanje=en('#iskanje-vodicev');
if(iskanje){const normaliziraj=s=>s.toLocaleLowerCase('sl').normalize('NFD').replace(/[\u0300-\u036f]/g,'');const gumbi=vsi('[data-filter]');let skupina='vse';function filtriraj(){let st=0;vsi('[data-vodic]').forEach(k=>{const ustreza=(skupina==='vse'||k.dataset.skupina===skupina)&&normaliziraj(k.textContent).includes(normaliziraj(iskanje.value));k.hidden=!ustreza;if(ustreza)st++;});en('#stevilo-zadetkov').textContent='Najdeni vodiči: '+st;}
 iskanje.addEventListener('input',filtriraj);gumbi.forEach(g=>g.addEventListener('click',()=>{skupina=g.dataset.filter;gumbi.forEach(x=>x.setAttribute('aria-pressed',String(x===g)));filtriraj();}));
}
vsi('[data-kopiraj]').forEach(g=>g.addEventListener('click',async()=>{const besedilo=en('#'+g.dataset.kopiraj).textContent;try{await navigator.clipboard.writeText(besedilo);g.textContent='Kopirano';}catch{g.textContent='Označi besedilo in ga kopiraj ročno.';}setTimeout(()=>g.textContent='Kopiraj ukaz',2500);}));
vsi('[data-natisni]').forEach(g=>g.addEventListener('click',()=>window.print()));
