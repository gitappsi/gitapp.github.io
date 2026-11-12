export const napake = {
 zavrnitev: {naslov:'Najprej primerjaj obe zgodovini', opis:'Zavrnitev lahko pomeni, da oddaljena veja vsebuje spremembe, ki jih lokalno še nimaš. Preveri oddaljeni naslov in pridobi reference. Ne uporabljaj prisilnega pošiljanja kot prve rešitve.', ukazi:['git status','git remote -v','git fetch origin','git log --oneline --graph --decorate --all -n 15'], povezava:'zavrnjen-push.html'},
 mapa: {naslov:'Preveri lokacijo projekta',opis:'Odpri terminal v dejanskem klonu. Prenesen arhiv ni nujno repozitorij z zgodovino. Nova inicializacija ne obnovi stare zgodovine.',ukazi:['git rev-parse --show-toplevel','git status'],povezava:'ni-repozitorija.html'},
 prazno: {naslov:'Loči urejanje od priprave',opis:'Shrani datoteko v urejevalniku. Preveri, ali si v pravem klonu, ali je datoteka nesledena in ali je razlika že v področju priprave.',ukazi:['git status --short','git diff','git diff --cached'],povezava:'nic-za-potrditev.html'},
 prezrto: {naslov:'Pravilo ne odstrani že sledenih datotek',opis:'Preglej, ali je datoteka že v indeksu. Pravila prezrtja ne odstranijo prej potrjene vsebine. Ime opombe.txt je samo vzorec poti.',ukazi:['git status --short','git ls-files -- opombe.txt','git check-ignore -v --no-index -- opombe.txt'],povezava:'gitignore-ze-sledena-datoteka.html'},
 spor: {naslov:'Ugotovi, kateri postopek je v teku',opis:'Začni s pregledom stanja. Združevanje, preurejanje in razveljavljanje nimajo istega zaključnega ukaza. Pred izbiro strani preberi obe spremembi.',ukazi:['git status','git diff'],povezava:'spor-pri-zdruzevanju.html'},
 glava: {naslov:'Ohrani novo delo s poimenovano referenco',opis:'Ločeni HEAD ni sam po sebi napaka. Če si ustvaril novo delo, ga najprej preglej in ohrani, preden preklopiš drugam.',ukazi:['git status','git branch --show-current','git log -1 --oneline --decorate'],povezava:'loceni-head.html'},
 skrivnost: {naslov:'Najprej prekliči ali zamenjaj skrivnost',opis:'Pri ponudniku prekliči razkriti žeton ali geslo. Brisanje vrstice, dodatek v .gitignore in revert ne odstranijo stare vsebine iz zgodovine. Prave vrednosti nikamor ne lepi.',ukazi:[],povezava:'skrivnost-v-potrditvi.html'},
 drugo: {naslov:'Ne ugibaj z ukazom, ki briše stanje',opis:'Preveri trenutno vejo, pripravo in postopek. Neznane napake ta pomočnik ne diagnosticira. Shrani pomembno vsebino in poišči razlago konkretnega sporočila.',ukazi:['git status','git diff','git diff --cached'],povezava:'prekini-postopek.html'}
};
export function razloziNapako(izbira){if(!Object.hasOwn(napake,izbira))throw new Error('Izberi opis težave.');return structuredClone(napake[izbira]);}
export function izberiRazveljavitev({cilj,objavljeno,indeks,navadna}) {
 const pregled=['git status','git diff','git diff --cached','git log --oneline -n 5'];
 const odgovor=(naslov,opis,ukazi=[],povezava='restore-reset-revert.html',tveganje=false)=>({naslov,opis,ukazi,pregled,povezava,tveganje});
 if(!['priprava','sporocilo','objava','zavrzi'].includes(cilj))throw new Error('Najprej izberi namen.');
 if(cilj==='priprava')return odgovor('Spremeni samo pripravo','Za eno vzorčno pot v repozitoriju z obstoječim HEAD in brez spora: ukaz obnovi indeks iz HEAD, delovno datoteko pa ohrani. Opombe.txt zamenjaj z dejansko preverjeno potjo. Pred prvo potrditvijo ta primer ne velja.',['git restore --staged -- opombe.txt'],'odstrani-iz-priprave.html');
 if(cilj==='zavrzi')return odgovor('Ustavi se pred prepisom datoteke','Obnova delovne datoteke lahko nepovratno zavrže nepripravljeno vsebino. Najprej naredi neodvisno kopijo in preveri vir ter pot. Ta izbirnik namenoma ne izpiše ukaza za zavrženje. Preizkusi učni laboratorij. ',[],'restore-reset-revert.html',true);
 if(cilj==='sporocilo') {
  if(objavljeno!=='ne')return odgovor('Ne prepisuj neznane ali skupne zgodovine','Popravljanje s --amend ustvari novo potrditev z novim identifikatorjem. Če je bila že objavljena ali tega ne veš, se najprej dogovori z drugimi. ',[],'popravi-sporocilo-potrditve.html',true);
  if(indeks!=='ne')return odgovor('Najprej preglej pripravljene spremembe','Običajni --amend lahko vključi tudi vsebino indeksa. Dokler ne potrdiš, da v njem ni drugih sprememb, pomočnik ne sestavi naslednjega ukaza.',[],'popravi-sporocilo-potrditve.html');
  return odgovor('Popravi samo zadnjo lokalno potrditev','Primer velja za zadnjo, še neobjavljeno potrditev in indeks brez dodatnih sprememb. Nastane nov identifikator. Po ukazu preveri tudi datoteke potrditve.',['git commit --amend -m "Jasnejši opis spremembe"'],'popravi-sporocilo-potrditve.html',true);
 }
 if(navadna!=='da')return odgovor('Najprej določi vrsto in cilj potrditve','Pri združitveni potrditvi je treba razumeti glavnega starša in prihodnja združevanja. Če vrste ne poznaš, ne izbiraj dodatnih možnosti na slepo.',[],'razveljavi-objavljeno-potrditev.html');
 return odgovor('Obrni učinek z novo potrditvijo','Za znano navadno potrditev je pogosto primeren revert, ne prepisovanje skupne veje. Najprej zagotovi čisto stanje in preveri cilj. Spodnji učni primer obrne samo zadnjo potrditev HEAD; ne uporabljaj ga za drug cilj. Lahko nastane spor.',['git revert --no-edit HEAD'],'razveljavi-objavljeno-potrditev.html',true);
}
export const vaje=[
 {ime:'Pozdrav z imenom',vhod:'function pozdrav() {\n<<<<<<< HEAD\n  return "Živjo, Ana!";\n=======\n  return "Živjo! Dobrodošla.";\n>>>>>>> predlog\n}\n',resitev:'function pozdrav() {\n  return "Živjo, Ana! Dobrodošla.";\n}\n',navodilo:'Ohrani ime Ana in prijazen zaključek Dobrodošla. Končna funkcija naj vrne en skupni pozdrav.'},
 {ime:'Opis delavnice',vhod:'Naslov: Učenje Gita\n<<<<<<< HEAD\nTrajanje: 60 minut\n=======\nTrajanje: 90 minut\n>>>>>>> urnik\nKraj: splet\n',resitev:'Naslov: Učenje Gita\nTrajanje: 90 minut\nKraj: splet\n',navodilo:'Potrjen urnik določa 90 minut. Ohrani naslov in kraj ter zapiši eno samo trajanje.'}
];
export function razcleniSpor(vhod){
 if(typeof vhod!=='string'||vhod.length>100000)throw new Error('Besedilo je predolgo ali neveljavno.');
 const vrstice=vhod.replace(/\r\n/g,'\n').split('\n');const deli=[];let nacin='navadno',trenutno=[],drugo=[];
 const shrani=()=>{if(trenutno.length){deli.push({vrsta:'besedilo',vsebina:trenutno.join('\n')});trenutno=[];}};
 for(const vrstica of vrstice){
  if(/^\|{7}/.test(vrstica))throw new Error('Ta vaja podpira dvostranski prikaz, ne oblike s skupnim prednikom.');
  if(/^<{7}(\s|$)/.test(vrstica)) {if(nacin!=='navadno')throw new Error('Gnezden ali nepravilno odprt spor.');shrani();nacin='prva';continue;}
  if(/^={7}\s*$/.test(vrstica)){if(nacin!=='prva')throw new Error('Ločilo je na nepričakovanem mestu.');drugo=trenutno;trenutno=[];nacin='druga';continue;}
  if(/^>{7}(\s|$)/.test(vrstica)){if(nacin!=='druga')throw new Error('Zaključek spora nima obeh strani.');deli.push({vrsta:'spor',prva:drugo.join('\n'),druga:trenutno.join('\n')});trenutno=[];drugo=[];nacin='navadno';continue;}
  trenutno.push(vrstica);
 }
 if(nacin!=='navadno')throw new Error('Spor nima zaključnega označevalca.');shrani();return deli;
}
export function sestaviSpor(vhod,stran){if(!['prva','druga'].includes(stran))throw new Error('Izberi veljavno stran.');return razcleniSpor(vhod).map(d=>d.vrsta==='spor'?d[stran]:d.vsebina).join('\n');}
export function preveriVajo(besedilo,stevilka){
 if(!Number.isInteger(stevilka)||!vaje[stevilka])throw new Error('Vaja ne obstaja.');
 if(/^\s*(<{7}|={7}|>{7}|\|{7})/m.test(besedilo))return {uspeh:false,sporocilo:'V rezultatu so še označevalci spora.'};
 if(besedilo.trim()===vaje[stevilka].resitev.trim())return {uspeh:true,sporocilo:'Rešitev se ujema z učnim ciljem. V resničnem projektu preveri še delovanje in preizkuse.'};
 return {uspeh:false,sporocilo:'Besedilo se ne ujema z vzorčno rešitvijo te vaje. To ni preverjanje splošne pravilnosti programa. Primerjaj navodilo in poskusi znova.'};
}
export function novoStanje(){return {delovno:'Prvi zapis.',priprava:'Prvi zapis.',glava:'Prvi zapis.',potrditve:[{oznaka:'P0',vsebina:'Prvi zapis.'}],sporocilo:'Izhodišče: datoteka je potrjena in nespremenjena.'};}
export function korak(stanje,dejanje,vsebina=''){
 const s=structuredClone(stanje);
 if(dejanje==='uredi'){if(typeof vsebina!=='string'||vsebina.length>2000)throw new Error('Vnesi največ 2000 znakov.');s.delovno=vsebina;s.sporocilo='Urejena je samo delovna datoteka. Priprava ostane ločen posnetek.';}
 else if(dejanje==='dodaj'){s.priprava=s.delovno;s.sporocilo='Trenutna delovna vsebina je kopirana v pripravo.';}
 else if(dejanje==='potrdi'){
  if(s.priprava===s.glava)s.sporocilo='Priprava je enaka zadnji potrditvi. Nove vsebine za potrditev ni.';
  else if(s.potrditve.length>=30)s.sporocilo='Dosežena je omejitev učne vaje. Začni znova.';
  else {s.glava=s.priprava;s.potrditve.push({oznaka:'P'+s.potrditve.length,vsebina:s.glava});s.sporocilo='Potrjena je vsebina priprave. Poznejše urejanje delovne datoteke ni vključeno.';}
 }
 else if(dejanje==='odpripravi'){s.priprava=s.glava;s.sporocilo='Priprava je obnovljena iz HEAD. Delovna vsebina je ohranjena.';}
 else if(dejanje==='obnovi'){s.delovno=s.priprava;s.sporocilo='Samo v tej simulaciji: delovna datoteka je obnovljena iz priprave. V resničnem repozitoriju bi s tem lahko izgubil nepripravljeno delo.';}
 else throw new Error('Neznan učni korak.');
 return s;
}
