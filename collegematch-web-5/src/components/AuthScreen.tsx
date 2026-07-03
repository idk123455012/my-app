import { GraduationCap, Lock, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { signInWithGoogle, continueAsGuest } = useAuth();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 py-10">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center shadow-lg shadow-cmBlue/40 mb-6">
        <GraduationCap size={44} className="text-cmGold" />
      </div>
      <h1 className="text-3xl font-bold text-textPrimary mb-2 text-center">CollegePath</h1>
      <p className="text-textSecondary text-center mb-6 max-w-xs">
        Your personalized college list, built around your exact stats.
      </p>

      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {['6,000+ Colleges', 'Personalized Match', 'AI Advisor'].map((f) => (
          <span key={f} className="text-xs font-semibold bg-cmBlue/10 border border-cmBlue/25 text-textPrimary px-3 py-1.5 rounded-full">
            {f}
          </span>
        ))}
      </div>

      <div className="w-full max-w-sm bg-surfaceMid border border-borderC rounded-xl p-6">
        <p className="text-center text-xs font-medium text-textSecondary mb-4">Sign in or create your account</p>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-white text-gray-800 font-bold py-3.5 rounded-md flex items-center justify-center gap-3 mb-2"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <p className="text-center text-[11px] text-textTertiary mb-5 flex items-center justify-center gap-1">
          <Lock size={11} /> No password needed
        </p>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px bg-borderC flex-1" />
          <span className="text-xs text-textTertiary">or</span>
          <div className="h-px bg-borderC flex-1" />
        </div>

        <button
          onClick={continueAsGuest}
          className="w-full bg-surfaceLight border border-borderC rounded-md py-4 text-center"
        >
          <div className="font-semibold text-textSecondary text-sm flex items-center justify-center gap-2">
            <UserRound size={16} /> Continue without an account
          </div>
          <div className="text-[11px] text-textTertiary mt-0.5">Your data stays on this device only</div>
        </button>
      </div>

      <p className="text-[11px] text-textTertiary text-center mt-6 max-w-xs">
        By continuing, you agree to our <a href="#" className="text-cmBlue">Terms of Use</a> and{' '}
        <a href="#" className="text-cmBlue">Privacy Policy</a>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  );
}
