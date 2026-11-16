/* One tap advances one scene of the scooter story. */
(() => {
  "use strict";
  const section = document.querySelector("#scooterAnimation");
  const stage = document.querySelector("#scooterStage");
  const caption = document.querySelector("#scooterCaption");
  const playButton = document.querySelector("#scooterPlay");
  const replayButton = document.querySelector("#scooterReplay");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const ink = "#191919", green = "#de514b";
  const line = `fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"`;
  const tea = `<path d="m-12-24 24 0-4 27-16 0Z" fill="#e9e5db" stroke="${ink}" stroke-width="3"/><ellipse cy="-24" rx="13" ry="3" fill="#fff" stroke="${ink}" stroke-width="3"/><path d="m3-25 3-19" ${line}/><g fill="${ink}"><circle cx="-4" cy="-4" r="2"/><circle cx="4" cy="-1" r="2"/><circle cx="1" cy="-8" r="2"/></g>`;
  /* Approved v7 outlines, in their original coordinates; only arms and legs change pose. */
  function person(id, name, driver = false) {
    const upper = driver
      ? `<path d="M-13 142C-25 144-39 149-44 161L-54 185L-35 191L-33 182L-34 233C-11 236 12 236 34 234L32 183L36 191L54 186L44 160C37 147 25 145 13 142" fill="#fff"/>
        <path d="M-12 132L-13 142Q0 155 13 142L12 133" fill="#fff"/>
        <path d="M-29 221L-30 229M27 222L28 231" stroke-width="1.7"/>
        <path d="M-29 103L-38 102C-39 118-39 130-37 139C-32 143-25 144-18 141L-20 122" fill="#fff"/>
        <path d="M29 102L40 103C40 118 39 131 35 141C29 144 24 144 19 142L20 122" fill="#fff"/>
        <path d="M-38 102C-40 86-33 73-23 65C-15 59-3 57 6 59M12 59C28 58 40 76 41 93L40 103" stroke-width="2.7"/>
        <path d="M-29 100C-33 97-37 100-35 105Q-34 110-29 109M29 100C34 98 38 101 36 106Q34 111 29 109" fill="#fff" stroke-width="2"/>
        <path d="M-29 109C-27 123-17 134 0 135C15 136 27 126 29 110" fill="#fff"/>
        <path d="M-29 99C-24 86-6 83 10 68C20 73 29 84 29 98" stroke-width="2.3"/>
        <path d="M10 68Q10 61 17 60M-33 115L-32 136M-27 130L-26 138M34 113Q34 127 31 137M26 130L25 139" stroke-width="1.7"/>
        <g stroke-width="1.7">
          <path d="M-25 109C-25 102-21 97-14 98C-7 97-3 101-3 109C-3 116-8 120-14 120C-22 120-25 116-25 109Z"/>
          <path d="M3 109C3 102 8 97 15 98C23 98 27 104 26 110C26 117 21 121 15 120C7 120 3 116 3 109Z"/>
          <path d="M-3 108Q0 106 3 108M-25 106L-29 105M26 106L29 105"/>
        </g>`
      : `<path d="M-13 141C-27 142-38 148-42 159L-52 184L-34 190L-32 181L-34 232C-13 236 11 234 33 233L32 180L35 189L53 184L43 159C38 148 25 144 13 141" fill="#fff"/>
        <path d="M-12 132L-13 141Q-1 156 13 141L12 133" fill="#fff"/>
        <path d="M-30 217L-29 227M25 219L26 229" stroke-width="1.7"/>
        <path d="M-39 98C-41 117-45 150-46 178C-41 183-34 184-29 181C-24 153-25 124-28 101" fill="#fff"/>
        <path d="M39 99C40 121 45 153 49 179C43 184 37 185 31 181C28 158 26 125 28 101" fill="#fff"/>
        <path d="M-39 98C-40 80-31 64-16 59C-7 56-2 58 2 57M6 57C20 57 33 66 37 79C39 87 40 92 39 99" stroke-width="2.7"/>
        <path d="M-29 101C-33 98-37 100-35 105Q-34 110-29 108M28 100C32 97 36 99 35 105Q34 109 29 108" fill="#fff" stroke-width="2"/>
        <path d="M-29 109C-28 122-19 132-4 134C12 137 26 125 29 110" fill="#fff"/>
        <g stroke-width="2.1">
          <path d="M-9 76C-11 86-17 95-25 99M-5 77C-7 86-10 93-15 97"/>
          <path d="M0 75C1 86-1 92-5 98M4 77C5 86 4 92 1 97"/>
          <path d="M11 76C13 87 18 94 24 99M15 78C18 87 22 92 28 96"/>
        </g>
        <path d="M-35 126C-36 145-37 161-39 173M-30 157L-32 176M34 128C35 146 38 162 41 177M32 160L34 176" stroke-width="1.6"/>
        <g stroke-width="2.1">
          <path d="M-25 109C-26 101-20 97-14 98C-6 97-3 102-3 109C-3 117-9 121-15 120C-22 120-25 116-25 109Z"/>
          <path d="M3 109C3 101 8 97 15 98C23 98 27 103 26 110C26 117 21 120 15 120C8 121 3 116 3 109Z"/>
          <path d="M-3 108Q0 106 3 108M-25 106L-29 105M26 106L29 104"/>
        </g>`;
    return `<g id="${id}" data-person="${driver ? "zhu" : "me"}" ${line}>
      <path id="${id}Legs" d="${sittingLegs}" fill="#fff" stroke-width="1.45"/>
      <g id="${id}Torso">
        <defs>
          <path id="${id}LeftArm" d="${driver ? "M-27-80Q-9-66 34-101" : "M-27-80Q-39-66-53-80"}"/>
          <path id="${id}RightArm" d="${driver ? "M27-80Q40-79 54-101" : "M27-80Q43-67 58-75"}"/>
        </defs>
        <use href="#${id}LeftArm" stroke="${ink}" stroke-width="7"/>
        <use href="#${id}LeftArm" stroke="#fff" stroke-width="4.4"/>
        <use href="#${id}RightArm" stroke="${ink}" stroke-width="7"/>
        <use href="#${id}RightArm" stroke="#fff" stroke-width="4.4"/>
        <g transform="translate(0 -187.22) scale(.58)" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          ${upper}
          <g id="${id}Eyes" fill="#191919" stroke="none">
            <ellipse cx="-14" cy="109" rx="1.6" ry="2.2"/>
            <ellipse cx="15" cy="109" rx="1.6" ry="2.2"/>
          </g>
          <path id="${id}Brows" d="M-22 91L-7 92M8 92L22 91" stroke-width="2.1" opacity="0"/>
          <path id="${id}Mouth" d="${driver ? "M-6 125Q1 130 7 124Q5 134 1 134Q-3 134-6 125Z" : "M-5 125Q1 130 7 124"}" stroke-width="${driver?1.8:2}"/>
        </g>
        <g id="${id}Cup" transform="translate(-53 -80)" ${driver ? 'opacity="0"' : ""}>${tea}</g>
      </g>
      <text x="1" y="-171" text-anchor="middle" fill="${ink}" stroke="none" font-family="Friend Hand,KaiTi,serif" font-size="28">${name}</text>
    </g>`;
  }
  function bystander(id, x, scale) {
    return `<g id="${id}" transform="translate(${x} 343) scale(${scale})" fill="none" stroke="#b7b7b0" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m-13-90-7 47 21 1 20-1-9-48m-24 5-14 29m41-29 11 28M-11-42l-4 40-9 1m35-40 6 39h9"/>
      <g id="${id}Head">
        <path d="M-19-131c-7-20 39-22 40-3l-3 21-38-1Z" fill="#b7b7b0"/>
        <path d="M-17-133c-7 25 3 41 18 40 16-1 24-18 15-41-10 4-23 6-33 1Z" fill="#fff"/>
        <path id="${id}Eyes" d="m-7-116 1 1m13-1 1 1" stroke="${ink}"/>
        <path d="m-4-104 9 0"/>
      </g>
      <text id="${id}Question" x="18" y="-153" fill="#8a8a82" stroke="none" font-family="Friend Hand,KaiTi,serif" font-size="30" opacity="0">？</text>
    </g>`;
  }
  const sittingLegs = "M-18-51L-21-39Q-10-31 13-22L22-4L33-7L26-28L3-48M3-48L26-32L41-12L51-17L34-41L19-51M22-4Q22 2 28 3L42 1Q43-4 33-7M41-12Q44-6 49-6L60-10Q60-15 51-17";
  const standingLegs = "M-17.98-52.66C-18.56-38.16-17.98-22.5-17.4-3.94L-5.8-2.2L-1.16-38.16M-1.16-38.16L3.48-3.36L16.24-3.36C17.98-21.34 19.14-34.68 17.98-52.08M-17.4-3.94C-20.88-1.04-23.78 2.44-22.04 4.18C-18.56 5.92-9.28 4.18-5.8 1.86L-5.8-2.2M3.48-3.36L2.9 3.02C7.54 5.92 17.98 5.92 19.72 3.6C19.72 1.28 17.4-1.04 16.24-3.36";
  stage.innerHTML = `<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="scooterDrawingTitle scooterDrawingDescription">
    <title id="scooterDrawingTitle">又坐上竹竹的电动车</title>
    <desc id="scooterDrawingDescription">我拿着奶茶坐在后座，竹竹骑得太快，我连人带奶茶摔下了车。我站在原地骂她，路人回头看。收拾完她喊上车，走啊，我又坐回了后座。</desc>
    <path d="M21 355q122 5 258-1t336 0" fill="none" stroke="#dfdfd8" stroke-width="3" stroke-linecap="round"/>
    <path d="m35 377 58 1m393-1 96-1" fill="none" stroke="#ededeb" stroke-width="3" stroke-linecap="round"/>
    ${bystander("scooterPasserLeft", 66, .8)}
    ${bystander("scooterPasserRight", 562, .82)}
    <g id="scooterSpeed" ${line}><path d="m28 252 62-2m-49 25 35-1m-24 24 44-1"/></g>
    <g id="scooterVehicle" ${line}>
      <ellipse cx="0" cy="18" rx="112" ry="6" fill="#19191908" stroke="none"/>
      <g id="scooterVehicleBody">
        <path d="m-89-28 14-37 75 1 22 40 33-3 9-66 22 1 11 71-22 5-141 2Z" fill="${green}"/>
        <path d="M-82-75h78q13 0 13 8t-13 8h-78q-11-8 0-16Z" fill="#fff"/>
        <path d="m71-92-8-27m-16 0 33-1m-156 78-28-5m57 32-10 23m72-23 10 18"/>
        <ellipse cx="87" cy="-84" rx="8" ry="11" fill="#fff"/>
      </g>
      <g transform="translate(-66 0)"><g id="scooterWheelBack"><circle r="25" fill="#fff"/><circle r="7"/><path d="M-18 0h10m16 0h10M0-18v10m0 16v10"/></g></g>
      <g transform="translate(77 0)"><g id="scooterWheelFront"><circle r="25" fill="#fff"/><circle r="7"/><path d="M-18 0h10m16 0h10M0-18v10m0 16v10"/></g></g>
    </g>
    ${person("scooterZhu", "竹竹", true)}
    <g id="scooterPuddle" opacity="0">
      <path d="M107 346c-17-12 20-25 44-13 21-2 43 14 18 18-22 2-39-1-62-5Z" fill="#e9e5db"/>
      <g fill="${ink}"><circle cx="125" cy="340" r="2.3"/><circle cx="153" cy="337" r="2.4"/><circle cx="170" cy="347" r="2"/><circle cx="139" cy="349" r="2"/></g>
    </g>
    <g id="scooterDroppedTea" opacity="0">${tea}</g>
    <g id="scooterSplash" fill="#e9e5db" stroke="#bcb6a7" stroke-width="2" opacity="0">
      <ellipse cx="-22" cy="-4" rx="4" ry="9" transform="rotate(-40 -22 -4)"/><ellipse cx="-3" cy="-19" rx="4" ry="9"/><ellipse cx="17" cy="-9" rx="4" ry="9" transform="rotate(30 17 -9)"/><circle cx="29" cy="10" r="4"/><circle cx="-35" cy="15" r="3"/>
    </g>
    ${person("scooterMe", "我")}
    <g id="scooterDust" ${line} opacity="0"><path d="m160 305-13-4m16 18-14 8m54-15 13 2m-11-21 11-7"/></g>
    <g id="scooterShout" ${line} opacity="0">
      <path d="M127 28q145-8 276-1l3 97-174 1-34 40 8-41-82 1Z" fill="#fff"/>
      <text id="scooterShoutFirst" x="265" y="69" text-anchor="middle" fill="${ink}" stroke="none" font-family="Friend Hand,KaiTi,serif" font-size="34">竹竹！！！</text>
      <text id="scooterShoutSecond" x="265" y="108" text-anchor="middle" fill="${ink}" stroke="none" font-family="Friend Hand,KaiTi,serif" font-size="32">你骑这么快干嘛！</text>
    </g>
    <g id="scooterCall" ${line} opacity="0">
      <path d="M379 36q99-6 213-2l-1 98-137 0-33 31 11-31-55 0Z" fill="#fff"/>
      <text x="485" y="77" text-anchor="middle" fill="${ink}" stroke="none" font-family="Friend Hand,KaiTi,serif" font-size="34">上车，</text>
      <text x="485" y="117" text-anchor="middle" fill="${ink}" stroke="none" font-family="Friend Hand,KaiTi,serif" font-size="34">走啊。</text>
    </g>
    <g id="scooterOkay" ${line} opacity="0">
      <path d="M119 127q60-3 143 0v58l-47 0-21 29 4-29-80 0Z" fill="#fff"/>
      <text x="191" y="168" text-anchor="middle" fill="${ink}" stroke="none" font-family="Friend Hand,KaiTi,serif" font-size="30">……哦。</text>
    </g>
  </svg>`;
  const el = id => document.getElementById(id);
  const vehicle = el("scooterVehicle"), me = el("scooterMe"), zhu = el("scooterZhu");
  const sceneTimes = [0, 4400, 7500, 12400, 14400, 17200, 20000];
  const captions = [
    "你慢点啊，我还拿着奶茶呢。",
    "……人和奶茶都没坐稳。",
    "路人都回头看了。",
    "先把自己捡起来。",
    "你一喊“走啊”……",
    "我又乖乖坐上去了。",
    "坐稳，下一站带你去玩德州。"
  ];
  const clamp = n => Math.max(0, Math.min(1, n));
  const mix = (a, b, p) => a + (b - a) * p;
  const ease = p => {p = clamp(p); return p * p * (3 - 2 * p);};
  const between = (time, from, to) => clamp((time - from) / (to - from));
  const opacity = (id, value) => {el(id).setAttribute("opacity", value.toFixed(3));};
  const move = (node, x, y, angle = 0, scale = 1) =>
    node.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle.toFixed(2)}) scale(${scale})`);
  let elapsed = 0, frame = null, playing = false, lastScene = -1;
  let step = 0, stepStart = 0, stepFrom = 0, stepTo = 0;

  function render() {
    const t = elapsed / 1000;
    const pulse = reduced.matches ? 0 : Math.sin(t * 8);
    let scene = t < 3.2 ? 0 : t < 5 ? 1 : t < 10.6 ? 2 : t < 13 ? 3 : t < 15 ? 4 : t < 17.4 ? 5 : 6;
    let vehicleX = t < 3.2 ? mix(249, 390, ease(t / 3.2)) : 424;
    if (t >= 3.2 && t < 5) vehicleX = mix(390, 424, ease(between(t, 3.2, 4.2)));
    if (t >= 17.4) vehicleX = mix(424, 477, ease(between(t, 17.4, 20)));
    const riding = scene === 0 || t >= 17;
    const wheelAngle = riding ? t * 265 : 850;
    move(vehicle, vehicleX, 329 + (riding ? pulse * .8 : 0));
    move(zhu, vehicleX + 15, 301 + (riding ? pulse * .8 : 0), 0, .9);
    ["scooterWheelBack", "scooterWheelFront"].forEach(id => el(id).setAttribute("transform", `rotate(${wheelAngle.toFixed(1)})`));
    let x = vehicleX - 45, y = 301, angle = 0;
    if (scene === 1) {
      const fall = ease(between(t, 3.2, 4.5));
      x = mix(345, 178, fall);
      y = mix(301, 338, fall) - Math.sin(fall * Math.PI) * 35;
      angle = -102 * fall;
      if (t > 4.5) {angle = mix(-102, 0, ease(between(t, 4.5, 5))); x = mix(178, 188, ease(between(t, 4.5, 5)));}
    } else if (scene >= 2 && scene <= 4) {
      x = 188;
      y = 341;
      angle = scene === 2 ? pulse * 2.5 : 0;
      if (scene === 3) angle = -35 * Math.sin(between(t, 10.6, 13) * Math.PI);
    } else if (scene === 5) {
      const walk = ease(between(t, 15, 16.5));
      const board = ease(between(t, 16.5, 17.2));
      x = mix(188, vehicleX - 45, walk);
      y = mix(341, 301, board) + (board === 0 ? pulse * 2 : -Math.sin(board * Math.PI) * 12);
      angle = -4 * Math.sin(board * Math.PI);
    }
    move(me, x, y, angle, .9);
    const onSeat = scene === 0 || scene === 1 && t < 4 || t >= 17;
    el("scooterMeLegs").setAttribute("d", onSeat ? sittingLegs : standingLegs);
    el("scooterMeBrows").setAttribute("d", scene === 2 ? "M-23 91L-7 97M8 97L23 91" : "M-22 91L-7 92M8 92L22 91");
    opacity("scooterMeBrows", scene === 2 ? 1 : 0);
    el("scooterMeMouth").setAttribute("d", scene === 2 ? `M-7 126Q1 ${116 - Math.abs(pulse) * 5} 9 126Q1 137-7 126Z` : "M-5 125Q1 130 7 124");
    el("scooterMeLeftArm").setAttribute("d", scene === 2 ? "M-27-80Q-43-48-14-47" : "M-27-80Q-39-66-53-80");
    el("scooterMeRightArm").setAttribute("d", scene === 2 ? `M27-80Q45 ${-91 + pulse * 4} 65-97` : scene === 3 ? "M27-80Q28-44-47-28" : "M27-80Q43-67 58-75");
    el("scooterZhuRightArm").setAttribute("d", scene === 4 || scene === 5 ? `M27-80Q48-99 39 ${-121 + pulse * 5}` : "M27-80Q40-79 54-101");
    opacity("scooterMeCup", t < 3.2 ? 1 : t > 12.6 ? 1 : 0);
    const dropped = t >= 3.2 && t < 12.6;
    opacity("scooterDroppedTea", dropped ? 1 : 0);
    if (dropped) {
      const fall = ease(between(t, 3.2, 4.35));
      let teaX = mix(297, 137, fall), teaY = mix(229, 334, fall);
      if (t >= 11.6) {const pick = ease(between(t, 11.6, 12.6)); teaX = mix(137, 143, pick); teaY = mix(334, 269, pick);}
      move(el("scooterDroppedTea"), teaX, teaY - Math.sin(fall * Math.PI) * 48, mix(0, -100, fall));
    }
    const cleanup = ease(between(t, 11.6, 12.8));
    opacity("scooterPuddle", t >= 4.1 ? 1 - cleanup : 0);
    opacity("scooterSplash", t >= 3.9 && t < 4.65 ? Math.sin(between(t, 3.9, 4.65) * Math.PI) : 0);
    move(el("scooterSplash"), 142, 301 - between(t, 3.9, 4.65) * 26);
    opacity("scooterDust", scene === 3 ? Math.abs(pulse) * .7 : 0);
    opacity("scooterSpeed", scene === 0 || t >= 17.4 ? .65 + pulse * .2 : 0);
    move(el("scooterSpeed"), vehicleX - 222, 0);
    opacity("scooterShout", scene === 2 ? 1 : 0);
    const moreAngry = t >= 7.2;
    el("scooterShoutFirst").textContent = moreAngry ? "我再也不坐" : "竹竹！！！";
    el("scooterShoutSecond").textContent = moreAngry ? "你的车了！！" : "你骑这么快干嘛！";
    opacity("scooterCall", scene === 4 || scene === 5 && t < 16 ? 1 : 0);
    opacity("scooterOkay", scene === 4 && t > 14.15 ? 1 : 0);
    ["scooterPasserLeft", "scooterPasserRight"].forEach((id, n) => {
      const turn = ease(between(t, 5.45 + n * .25, 6.25 + n * .25));
      el(`${id}Head`).setAttribute("transform", `rotate(${(turn * (n === 0 ? -15 : 16)).toFixed(1)} 0 -112)`);
      el(`${id}Eyes`).setAttribute("d", turn > .5 ? (n === 0 ? "m-4-116 1 1m13-1 1 1" : "m-11-116 1 1m13-1 1 1") : "m-7-116 1 1m13-1 1 1");
      opacity(`${id}Question`, scene === 2 ? turn : 0);
      opacity(id, scene >= 2 && scene <= 4 ? .82 : .35);
    });
    if (scene !== lastScene) {
      caption.textContent = captions[scene];
      section.dataset.scene = String(scene);
      lastScene = scene;
    }
    section.dataset.time = elapsed.toFixed(0);
  }
  function updateButtons() {
    const label = ["骑慢点！ →","竹竹！！！ →","先收拾一下 →","又喊我干嘛？ →","……上车吧 →","走吧 →","去德州桌 →"][step];
    const accessible = step === sceneTimes.length - 1 ? "跟我去下一站" : label;
    playButton.textContent = label;
    playButton.setAttribute("aria-label", accessible);
    stage.setAttribute("aria-label", accessible);
    playButton.setAttribute("aria-disabled", String(playing));
    stage.setAttribute("aria-disabled", String(playing));
    section.dataset.playing = String(playing);
    section.dataset.mode = "step";
    section.dataset.step = String(step);
  }
  function tick(clock) {
    if (!playing) return;
    if (!stepStart) stepStart = clock;
    const progress = clamp((clock - stepStart) / 850);
    elapsed = mix(stepFrom, stepTo, ease(progress));
    render();
    if (progress >= 1) {stop(); return;}
    frame = requestAnimationFrame(tick);
  }
  function stop() {
    playing = false;
    cancelAnimationFrame(frame);
    frame = null;
    stepStart = 0;
    updateButtons();
  }
  function reset() {
    stop();
    step = 0;
    elapsed = 0;
    render();
    updateButtons();
  }
  function advance() {
    if (playing) return;
    if (step === sceneTimes.length - 1) {section.dispatchEvent(new CustomEvent("journey:advance", {bubbles:true})); return;}
    stepFrom = elapsed;
    stepTo = sceneTimes[++step];
    window.BirthdaySound?.effect(["","fall","boing","pickup","bell","pop","scooter"][step]);
    if (reduced.matches) {
      elapsed = stepTo;
      render();
      updateButtons();
      return;
    }
    playing = true;
    stepStart = 0;
    updateButtons();
    frame = requestAnimationFrame(tick);
  }
  playButton.addEventListener("click", advance);
  stage.addEventListener("click", advance);
  let touchStart = null;
  stage.addEventListener("touchstart", event => {touchStart=event.touches[0]?.clientX;}, {passive:true});
  stage.addEventListener("touchend", event => {
    if(touchStart!==null && Math.abs((event.changedTouches[0]?.clientX??touchStart)-touchStart)>45){event.preventDefault();advance();}
    touchStart=null;
  }, {passive:false});
  replayButton.addEventListener("click", reset);
  document.addEventListener("birthday:restart",()=>{touchStart=null;reset();});
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && playing) {
      elapsed = stepTo;
      stop();
      render();
    }
  });
  reduced.addEventListener?.("change", () => {
    if (playing) elapsed = stepTo;
    stop();
    render();
  });
  render();
  updateButtons();
})();
