/* Characters copied from the approved v7_line_characters.svg.
   Keep the white hair interiors, three bang locks / open side-part bob, and original faces. */
(() => {
  "use strict";
  const ink="#191919",red="#de514b";
  const line=`fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"`;
  const thin=`fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"`;
  const svg=(content,viewBox="0 0 200 300")=>`<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">${content}</svg>`;
  const heart=(x,y,s=1,color=red)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 12C-29-8-18-24-8-21c5 1 7 6 8 9 5-14 23-12 22 0C22-3 10 7 0 12Z" fill="none" stroke="${color}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;

  const legsMe=`<path d="M-31 232C-32 257-31 284-30 316L-10 319L-2 257M-2 257L6 317L28 317C31 286 33 263 31 233" fill="#fff"/>
    <path d="M-30 316C-36 321-41 327-38 330C-32 333-16 330-10 326L-10 319M6 317L5 328C13 333 31 333 34 329C34 325 30 321 28 317" fill="#fff"/>`;
  const legsZhu=`<path d="M-31 233C-34 261-32 284-31 316L-10 318L-1 257M-1 257L7 318L29 317C31 289 33 264 31 234" fill="#fff"/>
    <path d="M-31 316C-35 321-40 326-37 330C-29 333-16 332-10 327L-10 318M7 318L7 329C14 333 31 334 35 330C37 326 32 321 29 317" fill="#fff"/>`;
  const armsMe=`<path d="M-45 185C-47 201-45 215-46 230C-49 235-48 242-43 246L-40 244L-41 235M-40 244C-36 244-35 240-36 235L-36 185" fill="#fff"/>
    <path d="M40 186C42 202 43 214 41 230C39 235 38 241 41 244L45 242L46 234M45 242C49 242 51 237 49 231L50 185" fill="#fff"/>`;
  const armsZhu=`<path d="M-47 187C-48 201-49 215-47 230C-49 235-47 242-43 244L-40 242L-42 234M-40 242C-37 242-36 238-37 234L-37 187" fill="#fff"/>
    <path d="M39 187C40 202 42 218 43 232C41 237 42 243 46 244L49 240L48 234M49 240C53 239 54 235 52 230L49 187" fill="#fff"/>`;
  const upperMe=`<path d="M-13 141C-27 142-38 148-42 159L-52 184L-34 190L-32 181L-34 232C-13 236 11 234 33 233L32 180L35 189L53 184L43 159C38 148 25 144 13 141" fill="#fff"/>
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
    </g>
    <g fill="#191919" stroke="none">
      <ellipse cx="-14" cy="109" rx="1.6" ry="2.2"/>
      <ellipse cx="15" cy="109" rx="1.6" ry="2.2"/>
    </g>
    <path d="M-5 125Q1 130 7 124" stroke-width="2"/>`;
  const upperZhu=`<path d="M-13 142C-25 144-39 149-44 161L-54 185L-35 191L-33 182L-34 233C-11 236 12 236 34 234L32 183L36 191L54 186L44 160C37 147 25 145 13 142" fill="#fff"/>
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
    </g>
    <g fill="#191919" stroke="none">
      <ellipse cx="-14" cy="109" rx="1.6" ry="2.2"/>
      <ellipse cx="15" cy="109" rx="1.6" ry="2.2"/>
    </g>
    <path d="M-6 125Q1 130 7 124Q5 134 1 134Q-3 134-6 125Z" stroke-width="1.8"/>`;
  const crown=`<path d="M-15-30l-4-12 10 6 9-10 9 10 10-6-4 12Z" fill="#fff" stroke="${ink}" stroke-width="2.1" stroke-linejoin="round"/>`;

  function person(x,y,s,identity,options={}) {
    const zhu=identity==="zhu";
    let armPaths=zhu?armsZhu:armsMe;
    if(options.arms==="gift")armPaths=zhu
      ? `<path d="M-47 187C-59 207-77 214-102 223C-106 219-113 219-116 223L-113 229L-106 229M-113 229C-113 233-107 235-102 232C-75 225-53 219-37 190" fill="#fff"/>
         <path d="M39 187C40 202 42 218 43 232C41 237 42 243 46 244L49 240L48 234M49 240C53 239 54 235 52 230L49 187" fill="#fff"/>`
      : `<path d="M-45 185C-47 201-45 215-46 230C-49 235-48 242-43 246L-40 244L-41 235M-40 244C-36 244-35 240-36 235L-36 185" fill="#fff"/>
         <path d="M40 186C53 204 76 215 103 222C107 218 114 219 117 223L114 229L107 229M114 229C114 233 108 235 103 232C77 228 54 220 50 185" fill="#fff"/>`;
    return `<g data-person="${identity}" transform="translate(${x} ${y}) scale(${s})">
      <g transform="translate(0 -66) scale(.58) rotate(${zhu?1:-1} 0 180)" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        ${zhu?legsZhu:legsMe}${armPaths}${zhu?upperZhu:upperMe}
      </g>${options.crown?crown:""}
    </g>`;
  }
  function frame(content,rank="",suit="♥") {
    const color=suit==="♥"?red:ink;
    return svg(`<path d="M12 3 183 2q14 0 14 15l1 266q0 14-15 14L17 298Q3 298 3 284L2 18Q2 4 12 3Z" fill="#fff" stroke="${ink}" stroke-width="2.6" stroke-linejoin="round"/>${content}${rank?`<g fill="${color}" font-family="Nishiki Birthday,Georgia,serif" font-size="29"><text x="14" y="34">${rank}</text><text x="14" y="59" font-size="25">${suit}</text><g transform="rotate(180 100 150)"><text x="14" y="34">${rank}</text><text x="14" y="59" font-size="25">${suit}</text></g></g>`:""}`);
  }
  const back=frame(`<path d="M25 25q76-5 150 0l1 248q-75 5-153 0Z" fill="none" stroke="${ink}" stroke-width="2"/><path d="m35 48 126 190m-125-1L161 48" fill="none" stroke="${ink}" stroke-width="1.7"/>${heart(100,150,.92,ink)}`);
  function faceCard(rank,identity) {
    return frame(`${person(99,96,1.12,identity,{crown:true})}${heart(152,168,.45)}<path d="M55 262q40 5 88-1" ${line}/>`,rank);
  }
  function number(rank,suit="♥") {
    const redSuit=suit==="♥";
    const content=redSuit
      ? `${heart(99,151,rank==="A"?2.15:1.42)}${rank==="10"?heart(99,220,.62):""}`
      : `<g fill="${ink}" font-family="Georgia,serif" font-size="105"><text x="100" y="183" text-anchor="middle">${suit}</text></g>`;
    return frame(content,rank,suit);
  }
  const jack=frame(`<g transform="translate(99 150) scale(1.12)" ${line}><path d="m-28-22-3-24 21 15m27 0 21-17-2 26C64 12 38 37 3 37c-42 0-63-27-31-59Z"/><path d="m-19-3 1 1m40-1 1 1"/><ellipse cx="2" cy="15" rx="24" ry="14"/><path d="m-6 12 1 5m14-5 1 5"/></g>${heart(99,79,.53)}`,"J");
  const together=svg(`${person(60,48,.66,"me")}${person(140,48,.66,"zhu")}${heart(100,26,.4)}`,"0 0 200 140");
  const pig=svg(`<g transform="translate(101 79)" ${line}><path d="m-28-22-3-24 21 15m27 0 21-17-2 26C64 12 38 37 3 37c-42 0-63-27-31-59Z" fill="#fff"/><path d="m-19-3 1 1m40-1 1 1"/><ellipse cx="2" cy="15" rx="24" ry="14"/><path d="m-6 12 1 5m14-5 1 5"/></g>`,"0 0 200 130");
  const gift=svg(`<path d="M25 168q121 9 250-1" ${line}/>${person(72,62,.86,"me",{arms:"gift"})}${person(224,62,.86,"zhu",{arms:"gift"})}<path d="m127 118 42-1 1 48-42 1Z" fill="#fff" stroke="${ink}" stroke-width="3"/><path d="m148 118 0 47m-20-32 41 0M148 118c-34-23-38 12-1 0 28-26 37 11 1 0" ${line}/>${heart(149,62,.7)}<path d="m20 69-8-7m267 7 10-5m-159-26-4-9m52 10 4-9" ${line}/>`, "0 0 300 192");
  window.BirthdayArt={svg,person,heart,line,ink,red,back,hole:[faceCard("Q","zhu"),faceCard("K","me")],board:[number("10"),jack,number("2","♣"),number("2","♠"),number("A")],together,pig,gift};
})();
