import {

  joinTabSections,

  measure,

  tabLine,

  tabSection,

} from "@/lib/tab-format";



const e = () => measure("");



const verseBars = {

  g: [e(), e(), e(), e()],

  d: [measure("----5---5---"), measure("----5---5---"), measure("----7---7---"), measure("----5---5---")],

  a: [measure("--3---3---3-"), measure("--3---3---3-"), measure("--5---5---5-"), measure("--3---3---3-")],

};



const verse1Lines = [

  tabLine("G", [...verseBars.g, ...verseBars.g]),

  tabLine("D", [...verseBars.d, ...verseBars.d]),

  tabLine("A", [...verseBars.a, ...verseBars.a]),

  tabLine("E", Array(8).fill("").map(() => e())),

];



const verse2Lines = [

  tabLine("G", Array(8).fill("").map(() => e())),

  tabLine("D", [

    measure("----5---5---"),

    measure("----5---5---"),

    measure("----3---3---"),

    measure("----3---3---"),

    measure("----7---7---"),

    measure("----7---7---"),

    measure("----5---5---"),

    measure("----5---5---"),

  ]),

  tabLine("A", [

    measure("--3---3---3-"),

    measure("--3---3---3-"),

    measure("--1---1---1-"),

    measure("--1---1---1-"),

    measure("--5---5---5-"),

    measure("--5---5---5-"),

    measure("--3---3---3-"),

    measure("--3---3---3-"),

  ]),

  tabLine("E", Array(8).fill("").map(() => e())),

];



const chorusLines = [

  tabLine("G", Array(8).fill("").map(() => e())),

  tabLine("D", [

    measure("----7---7---"),

    measure("----5---5---"),

    measure("----7---7---"),

    measure("----5---5---"),

    measure("----7---7---"),

    measure("----5---5---"),

    measure("----7---7---"),

    measure("----5---5---"),

  ]),

  tabLine("A", [

    measure("--5---5---5-"),

    measure("--3---3---3-"),

    measure("--5---5---5-"),

    measure("--3---3---3-"),

    measure("--5---5---5-"),

    measure("--3---3---3-"),

    measure("--5---5---5-"),

    measure("--3---3---3-"),

  ]),

  tabLine("E", Array(8).fill("").map(() => e())),

];



export const neonCathedralBassTab = joinTabSections([

  tabSection("Intro", [

    tabLine("G", Array(4).fill("").map(() => e())),

    tabLine("D", Array(4).fill("").map(() => e())),

    tabLine("A", Array(4).fill("").map(() => measure("--1---1---1-"))),

    tabLine("E", Array(4).fill("").map(() => e())),

  ]),

  tabSection("Verse 1", verse1Lines),

  tabSection("Pre-chorus", [

    tabLine("G", Array(4).fill("").map(() => e())),

    tabLine("D", [

      measure("----3---3---"),

      measure("----5---5---"),

      measure("----3---3---"),

      measure("----5---5---"),

    ]),

    tabLine("A", [

      measure("--1---1---1-"),

      measure("--3---3---3-"),

      measure("--1---1---1-"),

      measure("--3---3---3-"),

    ]),

    tabLine("E", Array(4).fill("").map(() => e())),

  ]),

  tabSection("Chorus", chorusLines),

  tabSection("Verse 2", verse2Lines),

  tabSection("Pre-chorus", [

    tabLine("G", Array(4).fill("").map(() => e())),

    tabLine("D", [

      measure("----3---3---"),

      measure("----5---5---"),

      measure("----3---3---"),

      measure("----5---5---"),

    ]),

    tabLine("A", [

      measure("--1---1---1-"),

      measure("--3---3---3-"),

      measure("--1---1---1-"),

      measure("--3---3---3-"),

    ]),

    tabLine("E", Array(4).fill("").map(() => e())),

  ]),

  tabSection("Chorus", chorusLines),

  tabSection("Bridge", [

    tabLine("G", Array(4).fill("").map(() => e())),

    tabLine("D", [

      measure("----3-------"),

      measure("----5-------"),

      measure("----7-------"),

      measure("----5-------"),

    ]),

    tabLine("A", [

      measure("--5---5---5-"),

      measure("--3---3---3-"),

      measure("--5---5---5-"),

      measure("--1-----------"),

    ]),

    tabLine("E", Array(4).fill("").map(() => e())),

  ]),

  tabSection("Instrumental", chorusLines),

  tabSection("Final chorus", chorusLines),

  tabSection("Outro", [

    tabLine("G", Array(2).fill("").map(() => e())),

    tabLine("D", Array(2).fill("").map(() => e())),

    tabLine("A", [measure("--3---3---3-"), measure("--1-----------")]),

    tabLine("E", Array(2).fill("").map(() => e())),

  ]),

]);



const h = (pattern: string) => measure(pattern);

const kick = h("x-x-x-x-x-x-x-");

const kickOpen = h("o-o-o-o-o-o-o-");

const snare = h("----o------o--");

const snareChorus = h("o---o---o---o-");



export const neonCathedralDrumsTab = joinTabSections([

  tabSection("Intro", [

    tabLine("K", Array(4).fill("").map(() => kick)),

    tabLine("S", Array(4).fill("").map(() => snare)),

    tabLine("H", Array(4).fill("").map(() => kick)),

  ]),

  tabSection("Verse 1", [

    tabLine("K", Array(8).fill("").map(() => kick)),

    tabLine("S", Array(8).fill("").map(() => snare)),

    tabLine("H", Array(8).fill("").map(() => kick)),

  ]),

  tabSection("Pre-chorus", [

    tabLine("K", Array(4).fill("").map(() => kickOpen)),

    tabLine("S", Array(4).fill("").map(() => h("----o---o---o-"))),

    tabLine("H", Array(4).fill("").map(() => kick)),

  ]),

  tabSection("Chorus", [

    tabLine("K", Array(8).fill("").map(() => kickOpen)),

    tabLine("S", Array(8).fill("").map(() => snareChorus)),

    tabLine("H", Array(8).fill("").map(() => kickOpen)),

  ]),

  tabSection("Verse 2", [

    tabLine("K", Array(8).fill("").map(() => kick)),

    tabLine("S", Array(8).fill("").map(() => snare)),

    tabLine("H", Array(8).fill("").map(() => kick)),

  ]),

  tabSection("Pre-chorus", [

    tabLine("K", Array(4).fill("").map(() => kickOpen)),

    tabLine("S", Array(4).fill("").map(() => h("----o---o---o-"))),

    tabLine("H", Array(4).fill("").map(() => kick)),

  ]),

  tabSection("Chorus", [

    tabLine("K", Array(8).fill("").map(() => kickOpen)),

    tabLine("S", Array(8).fill("").map(() => snareChorus)),

    tabLine("H", Array(8).fill("").map(() => kickOpen)),

  ]),

  tabSection("Bridge", [

    tabLine("K", Array(4).fill("").map(() => kick)),

    tabLine("S", Array(4).fill("").map(() => snare)),

    tabLine("H", Array(4).fill("").map(() => kickOpen)),

  ]),

  tabSection("Instrumental", [

    tabLine("K", Array(8).fill("").map(() => kickOpen)),

    tabLine("S", Array(8).fill("").map(() => snareChorus)),

    tabLine("H", Array(8).fill("").map(() => kickOpen)),

  ]),

  tabSection("Final chorus", [

    tabLine("K", Array(8).fill("").map(() => kickOpen)),

    tabLine("S", Array(8).fill("").map(() => snareChorus)),

    tabLine("H", Array(8).fill("").map(() => kickOpen)),

  ]),

  tabSection("Outro", [

    tabLine("K", Array(2).fill("").map(() => kick)),

    tabLine("S", [snare, measure("----o---------")]),

    tabLine("H", Array(2).fill("").map(() => kick)),

  ]),

]);



export const neonCathedralChordChart =

  "Intro: Am\nVerse 1: Am  F  C  G  |  Am  F  C  G  |  Am  F  C  G  |  Am  F  C  G\nPre-chorus: Dm  Am  G  |  Dm  Am  G\nChorus: F  C  G  Am  |  F  C  G  Am  |  F  C  G  Am  |  F  C  G  Am\nVerse 2: Am  F  C  G  |  Am  F  C  G\nBridge: Dm  G  C  Am\nInstrumental: F  C  G  Am\nFinal chorus: F  C  G  Am\nOutro: Am";



export const neonCathedralDrumChart =
  "Intro: kick 1 & 3, snare 2 & 4, 8ths on hats\nVerse 1: groove × 8 bars\nPre-chorus: open kick, snare pushes × 4\nChorus: driving kick, backbeat snare × 8\nVerse 2: groove × 8 bars\nBridge: half-time feel × 4\nInstrumental: full kit × 8\nFinal chorus: open hats throughout × 8\nOutro: kick + snare fade × 2";

const b4 = (bars: number) => Array(bars).fill("").map(() => e());

export const velvetStaticBassTab = joinTabSections([
  tabSection("Intro", [
    tabLine("G", b4(2)),
    tabLine("D", [measure("----3---3---"), measure("----3---3---")]),
    tabLine("A", [measure("--1---1---1-"), measure("--1---1---1-")]),
    tabLine("E", b4(2)),
  ]),
  tabSection("Verse", [
    tabLine("G", b4(4)),
    tabLine("D", Array(4).fill(measure("----5---5---"))),
    tabLine("A", Array(4).fill(measure("--3---3---3-"))),
    tabLine("E", b4(4)),
  ]),
  tabSection("Chorus", [
    tabLine("G", b4(4)),
    tabLine("D", [
      measure("----7-------"),
      measure("----5-------"),
      measure("----3-------"),
      measure("----5-------"),
    ]),
    tabLine("A", Array(4).fill(measure("--5---5---5-"))),
    tabLine("E", b4(4)),
  ]),
  tabSection("Bridge", [
    tabLine("G", b4(2)),
    tabLine("D", [measure("----5---3---"), measure("----3---1---")]),
    tabLine("A", [measure("--3-----------"), measure("--1-----------")]),
    tabLine("E", b4(2)),
  ]),
  tabSection("Outro", [
    tabLine("G", b4(2)),
    tabLine("D", [measure("----3---3---"), measure("----1---1---")]),
    tabLine("A", [measure("--1---1---1-"), e()]),
    tabLine("E", b4(2)),
  ]),
]);

const guitar6 = (
  highE: string[],
  b: string[],
  g: string[],
  d: string[],
  a: string[],
  lowE: string[],
) => [
  tabLine("e", highE),
  tabLine("B", b),
  tabLine("G", g),
  tabLine("D", d),
  tabLine("A", a),
  tabLine("E", lowE),
];

export const ironCurtainGuitarTab = joinTabSections([
  tabSection("Intro", guitar6(
    [measure("--12--10---8-"), measure("--12--10---8-")],
    b4(2), b4(2), b4(2), b4(2), b4(2),
  )),
  tabSection("Verse", guitar6(
    Array(4).fill(measure("--8----10---8-")),
    b4(4), b4(4), b4(4), b4(4), b4(4),
  )),
  tabSection("Chorus", guitar6(
    [
      measure("--12--12--10-"),
      measure("--8----10---12"),
      measure("--12--12--10-"),
      measure("--8----10---12"),
    ],
    b4(4), b4(4), b4(4), b4(4), b4(4),
  )),
  tabSection("Solo", guitar6(
    [
      measure("--8---10--12--"),
      measure("--12--10---8---"),
      measure("--8---10--12--"),
      measure("--12--10---8---"),
    ],
    b4(4), b4(4), b4(4), b4(4), b4(4),
  )),
  tabSection("Outro", guitar6(
    [measure("--8----8-------"), measure("--5----5-------")],
    b4(2), b4(2), b4(2), b4(2), b4(2),
  )),
]);


