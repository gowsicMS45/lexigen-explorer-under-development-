export const CATEGORIES: Record<string, string[]> = {
  Science: ["Quantum entanglement", "Black holes", "CRISPR", "Dark matter", "Neuroplasticity"],
  Math: ["Bayes theorem", "Fourier transform", "P vs NP", "Godel's incompleteness", "Topology"],
  "CS/AI": ["Transformer architecture", "Diffusion models", "Graph neural networks", "RLHF", "Vector databases"],
  History: ["Fall of Rome", "French Revolution", "Cold War", "Silk Road", "Industrial Revolution"],
  Philosophy: ["Stoicism", "Trolley problem", "Consciousness", "Free will", "Simulation theory"],
  Economics: ["Game theory", "Supply chains", "Inflation", "Behavioral economics", "Crypto"],
  Psychology: ["Cognitive bias", "Flow state", "Attachment theory", "Dopamine", "Sleep science"],
  Biology: ["DNA replication", "Evolution", "Photosynthesis", "Immune system", "Mitosis"],
  Physics: ["Relativity", "String theory", "Thermodynamics", "Wave-particle duality", "Entropy"],
  "Culture & Society": ["Globalization", "Cancel culture", "Social media effects", "Urbanization", "Feminism"],
};

export const CATEGORY_LIST = ["All", ...Object.keys(CATEGORIES)];

export const DIFFICULTIES = [
  { id: "ELI5", label: "ELI5", desc: "Explain like I'm 5" },
  { id: "Clear", label: "Clear", desc: "Simple and clear" },
  { id: "Detailed", label: "Detailed", desc: "In-depth" },
  { id: "Expert", label: "Expert", desc: "Technical depth" },
];

export function findCategory(topic: string): string {
  for (const [cat, topics] of Object.entries(CATEGORIES)) {
    if (topics.includes(topic)) return cat;
  }
  return "Custom";
}

export function rollTopic(category: string): string {
  const pool =
    category === "All"
      ? Object.values(CATEGORIES).flat()
      : CATEGORIES[category] ?? Object.values(CATEGORIES).flat();
  return pool[Math.floor(Math.random() * pool.length)];
}

export const DAILY_TOPIC = {
  name: "Quantum entanglement",
  category: "Science",
};
