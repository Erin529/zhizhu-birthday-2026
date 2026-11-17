/* Original bright mallet loop and small cartoon foley, generated offline. */
(() => {
  "use strict";
  const button=document.querySelector("#soundToggle"),label=document.querySelector("#soundLabel");
  const hint=document.querySelector("#soundHint");
  const media=[...document.querySelectorAll("#birthdaySong, #memoryVideo")];
  let ctx=null,bgmBus=null,fxBus=null,noiseBuffer=null,timer=null;
  let enabled=true,started=false,held=false,playing=false,nextTime=0,beat=0,request=0;
  const voices=new Set(),counts={};
  let lastDrive=-1;
  const eighth=60/114/2;
  const melody=[
    76,0,79,0,81,79,76,0,74,76,79,76,72,0,74,0,
    76,0,81,0,84,83,81,0,79,76,74,76,81,0,79,0,
    77,0,81,0,84,81,79,0,77,79,81,79,77,0,76,0,
    74,0,79,0,83,81,79,0,76,74,71,74,72,0,79,0
  ];
  const chords=[[48,60,64,67],[45,57,60,64],[41,53,57,60],[43,55,59,62]];
  const frequency=n=>440*2**((n-69)/12);
  function voice(sources,nodes,kind) {
    const v={sources,nodes,kind};
    const cleanup=()=>{if(!voices.delete(v))return;for(const n of nodes)n.disconnect();};
    sources[0].onended=cleanup;v.cleanup=cleanup;voices.add(v);return v;
  }
  function init() {
    if(ctx)return true;
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio){button.hidden=true;return false;}
    try {
      ctx=new Audio();
      const master=ctx.createGain(),compressor=ctx.createDynamicsCompressor();
      master.gain.value=.65;compressor.threshold.value=-14;compressor.ratio.value=4;
      compressor.attack.value=.004;compressor.release.value=.12;
      bgmBus=ctx.createGain();fxBus=ctx.createGain();
      bgmBus.gain.value=0;fxBus.gain.value=.7;
      bgmBus.connect(compressor);fxBus.connect(compressor);compressor.connect(master);master.connect(ctx.destination);
      noiseBuffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.5),ctx.sampleRate);
      const data=noiseBuffer.getChannelData(0);
      for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
      return true;
    } catch {ctx=null;button.hidden=true;return false;}
  }
  function tone(note,at,length,volume,kind="bgm",timbre="mallet",endNote=null) {
    const osc=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
    osc.type=timbre==="bass"?"triangle":"sine";osc.frequency.setValueAtTime(frequency(note),at);
    if(endNote!==null)osc.frequency.exponentialRampToValueAtTime(frequency(endNote),at+length*.8);
    filter.type="lowpass";filter.frequency.value=timbre==="bass"?450:3600;
    gain.gain.setValueAtTime(.0001,at);
    gain.gain.exponentialRampToValueAtTime(volume,at+.006);
    gain.gain.exponentialRampToValueAtTime(.0001,at+length);
    const bus=kind==="bgm"?bgmBus:fxBus;
    osc.connect(filter).connect(gain).connect(bus);
    const nodes=[osc,filter,gain],sources=[osc];
    if(timbre==="mallet") {
      const upper=ctx.createOscillator(),upperGain=ctx.createGain();
      upper.type="sine";upper.frequency.value=frequency(note)*3;
      upperGain.gain.value=.17;upper.connect(upperGain).connect(filter);
      nodes.push(upper,upperGain);sources.push(upper);
    }
    voice(sources,nodes,kind);
    for(const source of sources){source.start(at);source.stop(at+length+.025);}
  }
  function noise(at,length,volume,cutoff=2300,kind="fx") {
    const src=ctx.createBufferSource(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
    src.buffer=noiseBuffer;filter.type="highpass";filter.frequency.value=cutoff;
    gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(volume,at+.003);
    gain.gain.exponentialRampToValueAtTime(.0001,at+length);
    src.connect(filter).connect(gain).connect(kind==="bgm"?bgmBus:fxBus);
    voice([src],[src,filter,gain],kind);src.start(at);src.stop(at+length+.02);
  }
  function stopVoices(kind) {
    for(const v of [...voices])if(!kind||v.kind===kind) {
      for(const source of v.sources)try{source.stop();}catch{}
      v.cleanup();
    }
  }
  function paint() {
    button.setAttribute("aria-pressed",String(enabled&&started));
    button.setAttribute("aria-label",!started?"播放背景音乐和音效":enabled?"关闭背景音乐和音效":"开启背景音乐和音效");
    label.textContent=!started?"听音乐":enabled?"声音：开":"声音：关";
    document.body.dataset.sound=enabled?"on":"off";
    document.body.dataset.bgm=playing?"playing":"paused";
  }
  function halt() {
    playing=false;clearInterval(timer);timer=null;
    if(ctx)bgmBus.gain.setValueAtTime(0,ctx.currentTime);
    stopVoices("bgm");paint();
  }
  function schedule() {
    if(!playing||ctx.state!=="running"||document.hidden)return;
    if(nextTime<ctx.currentTime)nextTime=ctx.currentTime+.035;
    while(nextTime<ctx.currentTime+.24) {
      const index=beat%64,chord=chords[Math.floor(index/16)];
      const at=nextTime+(beat%2?eighth*.055:0),note=melody[index];
      if(note)tone(note,at,.38,index%4===0?.092:.073);
      if(beat%4===0)tone(chord[0],at,.58,.075,"bgm","bass");
      if(beat%4===2)tone(chord[0]+7,at,.34,.035,"bgm","bass");
      if(beat%8===0)chord.slice(1).forEach((n,i)=>tone(n,at+i*.025,.55,.015));
      if(beat%4===0)tone(40,at,.11,.052,"bgm","bass",25);
      if(beat%4===2)noise(at,.045,.016,3200,"bgm");
      if(beat%2===1)noise(at,.026,.0055,5500,"bgm");
      beat++;nextTime+=eighth;
    }
  }
  function mayPlay(){return enabled&&started&&!held&&!document.hidden;}
  function showHint(blocked) {
    if(hint)hint.hidden=!blocked;
  }
  function wake() {
    if(!mayPlay()||!init())return;
    const token=++request;
    ctx.resume().then(()=>{
      if(token!==request||!mayPlay())return;
      if(ctx.state!=="running"){showHint(true);return;}
      showHint(false);
      if(!playing) {
        playing=true;nextTime=ctx.currentTime+.035;
        bgmBus.gain.setValueAtTime(.65,ctx.currentTime);
        schedule();timer=setInterval(schedule,80);paint();
      }
    }).catch(()=>{showHint(true);halt();});
  }
  // Phone browsers, especially WeChat's WebView, only unlock audio inside a user gesture.
  function unlock() {
    if(!init()||!ctx||ctx.state!=="suspended")return;
    ctx.resume().then(()=>showHint(false)).catch(()=>{});
  }
  for(const eventName of ["pointerdown","touchend","click"]) {
    document.addEventListener(eventName,unlock,{once:true,passive:true});
  }
  window.addEventListener("WeixinJSBridgeReady",unlock,{once:true});
  function effect(name) {
    if(!ctx||ctx.state!=="running"||!enabled||!started||held||document.hidden)return;
    const at=ctx.currentTime+.008;
    if(name==="drive") {
      if(at-lastDrive<.33)return;lastDrive=at;
      tone(47,at,.16,.045,"fx","bass",52);noise(at,.09,.012,900);counts.drive=(counts.drive||0)+1;return;
    }
    counts[name]=(counts[name]||0)+1;
    const pluck=(n,t=0,l=.15,v=.12,end=null)=>tone(n,at+t,l,v,"fx","mallet",end);
    if(name==="flip"||name==="deal"){noise(at,.09,.065,1800);pluck(79,.025,.11,.045);}
    else if(name==="chip"){[0,.045,.09].forEach((t,i)=>pluck(65+i*4,t,.07,.10));}
    else if(name==="fall"){noise(at,.18,.045,1000);pluck(86,0,.28,.14,57);pluck(48,.24,.16,.08);}
    else if(name==="boing"){pluck(55,0,.23,.13,79);pluck(79,.2,.17,.09,67);}
    else if(name==="bell"){pluck(88,0,.40,.10);pluck(91,.12,.40,.08);}
    else if(name==="scooter"){tone(43,at,.3,.06,"fx","bass",55);noise(at,.14,.015,700);}
    else if(name==="win"){[72,76,79,84,88,91,96].forEach((n,i)=>pluck(n,i*.10,.62,i<4?.10:.07));}
    else if(name==="arrive"||name==="transition"){[79,84,88].forEach((n,i)=>pluck(n,i*.09,.32,.09));}
    else if(name==="error"){pluck(67,0,.13,.08);pluck(64,.13,.15,.08);}
    else if(name==="pickup"){pluck(79,0,.16,.08);pluck(84,.09,.19,.08);}
    else {pluck(84,0,.095,.065);}
  }
  function start() {
    started=true;held=media.some(m=>!m.paused);
    paint();
    if(!enabled)return;
    wake();
  }
  function hold(){held=true;request++;halt();stopVoices("fx");}
  function release(){held=media.some(m=>!m.paused);if(!held)wake();}
  button.addEventListener("click",()=>{
    if(!started){enabled=true;start();return;}
    enabled=!enabled;request++;
    if(!enabled){showHint(false);halt();stopVoices("fx");if(ctx)ctx.suspend().catch(()=>{});}
    else {paint();if(started)wake();}
    paint();
  });
  for(const player of media) {
    player.addEventListener("play",hold);
    for(const event of ["pause","ended","error"])player.addEventListener(event,release);
  }
  document.addEventListener("visibilitychange",()=>{
    request++;
    if(document.hidden){halt();stopVoices("fx");if(ctx)ctx.suspend().catch(()=>{});}
    else wake();
  });
  document.addEventListener("birthday:restart",()=>{
    request++;started=false;held=false;beat=0;nextTime=0;lastDrive=-1;
    showHint(false);halt();stopVoices();if(ctx)ctx.suspend().catch(()=>{});
  });
  window.BirthdaySound={start,effect,hold,release,snapshot:()=>({enabled,started,held,playing,context:ctx?.state||"uninitialized",beat,voices:voices.size,effects:{...counts}})};
  if(!(window.AudioContext||window.webkitAudioContext))button.hidden=true;
  paint();
})();
