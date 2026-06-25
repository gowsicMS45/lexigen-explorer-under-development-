import { useEffect, useState } from "react";

export type ProgressStatus = "learning" | "understood" | "mastered";

export interface TopicState {
  name: string;
  category: string;
  status?: ProgressStatus;
  saved?: boolean;
  note?: string;
}

export interface AppState {
  topics: Record<string, TopicState>;
  history: string[];
  streak: number;
}

const KEY = "lexigen-state-v1";

const initial: AppState = {
  topics: {},
  history: [],
  streak: 3,
};

let memory: AppState = initial;
const listeners = new Set<() => void>();

function load(): AppState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...initial, ...JSON.parse(raw) };
  } catch {}
  return initial;
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {}
}

export function useAppState() {
  const [state, setState] = useState<AppState>(memory);

  useEffect(() => {
    memory = load();
    setState(memory);
    const fn = () => setState({ ...memory });
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);

  return state;
}

function update(fn: (s: AppState) => void) {
  fn(memory);
  persist();
  listeners.forEach((l) => l());
}

export function ensureTopic(name: string, category: string) {
  update((s) => {
    if (!s.topics[name]) s.topics[name] = { name, category };
  });
}

export function cycleStatus(name: string, category: string) {
  const order: (ProgressStatus | undefined)[] = [undefined, "learning", "understood", "mastered"];
  update((s) => {
    if (!s.topics[name]) s.topics[name] = { name, category };
    const cur = s.topics[name].status;
    const idx = order.indexOf(cur);
    s.topics[name].status = order[(idx + 1) % order.length];
  });
}

export function toggleSaved(name: string, category: string) {
  update((s) => {
    if (!s.topics[name]) s.topics[name] = { name, category };
    s.topics[name].saved = !s.topics[name].saved;
  });
}

export function setNote(name: string, category: string, note: string) {
  update((s) => {
    if (!s.topics[name]) s.topics[name] = { name, category };
    s.topics[name].note = note;
  });
}

export function deleteNote(name: string) {
  update((s) => {
    if (s.topics[name]) s.topics[name].note = undefined;
  });
}

export function pushHistory(name: string) {
  update((s) => {
    s.history = [name, ...s.history.filter((h) => h !== name)].slice(0, 8);
  });
}
