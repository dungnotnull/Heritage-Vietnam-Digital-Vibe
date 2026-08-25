import React, { useState, useEffect } from 'react';
import { Users, Plus, Heart, Calendar, MapPin, Camera, Sparkles, MessageCircle, Send, CheckCircle2, UserPlus } from 'lucide-react';
import { HeritageItem, HeritageTraveler, Language } from '../types';

interface CommunityTravelersProps {
  heritage: HeritageItem;
  language: Language;
}

export const CommunityTravelers: React.FC<CommunityTravelersProps> = ({
  heritage,
  language,
}) => {
  const [travelers, setTravelers] = useState<HeritageTraveler[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [status, setStatus] = useState<'planning' | 'visited' | 'looking_for_buddies'>('planning');
  const [statusText, setStatusText] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch Travelers
  const fetchTravelers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/travelers?heritageId=${encodeURIComponent(heritage.id)}`);
      const data = await res.json();
      if (data.travelers) {
        setTravelers(data.travelers);
      }
    } catch (err) {
      console.error('Failed to load travelers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravelers();
  }, [heritage.id]);

  const handleLike = async (id: string) => {
    try {
      const res = await fetch(`/api/travelers/${id}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setTravelers(prev =>
          prev.map(t => (t.id === id ? { ...t, likesCount: data.likesCount } : t))
        );
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !notes.trim()) return;

    setSubmitting(true);
    try {
      const defaultPhoto = photoUrl.trim() || heritage.heroImage;
      const res = await fetch('/api/travelers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heritageId: heritage.id,
          userName: name.trim(),
          travelDate: travelDate.trim() || (language === 'vi' ? 'Sắp tới' : 'Upcoming'),
          status,
          statusTextVi: statusText.trim() || (status === 'planning' ? 'Lên kế hoạch tới thăm' : status === 'visited' ? 'Đã check-in thực tế' : 'Tìm bạn đồng hành ghép chuyến'),
          notesVi: notes.trim(),
          photos: [defaultPhoto],
          contactHint: contact.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.traveler) {
        setTravelers(prev => [data.traveler, ...prev]);
        setSuccessMessage(language === 'vi' ? 'Đã đăng bài kết nối du lịch thành công!' : 'Trip plan posted successfully!');
        setName('');
        setTravelDate('');
        setStatusText('');
        setNotes('');
        setPhotoUrl('');
        setContact('');
        setTimeout(() => {
          setShowModal(false);
          setSuccessMessage('');
        }, 1500);
      }
    } catch (err) {
      console.error('Submit traveler error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="community-travelers-section" className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Users className="w-4 h-4 text-amber-700" />
            <span>{language === 'vi' ? 'Cộng Đồng Du Khách & Kết Nối Chuyến Đi' : 'Visitor Community & Travel Connect'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heritage text-stone-900 mt-1">
            {language === 'vi'
              ? `Những người sẽ tới "${heritage.titleVi}"`
              : `People visiting "${heritage.titleEn}"`}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'vi'
              ? 'Dễ dàng kết nối bạn bè cùng sở thích, đăng hình kỷ niệm, ghép nhóm và chia sẻ kinh nghiệm du lịch thực tế.'
              : 'Connect with fellow cultural travelers, share trip photos, find travel buddies, and give authentic feedback.'}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-sm transition-all hover:scale-105 cursor-pointer flex-shrink-0"
        >
          <UserPlus className="w-4 h-4 text-stone-950" />
          <span>{language === 'vi' ? 'Đăng Kế hoạch / Check-in' : 'Join or Share Trip'}</span>
        </button>
      </div>

      {/* Travelers Grid */}
      {loading ? (
        <div className="py-8 text-center text-xs text-stone-500 animate-pulse">
          {language === 'vi' ? 'Đang tải danh sách du khách kết nối...' : 'Loading traveler community...'}
        </div>
      ) : travelers.length === 0 ? (
        <div className="py-10 text-center rounded-2xl bg-stone-50 border border-dashed border-stone-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-700">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-stone-700">
            {language === 'vi' ? 'Chưa có bài đăng nào cho địa điểm này' : 'No visitor posts yet'}
          </div>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {language === 'vi'
              ? 'Hãy là người đầu tiên chia sẻ lịch trình hoặc tìm bạn đồng hành tới thăm di sản tuyệt vời này!'
              : 'Be the first to share your trip plan or find fellow travelers!'}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-stone-900 text-amber-300 text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            {language === 'vi' ? 'Đăng bài ngay' : 'Post now'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {travelers.map(t => (
            <div
              key={t.id}
              className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-400 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* User Info & Status Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={t.avatar}
                      alt={t.userName}
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/30 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-900 truncate">
                        {t.userName}
                      </div>
                      <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{t.travelDate}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 whitespace-nowrap ${
                      t.status === 'planning'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : t.status === 'visited'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-purple-100 text-purple-900 border border-purple-300'
                    }`}
                  >
                    {t.status === 'planning'
                      ? (language === 'vi' ? '✈️ Sắp đi' : '✈️ Planning')
                      : t.status === 'visited'
                      ? (language === 'vi' ? '📸 Đã đến' : '📸 Visited')
                      : (language === 'vi' ? '🤝 Tìm bạn' : '🤝 Looking for buddies')}
                  </span>
                </div>

                {/* Status Headline */}
                <div className="text-xs font-bold text-stone-800">
                  {language === 'vi' ? t.statusTextVi : t.statusTextEn}
                </div>

                {/* Notes & Tips */}
                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === 'vi' ? t.notesVi : t.notesEn}
                </p>

                {/* Attached Photo */}
                {t.photos && t.photos.length > 0 && (
                  <div className="rounded-xl overflow-hidden border border-stone-200/80 max-h-48">
                    <img
                      src={t.photos[0]}
                      alt="Travel photo"
                      className="w-full h-36 object-cover hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Footer: Contact & Like */}
              <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-500">
                <div className="text-[11px] text-stone-600 truncate font-medium">
                  {t.contactHint ? (
                    <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {t.contactHint}
                    </span>
                  ) : (
                    <span>{language === 'vi' ? 'Cộng đồng HeritageVibe' : 'HeritageVibe Community'}</span>
                  )}
                </div>

                <button
                  onClick={() => handleLike(t.id)}
                  className="flex items-center gap-1 text-stone-600 hover:text-rose-600 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-stone-100"
                >
                  <Heart className={`w-3.5 h-3.5 ${t.likesCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                  <span className="font-bold text-[11px]">{t.likesCount}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Post Plan / Check-in */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="text-base font-bold font-heritage text-stone-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-700" />
                <span>{language === 'vi' ? 'Đăng Kế Hoạch / Kết Nối Du Khách' : 'Post Trip Plan / Connect'}</span>
              </h4>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {successMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-center font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'vi' ? 'Tên hoặc Nhóm của bạn *' : 'Your Name / Group *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={language === 'vi' ? 'Vd: Lan Hương & Duy Khánh (Đà Nẵng)' : 'e.g. Alex & Sarah'}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/40 outline-hidden bg-stone-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Mục đích đăng *' : 'Post Type *'}
                    </label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white font-medium"
                    >
                      <option value="planning">{language === 'vi' ? '✈️ Lên kế hoạch sắp đi' : '✈️ Planning to visit'}</option>
                      <option value="visited">{language === 'vi' ? '📸 Đã đến & Review' : '📸 Visited & Review'}</option>
                      <option value="looking_for_buddies">{language === 'vi' ? '🤝 Tìm bạn đồng hành ghép xe/thuyền' : '🤝 Looking for travel buddies'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Thời gian dự kiến / đã đi' : 'Travel Date / Period'}
                    </label>
                    <input
                      type="text"
                      value={travelDate}
                      onChange={e => setTravelDate(e.target.value)}
                      placeholder={language === 'vi' ? 'Vd: Dịp lễ 02/09 hoặc Đêm rằm' : 'e.g. Next weekend'}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/40 outline-hidden bg-stone-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'vi' ? 'Tiêu đề ngắn gọn' : 'Headline'}
                  </label>
                  <input
                    type="text"
                    value={statusText}
                    onChange={e => setStatusText(e.target.value)}
                    placeholder={language === 'vi' ? 'Vd: Tìm bạn ghép thuyền rồng nghe ca Huế đêm rằm' : 'Short summary'}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/40 outline-hidden bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'vi' ? 'Kinh nghiệm, Lời nhắn hoặc Kế hoạch chi tiết *' : 'Trip notes, tips, or invitation *'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder={language === 'vi' ? 'Chia sẻ cảm nhận, lịch trình, quán ăn ngon hoặc thông tin tìm bạn đi cùng...' : 'Share your itinerary or recommendations...'}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/40 outline-hidden bg-stone-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Link ảnh kỷ niệm (URL)' : 'Photo URL'}
                    </label>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={e => setPhotoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/40 outline-hidden bg-stone-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Thông tin liên hệ (Zalo/FB/SĐT)' : 'Contact (Zalo/FB/Phone)'}
                    </label>
                    <input
                      type="text"
                      value={contact}
                      onChange={e => setContact(e.target.value)}
                      placeholder={language === 'vi' ? 'Vd: Zalo 0912.xxx.xxx' : 'e.g. Zalo / IG'}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/40 outline-hidden bg-stone-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 cursor-pointer"
                  >
                    {language === 'vi' ? 'Hủy' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 font-bold hover:from-amber-500 hover:to-amber-600 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (language === 'vi' ? 'Đang đăng...' : 'Posting...') : (language === 'vi' ? 'Đăng kết nối' : 'Submit')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
