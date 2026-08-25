import React, { useState } from 'react';
import { 
  Compass, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Sparkles, 
  FileDown, 
  Clock, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  Lightbulb, 
  ShoppingBag, 
  Car, 
  ChevronRight, 
  Layers, 
  RotateCcw, 
  CheckCircle2, 
  Share2,
  AlertCircle,
  ExternalLink,
  CalendarPlus,
  Navigation
} from 'lucide-react';
import { PlannerTripRequest, PlannerTripPlan, Language, HeritageItem } from '../types';
import { exportTripPlanToDocx } from '../utils/docxExport';
import { getGoogleCalendarUrl, exportTripToIcs } from '../utils/calendarExport';
import { VietnamFlag } from './VietnamFlag';

interface HeritagePlannerProps {
  language: Language;
  heritages?: HeritageItem[];
  onSelectHeritage?: (heritageId: string) => void;
}

export const HeritagePlanner: React.FC<HeritagePlannerProps> = ({
  language,
  heritages,
  onSelectHeritage,
}) => {
  const isVi = language === 'vi';
  const currentMonth = new Date().getMonth() + 1;

  // Form State
  const [preference, setPreference] = useState<'scenic' | 'history_culture' | 'craft_music' | 'all_in_one'>('history_culture');
  const [region, setRegion] = useState<'north' | 'central' | 'south' | 'cross_vietnam'>('north');
  const [month, setMonth] = useState<number>(currentMonth);
  const [durationDays, setDurationDays] = useState<number>(3);
  const [budgetLevel, setBudgetLevel] = useState<'budget' | 'standard' | 'luxury' | 'custom'>('standard');
  const [customBudgetVnd, setCustomBudgetVnd] = useState<string>('');
  const [groupType, setGroupType] = useState<'solo' | 'couple' | 'family' | 'friends'>('family');
  const [customNotes, setCustomNotes] = useState<string>('');

  // Execution state
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlannerTripPlan | null>(null);
  const [packedItems, setPackedItems] = useState<Record<number, boolean>>({});
  const [exportingDocx, setExportingDocx] = useState<boolean>(false);

  const togglePacked = (index: number) => {
    setPackedItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const requestPayload: PlannerTripRequest = {
      preference,
      region,
      month,
      durationDays,
      budgetLevel,
      customBudgetVnd: customBudgetVnd ? parseInt(customBudgetVnd.replace(/\D/g, ''), 10) : undefined,
      groupType,
      customNotes,
      language,
    };

    try {
      const res = await fetch('/api/planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.plan) {
        setPlan(data.plan);
        setPackedItems({});
      } else {
        throw new Error(data.error || 'Failed to generate plan');
      }
    } catch (err: any) {
      console.error('Planner generation error:', err);
      setErrorMsg(isVi ? 'Không thể kết nối máy chủ Gemini Planner. Đang thử lại với bộ dữ liệu lưu trữ...' : 'Could not generate with Gemini server. Using cached planner data...');
    } finally {
      setLoading(false);
    }
  };

  const handleExportDocx = async () => {
    if (!plan) return;
    setExportingDocx(true);
    try {
      await exportTripPlanToDocx(plan, language);
    } catch (err) {
      console.error('Docx export error:', err);
    } finally {
      setExportingDocx(false);
    }
  };

  const monthHighlights = [
    { m: 1, tagVi: 'Xuân Kinh Bắc & Lễ hội Đền Hùng', tagEn: 'Spring Festivals' },
    { m: 2, tagVi: 'Lễ hội Chùa Hương & Hội Lim', tagEn: 'Pagoda & Folk Songs' },
    { m: 3, tagVi: 'Mùa hoa ban Tây Bắc & Cố Đô', tagEn: 'Ban Flowers & Hue' },
    { m: 4, tagVi: 'Giỗ Tổ Hùng Vương & Núi Sam', tagEn: 'Hung Kings & Sam Mount' },
    { m: 5, tagVi: 'Mùa nước đổ Ruộng bậc thang', tagEn: 'Water Pouring Season' },
    { m: 6, tagVi: 'Mùa sen Đồng Tháp & Biển Hạ Long', tagEn: 'Lotus Season & Ha Long' },
    { m: 7, tagVi: 'Mùa trái cây Nam Bộ & Phong Nha', tagEn: 'Delta Fruit Harvest' },
    { m: 8, tagVi: 'Mùa thu Hà Nội & Phố Cổ Hội An', tagEn: 'Hanoi Autumn & Hoi An' },
    { m: 9, tagVi: 'Mùa lúa chín vàng Mù Cang Chải', tagEn: 'Golden Harvest Terraces' },
    { m: 10, tagVi: 'Mùa nước nổi miền Tây & Tràng An', tagEn: 'Mekong Floating Season' },
    { m: 11, tagVi: 'Mùa hoa tam giác mạch Hà Giang', tagEn: 'Buckwheat Blossom' },
    { m: 12, tagVi: 'Mùa đông Cố Đô & Festival Hoa', tagEn: 'Winter Atmosphere' },
  ];

  return (
    <div id="planner-section" className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-stone-100 p-6 sm:p-10 shadow-2xl border border-stone-800">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isVi ? 'Planner Agent (Gemini AI)' : 'Gemini AI Planner Agent'}</span>
            </span>
            <VietnamFlag size="sm" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold font-heritage tracking-tight text-white">
            {isVi ? 'Lên Kế Hoạch Du Lịch & Khám Phá Di Sản' : 'Personalized Heritage & Scenic Trip Planner'}
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            {isVi
              ? 'Trợ lý AI phân tích mùa trong năm, thời tiết, tối ưu hóa cung đường gần nhau và chuẩn bị đầy đủ hành trang, lưu ý văn hóa kèm xuất file Word (.docx) chuyên nghiệp.'
              : 'Our AI Planner clusters nearby destinations, considers seasonal climate, prepares packing checklists and outputs editable Word (.docx) schedules.'}
          </p>
        </div>
      </div>

      {/* Input Form & Parameters */}
      <form onSubmit={handleGenerate} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Preference (Sở thích) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>{isVi ? '1. Sở thích trải nghiệm' : '1. Travel Preference'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPreference('history_culture')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  preference === 'history_culture'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                }`}
              >
                <div className="text-xs font-bold">{isVi ? '🏛️ Lịch sử & Di sản' : '🏛️ History & Heritage'}</div>
                <div className="text-[11px] text-stone-500 font-normal mt-0.5">{isVi ? 'Cố đô, đền chùa, di tích' : 'Imperial citadels, temples'}</div>
              </button>

              <button
                type="button"
                onClick={() => setPreference('scenic')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  preference === 'scenic'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                }`}
              >
                <div className="text-xs font-bold">{isVi ? '🏞️ Thắng cảnh Thiên nhiên' : '🏞️ Scenic Nature'}</div>
                <div className="text-[11px] text-stone-500 font-normal mt-0.5">{isVi ? 'Vịnh, hang động, non nước' : 'Bays, karst, waterfalls'}</div>
              </button>

              <button
                type="button"
                onClick={() => setPreference('craft_music')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  preference === 'craft_music'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                }`}
              >
                <div className="text-xs font-bold">{isVi ? '🏺 Làng nghề & Âm nhạc' : '🏺 Crafts & Folk Arts'}</div>
                <div className="text-[11px] text-stone-500 font-normal mt-0.5">{isVi ? 'Gốm, lụa, Quan họ, Nhã nhạc' : 'Pottery, silk, folk music'}</div>
              </button>

              <button
                type="button"
                onClick={() => setPreference('all_in_one')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  preference === 'all_in_one'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                }`}
              >
                <div className="text-xs font-bold">{isVi ? '🌟 Trọn gói Tổng hợp' : '🌟 Complete Highlights'}</div>
                <div className="text-[11px] text-stone-500 font-normal mt-0.5">{isVi ? 'Hài hòa di sản & thắng cảnh' : 'Balanced cultural trip'}</div>
              </button>
            </div>
          </div>

          {/* 2. Region (Miền) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>{isVi ? '2. Khu vực / Vùng miền' : '2. Destination Region'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRegion('north')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  region === 'north'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                }`}
              >
                <div className="text-xs font-bold">{isVi ? 'Miền Bắc' : 'Northern Vietnam'}</div>
                <div className="text-[11px] text-stone-500 font-normal mt-0.5">{isVi ? 'Hà Nội, Ninh Bình, Hạ Long, Tây Bắc' : 'Hanoi, Ha Long, Ninh Binh'}</div>
              </button>

              <button
                type="button"
                onClick={() => setRegion('central')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  region === 'central'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                }`}
              >
                <div className="text-xs font-bold">{isVi ? 'Miền Trung' : 'Central Vietnam'}</div>
                <div className="text-[11px] text-stone-500 font-normal mt-0.5">{isVi ? 'Huế, Hội An, Mỹ Sơn, Phong Nha' : 'Hue, Hoi An, My Son'}</div>
              </button>

              <button
                type="button"
                onClick={() => setRegion('south')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  region === 'south'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                }`}
              >
                <div className="text-xs font-bold">{isVi ? 'Miền Nam' : 'Southern Vietnam'}</div>
                <div className="text-[11px] text-stone-500 font-normal mt-0.5">{isVi ? 'Sài Gòn, Cần Thơ, An Giang, Tây Ninh' : 'Saigon, Mekong Delta'}</div>
              </button>

              <button
                type="button"
                onClick={() => setRegion('cross_vietnam')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  region === 'cross_vietnam'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                }`}
              >
                <div className="text-xs font-bold">{isVi ? 'Tuyến Xuyên Việt' : 'Grand Vietnam'}</div>
                <div className="text-[11px] text-stone-500 font-normal mt-0.5">{isVi ? 'Bắc - Trung - Nam liên tuyến' : 'Cross-country journey'}</div>
              </button>
            </div>
          </div>

          {/* 3. Month & Season (Thời điểm tháng) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>{isVi ? '3. Thời điểm khởi hành' : '3. Month of Departure'}</span>
              </span>
              <span className="text-amber-800 font-bold text-xs">
                {isVi ? `Tháng ${month}` : `Month ${month}`}
              </span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonth(m)}
                  className={`py-2 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    month === m
                      ? 'border-amber-600 bg-amber-500 text-stone-950 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                  }`}
                >
                  T{m}
                </button>
              ))}
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-600 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span className="font-medium">{isVi ? monthHighlights[month - 1].tagVi : monthHighlights[month - 1].tagEn}</span>
            </div>
          </div>

          {/* 4. Duration (Thời lượng) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{isVi ? '4. Thời lượng hành trình' : '4. Duration'}</span>
              </span>
              <span className="text-amber-800 font-bold text-xs">
                {isVi ? `${durationDays} ngày ${durationDays > 1 ? `${durationDays - 1} đêm` : ''}` : `${durationDays} Days`}
              </span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 7, 10].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDurationDays(d)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    durationDays === d
                      ? 'border-amber-600 bg-amber-500 text-stone-950 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                  }`}
                >
                  {d}N
                </button>
              ))}
            </div>
          </div>

          {/* 5. Budget Level (Kinh phí) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>{isVi ? '5. Kinh phí dự kiến' : '5. Budget Level'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBudgetLevel('budget')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  budgetLevel === 'budget'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold'
                    : 'border-stone-200 text-stone-700 bg-stone-50/50'
                }`}
              >
                <div className="text-xs font-bold">{isVi ? 'Tiết kiệm' : 'Budget'}</div>
                <div className="text-[10px] text-stone-500">~2 - 4 tr VNĐ/người</div>
              </button>

              <button
                type="button"
                onClick={() => setBudgetLevel('standard')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  budgetLevel === 'standard'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold'
                    : 'border-stone-200 text-stone-700 bg-stone-50/50'
                }`}
              >
                <div className="text-xs font-bold">{isVi ? 'Tiêu chuẩn' : 'Standard'}</div>
                <div className="text-[10px] text-stone-500">~5 - 9 tr VNĐ/người</div>
              </button>

              <button
                type="button"
                onClick={() => setBudgetLevel('luxury')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  budgetLevel === 'luxury'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold'
                    : 'border-stone-200 text-stone-700 bg-stone-50/50'
                }`}
              >
                <div className="text-xs font-bold">{isVi ? 'Cao cấp / Nghỉ dưỡng' : 'Luxury'}</div>
                <div className="text-[10px] text-stone-500">&gt; 12 tr VNĐ/người</div>
              </button>

              <button
                type="button"
                onClick={() => setBudgetLevel('custom')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  budgetLevel === 'custom'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold'
                    : 'border-stone-200 text-stone-700 bg-stone-50/50'
                }`}
              >
                <div className="text-xs font-bold">{isVi ? 'Tùy chỉnh số tiền' : 'Custom Amount'}</div>
                <div className="text-[10px] text-stone-500">{isVi ? 'Tự nhập ngân sách' : 'Enter amount'}</div>
              </button>
            </div>

            {budgetLevel === 'custom' && (
              <input
                type="text"
                value={customBudgetVnd}
                onChange={(e) => setCustomBudgetVnd(e.target.value)}
                placeholder={isVi ? "Ví dụ: 8.000.000 VNĐ" : "e.g., 500 USD"}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            )}
          </div>

          {/* 6. Group Type & Special Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" />
              <span>{isVi ? '6. Thành phần đoàn & Ghi chú' : '6. Group & Notes'}</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'solo', labelVi: '1 Mình', labelEn: 'Solo' },
                { id: 'couple', labelVi: 'Cặp đôi', labelEn: 'Couple' },
                { id: 'family', labelVi: 'Gia đình', labelEn: 'Family' },
                { id: 'friends', labelVi: 'Nhóm bạn', labelEn: 'Friends' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGroupType(g.id as any)}
                  className={`flex-1 py-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                    groupType === g.id
                      ? 'border-amber-600 bg-amber-50/80 text-amber-950'
                      : 'border-stone-200 text-stone-700 bg-stone-50/50'
                  }`}
                >
                  {isVi ? g.labelVi : g.labelEn}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder={isVi ? "Yêu cầu thêm (VD: thích đồ chay, có người cao tuổi...)" : "Special requests (e.g. vegetarian, senior-friendly)"}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Submit & Generate Button */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-stone-500 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>{isVi ? 'Tự động gom cụm điểm đến gần nhau • Tối ưu di chuyển • Chuẩn theo mùa' : 'Clustered nearby routes • Seasonally optimized • Exportable Word document'}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>{isVi ? 'Gemini AI đang lên lịch trình...' : 'Generating Itinerary with Gemini...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isVi ? 'Tạo Kế Hoạch Chi Tiết Ngay' : 'Generate Full Itinerary'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Generated Itinerary Display */}
      {plan && (
        <div className="space-y-6 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 animate-slide-up">
          
          {/* Plan Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isVi ? `Tháng ${plan.requestParams?.month || month} Tối Ưu` : `Month ${plan.requestParams?.month || month} Optimized`}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                  {isVi ? `${plan.days.length} Ngày Trải Nghiệm` : `${plan.days.length} Days Trip`}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200">
                  {isVi ? plan.estimatedBudgetVi : plan.estimatedBudgetEn}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-heritage text-stone-950">
                {isVi ? plan.titleVi : plan.titleEn}
              </h3>
              <p className="text-stone-600 text-sm max-w-3xl">
                {isVi ? plan.overviewSummaryVi : plan.overviewSummaryEn}
              </p>
            </div>

            {/* Export & Calendar Integration Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Google Calendar Link */}
              <a
                href={getGoogleCalendarUrl(plan, language)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 cursor-pointer transition-all hover:scale-[1.02]"
                title={isVi ? 'Thêm toàn bộ tour vào Google Calendar' : 'Add tour to Google Calendar'}
              >
                <CalendarPlus className="w-4 h-4" />
                <span>{isVi ? 'Google Calendar' : 'Google Calendar'}</span>
                <ExternalLink className="w-3 h-3 text-amber-200" />
              </a>

              {/* iCal .ics Export */}
              <button
                type="button"
                onClick={() => exportTripToIcs(plan, language)}
                className="px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-900 text-stone-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:scale-[1.02]"
                title={isVi ? 'Tải tệp lịch iCal (.ics) cho Apple Calendar & Outlook' : 'Download iCal (.ics) calendar file'}
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{isVi ? 'Tải iCal (.ics)' : 'iCal (.ics)'}</span>
              </button>

              {/* Word Export Button */}
              <button
                type="button"
                onClick={handleExportDocx}
                disabled={exportingDocx}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer transition-all hover:scale-[1.02]"
              >
                {exportingDocx ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isVi ? 'Đang tạo Word...' : 'Creating Word...'}</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    <span>{isVi ? 'Xuất Word (.docx)' : 'Word (.docx)'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Highlights & Logistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{isVi ? 'Điểm nhấn mùa tháng đã chọn' : 'Seasonal Highlights'}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {isVi ? plan.seasonHighlightsVi : plan.seasonHighlightsEn}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-4 h-4 text-amber-600" />
                <span>{isVi ? 'Khuyến nghị phương tiện di chuyển' : 'Transport Recommendation'}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {isVi ? plan.transportRecommendationVi : plan.transportRecommendationEn}
              </p>
            </div>
          </div>

          {/* Day-by-Day Clustered Itinerary */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2 text-stone-900 font-bold font-heritage text-xl">
              <Compass className="w-5 h-5 text-amber-600" />
              <span>{isVi ? 'Chi Tiết Lịch Trình Từng Ngày (Đã Tối Ưu Cung Đường)' : 'Day-by-Day Clustered Itinerary'}</span>
            </div>

            <div className="space-y-6">
              {plan.days.map((day) => (
                <div key={day.day} className="rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
                  {/* Day Header */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 to-stone-800 text-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-sm shadow-md">
                        N{day.day}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {isVi ? day.titleVi : day.titleEn}
                        </h4>
                        <p className="text-xs text-amber-300">
                          {isVi ? day.themeVi : day.themeEn}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Destinations Timeline */}
                  <div className="p-5 sm:p-6 space-y-4 bg-stone-50/50">
                    <div className="space-y-4">
                      {day.destinations.map((dest, dIdx) => {
                        const destName = isVi ? dest.nameVi : dest.nameEn;
                        const gmapQuery = encodeURIComponent(`${dest.nameVi} Việt Nam`);
                        const gmapUrl = `https://www.google.com/maps/search/?api=1&query=${gmapQuery}`;

                        return (
                          <div key={dIdx} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs">
                                  {dest.timeSlot || '08:30 - 11:30'}
                                </span>
                                <h5 className="text-sm font-bold text-stone-900">
                                  {destName}
                                </h5>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {dest.isNearbyClustered && (
                                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    {isVi ? '✓ Cùng cụm điểm đến gần' : '✓ Clustered nearby'}
                                  </span>
                                )}

                                {/* Live Google Maps Places Link */}
                                <a
                                  href={gmapUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors cursor-pointer"
                                  title={isVi ? 'Xem vị trí trên Google Maps Places' : 'View on Google Maps Places'}
                                >
                                  <MapPin className="w-3 h-3 text-red-600" />
                                  <span>Google Maps</span>
                                  <ExternalLink className="w-2.5 h-2.5 text-stone-500" />
                                </a>
                              </div>
                            </div>

                            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                              {isVi ? dest.descriptionVi : dest.descriptionEn}
                            </p>

                            {dest.travelTipsVi && (
                              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <span>{isVi ? dest.travelTipsVi : dest.travelTipsEn}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Day Meals */}
                    {day.mealsVi && (
                      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center gap-2 text-xs text-stone-800">
                        <span className="font-bold text-amber-900 uppercase tracking-wider">
                          🍽️ {isVi ? 'Gợi ý ẩm thực ngày:' : 'Meals:'}
                        </span>
                        {(isVi ? day.mealsVi : day.mealsEn || day.mealsVi).map((meal, mIdx) => (
                          <span key={mIdx} className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 text-stone-700 font-medium">
                            {meal}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Packing Checklist & Cultural Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-stone-200">
            
            {/* Interactive Packing Checklist */}
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span>{isVi ? 'Danh sách đồ dùng cần mang (Checklist)' : 'Packing Checklist'}</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {Object.values(packedItems).filter(Boolean).length} / {(isVi ? plan.packingChecklistVi : plan.packingChecklistEn).length} {isVi ? 'đã chuẩn bị' : 'packed'}
                </span>
              </div>

              <div className="space-y-2">
                {(isVi ? plan.packingChecklistVi : plan.packingChecklistEn).map((item, idx) => {
                  const isChecked = Boolean(packedItems[idx]);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => togglePacked(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs flex items-start gap-3 transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium line-through opacity-80' 
                          : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="flex-1">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cultural Etiquette & Recommended Souvenirs */}
            <div className="space-y-6">
              {/* Cultural Notes */}
              <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>{isVi ? 'Lưu ý ứng xử văn hóa & bảo tồn' : 'Cultural Etiquette'}</span>
                </div>

                <div className="space-y-2">
                  {(isVi ? plan.culturalNotesVi : plan.culturalNotesEn).map((note, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-stone-200/80 text-xs text-stone-700 leading-relaxed flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-600 flex-shrink-0 mt-1.5" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Souvenirs */}
              {plan.recommendedSouvenirsVi && (
                <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-700" />
                    <span>{isVi ? 'Gợi ý quà lưu niệm & đặc sản làng nghề' : 'Recommended Souvenirs'}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(isVi ? plan.recommendedSouvenirsVi : plan.recommendedSouvenirsEn || plan.recommendedSouvenirsVi).map((souvenir, sIdx) => (
                      <span key={sIdx} className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-stone-800 text-xs font-semibold shadow-2xs">
                        🎁 {souvenir}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
