/* One continuous, host-controlled manga demonstration. */
const drinkLessons=[
 {title:'今天，一起調製珍珠紅茶拿鐵',captions:['嵐星帶來今天的示範飲品！','底下是珍珠，中間是紅茶，上面是牛奶與冰塊。'],warning:'這是成品介紹；實際添加順序，跟著後面的操作做。'},
 {title:'認識雪克杯的三個部件',captions:['杯身：紅茶裝到紅色線上緣，黑線也要保留。','大杯蓋：先蓋住杯身。','小杯蓋：再蓋上大杯蓋的上方開口。'],warning:'大杯蓋先、小杯蓋後，不可把兩個蓋子一起蓋上。'},
 {title:'拿起紙杯，加入兩湯匙珍珠',captions:['拿起黃色紙杯，準備加入珍珠。','舀入第一湯匙珍珠。','再舀入第二湯匙：合計兩湯匙。']},
 {title:'量取150 ml牛奶，倒入紙杯',captions:['拿起不鏽鋼杯，倒入光泉鮮乳至150 ml。','將量好的牛奶倒入已有珍珠的紙杯。'],warning:'先用不鏽鋼杯量取，再倒入紙杯。'},
 {title:'裝紅茶，依序蓋好雪克杯',captions:['從茶桶接紅茶，裝到紅色線上緣。','先蓋上大杯蓋。','再蓋上小杯蓋。'],warning:'這一步先不加冰塊；先大杯蓋，再小杯蓋。'},
 {title:'握好雪克杯，向斜前方雪克',captions:['右手拇指壓小杯蓋，其餘四指自然垂下；左手托住杯底。','小杯蓋朝向自己、杯底朝上，傾斜約45度。','向斜前方來回雪克，跟著現場老師示範。'],warning:'先確認兩個杯蓋已蓋好；此時杯內只有紅茶。'},
 {title:'倒入紅茶，加冰塊，完成！',captions:['打開小杯蓋，大杯蓋留在杯身上。','把雪克好的紅茶倒進已有珍珠與牛奶的紙杯。','再加入冰塊。','蓋上透明杯蓋，完成珍珠紅茶拿鐵！']}
];
const drinkFrameCaptions=[
 ['嵐星帶來今天的示範飲品！','珍珠、紅茶、牛奶與冰塊，組成今天的飲品。','底層是珍珠，中間是紅茶。','上層是牛奶與冰塊；接著跟老師一起動手。'],
 ['先認識杯身、大杯蓋與小杯蓋。','紅茶要裝到紅色線上緣，黑線也要保留。','先蓋上大杯蓋。','再蓋上小杯蓋，不可同時蓋。'],
 ['拿起黃色紙杯與珍珠湯匙。','舀起第一湯匙珍珠。','第一匙加入紙杯，再舀第二匙。','加入第二匙，合計兩湯匙珍珠。'],
 ['倒入指定的光泉鮮乳。','用不鏽鋼杯量取150 ml。','將量好的牛奶移到紙杯上方。','倒入已有珍珠的紙杯。'],
 ['從茶桶接取紅茶。','紅茶液面到紅色線上緣；先不加冰塊。','先蓋上大杯蓋。','再蓋上小杯蓋。'],
 ['右手拇指壓小杯蓋，左手托杯底。','小杯蓋朝向自己、杯底朝上，傾斜約45度。','向斜前方來回雪克。','握法請配合現場老師示範；此時不加冰塊。'],
 ['只打開小杯蓋，大杯蓋留在杯身上。','將雪克杯開口對準紙杯，準備倒入。','傾斜雪克杯，紅茶從開口流進紙杯。','將紅茶倒入已有珍珠與150 ml牛奶的紙杯。','完成倒入，再進行下一個動作。','再加入冰塊。','蓋上透明杯蓋，完成！']
];
function drinkArt(i){const frames=i===6?[['drink-manga-7',0],['drink-pour',0],['drink-pour',1],['drink-pour',2],['drink-pour',3],['drink-manga-7',2],['drink-manga-7',3]]:[0,1,2,3].map(n=>['drink-manga-'+(i+1),n]);return '<div class="drink-manga" role="img" aria-label="'+drinkLessons[i].title+'漫畫動畫">'+frames.map(([asset,cell],n)=>'<div class="drink-manga-frame" data-scene="'+n+'" style="background-image:url(assets/'+asset+'.webp);background-position:'+(cell%2?'100%':'0%')+' '+(cell>=2?'100%':'0%')+'"></div>').join('')+'</div>';}
function renderDrink(){
 const spans=drinkLessons.map((_,i)=>i===5?2250:i===6?2000:3200),durations=spans.map((n,i)=>n*drinkFrameCaptions[i].length),starts=durations.map((_,i)=>durations.slice(0,i).reduce((a,b)=>a+b,0)),total=durations.reduce((a,b)=>a+b,0);
 let elapsed=0,playing=false,ready=false,loading=false,lastTime=0,current=-1,lastFrame=-1,raf=0,loadToken=0;
 const intro=e('div',undefined,'drink-intro');intro.append(e('div','珍珠紅茶拿鐵・完整漫畫示範','tag'),e('h1','按一次，跟著嵐星一起做！'),e('p','七個步驟依序自動播放，現場操作時可隨時暫停。'));app.append(intro);
 const player=e('section',undefined,'drink-lesson drink-film');player.setAttribute('aria-label','飲品實作連續播放器');
 const heading=e('div',undefined,'drink-heading'),badge=e('span','01 / 07','drink-badge'),title=e('h2');heading.append(badge,title);
 const demo=e('div',undefined,'drink-demo'),caption=e('div',undefined,'drink-caption'),warning=e('p',undefined,'drink-warning');caption.setAttribute('aria-live','polite');
 const surfaceHint=e('span','▶','drink-surface-play');surfaceHint.setAttribute('aria-hidden','true');demo.tabIndex=0;demo.setAttribute('role','button');
 const transport=e('div',undefined,'drink-transport'),controls=e('div',undefined,'drink-controls'),status=e('span','等待播放','drink-status');status.setAttribute('aria-live','polite');
 const range=e('input');range.type='range';range.min=0;range.max=total;range.step=100;range.value=0;range.setAttribute('aria-label','播放進度');
 const clock=e('span',undefined,'drink-film-clock'),speed=e('select');speed.setAttribute('aria-label','播放速度');[.75,1,1.25].forEach(v=>{const option=e('option',v+'倍速');option.value=v;option.selected=v===1;speed.append(option)});
 const setText=(node,text)=>{if(node.textContent!==text)node.textContent=text};
 const time=ms=>Math.floor(ms/60000)+':'+String(Math.floor(ms/1000)%60).padStart(2,'0');
 function paint(){if(!player.isConnected)return;const i=elapsed>=total?6:starts.findIndex((start,n)=>elapsed>=start&&elapsed<start+durations[n]),local=Math.max(0,Math.min(durations[i]-.01,elapsed-starts[i]));
  if(i!==current){current=i;lastFrame=-1;title.textContent=drinkLessons[i].title;badge.textContent=String(i+1).padStart(2,'0')+' / 07';demo.innerHTML=drinkArt(i);demo.append(surfaceHint);warning.textContent=drinkLessons[i].warning||'';warning.hidden=!drinkLessons[i].warning;const image=new Image;image.onload=()=>{if(player.isConnected&&current===i)demo.querySelector('.drink-manga').style.aspectRatio=image.naturalWidth+'/'+image.naturalHeight};image.src='assets/drink-manga-'+(i+1)+'.webp';}
  const frame=i===5?Math.floor(local/(durations[i]/20))%4:Math.floor(local/spans[i]);if(frame!==lastFrame){demo.querySelectorAll('[data-scene]').forEach((node,n)=>node.style.opacity=n===frame?'1':'0');lastFrame=frame;}
  const text=drinkFrameCaptions[i][Math.min(drinkFrameCaptions[i].length-1,Math.floor(local/spans[i]))];if(caption.textContent!==text)caption.textContent=text;
  demo.classList.toggle('has-started',ready||playing||elapsed>0);demo.classList.toggle('is-playing',playing);demo.classList.toggle('is-loading',loading);demo.setAttribute('aria-label',loading?'圖片載入中':playing?'暫停飲品示範':elapsed>=total?'重播飲品示範':elapsed?'繼續飲品示範':'播放飲品示範');surfaceHint.textContent=loading?'…':playing?'Ⅱ':'▶';
  range.value=elapsed;setText(clock,time(elapsed)+' / '+time(total));setText(play,playing?'Ⅱ 暫停播放':elapsed>=total?'▶ 再看一次':elapsed?'▶ 繼續播放':'▶ 開始完整示範');setText(status,loading?'圖片載入中…':elapsed>=total?'七個步驟播放完成':playing?'連續播放中':elapsed?'已暫停':'等待播放');
 }
 function pause(){playing=false;cancelAnimationFrame(raf);paint()}
 function tick(now){if(!playing||!player.isConnected)return;elapsed=Math.min(total,elapsed+(now-lastTime)*Number(speed.value));lastTime=now;if(elapsed>=total)playing=false;paint();if(playing)raf=requestAnimationFrame(tick)}
 async function begin(){if(loading)return;if(!ready){loading=true;const token=++loadToken;play.disabled=true;paint();try{await new Promise((resolve,reject)=>{const image=new Image;const timeout=setTimeout(()=>reject(new Error('image timeout')),12000);image.onload=()=>{clearTimeout(timeout);resolve()};image.onerror=()=>{clearTimeout(timeout);reject(new Error('image unavailable'))};image.src='assets/drink-manga-'+(current+1)+'.webp'});if(token!==loadToken||!player.isConnected)return;ready=true;}catch{if(player.isConnected){loading=false;play.disabled=false;status.textContent='圖片載入失敗，請按開始重試。'}return}loading=false;play.disabled=false;}
  if(elapsed>=total)elapsed=0;playing=true;lastTime=performance.now();paint();raf=requestAnimationFrame(tick);
 }
 const toggle=()=>{if(loading)return;playing?pause():begin()};
 const play=b('▶ 開始完整示範',toggle,'yellow');demo.onclick=toggle;demo.onkeydown=event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();toggle()}};
 // Fetch later scenes without blocking the first play action.
 for(const name of [...Array.from({length:7},(_,i)=>'drink-manga-'+(i+1)),'drink-pour']){const preload=new Image;preload.src='assets/'+name+'.webp';}
 controls.append(play,b('↺ 從頭重播',()=>{pause();elapsed=0;paint();begin()},'light'),b('上一段',()=>{pause();elapsed=starts[Math.max(0,current-1)];paint()},'light'),b('下一段',()=>{pause();elapsed=current<6?starts[current+1]:total;paint()},'light'),speed,status);
 range.oninput=()=>{elapsed=Number(range.value);lastTime=performance.now();paint()};speed.onchange=()=>{lastTime=performance.now()};transport.append(range,clock);
 player.append(heading,demo,caption,warning,transport,controls);app.append(player);paint();
 const end=e('div',undefined,'drink-end');end.append(b('示範結束，查看門市成果 →',()=>{pause();go('results')},'yellow'));app.append(end);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&player.isConnected&&playing)pause()},{signal:(()=>{const controller=new AbortController;const observer=new MutationObserver(()=>{if(!player.isConnected){cancelAnimationFrame(raf);loadToken++;controller.abort();observer.disconnect()}});observer.observe(app,{childList:true});return controller.signal})()});
}
