import { evaluate, predsOf, readsOf, writesOf, type Predicates } from './conditions';
import type { DialogueScript } from './script';

/**
 * lintDialogue — everything a conversation can get wrong that is not a crash.
 *
 * A dialogue graph fails quietly. A misspelt link sends the player to a line
 * that does not exist; an unreachable branch is content nobody will ever see;
 * a set of choices that are all conditional can leave somebody staring at a
 * question with no answers. None of that throws, none of it shows up in a
 * screenshot, and all of it is obvious to a walk of the graph.
 *
 * This is why conditions are data. `if: (vars) => vars.coins >= 5` cannot be
 * read; `{ gte: ['coins', 5] }` can, so `coins` joins the set of names the
 * linter knows about and a misspelt `coin` is a finding rather than a
 * silently-false condition and a branch that never fires.
 *
 * Findings are a LIST, and each has a severity. `error` is broken; `warn` is
 * suspicious and occasionally deliberate — a hub conversation legitimately has
 * a node reachable only by a `pred`. Gate on errors, read the warnings.
 */
export type LintSeverity = 'error' | 'warn';

export interface LintFinding {
  severity: LintSeverity;
  /** Stable machine-readable kind, so a gate can count by category. */
  code:
    | 'dangling-link'
    | 'unreachable-node'
    | 'strandable-node'
    | 'unknown-predicate'
    | 'undeclared-variable'
    | 'unread-variable'
    | 'empty-text'
    | 'duplicate-choice';
  /** The node it is about, where there is one. */
  node?: string;
  message: string;
}

export interface LintOptions {
  /**
   * The predicates the game will actually register.
   *
   * Without them every `{ pred: … }` is reported as unknown, which is right
   * for a bare script and noise for a game that has them — so pass the same
   * object you pass `Dialogue`.
   */
  predicates?: Predicates;
}

export interface LintReport {
  findings: LintFinding[];
  errors: number;
  warnings: number;
  /** Exact, and the reason this is gate-able: reachable ≠ total is a bug. */
  counts: { nodes: number; reachable: number; choices: number; variables: number };
}

/** Walk from `start` over node `to` and every choice `to`, conditions ignored. */
function reachableFrom(script: DialogueScript): Set<string> {
  const seen = new Set<string>();
  const queue = [script.start];
  while (queue.length) {
    const id = queue.pop() as string;
    if (seen.has(id)) continue;
    seen.add(id);
    const node = script.nodes[id];
    if (!node) continue;
    if (node.to) queue.push(node.to);
    for (const choice of node.choices ?? []) if (choice.to) queue.push(choice.to);
  }
  return seen;
}

export function lintDialogue(script: DialogueScript, options: LintOptions = {}): LintReport {
  const findings: LintFinding[] = [];
  const add = (severity: LintSeverity, code: LintFinding['code'], message: string, node?: string) =>
    findings.push({ severity, code, message, node });

  const ids = Object.keys(script.nodes);
  const reachable = reachableFrom(script);
  const declared = new Set(Object.keys(script.vars ?? {}));
  const registered = new Set(Object.keys(options.predicates ?? {}));
  const reads = new Set<string>();
  const writes = new Set<string>();
  let choiceCount = 0;

  for (const id of ids) {
    const node = script.nodes[id];

    if (!node.text?.trim()) {
      add('error', 'empty-text', `node "${id}" has no text`, id);
    }

    if (node.to && !script.nodes[node.to]) {
      add('error', 'dangling-link', `node "${id}" continues to "${node.to}", which does not exist`, id);
    }

    writesOf(node.do, writes);

    const choices = node.choices ?? [];
    choiceCount += choices.length;
    const texts = new Set<string>();
    for (const [index, choice] of choices.entries()) {
      const where = `node "${id}" choice ${index}`;
      if (!choice.text?.trim()) add('error', 'empty-text', `${where} has no text`, id);
      if (choice.to && !script.nodes[choice.to]) {
        add('error', 'dangling-link', `${where} leads to "${choice.to}", which does not exist`, id);
      }
      // Two identical strings in one list is a copy-paste that leaves the
      // player picking between indistinguishable options.
      if (choice.text && texts.has(choice.text)) {
        add('warn', 'duplicate-choice', `${where} repeats the text of an earlier choice`, id);
      }
      texts.add(choice.text);
      readsOf(choice.if, reads);
      writesOf(choice.do, writes);
      for (const name of predsOf(choice.if)) {
        if (!registered.has(name)) {
          add('error', 'unknown-predicate', `${where} uses predicate "${name}", which is not registered`, id);
        }
      }
    }

    // Can the player be stranded here? Only when there ARE choices (so
    // `advance` will not move) and every one of them is conditional and
    // hideable. Evaluated against the declared starting vars: this is a
    // heuristic about the OPENING state, and it is flagged as a warning
    // because a hub whose options unlock later is a legitimate shape.
    if (choices.length > 0) {
      const everHideable = choices.every((c) => c.if && !c.locked);
      if (everHideable) {
        const anyOpen = choices.some((c) =>
          evaluate(c.if, script.vars ?? {}, options.predicates ?? {})
        );
        if (!anyOpen) {
          add(
            'warn',
            'strandable-node',
            `node "${id}" offers only conditional choices and none pass with the script's ` +
              'starting variables — a player arriving early sees a question with no answers',
            id
          );
        }
      }
    }

    if (!reachable.has(id)) {
      add('warn', 'unreachable-node', `node "${id}" cannot be reached from "${script.start}"`, id);
    }
  }

  // A name read but never written and never declared is a typo far more often
  // than it is intent — this is the finding that pays for the whole data-shaped
  // condition language.
  for (const name of reads) {
    if (!declared.has(name) && !writes.has(name)) {
      add(
        'error',
        'undeclared-variable',
        `variable "${name}" is read but never set and not declared in \`vars\``
      );
    }
  }
  // The mirror: written, never read. Usually a flag whose consumer was renamed.
  for (const name of writes) {
    if (!reads.has(name) && !declared.has(name)) {
      add('warn', 'unread-variable', `variable "${name}" is set but never read`);
    }
  }

  const variables = new Set([...declared, ...reads, ...writes]).size;
  return {
    findings,
    errors: findings.filter((f) => f.severity === 'error').length,
    warnings: findings.filter((f) => f.severity === 'warn').length,
    counts: { nodes: ids.length, reachable: reachable.size, choices: choiceCount, variables },
  };
}

/** One line per finding, for a console or a CI log. */
export function formatLint(report: LintReport): string {
  const lines = report.findings.map(
    (f) => `  ${f.severity === 'error' ? 'ERROR' : ' warn'}  ${f.code.padEnd(20)} ${f.message}`
  );
  const { nodes, reachable, choices, variables } = report.counts;
  lines.push(
    `\n${nodes} nodes (${reachable} reachable), ${choices} choices, ${variables} variables — ` +
      `${report.errors} error(s), ${report.warnings} warning(s)`
  );
  return lines.join('\n');
}
