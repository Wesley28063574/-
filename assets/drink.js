/* Host-controlled SVG demonstrations. No automatic sound, timers or recipe guesses. */
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
const intro=e('div',undefined,'drink-intro');intro.append(e('div','現場動手做・主持人掌握節奏','tag'),e('h1','換我們調製一杯！'),e('p','一個動作、一次示範。往下捲動，配合現場老師一起操作。'));app.append(intro);
drinkLessons.forEach((lesson,i)=>{
 const section=e('section',undefined,'drink-lesson');section.id='drink-step-'+(i+1);section.setAttribute('aria-labelledby','drink-title-'+i);
 const heading=e('div',undefined,'drink-heading'),title=e('h2',lesson.title);title.id='drink-title-'+i;heading.append(e('span',String(i+1).padStart(2,'0'),'drink-badge'),title);
 const demo=e('div',undefined,'drink-demo');demo.innerHTML=drinkArt(i);const artImage=new Image();artImage.onload=()=>{demo.querySelector('.drink-manga').style.aspectRatio=artImage.naturalWidth+'/'+artImage.naturalHeight};artImage.src='assets/drink-manga-'+(i+1)+'.webp';
 const caption=e('div',lesson.captions[0],'drink-caption');caption.setAttribute('aria-live','polite');
 const controls=e('div',undefined,'drink-controls'),status=e('span','等待示範','drink-status');status.setAttribute('aria-live','polite');let animations=[],playing=false,started=false,token=0;
 function reset(){token++;animations.forEach(a=>a.cancel());animations=[];playing=false;started=false;caption.textContent=lesson.captions[0];status.textContent='等待示範';play.textContent='▶ 播放示範';}
 function start(){started=true;playing=true;play.textContent='Ⅱ 暫停示範';status.textContent='示範中';const scenes=[...demo.querySelectorAll('[data-scene]')],span=i===5?2250:i===6?2000:3200,total=scenes.length*span,currentToken=++token;
 const sequence=i===5?Array.from({length:20},(_,n)=>n%4):scenes.map((_,n)=>n);
 scenes.forEach((node,n)=>{const frames=sequence.map((f,k)=>({opacity:f===n?1:0,offset:k/sequence.length,easing:'steps(1,end)'}));frames.push({opacity:n===scenes.length-1?1:0,offset:1});animations.push(node.animate(frames,{duration:total,fill:'forwards'}));});
 const tracker=demo.animate([{opacity:1},{opacity:1}],{duration:total});animations.push(tracker);
 const update=()=>{if(currentToken!==token||!section.isConnected)return;const t=tracker.currentTime||0;caption.textContent=drinkFrameCaptions[i][Math.min(drinkFrameCaptions[i].length-1,Math.floor(t/span))];if(tracker.playState==='running'||tracker.playState==='paused')requestAnimationFrame(update)};requestAnimationFrame(update);
 tracker.finished.then(()=>{if(currentToken!==token)return;playing=false;caption.textContent=drinkFrameCaptions[i].at(-1);status.textContent='示範完成';play.textContent='▶ 再看一次';}).catch(()=>{});
 }
 const play=b('▶ 播放示範',()=>{if(!started){start();return}if(playing){animations.forEach(a=>a.pause());playing=false;play.textContent='▶ 繼續示範';status.textContent='已暫停'}else if(animations.at(-1)?.playState==='finished'){reset();start()}else{animations.forEach(a=>a.play());playing=true;play.textContent='Ⅱ 暫停示範';status.textContent='示範中'}},'yellow');
 controls.append(play,b('↺ 重播',()=>{reset();start()},'light'),status);
 if(i<6)controls.append(b('往下，下一個動作 ↓',()=>document.getElementById('drink-step-'+(i+2)).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}),'light'));
 section.append(heading,demo,caption);if(lesson.warning)section.append(e('p',lesson.warning,'drink-warning'));section.append(controls);app.append(section);
});
const end=e('div',undefined,'drink-end');end.append(e('h2','我們的飲品完成了！'),b('查看我們的門市成果 →',()=>go('results'),'yellow'));app.append(end);
}
