/* The car follows the road only when its slider or drawing is dragged. */
(() => {
  "use strict";
  const $=s=>document.querySelector(s), art=window.BirthdayArt;
  const {svg,person,line,ink,red}=art;
  const cypress=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0v-76M-11-12Q-23-41 0-97C23-47 22-25 11-12Z" fill="#fff" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/></g>`;
  const hill=`<path d="M-20 162Q66 71 173 151T370 148T660 130M-10 210q142-133 272-20t398-28" fill="none" stroke="#bdbab2" stroke-width="2.4" stroke-linecap="round"/>`;
  $("#tuscanyStage").innerHTML=svg(`<circle cx="514" cy="43" r="20" fill="none" stroke="${red}" stroke-width="2.5"/><path d="m25 47q7-14 20 0m75 22q8-13 19 0" ${line}/>${hill}
    ${cypress(41,174,.68)}${cypress(80,157,.56)}${cypress(288,153,.66)}${cypress(355,175,.55)}${cypress(484,146,.64)}
    <path d="m204 113 30-25 33 25v42h-63Z" fill="#fff" stroke="${ink}" stroke-width="2.5"/><path d="M224 155v-24h15v24m11-40h8v10h-8" fill="none" stroke="${ink}" stroke-width="2"/>
    <path d="M-12 276C101 178 141 265 227 255S340 200 422 242s133 2 219-59" fill="none" stroke="#ece9e2" stroke-width="27"/>
    <path id="drivePath" d="M54 253C119 219 148 265 227 255S340 200 422 242s91 12 147-28" fill="none" stroke="#c4c0b6" stroke-width="2.3" stroke-dasharray="8 10"/>
    <g transform="translate(552 164)"><path d="M-34 7v-60h66v62M-31-51l9-10 55 0-1 10" fill="#fff" stroke="${ink}" stroke-width="2.5"/><text x="1" y="-34" font-family="Friend Hand,sans-serif" font-size="16" text-anchor="middle" fill="${ink}">德州</text><text x="1" y="-17" font-family="Friend Hand,sans-serif" font-size="16" text-anchor="middle" fill="${ink}">牌桌</text><text x="1" y="2" font-family="Georgia,serif" font-size="17" text-anchor="middle" fill="${red}">♥</text></g>
    <g id="journeyCar">
      <ellipse cx="0" cy="4" rx="63" ry="5" fill="#1919190b"/>
      <path d="m-60-17 13-12 19-37 61-1 20 36 13 10-2 20h-123Z" fill="#fff" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
      <path d="m-20-61-15 28h73l-16-28Z" fill="#faf9f6" stroke="${ink}" stroke-width="2.5"/>
      <clipPath id="carWindowClip"><path d="m-20-60-14 26h71l-15-26Z"/></clipPath>
      <g clip-path="url(#carWindowClip)">${person(-12,-39,.34,"me")}${person(17,-38,.34,"zhu")}</g>
      <path d="M3-61v28m-61 14h15m94-1h12m-49-1h12" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="m-54-10 103-1" stroke="${red}" stroke-width="3"/>
      <g transform="translate(-35 0)"><g class="car-wheel"><circle r="12" fill="#fff" stroke="${ink}" stroke-width="3"/><path d="m-7 0h14M0-7V7" stroke="${ink}" stroke-width="2"/></g></g>
      <g transform="translate(38 0)"><g class="car-wheel"><circle r="12" fill="#fff" stroke="${ink}" stroke-width="3"/><path d="m-7 0h14M0-7V7" stroke="${ink}" stroke-width="2"/></g></g>
    </g>`, "0 0 640 320");
  $("#giftDrawing").innerHTML=art.gift;
  $("#invitationArt").innerHTML=art.together;
  const panels=[$("#scooterAnimation"),$("#tuscanyPanel")];
  const range=$("#driveRange"),car=$("#journeyCar"),path=$("#drivePath"),length=path.getTotalLength();
  let dragging=false;
  function progress() {}
  function moveCar() {
    const value=Number(range.value),p=value/100;
    const point=path.getPointAtLength(length*p),ahead=path.getPointAtLength(Math.min(length,length*p+3)),behind=path.getPointAtLength(Math.max(0,length*p-3));
    const angle=Math.atan2(ahead.y-behind.y,ahead.x-behind.x)*180/Math.PI;
    car.setAttribute("transform",`translate(${point.x} ${point.y}) rotate(${angle*.45})`);
    document.querySelectorAll(".car-wheel").forEach(w=>w.setAttribute("transform",`rotate(${value*13})`));
    $("#tuscanyPanel").dataset.distance=String(value);
    $("#sitDown").disabled=value<95;
    $("#sitDown").textContent=value>=95?"坐下，开一手 ↗":"还没到呢";
    range.setAttribute("aria-valuetext",value>=95?"到达生日牌桌":`已经开了${value}%`);
    $("#roadCaption").textContent=value>=95?"到啦，前面就是德州桌。":value>60?"等一下，我还没看够呢。":value>25?"你看路，我看你。":"坐稳啦，带你去玩德州。";
  }
  $("#startJourney").addEventListener("click",()=>{
    $("#welcome").hidden=true;$("#journeySection").hidden=false;
    window.BirthdaySound?.start();
    scrollTo({top:0,behavior:"instant"});
    $("#scooterStage").focus({preventScroll:true});
  });
  function toTable() {
    $("#journeySection").hidden=true;$("#pokerSection").hidden=false;
    window.BirthdaySound?.effect("arrive");
    $("#pokerSection").dispatchEvent(new CustomEvent("journey:arrived"));
    $("#pokerSection").scrollIntoView({behavior:"instant",block:"start"});
  }
  $("#scooterAnimation").addEventListener("journey:advance",()=>{
    panels[0].hidden=true;panels[1].hidden=false;
    window.BirthdaySound?.effect("transition");
    panels[1].scrollIntoView({behavior:"instant",block:"start"});
  });
  $("#sitDown").addEventListener("click",()=>{if(Number(range.value)>=95)toTable();});
  $("#skipJourney").addEventListener("click",toTable);
  let previousDistance=0;
  function drive() {
    const value=Number(range.value);
    moveCar();
    if(previousDistance<95&&value>=95)window.BirthdaySound?.effect("arrive");
    else if(value!==previousDistance)window.BirthdaySound?.effect("drive");
    previousDistance=value;
  }
  range.addEventListener("input",drive);
  // Drawing drag uses the same native slider, including keyboard accessibility.
  function drag(event) {
    if(!dragging)return;
    const box=$("#tuscanyStage").getBoundingClientRect();
    range.value=String(Math.max(0,Math.min(100,(event.clientX-box.left-box.width*.084)/(box.width*.8)*100)));
    drive();
  }
  $("#tuscanyStage").addEventListener("pointerdown",event=>{dragging=true;event.currentTarget.setPointerCapture(event.pointerId);drag(event);});
  $("#tuscanyStage").addEventListener("pointermove",drag);
  for(const name of ["pointerup","pointercancel"])$("#tuscanyStage").addEventListener(name,()=>{dragging=false;});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)dragging=false;});
  $("#restartJourney").addEventListener("click",()=>{
    document.dispatchEvent(new CustomEvent("birthday:restart"));
    $("#welcome").hidden=false;$("#journeySection").hidden=true;$("#pokerSection").hidden=true;
    panels[0].hidden=false;panels[1].hidden=true;range.value="0";previousDistance=0;dragging=false;
    moveCar();
    scrollTo({top:0,behavior:"instant"});
    $("#startJourney").focus({preventScroll:true});
  });
  moveCar();
})();
