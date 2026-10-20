import json,subprocess,os
from pathlib import Path
import sherpa_onnx as so,soundfile as sf,numpy as np
r=Path(os.environ.get('LANSTAR_TTS_MODEL','/tmp/vits-zh-hf-fanchen-C'));root=Path(__file__).resolve().parents[1];work=Path('/tmp/lanstar-full-narration');work.mkdir(exist_ok=True)
c=so.OfflineTtsConfig(model=so.OfflineTtsModelConfig(vits=so.OfflineTtsVitsModelConfig(model=str(r/'vits-zh-hf-fanchen-C.onnx'),lexicon=str(r/'lexicon.txt'),tokens=str(r/'tokens.txt')),num_threads=2),rule_fsts=','.join(str(r/x) for x in ['phone.fst','date.fst','number.fst']),max_num_sentences=1)
tts=so.OfflineTts(c);captions=json.loads(subprocess.check_output(['node','-e',"const fs=require('fs'),vm=require('vm');const s=fs.readFileSync('assets/drink.js','utf8');console.log(JSON.stringify(vm.runInNewContext(s.slice(0,s.indexOf('function drinkArt'))+';drinkFrameCaptions;')));"],cwd=root));parts=[];lessons=[];sr=44100;position=0
# Normalize only numeric recipe notation for clear spoken instructions.
for i,lines in enumerate(captions):
 start=position;cues=[]
 for n,text in enumerate(lines):
  spoken=text.replace('150 ml','一百五十毫升').replace('45度','四十五度').replace('嵐星','岚星')
  a=tts.generate(spoken,sid=5,speed=1.08);src=work/f'{i}-{n}.wav';dst=work/f'{i}-{n}-fx.wav';sf.write(src,a.samples,a.sample_rate)
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(src),'-af','asetrate=19200,aresample=44100,atempo=0.9,equalizer=f=350:t=q:w=0.7:g=2,equalizer=f=3200:t=q:w=1.1:g=-3,lowpass=f=6500','-ar',str(sr),str(dst)],check=True)
  x,_=sf.read(dst);x=np.concatenate([np.zeros(int(sr*.12)),x,np.zeros(int(sr*.3))]);cues.append({'start':round(position/sr*1000),'end':round((position+len(x))/sr*1000),'text':text,'frame':n});parts.append(x);position+=len(x)
 lessons.append({'start':round(start/sr*1000),'end':round(position/sr*1000),'cues':cues});print('lesson',i+1,'seconds',round((position-start)/sr,1),flush=True)
full=np.concatenate(parts);sf.write(work/'full.wav',full,sr)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(work/'full.wav'),'-af','loudnorm=I=-16:TP=-1.5:LRA=8','-ar',str(sr),'-b:a','128k',str(root/'assets/voice/drink-narration.mp3')],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(root/'assets/voice/drink-narration.mp3'),'-stream_loop','-1','-i',str(root/'assets/voice/music-happy.mp3'),'-filter_complex',f'[0:a]asplit=2[v][trigger];[1:a]volume=0.75,afade=t=out:st={len(full)/sr-1}:d=1[m];[m][trigger]sidechaincompress=threshold=0.06:ratio=3:attack=15:release=250[bg];[v][bg]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95:latency=1[a]','-map','[a]','-t',str(len(full)/sr),'-b:a','160k',str(root/'assets/voice/drink-full-happy.mp3')],check=True)
meta={'src':'assets/voice/drink-full-happy.mp3','duration':round(len(full)/sr*1000),'lessons':lessons}
(root/'assets/drink-timeline.js').write_text('const drinkNarration='+json.dumps(meta,ensure_ascii=False)+';\n')
print('TOTAL',round(len(full)/sr,1),flush=True)
