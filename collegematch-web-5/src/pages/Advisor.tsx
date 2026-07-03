import { useState, useRef, useEffect } from 'react';
import { Brain, Send } from 'lucide-react';
import { emptyProfile } from '../data/types';
import type { StudentProfile } from '../data/types';
import { loadLocal } from '../lib/storage';

interface Message {
  role: 'user' | 'alex';
  text: string;
}

// Rule-based response engine — mirrors the app's on-device AdvisorEngine.
// Nothing here is sent to any external server or AI API; it's pattern
// matching against the student's own saved profile, run entirely in the browser.
function respond(question: string, profile: StudentProfile): string {
  const q = question.toLowerCase();
  const hasProfile = profile.academic.unweightedGPA > 0;

  if (!hasProfile) {
    return "I'd love to help, but I don't see a profile yet. Head to your Profile tab and enter your GPA and test scores first — then I can give you advice tailored to your actual stats.";
  }

  if (q.includes('essay')) {
    return "For your essays: start with a specific moment, not a summary of your whole life. Admissions readers see thousands of essays — a vivid, small scene sticks with them far more than a broad statement like \"I've always loved science.\" Try the Essay Reviewer tab to get feedback on a draft.";
  }

  if (q.includes('early decision') || q.includes(' ed ') || q.includes('early action')) {
    return `Early Decision is binding — only do it if a school is truly your #1 and you're confident on cost. With your ${profile.academic.unweightedGPA.toFixed(2)} GPA, ED can meaningfully boost your odds at Match and Reach schools, since acceptance rates are typically higher in the ED round. Early Action is non-binding and a safer way to apply early if you're not 100% sure.`;
  }

  if (q.includes('safety') || q.includes('reach') || q.includes('list') || q.includes('how many')) {
    return "A balanced list usually looks like: 2-3 Safety schools you're excited about (not just backups), 4-6 Match schools, and 2-4 Reach schools. Check your Results tab — it's already sorted your matches into these categories based on your profile.";
  }

  if (q.includes('gpa') || q.includes('grade')) {
    return `Your unweighted GPA is ${profile.academic.unweightedGPA.toFixed(2)}. Colleges look at your GPA trend too — an upward trajectory (grades improving junior/senior year) can matter more than a flat number. If you're still in school, focus on your strongest subjects for the rest of this year.`;
  }

  if (q.includes('sat') || q.includes('act') || q.includes('test score')) {
    if (profile.academic.hasSAT) {
      return `Your SAT is ${profile.academic.satScore}. Check individual college pages — if you're within or above their middle 50% range, you're competitive on testing. Many schools are test-optional now, so a strong score is a bonus, not a requirement.`;
    }
    return "You haven't logged a test score yet. If you're planning to test, aim to take it early enough to retake once if needed. Many schools are test-optional, so this isn't mandatory — check each school's specific policy.";
  }

  if (q.includes('major') || q.includes('study')) {
    return profile.academic.intendedMajor
      ? `You've got ${profile.academic.intendedMajor} listed as your intended major. Look at each school's specific program strength in that area, not just their overall ranking — a lower-ranked school with a standout program in your major can be a better fit.`
      : "You haven't set an intended major yet — that's okay, 'undecided' is a completely valid answer for most schools. If you do have an interest area, add it to your profile so I can give more specific advice.";
  }

  return "I can help with questions about essays, GPA, test scores, early decision/action, majors, or building a balanced college list. Try asking about one of those, or check your Results tab to see your personalized matches.";
}

export default function Advisor() {
  const profile = loadLocal<StudentProfile>('studentProfile') ?? emptyProfile();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'alex', text: "Hi, I'm Alex — your college advisor. Ask me about essays, test scores, early decision, or building your college list. Everything here runs on your device; nothing is sent anywhere." },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send() {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input.trim() };
    const reply: Message = { role: 'alex', text: respond(input, profile) };
    setMessages((m) => [...m, userMsg, reply]);
    setInput('');
  }

  return (
    <div className="pb-24 md:pb-8 px-5 pt-6 max-w-2xl mx-auto flex flex-col" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
          <Brain size={20} className="text-purple-400" />
        </div>
        <div>
          <h1 className="font-bold text-textPrimary">Alex — AI Advisor</h1>
          <p className="text-xs text-textTertiary">Runs on-device · Nothing leaves your browser</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === 'user'
                  ? 'bg-cmBlue text-white rounded-br-sm'
                  : 'bg-surfaceMid border border-borderC text-textPrimary rounded-bl-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask Alex about essays, scores, deadlines…"
          className="flex-1 bg-surfaceMid border border-borderC rounded-full px-4 py-3 text-sm text-textPrimary"
        />
        <button onClick={send} className="bg-cmBlue text-white font-bold px-5 rounded-full flex items-center gap-1.5">
          Send <Send size={14} />
        </button>
      </div>
    </div>
  );
}
