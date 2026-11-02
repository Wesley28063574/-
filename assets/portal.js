/* Save the event successfully before entering the game. Every start has its own ID. */
(()=>{
 const form=document.getElementById('event-start'),organization=document.getElementById('event-organization'),date=document.getElementById('event-date'),status=document.getElementById('event-start-status'),buttons=[...document.querySelectorAll('.edition-card')];let busy=false,pending;
 date.value=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei'}).format(new Date());
 organization.addEventListener('input',()=>organization.setCustomValidity(''));
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  const age=event.submitter?.dataset.age;
  if(!AgeEditions[age]){status.textContent='請點選國小、國高中或大學，開始對應的活動。';return}
  organization.setCustomValidity(organization.value.trim()?'':'請填寫單位名稱');if(!form.reportValidity())return;
  busy=true;buttons.forEach(button=>{button.disabled=true;button.setAttribute('aria-disabled','true')});status.textContent='正在建立'+AgeEditions[age].label+'活動紀錄…';
  try{
   const unit=organization.value.trim(),time=new Date().toISOString(),key=unit+'|'+date.value+'|'+age;
   if(!pending||pending.key!==key)pending={key,record:{schemaVersion:1,cloudDirty:true,id:crypto.randomUUID(),createdAt:time,updatedAt:time,status:'active',meta:{name:unit+'｜'+date.value+'｜'+AgeEditions[age].label+'活動',date:date.value,organization:unit,location:'',kind:'未分類',ageGroup:age,audience:AgeEditions[age].label,facilitator:'',participants:null,groupCount:2,notes:''},content:makeAgeTemplate(age),state:{groups:[],ui:{phase:'welcome',round:0,revealed:false,practice:false,closing:0,introStep:0,revealStep:0,openingLine:0,seconds:300}},audit:[{at:time,changes:['首頁建立活動：'+unit+'・'+AgeEditions[age].label]}]}};
   await ActivityStore.put(pending.record);
   localStorage.setItem('lanstar-active-event-'+age,pending.record.id);
   status.textContent='活動已建立，正在進入遊戲…';
   const target=new URL('game.html',document.baseURI);target.searchParams.set('age',age);target.searchParams.set('activity',pending.record.id);target.searchParams.set('v','cup-stock-picture-1');location.assign(target.href);
  }catch(error){status.textContent='活動尚未開始：無法保存本機紀錄，請確認瀏覽器儲存空間與權限後再試一次。';console.error(error);busy=false;buttons.forEach(button=>{button.disabled=false;button.removeAttribute('aria-disabled')})}
 });
})();
