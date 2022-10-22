import * as chalk from "chalk"; // eslint-disable-line unicorn/import-style

const ChalkEffect = {
  blue: chalk.blue,
  dim: chalk.dim,
  green: chalk.green,
  red: chalk.red,
  yellow: chalk.yellow,
} as const;

type EffectFn = (text: string) => string;

type ColorFn = EffectFn & {
  b: EffectFn;
  i: EffectFn;
  u: EffectFn;
  bi: EffectFn;
  bu: EffectFn;
  iu: EffectFn;
  biu: EffectFn;
};

const buildColor = (effectName: keyof typeof ChalkEffect): ColorFn => {
  const effect = ChalkEffect[effectName];

  function color(text: string): string {
    return effect(text);
  }

  color.b = (text: string): string => effect.bold(text);
  color.i = (text: string): string => effect.italic(text);
  color.u = (text: string): string => effect.underline(text);
  color.bi = (text: string): string => effect.bold.italic(text);
  color.bu = (text: string): string => effect.bold.underline(text);
  color.iu = (text: string): string => effect.italic.underline(text);
  color.biu = (text: string): string => effect.bold.italic.underline(text);

  return color;
};

const TextEffect = {
  dim: buildColor("dim"),
  info: buildColor("blue"),
  success: buildColor("green"),
  failure: buildColor("red"),
  warning: buildColor("yellow"),

  b: (text: string): string => chalk.bold(text),
  i: (text: string): string => chalk.bold(text),
  u: (text: string): string => chalk.bold(text),
};

export default TextEffect;
