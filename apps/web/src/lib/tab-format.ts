export const MEASURE_WIDTH = 14;



export function measure(content: string): string {

  const trimmed = content.slice(0, MEASURE_WIDTH);

  return trimmed.padEnd(MEASURE_WIDTH, "-");

}



export function tabLine(label: string, bars: string[]): string {

  return `${label}|${bars.map(measure).join("|")}|`;

}



export function tabSection(label: string, lines: string[]): string {

  return `[${label}]\n${lines.join("\n")}`;

}



export function joinTabSections(sections: string[]): string {

  return sections.join("\n");

}


