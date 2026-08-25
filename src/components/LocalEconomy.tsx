import React, { useState } from 'react';
import { Store, MapPin, Phone, ExternalLink, Heart, Users, CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { ArtisanProfile, Language } from '../types';

interface LocalEconomyProps {
  artisans: ArtisanProfile[];
  language: Language;
  onArtisanSupported: (artisanId: string) => void;
}

export const LocalEconomy: React.FC<LocalEconomyProps> = ({
  artisans,
  language,
  onArtisanSupported,
}) => {
  const [supportedMap, setSupportedMap] = useState<Record<string, number>>({});
  const [selectedProductModal, setSelectedProductModal] = useState<{
    artisanName: string;
    product: ArtisanProfile['sampleProducts'][0];
  } | null>(null);

  const handleSupportArtisan = (artisan: ArtisanProfile) => {
    setSupportedMap(prev => ({
      ...prev,
      [artisan.id]: (prev[artisan.id] || artisan.footfallCount) + 1,
    }));
    onArtisanSupported(artisan.id);

    fetch('/api/metrics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'artisan_support',
        details: `Direct inquiry for master artisan ${artisan.name} (${artisan.villageVi})`,
      }),
    }).catch(console.error);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-14">
      
      {/* Top Banner: Local Economy Mission */}
      <div className="rounded-3xl bg-stone-900 border border-amber-900/40 p-6 sm:p-8 text-stone-100 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase">
          <Store className="w-3.5 h-3.5" />
          {language === 'vi' ? 'Kết Nối Kinh Tế Di Sản Hai Chiều' : 'Two-Sided Heritage Economy'}
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-amber-50">
          {language === 'vi' ? 'Đồng Hành Cùng Nghệ Nhân & Làng Nghề Cổ' : 'Empower Master Artisans & Craft Co-ops'}
        </h1>
        <p className="text-stone-300 text-sm max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'HeritageVibe biến tình yêu văn hóa thành sự hỗ trợ kinh tế thực tế cho các làng nghề truyền thống. Bạn có thể kết nối trực tiếp với nghệ nhân ưu tú, đặt lịch trải nghiệm hoặc sở hữu các tác phẩm thủ công tinh xảo.'
            : 'Connecting cultural engagement to direct economic impact for traditional craft villages. Book master workshops or acquire authentic handcrafted treasures directly.'}
        </p>
      </div>

      {/* Artisans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {artisans.map((artisan) => {
          const currentFootfall = supportedMap[artisan.id] || artisan.footfallCount;

          return (
            <div
              key={artisan.id}
              id={`artisan-card-${artisan.id}`}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image & Master Badge */}
                <div className="relative h-52 overflow-hidden bg-stone-900">
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-stone-900/90 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs border border-amber-500/40 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'vi' ? 'Nghệ nhân Thẩm định' : 'Verified Master Artisan'}</span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-stone-900/90 text-amber-100 text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-xs border border-stone-700/60">
                    {artisan.experienceYears} {language === 'vi' ? 'năm tuổi nghề' : 'years of mastery'}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{language === 'vi' ? `${artisan.villageVi}, ${artisan.provinceVi}` : `${artisan.villageEn}, ${artisan.provinceEn}`}</span>
                    </div>
                    <h3 className="text-lg font-bold font-heritage text-stone-900 mt-1">
                      {artisan.name}
                    </h3>
                    <div className="text-xs font-medium text-stone-500">
                      {language === 'vi' ? artisan.craftTypeVi : artisan.craftTypeEn}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {language === 'vi' ? artisan.storyVi : artisan.storyEn}
                  </p>

                  {/* Sample Products */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
                      <span>{language === 'vi' ? 'Tác phẩm Tiêu biểu' : 'Signature Masterpieces'}</span>
                    </div>

                    <div className="space-y-1.5">
                      {artisan.sampleProducts.map((prod, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => setSelectedProductModal({ artisanName: artisan.name, product: prod })}
                          className="p-2 rounded-xl bg-stone-50 hover:bg-amber-50/80 border border-stone-200/80 flex items-center justify-between text-xs cursor-pointer transition-colors"
                        >
                          <span className="font-medium text-stone-800 truncate">
                            {language === 'vi' ? prod.nameVi : prod.nameEn}
                          </span>
                          <span className="font-bold text-amber-900 whitespace-nowrap ml-2">
                            {prod.priceVnd.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Footfall & Support Actions */}
              <div className="p-6 pt-0 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>Lượt quan tâm: <strong className="text-stone-800">{currentFootfall}</strong></span>
                  </div>
                  <a
                    href={artisan.socialOrShopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <button
                  onClick={() => handleSupportArtisan(artisan)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
                  <span>{language === 'vi' ? 'Kết nối & Đặt lịch Thăm Xưởng' : 'Connect with Master Artisan'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-amber-800 uppercase">
                {selectedProductModal.artisanName}
              </span>
              <button
                onClick={() => setSelectedProductModal(null)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-bold font-heritage text-stone-900">
              {language === 'vi' ? selectedProductModal.product.nameVi : selectedProductModal.product.nameEn}
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed">
              {selectedProductModal.product.descriptionVi}
            </p>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
              <span className="text-xs font-medium text-amber-900">Giá niêm yết xưởng:</span>
              <span className="text-base font-bold text-amber-950">
                {selectedProductModal.product.priceVnd.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedProductModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  alert(language === 'vi' ? 'Đã lưu yêu cầu kết nối! Xưởng thủ công sẽ liên hệ qua điện thoại.' : 'Inquiry registered! Studio will contact you soon.');
                  setSelectedProductModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-stone-950 text-xs font-bold shadow-xs"
              >
                Đặt trước tác phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
