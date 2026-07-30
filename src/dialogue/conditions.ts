/**
 * Conditions and effects, as DATA.
 *
 * The obvious design is `if: (vars) => vars.coins >= 5`. It is more expressive
 * than anything below and it is the wrong choice, for one reason: a function
 * cannot be checked, serialised, or authored anywhere except in code. A
 * conversation is content. Content wants to live in a file that a linter can
 * read, and the whole value of `lintDialogue` — every dangling link, every
 * unreachable line, every variable misspelt once — depends on the conditions
 * being inspectable rather than opaque.
 *
 * So the vocabulary is small and closed, with ONE escape hatch: `{ pred: name }`
 * resolves against predicates the caller registers, exactly the way `Catalog`
 * resolves a level file's kinds to factories. Code when you need it, by name,
 * and the linter still knows whether the name exists.
 */

/** What a dialogue variable can hold. Numbers compare, strings match, flags gate. */
export type DialogueValue = string | number | boolean;

/** The variable store. Plain data, so it saves and restores. */
export type Vars = Record<string, DialogueValue>;

/** Named predicates for the cases the data vocabulary cannot express. */
export type Predicates = Record<string, (vars: Readonly<Vars>) => boolean>;

/**
 * A condition on a choice.
 *
 * `is` is the common case by a distance — a flag being set — so it is the
 * shortest to write. There is deliberately no arithmetic and no string
 * concatenation: a condition language that grows into a scripting language
 * stops being checkable, which was the entire point.
 */
export type Condition =
  /** Truthy: `true`, a non-zero number, a non-empty string. */
  | { is: string }
  | { not: Condition }
  /** Every one. An empty list is true — nothing to fail. */
  | { all: Condition[] }
  /** Any one. An empty list is false — nothing to satisfy. */
  | { any: Condition[] }
  | { eq: [string, DialogueValue] }
  | { ne: [string, DialogueValue] }
  | { gte: [string, number] }
  | { lt: [string, number] }
  | { pred: string };

/** A change to make when a line is entered or a choice is taken. */
export type Effect =
  | { set: [string, DialogueValue] }
  /** Add to a number. A missing variable starts at 0, so counters need no setup. */
  | { inc: [string, number] }
  /** Hand a named event to the caller — a quest step, a sound, an animation. */
  | { emit: string };

const truthy = (value: DialogueValue | undefined): boolean =>
  value !== undefined && value !== false && value !== 0 && value !== '';

/** A number, or 0 for absent — so `gte` on an uncounted thing is not NaN. */
const asNumber = (value: DialogueValue | undefined): number =>
  typeof value === 'number' ? value : value === true ? 1 : 0;

/**
 * Evaluate a condition.
 *
 * An unregistered predicate is FALSE rather than a throw. A missing bit of
 * content should cost the player one unavailable choice, not the whole
 * conversation mid-sentence — and `lintDialogue` reports it before anybody
 * ships it. Loud at author time, quiet at play time.
 */
export function evaluate(
  condition: Condition | undefined,
  vars: Readonly<Vars>,
  predicates: Predicates = {}
): boolean {
  if (!condition) return true;
  if ('is' in condition) return truthy(vars[condition.is]);
  if ('not' in condition) return !evaluate(condition.not, vars, predicates);
  if ('all' in condition) return condition.all.every((c) => evaluate(c, vars, predicates));
  if ('any' in condition) return condition.any.some((c) => evaluate(c, vars, predicates));
  if ('eq' in condition) return vars[condition.eq[0]] === condition.eq[1];
  if ('ne' in condition) return vars[condition.ne[0]] !== condition.ne[1];
  if ('gte' in condition) return asNumber(vars[condition.gte[0]]) >= condition.gte[1];
  if ('lt' in condition) return asNumber(vars[condition.lt[0]]) < condition.lt[1];
  if ('pred' in condition) return predicates[condition.pred]?.(vars) ?? false;
  return false;
}

/**
 * Apply effects in order, mutating `vars` and collecting emitted event names.
 *
 * Order is not an implementation detail: `[{ inc: ['coins', 1] }, { emit: 'paid' }]`
 * must emit after the increment, because a listener that reads `coins` should
 * see the new value.
 */
export function apply(
  effects: Effect[] | undefined,
  vars: Vars,
  emitted: string[] = []
): string[] {
  for (const effect of effects ?? []) {
    if ('set' in effect) vars[effect.set[0]] = effect.set[1];
    else if ('inc' in effect) vars[effect.inc[0]] = asNumber(vars[effect.inc[0]]) + effect.inc[1];
    else if ('emit' in effect) emitted.push(effect.emit);
  }
  return emitted;
}

/** Every variable name a condition READS. Used by the linter to catch typos. */
export function readsOf(condition: Condition | undefined, into: Set<string> = new Set()): Set<string> {
  if (!condition) return into;
  if ('is' in condition) into.add(condition.is);
  else if ('not' in condition) readsOf(condition.not, into);
  else if ('all' in condition) condition.all.forEach((c) => readsOf(c, into));
  else if ('any' in condition) condition.any.forEach((c) => readsOf(c, into));
  else if ('eq' in condition) into.add(condition.eq[0]);
  else if ('ne' in condition) into.add(condition.ne[0]);
  else if ('gte' in condition) into.add(condition.gte[0]);
  else if ('lt' in condition) into.add(condition.lt[0]);
  // `pred` reads whatever it likes — opaque on purpose, and reported as such.
  return into;
}

/** Every variable name an effect WRITES. */
export function writesOf(effects: Effect[] | undefined, into: Set<string> = new Set()): Set<string> {
  for (const effect of effects ?? []) {
    if ('set' in effect) into.add(effect.set[0]);
    else if ('inc' in effect) into.add(effect.inc[0]);
  }
  return into;
}

/** Every predicate name a condition names. */
export function predsOf(condition: Condition | undefined, into: Set<string> = new Set()): Set<string> {
  if (!condition) return into;
  if ('not' in condition) predsOf(condition.not, into);
  else if ('all' in condition) condition.all.forEach((c) => predsOf(c, into));
  else if ('any' in condition) condition.any.forEach((c) => predsOf(c, into));
  else if ('pred' in condition) into.add(condition.pred);
  return into;
}
