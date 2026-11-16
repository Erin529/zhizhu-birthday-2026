/* A small birthday hand: peek, bet, reveal, then choose five of seven. */
(() => {
  "use strict";
  const $=s=>document.querySelector(s),art=window.BirthdayArt;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const holes=[...document.querySelectorAll(".hole-tap")],board=[...document.querySelectorAll(".board-card")],cards=[...holes,...board];
  const ranks=["红心Q","红心K","红心10","红心J","梅花2","黑桃2","红心A"],royal=[0,1,2,3,6];
  const next=$("#nextRound"),raise=$("#raiseBet"),label=$("#nextLabel"),note=$("#roundNote"),section=$("#pokerSection");
  const result=$("#handResult"),film=$("#filmSection"),steps=[...document.querySelectorAll(".round-track li")];
  let phase="idle",busy=false,generation=0,stack=100,pigStack=100,pot=0;
  const seen=new Set(),selected=new Set();
  holes.forEach((card,i)=>{card.querySelector(".card-back").innerHTML=art.back;card.querySelector(".card-front").innerHTML=art.hole[i];});
  board.forEach((card,i)=>{card.querySelector(".card-back").innerHTML=art.back;card.querySelector(".card-front").innerHTML=art.board[i];});
  $("#pigDealer").innerHTML=art.pig;
  $(".song-doodle").innerHTML=art.together;
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,reduced?0:ms));
  function speech(text){$("#dealerSpeech").textContent=text;}
  function chips() {
    $("#stackCount").textContent=String(stack);$("#pigStack").textContent=String(pigStack);$("#potCount").textContent=String(pot);
    $(".pot").classList.remove("chip-bump");void $(".pot").offsetWidth;$(".pot").classList.add("chip-bump");
  }
  function track() {
    const index={idle:0,preflop:0,flop:1,flopBet:1,turn:2,turnBet:2,river:3,select:4,won:4}[phase];
    steps.forEach((node,i)=>{node.classList.toggle("done",i<index||phase==="won");node.removeAttribute("aria-current");if(i===index)node.setAttribute("aria-current","step");});
    section.dataset.phase=phase;
    $("#board").setAttribute("aria-label",`五张公共牌，已翻开${board.filter(c=>c.classList.contains("opened")).length}张`);
  }
  function controls() {
    const selecting=phase==="select";
    document.querySelectorAll(".hole-card small").forEach((node,i)=>{node.textContent=selecting?"点我选牌":i===0?"先偷看":"再看看";});
    cards.forEach((card,i)=>{
      const isHole=i<2,bi=i-2;
      const revealable=phase==="flop"&&bi>=0&&bi<3||phase==="turn"&&bi===3||phase==="river"&&bi===4;
      const can=isHole?phase!=="idle"&&phase!=="won":selecting||revealable&&!card.classList.contains("opened");
      card.disabled=busy||!can;
      card.classList.toggle("ready",!busy&&(selecting||isHole&&phase==="preflop"&&!seen.has(i)||!isHole&&revealable&&!card.classList.contains("opened")));
      if(selecting)card.setAttribute("aria-label",`${ranks[i]}，${selected.has(i)?"已选中，点一下取消":"点一下选入五张牌"}`);
      else if(card.classList.contains("opened"))card.setAttribute("aria-label",`${ranks[i]}，${isHole&&phase!=="won"?"点一下盖回底牌":"已翻开"}`);
      else card.setAttribute("aria-label",isHole?(phase==="idle"?"先发牌":`点一下看${i===0?"竹竹":"我"}的底牌`):revealable?`点一下翻开第${bi+1}张公共牌`:`第${bi+1}张公共牌，还没发到这一轮`);
      card.setAttribute("aria-pressed",String(selecting?selected.has(i):card.classList.contains("opened")));
    });
    const betting=["preflop","flopBet","turnBet"].includes(phase);
    next.hidden=["flop","turn","river","won"].includes(phase);
    next.disabled=busy||phase==="preflop"&&seen.size<2||selecting&&selected.size!==5;
    raise.hidden=!betting;
    raise.disabled=busy||phase==="preflop"&&seen.size<2;
    label.textContent={idle:"发牌",preflop:"跟注 10",flopBet:"过牌",turnBet:"过牌",select:"开牌，看看！"}[phase]||"发牌";
    raise.textContent=phase==="preflop"?"加注到 20":phase==="flopBet"?"下注 10":"下注 20";
    $("#gameHint").textContent=selecting?`已选 ${selected.size} / 5 张`:phase==="preflop"?"先看看我们俩的底牌。":"";
    $("#resetHand").hidden=phase==="idle";
    track();
  }
  async function turnFace(card,open=true) {
    const token=generation;
    const hadFocus=document.activeElement===card;
    window.BirthdaySound?.effect("flip");
    busy=true;controls();
    if(open){card.classList.add("opened");card.classList.remove("settled");}
    else {card.classList.remove("opened","settled");}
    await delay(630);
    if(token!==generation)return false;
    if(open)card.classList.add("settled");
    busy=false;
    controls();
    if(hadFocus)card.focus({preventScroll:true});
    return true;
  }
  function beginSelection() {
    phase="select";
    holes.forEach(card=>card.classList.add("opened","settled"));
    note.textContent="七张里，挑出最好的一手五张牌。";
    speech("哼哼。两个 2 也挺可爱？");
    controls();
  }
  async function reveal(card,index) {
    if(busy||card.disabled)return;
    if(phase==="select") {
      if(selected.has(index)){selected.delete(index);card.classList.remove("selected");}
      else {
        if(selected.size===5){note.textContent="先取消一张，再换你想要的牌。";return;}
        selected.add(index);card.classList.add("selected");
      }
      window.BirthdaySound?.effect("select");
      note.textContent=selected.size===5?"选好了？开牌！":"七张里，挑出最好的一手五张牌。";
      controls();return;
    }
    if(index<2) {
      const open=!card.classList.contains("opened");
      if(!await turnFace(card,open))return;
      seen.add(index);
      if(phase==="preflop") {
        note.textContent=seen.size===2?"Q 和 K，我们俩。跟还是加？":"另一张也看看？";
        speech(seen.size===2?"我先放 10，你们跟不跟？":"偷看没事，我不告状。");
      }
      controls();return;
    }
    if(!await turnFace(card))return;
    if(phase==="flop") {
      const n=board.slice(0,3).filter(c=>c.classList.contains("opened")).length;
      note.textContent=n===3?"10、J，还有个凑热闹的 2。":`翻开 ${n} / 3 张，再点一张。`;
      if(n===3){phase="flopBet";speech("红心有点多啊，我先过。");}
    } else if(phase==="turn") {
      phase="turnBet";note.textContent="又来一个 2。先别急。";speech("我还是过。你们要加吗？");
    } else if(phase==="river") {beginSelection();return;}
    controls();
  }
  function stake(amount) {
    // On the first street the pig has already put in ten.
    const pigAmount=phase==="preflop"?amount-10:amount;
    stack-=amount;pigStack-=pigAmount;pot+=amount+pigAmount;chips();
  }
  function betting(add) {
    if(busy||!["preflop","flopBet","turnBet"].includes(phase)||phase==="preflop"&&seen.size<2)return;
    const previous=phase,amount=previous==="preflop"?(add?20:10):add?(previous==="flopBet"?10:20):0;
    stake(amount);
    window.BirthdaySound?.effect(amount?"chip":"pop");
    speech(add?"加就加，小猪跟了！":"行。下一张你来翻。");
    phase={preflop:"flop",flopBet:"turn",turnBet:"river"}[previous];
    const dealt=phase==="flop"?[0,1,2]:phase==="turn"?[3]:[4];
    dealt.forEach(i=>board[i].classList.add("dealt"));
    note.textContent=phase==="flop"?"三张翻牌，你来翻。":phase==="turn"?"第四张，翻开看看。":"最后一张。你来。";
    controls();
  }
  function showdown() {
    if(phase!=="select"||selected.size!==5)return;
    if(!royal.every(i=>selected.has(i))) {
      note.textContent="差一点。试试把红心凑成 10、J、Q、K、A？";
      speech("我就说两个 2 是来凑热闹的。");
      window.BirthdaySound?.effect("error");
      section.classList.remove("wrong-hand");void section.offsetWidth;section.classList.add("wrong-hand");
      return;
    }
    phase="won";stack+=pot;pot=0;chips();
    cards.forEach((card,i)=>{card.classList.remove("selected","ready");card.classList.add(royal.includes(i)?"winner":"discarded");});
    note.textContent="红心 10、J、Q、K、A。";
    speech("皇家同花顺！……这把算你们厉害。");
    result.hidden=false;film.hidden=false;$(".poker-table").classList.add("celebrating");
    window.BirthdaySound?.effect("win");
    controls();
    $("#toFilm").focus({preventScroll:true});
  }
  next.addEventListener("click",()=>{
    if(busy||next.disabled)return;
    if(phase==="idle") {
      phase="preflop";pigStack-=10;pot=10;chips();holes.forEach(card=>card.classList.add("dealt"));
      window.BirthdaySound?.effect("deal");
      note.textContent="我们拿到了什么？";
      speech("我先放 10，你们慢慢看。");controls();
    } else if(phase==="select")showdown();
    else betting(false);
  });
  raise.addEventListener("click",()=>betting(true));
  cards.forEach((card,i)=>card.addEventListener("click",()=>reveal(card,i)));
  let mediaRequest=0;
  function resetHand(whole=false) {
    mediaRequest++;
    generation++;phase="idle";busy=false;stack=100;pigStack=100;pot=0;seen.clear();selected.clear();
    cards.forEach(card=>card.classList.remove("opened","settled","winner","ready","selected","dealt","discarded"));
    $(".poker-table").classList.remove("celebrating");section.classList.remove("wrong-hand");
    result.hidden=true;film.hidden=true;note.textContent=whole?"坐好了？发牌吧。":"再来一手。这次怎么打？";speech(whole?"小猪等你开牌呢。":"洗好啦。你们先。");chips();controls();
    audio.pause();video.pause();
    for(const player of [audio,video])if(player.readyState>0)player.currentTime=0;
    fallback=false;
    if(config.video){video.removeAttribute("src");video.load();}
    $("#mediaStatus").textContent="";
    $("#filmCover").hidden=false;video.hidden=true;$("#songControls").hidden=true;
    buttonState();
    if(!whole){window.BirthdaySound?.effect("deal");$("#resetHand").blur();next.focus({preventScroll:true});}
  }
  $("#resetHand").addEventListener("click",()=>resetHand());
  document.addEventListener("birthday:restart",()=>resetHand(true));
  $("#toFilm").addEventListener("click",event=>{
    event.preventDefault();film.scrollIntoView({behavior:reduced?"instant":"smooth",block:"start"});
  });
  const config=window.BIRTHDAY_MEDIA||{};
  const video=$("#memoryVideo"),audio=$("#birthdaySong"),play=$("#playGift"),playLabel=$("#playLabel"),status=$("#mediaStatus");
  if(config.song)audio.src=config.song;
  if(config.video)playLabel.textContent="播放视频";
  let fallback=false;
  function currentMedia(){return config.video&&!fallback?video:audio;}
  function buttonState() {
    const media=currentMedia();
    play.setAttribute("aria-pressed",String(!media.paused));
    playLabel.textContent=media.paused?(media===video?"播放视频":"听听这首歌"):(media===video?"暂停视频":"暂停歌曲");
  }
  function audioFallback() {
    fallback=true;video.hidden=true;$("#filmCover").hidden=false;$("#songControls").hidden=false;
    status.textContent="视频暂时打不开，先听我写给你的歌吧。";buttonState();
  }
  video.addEventListener("error",audioFallback);
  play.addEventListener("click",async()=>{
    if(phase!=="won")return;
    const media=currentMedia();
    if(!media.paused){media.pause();return;}
    const token=++mediaRequest;
    window.BirthdaySound?.hold();
    if(media===video){
      if(!video.getAttribute("src"))video.src=config.video;
      video.hidden=false;$("#filmCover").hidden=true;
    }
    else $("#songControls").hidden=false;
    try{await media.play();if(token!==mediaRequest){media.pause();return;}if(media===audio&&!fallback)status.textContent="";}
    catch{if(token!==mediaRequest)return;window.BirthdaySound?.release();if(media===video)audioFallback();else status.textContent="点下面播放器的播放键，就能听了。";}
    buttonState();
  });
  for(const media of [audio,video])for(const event of ["play","pause","ended"])media.addEventListener(event,buttonState);
  audio.addEventListener("error",()=>{status.textContent="歌曲暂时打不开，稍后再试一下。";});
  $("#toLetter").addEventListener("click",event=>{
    event.preventDefault();
    currentMedia().pause();
    $("#letterSection").scrollIntoView({behavior:reduced?"instant":"smooth",block:"start"});
    $("#letterTitle").focus({preventScroll:true});
  });
  controls();
})();
