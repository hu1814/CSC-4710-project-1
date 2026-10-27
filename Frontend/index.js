// Matched to the backend endpoints in Backend/app.js (main branch, Oct 27, 2026).
const API_BASE = 'http://localhost:5050';
const notice = document.getElementById('notice');
function notify(message, error=false){notice.textContent=message;notice.hidden=false;notice.classList.toggle('error',error)}
async function request(path, options={}){
  let response;
  try{response=await fetch(API_BASE+path,options)}catch{throw Error('Cannot connect to backend. Check that it is running on port 5050.')}
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(payload.error||payload.message||`Request failed (${response.status})`);
  return payload.data;
}
const values=form=>Object.fromEntries(new FormData(form).entries());
async function submit(form,path,message){
  const button=form.querySelector('button');button.disabled=true;
  try{const data=values(form);if(path==='/users/register'){data.age=Number(data.age)}
    await request(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    notify(message);form.reset();
  }catch(e){notify(e.message,true)}finally{button.disabled=false}
}
document.getElementById('registerForm').addEventListener('submit',e=>{e.preventDefault();submit(e.currentTarget,'/users/register','Registration successful.')});
document.getElementById('signinForm').addEventListener('submit',e=>{e.preventDefault();submit(e.currentTarget,'/users/sign-in','Sign-in successful.')});
const definitions={name:[['firstname','First name (optional)','text'],['lastname','Last name (optional)','text']],userid:[['username','Username','text']],salary:[['min','Minimum salary','number'],['max','Maximum salary','number']],age:[['min','Minimum age','number'],['max','Maximum age','number']],after:[['username','Reference username','text']],never:[],'same-day':[['username','Reference username','text']],today:[]};
const searchType=document.getElementById('searchType'), fields=document.getElementById('searchFields');
function updateFields(){fields.replaceChildren();for(const [name,labelText,type] of definitions[searchType.value]){const label=document.createElement('label');label.textContent=labelText;const input=document.createElement('input');input.name=name;input.type=type;input.required=searchType.value!=='name';if(type==='number'){input.step=searchType.value==='salary'?'0.01':'1';if(searchType.value==='age')input.min='0'}label.append(input);fields.append(label)}}
searchType.addEventListener('change',updateFields);updateFields();
const columns=['username','firstname','lastname','salary','age','registerday','signintime'];
function display(users){const tbody=document.getElementById('results');tbody.replaceChildren();document.getElementById('resultCount').textContent=`(${users.length})`;if(!users.length){const c=tbody.insertRow().insertCell();c.colSpan=7;c.textContent='No matching users found.';return}for(const user of users){const row=tbody.insertRow();for(const col of columns){const v=user[col];row.insertCell().textContent=v==null||v===''?'—':String(v)}}}
function getPath(type,form){const v=values(form),u=encodeURIComponent(v.username||'');switch(type){
case 'name':{const q=new URLSearchParams();if(v.firstname?.trim())q.set('firstname',v.firstname.trim());if(v.lastname?.trim())q.set('lastname',v.lastname.trim());if(!q.toString())throw Error('Enter at least one name.');return '/users/search/name?'+q}
case 'userid':return '/users/by-username/'+u;
case 'salary':return '/users/search/salary?'+new URLSearchParams({min:v.min,max:v.max});
case 'age':return '/users/search/age?'+new URLSearchParams({min:v.min,max:v.max});
case 'after':return '/users/registered-after/'+u;
case 'never':return '/users/never-signed-in';
case 'same-day':return '/users/registered-same-day/'+u;
case 'today':return '/users/registered-today';
default:throw Error('Unknown search type');}}
document.getElementById('searchForm').addEventListener('submit',async e=>{e.preventDefault();const button=e.currentTarget.querySelector('button');button.disabled=true;try{const result=await request(getPath(searchType.value,e.currentTarget));display(Array.isArray(result)?result:result?[result]:[]);notify('Search completed.')}catch(err){display([]);notify(err.message,true)}finally{button.disabled=false}});
