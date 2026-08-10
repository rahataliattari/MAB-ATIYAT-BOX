const state = {
  page: "dashboard",
  filters: {search:"", status:"All", district:"All", boxType:"All"},
  data: {
    boxes: [
      {code:"MBX-10021", responsible:"Muhammad Sajid", district:"Narowal", place:"Madina General Store", type:"Special", status:"Active", lastCollection:"2026-08-08", amount:18500},
      {code:"MBX-10022", responsible:"Khizar Hayat", district:"Narowal", place:"Al-Madina Mart", type:"Normal", status:"Active", lastCollection:"2026-08-07", amount:12400},
      {code:"MBX-10023", responsible:"Abdul Hafeez", district:"Gujranwala", place:"City Cash & Carry", type:"Special", status:"Pending", lastCollection:"2026-07-30", amount:9200},
      {code:"MBX-10024", responsible:"Shahbaz Ali", district:"Gujranwala", place:"Usman Traders", type:"Special", status:"Active", lastCollection:"2026-08-06", amount:22100},
      {code:"MBX-10025", responsible:"Muhammad Bilal", district:"Sialkot", place:"Faizan Electronics", type:"Normal", status:"Broken", lastCollection:"2026-07-21", amount:0},
      {code:"MBX-10026", responsible:"Ali Raza", district:"Sialkot", place:"New City Store", type:"Special", status:"Active", lastCollection:"2026-08-08", amount:16700},
      {code:"MBX-10027", responsible:"Usman Attari", district:"Narowal", place:"Haji Store", type:"Normal", status:"Active", lastCollection:"2026-08-05", amount:7300},
      {code:"MBX-10028", responsible:"Imran Attari", district:"Gujranwala", place:"Rehmat Traders", type:"Special", status:"Theft", lastCollection:"2026-07-14", amount:0}
    ],
    collections: [
      {date:"2026-08-08",code:"MBX-10021",responsible:"Muhammad Sajid",district:"Narowal",status:"Normal collection",amount:18500},
      {date:"2026-08-08",code:"MBX-10026",responsible:"Ali Raza",district:"Sialkot",status:"Normal collection",amount:16700},
      {date:"2026-08-07",code:"MBX-10022",responsible:"Khizar Hayat",district:"Narowal",status:"Normal collection",amount:12400},
      {date:"2026-08-06",code:"MBX-10024",responsible:"Shahbaz Ali",district:"Gujranwala",status:"Normal collection",amount:22100},
      {date:"2026-08-05",code:"MBX-10027",responsible:"Usman Attari",district:"Narowal",status:"Walk in collection",amount:7300},
      {date:"2026-07-30",code:"MBX-10023",responsible:"Abdul Hafeez",district:"Gujranwala",status:"Normal collection",amount:9200}
    ]
  }
};

const navGroups = [
  ["MAIN", [{id:"dashboard",icon:"bi-grid-1x2",label:"Dashboard"}]],
  ["USER & DONOR", [
    {id:"users",icon:"bi-people",label:"Users"},{id:"donation-head",icon:"bi-diagram-3",label:"Donation Head"},
    {id:"donor",icon:"bi-person-lines-fill",label:"Donor Management"}
  ]],
  ["BOX MANAGEMENT", [
    {id:"boxes",icon:"bi-box-seam",label:"Box Details"},{id:"places",icon:"bi-geo-alt",label:"Box Place List"},
    {id:"assignments",icon:"bi-person-check",label:"Assigned Boxes"},{id:"box-status",icon:"bi-exclamation-diamond",label:"Box Status"},
    {id:"transfers",icon:"bi-arrow-left-right",label:"Transfer List"},{id:"activity",icon:"bi-clock-history",label:"Box Activity Log"}
  ]],
  ["COLLECTION", [
    {id:"collection",icon:"bi-cash-stack",label:"Collection Details"},{id:"monthly-status",icon:"bi-calendar3",label:"Monthly Box Status"},
    {id:"match",icon:"bi-check2-square",label:"Match Collection"},{id:"deposit",icon:"bi-bank",label:"Deposit & Reconciliation"}
  ]],
  ["REPORTS", [
    {id:"reports",icon:"bi-bar-chart",label:"Reports"},{id:"comparison",icon:"bi-graph-up-arrow",label:"Comparison Summary"},
    {id:"no-activity",icon:"bi-hourglass-split",label:"Box No Activity"}
  ]],
  ["OTHER", [
    {id:"market",icon:"bi-shop",label:"Market Visits"},{id:"receipt",icon:"bi-receipt",label:"Receipt Book"},
    {id:"feedback",icon:"bi-chat-square-text",label:"Feedback"},{id:"notifications",icon:"bi-bell",label:"Notifications"}
  ]]
];

function money(n){return "Rs. "+Number(n||0).toLocaleString("en-PK")}
function fmtDate(d){return new Date(d+"T00:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}
function badge(s){
  const c = /active|normal/i.test(s)?"badge-success":/pending|walk/i.test(s)?"badge-warning":/broken|theft|closed/i.test(s)?"badge-danger":"badge-info";
  return `<span class="badge-soft ${c}">${s}</span>`;
}
function toast(msg){
  const el=document.createElement("div");el.className="toast show align-items-center text-bg-dark border-0";
  el.innerHTML=`<div class="d-flex"><div class="toast-body" style="font-size:12px">${msg}</div><button class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button></div>`;
  document.getElementById("toastContainer").appendChild(el);setTimeout(()=>el.remove(),2500);
}
function renderNav(){
  document.getElementById("nav").innerHTML=navGroups.map(([title,items])=>`<div class="nav-section">${title}</div>`+
    items.map(x=>`<button class="nav-item ${state.page===x.id?"active":""}" data-page="${x.id}"><i class="bi ${x.icon}"></i><span>${x.label}</span></button>`).join("")).join("");
  document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{state.page=b.dataset.page;render()});
}
function shell(title,sub,body,action=""){
 return `<div class="page-head"><div><h2 class="h5 fw-bold mb-0">${title}</h2><p>${sub}</p></div>${action}</div>${body}`;
}
function dashboard(){
 const b=state.data.boxes,c=state.data.collections;
 const total=c.reduce((a,x)=>a+x.amount,0), active=b.filter(x=>x.status==="Active").length;
 return shell("Dashboard","Overview of Atiyat Box operations and collection performance.",
 `<div class="row g-3 mb-3">
   ${[
    ["Total Collection",money(total),"bi-cash-coin","Last loaded sample"],
    ["Total Boxes",b.length.toLocaleString(),"bi-box-seam",active+" active"],
    ["Collection Entries",c.length.toLocaleString(),"bi-list-check","Current sample"],
    ["Active Boxes",active.toLocaleString(),"bi-check-circle","Operational"],
    ["Pending / Issue",b.filter(x=>x.status!=="Active").length,"bi-exclamation-circle","Needs attention"]
   ].map(x=>`<div class="col-6 col-xl"><div class="stat-card"><div class="stat-label">${x[0]}</div><div class="stat-value">${x[1]}</div><div class="stat-icon"><i class="bi ${x[2]}"></i></div><div class="stat-foot">${x[3]}</div></div></div>`).join("")}
 </div>
 <div class="row g-3">
   <div class="col-xl-8"><div class="panel"><div class="d-flex justify-content-between align-items-center mb-3"><div><div class="panel-title">Collection Trend</div><div class="panel-sub">Sample monthly comparison</div></div><span class="badge-soft badge-success">Live-ready</span></div><div class="chart-box"><canvas id="collectionChart"></canvas></div></div></div>
   <div class="col-xl-4"><div class="panel"><div class="panel-title mb-1">Box Status</div><div class="panel-sub mb-3">Current distribution</div><div class="chart-box"><canvas id="statusChart"></canvas></div></div></div>
   <div class="col-12"><div class="panel"><div class="d-flex justify-content-between mb-3"><div><div class="panel-title">Recent Collection</div><div class="panel-sub">Latest entries</div></div><button class="btn-soft" onclick="state.page='collection';render()">View all</button></div>${collectionTable(c.slice(0,6))}</div></div>
 </div>`);
}
function collectionTable(rows){
 return `<div class="table-wrap"><table class="table table-hover"><thead><tr><th>Date</th><th>Box Code</th><th>Responsible</th><th>District</th><th>Status</th><th class="text-end">Amount</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${fmtDate(x.date)}</td><td><strong>${x.code}</strong></td><td>${x.responsible}</td><td>${x.district}</td><td>${badge(x.status)}</td><td class="text-end fw-semibold">${money(x.amount)}</td></tr>`).join("")}</tbody></table></div>`;
}
function boxes(){
 const rows=state.data.boxes.filter(x=> {
  const q=state.filters.search.toLowerCase();
  return (!q || Object.values(x).join(" ").toLowerCase().includes(q)) &&
    (state.filters.status==="All"||x.status===state.filters.status) &&
    (state.filters.district==="All"||x.district===state.filters.district) &&
    (state.filters.boxType==="All"||x.type===state.filters.boxType);
 });
 return shell("Box Details","Search, filter and manage Atiyat Boxes.",
 `<div class="filters"><div class="row g-2 align-items-end">
  <div class="col-lg-4"><label class="form-label">Search</label><div class="search-box"><i class="bi bi-search"></i><input id="search" class="form-control" placeholder="Box code, shop, responsible..." value="${state.filters.search}"></div></div>
  <div class="col-6 col-lg-2"><label class="form-label">District</label><select id="district" class="form-select"><option>All</option><option>Narowal</option><option>Gujranwala</option><option>Sialkot</option></select></div>
  <div class="col-6 col-lg-2"><label class="form-label">Type</label><select id="boxType" class="form-select"><option>All</option><option>Special</option><option>Normal</option></select></div>
  <div class="col-6 col-lg-2"><label class="form-label">Status</label><select id="status" class="form-select"><option>All</option><option>Active</option><option>Pending</option><option>Broken</option><option>Theft</option></select></div>
  <div class="col-6 col-lg-2"><button class="btn-brand w-100" onclick="openBoxModal()"><i class="bi bi-plus-lg me-1"></i>Add Box</button></div>
 </div></div>
 <div class="kpi-strip mb-3"><div class="kpi"><span>Showing</span><strong>${rows.length}</strong></div><div class="kpi"><span>Active</span><strong>${rows.filter(x=>x.status==="Active").length}</strong></div><div class="kpi"><span>Total Value</span><strong>${money(rows.reduce((a,x)=>a+x.amount,0))}</strong></div></div>
 <div class="panel">${rows.length?`<div class="table-wrap"><table class="table table-hover"><thead><tr><th>Box Code</th><th>Responsible</th><th>District</th><th>Place</th><th>Type</th><th>Status</th><th>Last Collection</th><th class="text-end">Amount</th><th></th></tr></thead><tbody>${rows.map((x,i)=>`<tr><td><strong>${x.code}</strong></td><td>${x.responsible}</td><td>${x.district}</td><td>${x.place}</td><td>${x.type}</td><td>${badge(x.status)}</td><td>${fmtDate(x.lastCollection)}</td><td class="text-end">${money(x.amount)}</td><td><button class="icon-btn" onclick="toast('Details for ${x.code}')"><i class="bi bi-eye"></i></button></td></tr>`).join("")}</tbody></table></div>`:`<div class="empty"><i class="bi bi-inbox"></i>No boxes found</div>`}</div>`);
}
function collection(){
 const rows=state.data.collections;
 return shell("Collection Details","Collection records with filtering and summary.",
 `<div class="filters"><div class="row g-2 align-items-end">
 <div class="col-md-3"><label class="form-label">From</label><input type="date" class="form-control" id="fromDate" value="2026-07-01"></div>
 <div class="col-md-3"><label class="form-label">To</label><input type="date" class="form-control" id="toDate" value="2026-08-10"></div>
 <div class="col-md-3"><label class="form-label">District</label><select class="form-select" id="cDistrict"><option>All</option><option>Narowal</option><option>Gujranwala</option><option>Sialkot</option></select></div>
 <div class="col-md-3"><button class="btn-brand w-100" onclick="toast('Filters applied')"><i class="bi bi-funnel me-1"></i>Apply Filters</button></div></div></div>
 <div class="row g-3 mb-3"><div class="col-md-4"><div class="stat-card"><div class="stat-label">Total Collection</div><div class="stat-value">${money(rows.reduce((a,x)=>a+x.amount,0))}</div></div></div><div class="col-md-4"><div class="stat-card"><div class="stat-label">Entries</div><div class="stat-value">${rows.length}</div></div></div><div class="col-md-4"><div class="stat-card"><div class="stat-label">Average</div><div class="stat-value">${money(rows.reduce((a,x)=>a+x.amount,0)/rows.length)}</div></div></div></div>
 <div class="panel">${collectionTable(rows)}</div>`);
}
function reports(){
 return shell("Reports","Operational and management reports.",
 `<div class="module-grid">${[
 ["bi-boxes","Box Stock Report","Zimmadar-wise stock and status"],
 ["bi-calendar-week","Jadwal Report","Scheduled opening / collection"],
 ["bi-arrow-left-right","Box In/Out Report","Movement of boxes"],
 ["bi-bar-chart-steps","Deposit Summary","Deposits and reconciliation"],
 ["bi-journal-text","Box Register","Complete box register"],
 ["bi-geo-alt","Box Placement","Placement by district"],
 ["bi-graph-up","Comparison Summary","Month and district comparison"],
 ["bi-hourglass","No Activity Report","Boxes without recent activity"]
 ].map(x=>`<div class="module-card" onclick="toast('${x[1]} is ready for Google Sheet data')"><i class="bi ${x[0]}"></i><strong>${x[1]}</strong><span>${x[2]}</span></div>`).join("")}</div>`);
}
function generic(){
 const labels={users:"Users", "donation-head":"Donation Head", donor:"Donor Management",places:"Box Place List",assignments:"Assigned Boxes", "box-status":"Box Status",transfers:"Transfer List",activity:"Box Activity Log", "monthly-status":"Monthly Box Status",match:"Match Collection",deposit:"Deposit & Reconciliation",comparison:"Comparison Summary","no-activity":"Box No Activity",market:"Market Visits",receipt:"Receipt Book",feedback:"Feedback",notifications:"Notifications",settings:"Settings",help:"Help & FAQ"};
 const title=labels[state.page]||"Module";
 return shell(title,"This module follows the management structure of the reference system.",
 `<div class="panel"><div class="empty"><i class="bi bi-layout-text-window-reverse"></i><strong>${title}</strong><div class="mt-2">UI module is included in this first GitHub version. Connect your live Google Sheet/API to populate records.</div><button class="btn-brand mt-3" onclick="toast('Module action placeholder')">Open Module</button></div></div>`);
}
function render(){
 renderNav();
 const titles={dashboard:"Dashboard",boxes:"Box Management",collection:"Collection Details",reports:"Reports"};
 document.getElementById("pageTitle").textContent=titles[state.page]||state.page.replaceAll("-"," ").replace(/\b\w/g,m=>m.toUpperCase());
 document.getElementById("crumb").textContent=document.getElementById("pageTitle").textContent;
 const out=state.page==="dashboard"?dashboard():state.page==="boxes"?boxes():state.page==="collection"?collection():state.page==="reports"?reports():generic();
 document.getElementById("app").innerHTML=out;
 bind();
 if(state.page==="dashboard") drawCharts();
}
function bind(){
 const s=document.getElementById("search"),d=document.getElementById("district"),t=document.getElementById("boxType"),st=document.getElementById("status");
 if(s)s.oninput=e=>{state.filters.search=e.target.value;render()};
 if(d){d.value=state.filters.district;d.onchange=e=>{state.filters.district=e.target.value;render()}}
 if(t){t.value=state.filters.boxType;t.onchange=e=>{state.filters.boxType=e.target.value;render()}}
 if(st){st.value=state.filters.status;st.onchange=e=>{state.filters.status=e.target.value;render()}}
}
function drawCharts(){
 new Chart(document.getElementById("collectionChart"),{type:"line",data:{labels:["May","Jun","Jul","Aug"],datasets:[{label:"Collection",data:[2860000,3180000,3486143,Math.round(state.data.collections.reduce((a,x)=>a+x.amount,0))],tension:.35,fill:true}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>"Rs. "+(v/1000000).toFixed(1)+"M"}}}}});
 const counts={Active:0,Pending:0,Broken:0,Theft:0};state.data.boxes.forEach(x=>counts[x.status]=(counts[x.status]||0)+1);
 new Chart(document.getElementById("statusChart"),{type:"doughnut",data:{labels:Object.keys(counts),datasets:[{data:Object.values(counts)}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom",labels:{boxWidth:10,font:{size:9}}}}}});
}
function openBoxModal(){
 document.body.insertAdjacentHTML("beforeend",`<div class="modal fade" id="boxModal" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Add Atiyat Box</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><div class="row g-2"><div class="col-6"><label class="form-label">Box Code</label><input id="mCode" class="form-control" placeholder="MBX-10029"></div><div class="col-6"><label class="form-label">Type</label><select id="mType" class="form-select"><option>Special</option><option>Normal</option></select></div><div class="col-12"><label class="form-label">Responsible</label><input id="mResp" class="form-control"></div><div class="col-6"><label class="form-label">District</label><select id="mDist" class="form-select"><option>Narowal</option><option>Gujranwala</option><option>Sialkot</option></select></div><div class="col-6"><label class="form-label">Shop / Place</label><input id="mPlace" class="form-control"></div></div></div><div class="modal-footer"><button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn-brand" onclick="addBox()">Save Box</button></div></div></div></div>`);
 const m=new bootstrap.Modal(document.getElementById("boxModal"));m.show();
}
function addBox(){
 const code=document.getElementById("mCode").value.trim()||"MBX-"+Math.floor(10000+Math.random()*89999);
 state.data.boxes.unshift({code,responsible:document.getElementById("mResp").value||"Unassigned",district:document.getElementById("mDist").value,place:document.getElementById("mPlace").value||"Not entered",type:document.getElementById("mType").value,status:"Active",lastCollection:"2026-08-10",amount:0});
 bootstrap.Modal.getInstance(document.getElementById("boxModal")).hide();document.getElementById("boxModal").remove();toast("Box added successfully");render();
}
document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.getElementById("refreshBtn").onclick=()=>{toast("Dashboard refreshed");render()};
render();
