/* Activity archive bridge. Photos and records remain in the owner-private archive. */
(()=>{
  const HOST_ORIGIN='https://lanstar-shaker-archive.lanstar001.chatgpt.site';
  let connected=false,readOnly=false,applying=false;
  const groupPhotos=new Map();
  const parentPost=data=>{if(window.parent!==window)window.parent.postMessage(data,HOST_ORIGIN)};
  function snapshot(){return {phase,groups:groups.map(g=>({name:g.name,choice:g.choice,history:g.history.map(v=>Number.isInteger(v)?v:null),scores:[...g.scores]})),round,revealed,revealStep,closing,seconds:tick?Math.max(0,Math.ceil((endAt-Date.now())/1000)):seconds,introStep,openingLine};}
  function emit(){if(connected&&!readOnly&&!applying)parentPost({type:'archive:state',snapshot:snapshot()});}
  function applyPhotos(){groups.forEach((group,index)=>{const photo=groupPhotos.get(index);if(photo){group.photo=photo.dataUrl;if(photo.image)group.photoImage=photo.image;}});}
  const previousRender=render;
  render=function(){applyPhotos();previousRender();emit();};
  window.addEventListener('message',event=>{
    if(event.origin!==HOST_ORIGIN||event.source!==window.parent||!event.data)return;
    const data=event.data;
    if(data.type==='archive:init'){
      applying=true;connected=true;readOnly=!!data.readOnly;stop();closeStage();
      const state=data.snapshot;
      if(state&&Array.isArray(state.groups)){
        groups=state.groups.map(g=>({name:g.name,choice:g.choice,history:[...g.history],scores:[...g.scores]}));
        phase=state.phase==='drink'&&!enableDrinkPractice?'results':state.phase;round=state.round;revealed=!!state.revealed;revealStep=state.revealStep;closing=state.closing;seconds=state.seconds;introStep=state.introStep;openingLine=state.openingLine||0;
        if(['detail','play','names','practice','results','finish'].includes(phase)&&!groups.length)phase='welcome';
      }
      if(data.viewResults){if(!groups.length)groups=Array.from({length:Math.max(2,Math.min(6,data.groupCount||2))},(_,i)=>({name:'第'+(i+1),choice:null,history:[],scores:[25,25,25,25,25,25]}));phase='results';}
      render();applying=false;parentPost({type:'archive:applied'});emit();
    }
    if(data.type==='archive:photos'&&Array.isArray(data.photos)){
      data.photos.forEach(photo=>{
        if(!Number.isInteger(photo.groupIndex)||photo.groupIndex<0||photo.groupIndex>5||!/^data:image\/(jpeg|png|webp);base64,/.test(photo.dataUrl))return;
        const item={dataUrl:photo.dataUrl,image:null};groupPhotos.set(photo.groupIndex,item);
        const image=new Image;image.onload=()=>{item.image=image;applyPhotos();if(phase==='detail'){applying=true;render();applying=false;}};image.src=photo.dataUrl;
      });
      applyPhotos();applying=true;render();applying=false;
    }
    if(data.type==='archive:mode')readOnly=!!data.readOnly;
    if(data.type==='archive:request-state')emit();
  });
  document.addEventListener('input',()=>setTimeout(emit,0));
  document.addEventListener('change',()=>setTimeout(emit,0));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)emit();});
  setInterval(()=>{if(tick)emit();},15000);
  parentPost({type:'archive:ready'});
})();