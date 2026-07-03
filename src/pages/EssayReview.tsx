import { useState } from 'react';
import { FileEdit, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface Feedback {
  label: string;
  status: 'good' | 'warn' | 'bad';
  detail: string;
}

function analyze(text: string, wordLimit: number): Feedback[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = text.trim() ? words.length : 0;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
  const firstPersonCount = (text.match(/\bI\b/g) || []).length;
  const clicheWords = ['passionate', 'ever since I was young', 'thinking outside the box', 'in today\'s society', 'game changer'];
  const foundCliches = clicheWords.filter((c) => text.toLowerCase().includes(c));

  const feedback: Feedback[] = [];

  // Word count
  if (wordCount === 0) {
    feedback.push({ label: 'Word Count', status: 'warn', detail: 'Paste your essay to get started.' });
  } else if (wordCount > wordLimit) {
    feedback.push({ label: 'Word Count', status: 'bad', detail: `${wordCount} / ${wordLimit} words — you're over by ${wordCount - wordLimit}. Trim it down.` });
  } else if (wordCount < wordLimit * 0.85) {
    feedback.push({ label: 'Word Count', status: 'warn', detail: `${wordCount} / ${wordLimit} words — you have room to add more detail or a stronger ending.` });
  } else {
    feedback.push({ label: 'Word Count', status: 'good', detail: `${wordCount} / ${wordLimit} words — good length.` });
  }

  // Opening
  if (wordCount > 0) {
    const opening = words.slice(0, 8).join(' ').toLowerCase();
    if (opening.startsWith('i am') || opening.startsWith('i have always') || opening.startsWith('ever since')) {
      feedback.push({ label: 'Opening Line', status: 'warn', detail: 'Your opening is a common pattern admissions readers see often. Try starting mid-scene or with a specific detail instead of a general statement.' });
    } else if (wordCount > 0) {
      feedback.push({ label: 'Opening Line', status: 'good', detail: 'Opening avoids the most overused patterns — good.' });
    }
  }

  // Sentence variety
  if (wordCount > 20) {
    if (avgWordsPerSentence > 25) {
      feedback.push({ label: 'Sentence Length', status: 'warn', detail: `Average ${Math.round(avgWordsPerSentence)} words/sentence — consider breaking up long sentences for readability.` });
    } else {
      feedback.push({ label: 'Sentence Length', status: 'good', detail: `Average ${Math.round(avgWordsPerSentence)} words/sentence — reads naturally.` });
    }
  }

  // Cliches
  if (foundCliches.length > 0) {
    feedback.push({ label: 'Common Phrases', status: 'warn', detail: `Found: "${foundCliches.join('", "')}" — these appear in many essays. Consider more specific language.` });
  } else if (wordCount > 0) {
    feedback.push({ label: 'Common Phrases', status: 'good', detail: 'No overused phrases detected.' });
  }

  // Voice / first person balance
  if (wordCount > 50) {
    const ratio = firstPersonCount / wordCount;
    if (ratio > 0.08) {
      feedback.push({ label: 'Voice', status: 'warn', detail: 'Heavy use of "I" statements — try showing through action and detail rather than repeatedly stating "I felt" / "I learned".' });
    } else {
      feedback.push({ label: 'Voice', status: 'good', detail: 'Good balance of narrative and reflection.' });
    }
  }

  return feedback;
}

const statusColor = { good: 'text-cmSafety bg-cmSafety/10 border-cmSafety/25', warn: 'text-cmReach bg-cmReach/10 border-cmReach/25', bad: 'text-cmHC bg-cmHC/10 border-cmHC/25' };
const statusIcon = { good: CheckCircle2, warn: AlertTriangle, bad: XCircle };

export default function EssayReview() {
  const [text, setText] = useState('');
  const [wordLimit, setWordLimit] = useState(650);
  const feedback = analyze(text, wordLimit);

  return (
    <div className="pb-8 px-5 pt-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <FileEdit size={26} className="text-textPrimary" />
        <h1 className="text-2xl font-bold text-textPrimary">Essay Review</h1>
      </div>
      <p className="text-textSecondary text-sm mb-6">Rule-based analysis, runs entirely in your browser — your essay is never sent anywhere.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-textSecondary">Your Essay</span>
            <span className="text-xs text-textTertiary flex items-center gap-2">
              Word limit:
              <input
                type="number"
                value={wordLimit}
                onChange={(e) => setWordLimit(parseInt(e.target.value) || 650)}
                className="w-16 bg-surfaceMid border border-borderC rounded px-2 py-1 text-textPrimary"
              />
            </span>
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your essay draft here…"
            rows={16}
            className="w-full bg-surfaceMid border border-borderC rounded-xl p-4 text-sm text-textPrimary resize-none"
          />
        </div>

        <div>
          <span className="block text-sm font-semibold text-textSecondary mb-2">Feedback</span>
          <div className="flex flex-col gap-3">
            {feedback.map((f, i) => {
              const StatusIcon = statusIcon[f.status];
              return (
                <div key={i} className={`border rounded-xl p-3 ${statusColor[f.status]}`}>
                  <div className="flex items-center gap-2 font-bold text-sm mb-1">
                    <StatusIcon size={15} />{f.label}
                  </div>
                  <p className="text-xs text-textSecondary">{f.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
