import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile,
  signInAnonymously
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { ShieldCheck, Lock, Mail, User as UserIcon, ArrowRight, Sparkles, CheckCircle2, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { Language } from '../types';

interface AuthGateProps {
  language: Language;
  onSuccess?: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ language, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!displayName.trim()) {
          setErrorMsg(language === 'vi' ? 'Vui lòng nhập họ tên hiển thị!' : 'Please enter display name!');
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(userCredential.user, {
          displayName: displayName.trim(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err?.message || 'Authentication error';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
        msg = language === 'vi' ? 'Email hoặc mật khẩu không chính xác.' : 'Invalid email or password.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = language === 'vi' ? 'Email này đã được đăng ký tài khoản.' : 'This email is already registered.';
      } else if (msg.includes('auth/weak-password')) {
        msg = language === 'vi' ? 'Mật khẩu phải có ít nhất 6 ký tự.' : 'Password must be at least 6 characters.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      setErrorMsg(language === 'vi' ? 'Đăng nhập Google không thành công hoặc đã bị đóng.' : 'Google Sign-In failed or was cancelled.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickGuestSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const cred = await signInAnonymously(auth);
      await updateProfile(cred.user, {
        displayName: 'Cộng tác viên Di sản (Guest)',
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Guest Sign In error:', err);
      // If anonymous auth is not enabled, fallback to mock demo account
      setErrorMsg(language === 'vi' ? 'Đăng nhập ẩn danh chưa khả dụng. Hãy tạo tài khoản email.' : 'Anonymous login not available. Please sign up with email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-6 p-6 sm:p-8 bg-stone-900 border border-amber-800/50 rounded-3xl shadow-2xl text-stone-100 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'vi' ? 'Yêu Cầu Xác Thực Tài Khoản' : 'Authentication Required'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heritage text-amber-100">
            {isRegister
              ? (language === 'vi' ? 'Đăng Ký Tài Khoản Đóng Góp Tri Thức' : 'Register Cultural Contributor')
              : (language === 'vi' ? 'Đăng Nhập Cổng Tri Thức Di Sản' : 'Sign In to Heritage Knowledge')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto">
            {language === 'vi'
              ? 'Để bảo đảm tính xác thực và lưu danh người đóng góp di sản văn hóa, vui lòng đăng nhập hoặc đăng ký tài khoản miễn phí.'
              : 'To preserve authenticity and record historical contributors, please sign in or create a free account.'}
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 bg-red-950/80 border border-red-500/60 rounded-2xl text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Social / Quick Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-stone-800 hover:bg-stone-750 text-white font-bold text-xs sm:text-sm border border-stone-700 hover:border-amber-500/50 shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{language === 'vi' ? 'Tiếp tục với Google' : 'Continue with Google'}</span>
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-stone-800" />
            <span className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider">
              {language === 'vi' ? 'Hoặc email' : 'Or with Email'}
            </span>
            <div className="flex-1 h-px bg-stone-800" />
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {isRegister && (
            <div>
              <label className="block font-bold text-stone-300 mb-1">
                {language === 'vi' ? 'Họ và tên người đóng góp *' : 'Display Name / Contributor *'}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="VD: TS. Nguyễn Văn An"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 placeholder-stone-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-300 mb-1">
              {language === 'vi' ? 'Địa chỉ Email *' : 'Email Address *'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tennguoidung@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 placeholder-stone-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-300 mb-1">
              {language === 'vi' ? 'Mật khẩu (ít nhất 6 ký tự) *' : 'Password (min 6 characters) *'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 placeholder-stone-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>
              {loading
                ? (language === 'vi' ? 'Đang xử lý...' : 'Processing...')
                : isRegister
                ? (language === 'vi' ? 'Đăng Ký Tài Khoản' : 'Create Account')
                : (language === 'vi' ? 'Đăng Nhập Vào Hệ Thống' : 'Sign In')}
            </span>
          </button>
        </form>

        {/* Toggle Mode & Guest Option */}
        <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
            }}
            className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline underline-offset-4"
          >
            {isRegister
              ? (language === 'vi' ? 'Đã có tài khoản? Đăng nhập ngay' : 'Already have an account? Sign in')
              : (language === 'vi' ? 'Chưa có tài khoản? Đăng ký tại đây' : 'New contributor? Register here')}
          </button>

          <button
            type="button"
            onClick={handleQuickGuestSignIn}
            disabled={loading}
            className="text-stone-400 hover:text-stone-200 text-[11px] font-medium transition-colors cursor-pointer"
          >
            {language === 'vi' ? '⚡ Thử nhanh chế độ Khách' : '⚡ Quick Guest Access'}
          </button>
        </div>

      </div>
    </div>
  );
};
