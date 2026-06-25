import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Background } from "@/components/lexigen/Background";
import { Cursor } from "@/components/lexigen/Cursor";
import { Loading } from "@/components/lexigen/Loading";
import { Header, type View } from "@/components/lexigen/Header";
import {
  ExploreView,
  NotesView,
  ProgressView,
  SavedView,
} from "@/components/lexigen/views";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LexiGen — Explore any topic, explained your way" },
      {
        name: "description",
        content:
          "AI-powered learning that explains anything at the level you want — ELI5 to expert, with flashcards, quizzes, and mind maps.",
      },
      { property: "og:title", content: "LexiGen — AI Topic Explainer" },
      {
        property: "og:description",
        content:
          "Roll a topic, pick a level, and let LexiGen explain it. Flashcards, quizzes, mind maps and notes built in.",
      },
    ],
  }),
  component: LexiGen,
});

function LexiGen() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("explore");

  useEffect(() => {
    document.body.classList.add("lx-body");
    return () => document.body.classList.remove("lx-body");
  }, []);

  return (
    <div className="lx-app">
      <Background />
      <Cursor />
      {loading && <Loading onDone={() => setLoading(false)} />}
      <Header view={view} setView={setView} />
      <main className="lx-main">
        {view === "explore" && <ExploreView />}
        {view === "progress" && <ProgressView />}
        {view === "saved" && <SavedView />}
        {view === "notes" && <NotesView />}
      </main>
    </div>
  );
}
