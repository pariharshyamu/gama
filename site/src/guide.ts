import { renderMarkdown } from './markdown';

const PAGES: Array<{ id: string; title: string; playground?: string }> = [
  { id: 'getting-started', title: 'Getting started', playground: 'seek' },
  { id: 'characters', title: 'Characters: templates', playground: 'third-person' },
  { id: 'motion', title: 'Motion agents & steering', playground: 'flock' },
  { id: 'core', title: 'Core: loop, entities, events' },
  { id: 'animation', title: 'Animation: tweens & clips', playground: 'tweens' },
  { id: 'gameplay', title: 'Input, cameras, collisions', playground: 'character' },
  { id: 'audio', title: 'Audio: procedural sound', playground: 'audio' },
  { id: 'feel', title: 'Game feel & HUD', playground: 'juice' },
  { id: 'loop', title: 'The pickup loop', playground: 'loot' },
  { id: 'stakes', title: 'Stakes: health & projectiles', playground: 'arena' },
  { id: 'opposition', title: 'Opposition: waves & harassment', playground: 'waves' },
  { id: 'retention', title: 'Retention: flow, saves, ghosts', playground: 'trial' },
  { id: 'platformer', title: 'Platformer: jump physics', playground: 'coinrun' },
  { id: 'light', title: 'Light as gameplay', playground: 'stealth' },
  { id: 'flight', title: 'Flight: the arcade model', playground: 'aviator' },
  { id: 'physics', title: 'Physics (rapier adapter)' },
  { id: 'react', title: 'React (r3f bindings)' },
];

/** Playground examples relevant to sections, keyed by heading id. */
const SECTION_PLAYGROUNDS: Record<string, string> = {
  'behavior-catalogue': 'seek',
  'flocking-at-scale-spatialgrid': 'flock',
  'obstacle-avoidance': 'avoid',
  paths: 'path',
  'navigation-navmesh-goto': 'navmesh',
  'generating-navmeshes-from-level-geometry': 'navgen',
  'decision-making-at-scale-behavior-trees': 'behavior-tree',
  'decision-making-statemachine': 'behavior-tree',
  tweens: 'tweens',
  'camera-rigs': 'orbit',
  collisions: 'character',
  'third-person': 'third-person',
  'top-down': 'npcs',
  'npc-archetypes': 'npcs',
  'one-shots': 'audio',
  'continuous-sources': 'audio',
  'the-spectrum-wall': 'audio',
  'shake-is-trauma-squared': 'juice',
  'hit-stop-and-slow-motion': 'juice',
  'the-radar': 'juice',
  collector: 'loot',
  checkpointrun: 'loot',
  health: 'arena',
  'wavedirector-pacing-without-bodies': 'waves',
  'harass-the-ranged-enemys-dance': 'waves',
  projectiles: 'arena',
  'gameflow-the-state-machine-every-game-has-anyway': 'trial',
  'objectives-what-done-means': 'trial',
  'saveslot-the-all-procedural-bet-pays-off': 'trial',
  'ghosts-beat-yesterdays-you': 'trial',
  platformercontroller: 'coinrun',
  'the-three-forgivenesses': 'coinrun',
  'moving-platforms': 'coinrun',
  'the-coin-run': 'coinrun',
  'illumination-the-number-the-stealth-genre-is-made-of': 'stealth',
  'flashlight-the-light-a-game-carries': 'stealth',
  'moodgrade-the-game-states-visual-voice': 'stealth',
  'the-stealth-garden': 'stealth',
  flightcontroller: 'aviator',
  'the-stick-is-a-rate': 'aviator',
  'the-aviator-playground': 'aviator',
};

const sidebar = document.getElementById('sidebar') as HTMLElement;
const content = document.getElementById('content') as HTMLElement;
const current = new URLSearchParams(location.search).get('page') ?? PAGES[0].id;

async function load(): Promise<void> {
  const page = PAGES.find((p) => p.id === current) ?? PAGES[0];
  const response = await fetch(`./docs/${page.id}.md`);
  if (!response.ok) {
    content.innerHTML = `<p>Could not load <code>${page.id}</code>.</p>`;
    return;
  }
  const { html, headings } = renderMarkdown(await response.text());
  content.innerHTML = html;

  // Inject "open in playground" links after sections that have live demos.
  for (const heading of content.querySelectorAll('h2[id], h3[id]')) {
    const example = SECTION_PLAYGROUNDS[heading.id];
    if (!example) continue;
    const link = document.createElement('a');
    link.className = 'try';
    link.href = `playground.html?example=${example}`;
    link.textContent = '▸ open a live example in the playground';
    heading.after(link);
  }

  // Sidebar: pages, then this page's table of contents.
  const pagesHtml = PAGES.map(
    (p) =>
      `<a class="${p.id === page.id ? 'active' : ''}" href="guide.html?page=${p.id}">${p.title}</a>`
  ).join('');
  const tocHtml = headings
    .filter((h) => h.level === 2)
    .map((h) => `<a class="toc" href="#${h.id}">${h.text}</a>`)
    .join('');
  sidebar.innerHTML =
    `<h4>Guides</h4>${pagesHtml}` + (tocHtml ? `<h4>On this page</h4>${tocHtml}` : '');

  document.title = `${page.title} · GAMA`;
  if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
}

load();
