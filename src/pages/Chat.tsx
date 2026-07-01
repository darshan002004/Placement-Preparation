import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Loader2, Sparkles, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Explain DSA two-pointer technique with example",
  "Common HR questions for fresher SDE role",
  "How do I prepare for Amazon Leadership Principles?",
  "Best resources for CS core in 1 month?",
];

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(false);
  const recognitionRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-IN";
    rec.onresult = (e: any) => {
      let txt = "";
      for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
      setInput(txt);
      if (e.results[e.results.length - 1].isFinal) {
        setListening(false);
        setTimeout(() => send(txt), 100);
      }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  const toggleMic = () => {
    const rec = recognitionRef.current;
    if (!rec) { toast.error("Voice input not supported in this browser. Use Chrome/Edge."); return; }
    if (listening) { rec.stop(); setListening(false); }
    else { setInput(""); rec.start(); setListening(true); }
  };

  const speak = (text: string) => {
    if (!speakReplies || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[*#`_>-]/g, "").slice(0, 800));
    u.rate = 1.05; u.pitch = 1; u.lang = "en-IN";
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    if (!user) return;
    supabase.from("chat_messages").select("role,content").eq("user_id", user.id).order("created_at").then(({ data }) => {
      if (data) setMessages(data as Msg[]);
    });
  }, [user]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || streaming || !user) return;
    setInput("");
    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setStreaming(true);

    await supabase.from("chat_messages").insert({ user_id: user.id, role: "user", content });

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: next }),
      });
      if (resp.status === 429) { toast.error("Rate limited. Try again shortly."); setStreaming(false); return; }
      if (resp.status === 402) { toast.error("AI credits exhausted."); setStreaming(false); return; }
      if (!resp.ok || !resp.body) { toast.error("Chat failed"); setStreaming(false); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, nl);
          textBuffer = textBuffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
      if (assistantSoFar) {
        await supabase.from("chat_messages").insert({ user_id: user.id, role: "assistant", content: assistantSoFar });
        speak(assistantSoFar);
      }
    } catch (e: any) {
      toast.error(e.message || "Stream error");
    } finally {
      setStreaming(false);
    }
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-start justify-between gap-4 animate-fade-in-up">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <MessageSquare className="h-3 w-3" /> AI Mentor — Voice Enabled
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold">Ask <span className="text-gradient">PlaceMentor</span></h1>
          <p className="mt-2 text-muted-foreground">Speak or type — doubts, mock questions, interview tips.</p>
        </div>
        <Button
          variant={speakReplies ? "default" : "outline"}
          size="sm"
          onClick={() => { setSpeakReplies(!speakReplies); if (speakReplies) window.speechSynthesis?.cancel(); }}
          title="Read replies aloud"
        >
          {speakReplies ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex h-[calc(100vh-280px)] min-h-[500px] flex-col rounded-2xl border border-border/60 bg-card shadow-card">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero shadow-glow">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">How can I help today?</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try one of these:</p>
              <div className="mt-5 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {STARTERS.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="rounded-xl border border-border bg-background p-3 text-left text-sm transition-smooth hover:border-primary/50 hover:bg-muted/50">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                m.role === "user" ? "bg-gradient-hero text-primary-foreground shadow-elegant" : "bg-muted/60"
              }`}>
                {m.role === "user" ? (
                  <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                ) : (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{m.content || "..."}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t border-border/60 p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={listening ? "🎙️ Listening... speak now" : "Ask anything or tap mic 🎙️ (Shift+Enter for newline)"}
              className="min-h-[52px] resize-none"
              maxLength={2000}
              disabled={streaming}
            />
            <Button type="button" variant={listening ? "destructive" : "outline"} onClick={toggleMic} disabled={streaming} title="Voice input">
              {listening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button type="submit" disabled={streaming || !input.trim()} className="bg-gradient-hero shadow-elegant">
              {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
