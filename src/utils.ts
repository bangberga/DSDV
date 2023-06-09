import chroma from "chroma-js";

function generateColors(whiteThreshold: number, n: number) {
  const allColors = Object.values(chroma.brewer).flat();
  const filteredColors = allColors.filter((color) => {
    const [r, g, b] = chroma(color).rgb();
    return r < whiteThreshold || g < whiteThreshold || b < whiteThreshold;
  });
  return shuffle(chroma.scale(filteredColors).colors(n));
}

function shuffle(arr: any[]) {
  arr.sort(() => Math.random() - 0.5);
  return arr;
}

function getRandomItems<T>(arr: T[], n: number): T[] {
  const result: T[] = [...arr];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.slice(0, n);
}
export { generateColors, getRandomItems };
