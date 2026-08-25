import { HeritageItem, QuizQuestion, CollectibleBadge, ArtisanProfile, ArArtifact } from '../types';
import { HERITAGE_MEDIA_MAP } from './heritageMedia';

export const AR_ARTIFACTS: ArArtifact[] = [
  {
    id: 'trong-dong',
    heritageId: 'quan-ho-bac-ninh',
    nameVi: 'Trống Đồng Ngọc Lũ I (Đông Sơn)',
    nameEn: 'Dong Son Bronze Drum (Ngoc Lu I)',
    subtitleVi: 'Bảo vật Quốc gia số 01 • Thời kỳ Văn hóa Đông Sơn (Thế kỷ 2 - 3 TCN)',
    subtitleEn: 'National Treasure No. 01 • Dong Son Culture (2nd - 3rd Century BC)',
    eraVi: 'Văn hóa Đông Sơn (khoảng 2.500 năm trước)',
    eraEn: 'Dong Son Culture (~2,500 years ago)',
    materialVi: 'Đồng thau nguyên khối đúc khuôn sáp thất truyền',
    materialEn: 'Solid cast bronze with lost-wax technique',
    descriptionVi: 'Đỉnh cao của nghệ thuật luyện kim và đúc đồng cổ đại Việt Nam. Mặt trống khắc ngôi sao 14 cánh biểu trưng thần Mặt Trời, xung quanh là các vành chim Lạc bay, cảnh giã gạo, múa vũ trang và nhà sàn mái cong.',
    descriptionEn: 'The pinnacle of ancient Vietnamese metallurgy. The tympanum features a 14-point solar star encircled by flying Lac birds, ceremonial warriors, and stilt houses.',
    icon: 'Sun',
    hotspots: [
      {
        id: 'hs-sun',
        position: [0, 1.25, 0],
        titleVi: 'Ngôi sao 14 cánh (Thần Mặt Trời)',
        titleEn: '14-Point Sun Star',
        descVi: 'Tâm điểm của vũ trụ quan cư dân nông nghiệp lúa nước, tượng trưng cho nguồn ánh sáng và sự sinh sôi.',
        descEn: 'Cosmological center symbolizing the sun and agricultural prosperity.'
      },
      {
        id: 'hs-birds',
        position: [0.7, 1.25, 0.4],
        titleVi: 'Đoàn chim Lạc bay ngược chiều kim đồng hồ',
        titleEn: 'Flock of Flying Lac Birds',
        descVi: 'Biểu tượng linh vật bất diệt của người Việt cổ, chuyển động vĩnh cửu của thời gian và mùa màng.',
        descEn: 'Sacred totem of ancient Viet people moving in eternal cosmic rhythm.'
      },
      {
        id: 'hs-warriors',
        position: [-0.65, 0.4, 0.8],
        titleVi: 'Vành đai Vũ sĩ hóa trang & Nhà sàn',
        titleEn: 'Ceremonial Dancers & Stilt Houses',
        descVi: 'Các chiến binh cầm rìu chiến, giáo mác nhảy múa trong lễ hội cầu mùa hoặc khải hoàn chiến thắng.',
        descEn: 'Warriors in feathered headdresses dancing in seasonal rituals and victory celebrations.'
      }
    ]
  },
  {
    id: 'binh-gom',
    heritageId: 'gom-su-bat-trang',
    nameVi: 'Bình Gốm Men Rạn Cổ Bát Tràng',
    nameEn: 'Bat Trang Antique Crackle Ceramic Vase',
    subtitleVi: 'Tuyệt kỹ men rạn Tam thái • Triều Lê - Mạc (Thế kỷ 16 - 17)',
    subtitleEn: 'Crackle Glaze Masterpiece • Le - Mac Dynasties (16th - 17th Century)',
    eraVi: 'Thế kỷ 16 - 17 (Thời Hậu Lê)',
    eraEn: '16th - 17th Century (Later Le Dynasty)',
    materialVi: 'Đất sét trắng sông Hồng & Men tro tự nhiên nung lò bầu 1.280°C',
    materialEn: 'Red River kaolin clay & natural ash glaze wood-fired at 1,280°C',
    descriptionVi: 'Men rạn là sáng tạo độc quyền của nghệ nhân Bát Tràng, tạo nên các đường rạn hình mai rùa hoặc tam giác tinh xảo như bức tranh thủy mặc đắp nổi hoa sen và rồng phượng.',
    descriptionEn: 'Crackle glaze is an exclusive invention of Bat Trang masters, creating delicate tortoise-shell cracks overlaid with lotus reliefs.',
    icon: 'Sparkles',
    hotspots: [
      {
        id: 'hs-crackle',
        position: [0, 0.6, 0.65],
        titleVi: 'Mạng vân men rạn hình rùa cổ',
        titleEn: 'Crackle Glaze Pattern',
        descVi: 'Kỹ thuật nung điều chỉnh độ co ngót giữa cốt đất và men, tạo mạng rạn độc bản không trùng lặp.',
        descEn: 'Precision temperature differential creating unique organic crackle matrices.'
      },
      {
        id: 'hs-lotus',
        position: [0, 0, 0.72],
        titleVi: 'Phù điêu Hoa Sen đắp nổi',
        titleEn: 'Lotus Relief Ornament',
        descVi: 'Đắp nổi thủ công bằng ngón tay nghệ nhân, tráng men lam cô-ban cổ truyền.',
        descEn: 'Hand-sculpted lotus relief brushed with historic cobalt blue slip.'
      }
    ]
  },
  {
    id: 'den-long',
    heritageId: 'pho-co-hoi-an',
    nameVi: 'Đèn Lồng Lụa Phố Cổ Hội An',
    nameEn: 'Hoi An Ancient Town Silk Lantern',
    subtitleVi: 'Biểu tượng Ánh sáng Phố Hội • Di sản Văn hóa Thế giới UNESCO',
    subtitleEn: 'Symbol of Light of Hoi An • UNESCO World Cultural Heritage',
    eraVi: 'Thế kỷ 16 đến nay',
    eraEn: '16th Century to Present',
    materialVi: 'Khung tre già ngâm nước biển 10 ngày & Lụa tơ tằm Vạn Phúc/Bảo Lộc',
    materialEn: 'Aged saltwater-treated bamboo frame & 100% natural mulberry silk',
    descriptionVi: 'Đèn lồng Hội An mang vẻ đẹp lung linh huyền ảo với các hình dáng củ tỏi, quả trám, đĩa bay và quả đu đủ. Ánh sáng vàng dịu xuyên qua làn lụa ngũ sắc biểu trưng cho sự ấm êm, may mắn và tài lộc.',
    descriptionEn: 'Hoi An lanterns cast a mystical warm glow through natural silk dyed in auspicious crimson, amber, and jade tones.',
    icon: 'Flame',
    hotspots: [
      {
        id: 'hs-silk',
        position: [0, 0.2, 0.6],
        titleVi: 'Lụa tơ tằm dệt tay',
        titleEn: 'Handwoven Mulberry Silk',
        descVi: 'Lụa mềm được căng thủ công tỉ mỉ trên từng nan tre, tạo độ tán xạ ánh sáng dịu mắt.',
        descEn: 'Natural silk stretched over curved ribs to diffuse soft warm illumination.'
      },
      {
        id: 'hs-tassel',
        position: [0, -0.9, 0],
        titleVi: 'Tua rua chỉ ngũ sắc',
        titleEn: 'Silk Thread Tassels',
        descVi: 'Tua rua buông mềm rủ xuống, đung đưa theo gió sông Hoài báo hiệu bình an, hanh thông.',
        descEn: 'Flowing colorful tassels swaying gracefully in the river breeze.'
      }
    ]
  },
  {
    id: 'kim-bao',
    heritageId: 'nha-nhac-cung-dinh-hue',
    nameVi: 'Kim Bảo Hoàng Đế Chi Bảo (Ấn Vàng Triều Nguyễn)',
    nameEn: 'Imperial Gold Seal "Hoang De Chi Bao"',
    subtitleVi: 'Bảo vật Quốc gia • Đúc năm Minh Mạng thứ 4 (1823)',
    subtitleEn: 'National Treasure • Cast in 4th Year of Minh Mang (1823)',
    eraVi: 'Triều Nguyễn (Năm 1823)',
    eraEn: 'Nguyen Dynasty (1823)',
    materialVi: 'Vàng ròng nguyên khối đúc hình rồng cuộn 10.78 kg',
    materialEn: 'Solid pure gold dragon sculpture weighing 10.78 kg',
    descriptionVi: 'Chiếc ấn vàng truyền quốc tối thượng của triều Nguyễn, biểu tượng cho quyền lực vương triều và tính chính thống lịch sử quốc gia, chạm khắc hình rồng 5 móng uốn lượn uy dũng.',
    descriptionEn: 'The supreme royal gold seal of the Nguyen Dynasty symbolizing dynastic sovereignty, featuring a 5-clawed imperial dragon.',
    icon: 'Crown',
    hotspots: [
      {
        id: 'hs-dragon',
        position: [0, 0.65, 0],
        titleVi: 'Rồng cuộn 5 móng (Ngũ trảo)',
        titleEn: '5-Clawed Imperial Dragon Handle',
        descVi: 'Tư thế rồng đầu ngẩng cao, mắt nhìn thẳng, râu bờm uy dũng biểu thị uy quyền thiên tử tối thượng.',
        descEn: 'Dragon head poised high with sovereign majesty and intricate scales.'
      },
      {
        id: 'hs-seal-base',
        position: [0, -0.3, 0.6],
        titleVi: 'Đế ấn vuông khắc 4 chữ triện',
        titleEn: 'Square Seal Face with Seal Script',
        descVi: 'Khắc nổi 4 chữ Hán "Hoàng Đế Chi Bảo" với nét chữ triện uyển chuyển, dứt khoát.',
        descEn: 'Inscribed with four monumental seal characters "Emperor’s Treasure".'
      }
    ]
  },
  {
    id: 'dan-kim',
    heritageId: 'don-ca-tai-tu-nam-bo',
    nameVi: 'Đàn Kìm Dạ Cổ Phương Nam (Đàn Nguyệt)',
    nameEn: 'Moon Lute of Southern Don Ca Tai Tu',
    subtitleVi: 'Quân tử cầm • Nhạc cụ chủ âm Đờn ca Tài tử UNESCO',
    subtitleEn: 'Noble Lute • Master Lead Instrument of Southern Don Ca Tai Tu',
    eraVi: 'Thế kỷ 19 đến nay',
    eraEn: '19th Century to Present',
    materialVi: 'Gỗ trắc/cẩm lai quý, mặt gỗ ngô đồng, phím đàn cao bằng tre già',
    materialEn: 'Precious rosewood body, wutong soundboard, and raised bamboo frets',
    descriptionVi: 'Cây đàn tròn như mặt trăng rằm, giữ linh hồn trong 20 bài bản tổ Đờn ca tài tử. Với hệ thống phím bấm cao độc đáo, nghệ nhân có thể nhấn nhá, vuốt luyến tạo âm hưởng nỉ non, sâu lắng.',
    descriptionEn: 'With its round soundbox and unusually tall frets, the Dan Kim allows microtonal pitch-bending that defines the soul of southern folk melodies.',
    icon: 'Music',
    hotspots: [
      {
        id: 'hs-frets',
        position: [0, 0.4, 0.1],
        titleVi: 'Phím đàn cao đặc trưng',
        titleEn: 'Raised High Frets',
        descVi: 'Khoảng cách phím cao cho phép ngón tay nhấn sâu tạo độ rung luyến đặc trưng của điệu Oán Nam Bộ.',
        descEn: 'Deep-set frets allowing expressive string bending and melancholic ornaments.'
      },
      {
        id: 'hs-soundbox',
        position: [0, -0.4, 0.15],
        titleVi: 'Mặt thùng đàn gỗ Ngô Đồng',
        titleEn: 'Wutong Resonance Board',
        descVi: 'Gỗ nhẹ và xốp tạo âm sắc vang ấm, mộc mạc như tiếng lòng của người phương Nam.',
        descEn: 'Light porous wood producing warm, mellow resonance across river waterways.'
      }
    ]
  },
  {
    id: 'non-la',
    heritageId: 'quan-the-di-tich-hue',
    nameVi: 'Nón Lá Bài Thơ Xứ Huế',
    nameEn: 'Hue Poem Conical Hat (Non La Bai Tho)',
    subtitleVi: 'Nghệ thuật chằm nón lá cổ truyền • Biểu tượng duyên dáng Việt Nam',
    subtitleEn: 'Traditional Conical Hat Craft • Symbol of Vietnamese Grace',
    eraVi: 'Thế kỷ 17 đến nay',
    eraEn: '17th Century to Present',
    materialVi: 'Lá cọ non phơi sương, 16 vành tre chuốt mịn & bài thơ ẩn bóng',
    materialEn: 'Sun-dried young palm leaves, 16 delicate bamboo ribs & hidden poems',
    descriptionVi: 'Chiếc nón bài thơ trứ danh làng nón Dạ Lê và Tây Hồ. Khi soi lên ánh nắng mặt trời, các câu thơ chữ Hán hoặc phong cảnh chùa Thiên Mụ, cầu Tràng Tiền sẽ hiện lên lung linh giữa hai lớp lá.',
    descriptionEn: 'The poetic conical hat reveals hidden verse and landscape silhouettes of Hue when held up against gentle sunlight.',
    icon: 'Sun',
    hotspots: [
      {
        id: 'hs-rims',
        position: [0, -0.2, 0.6],
        titleVi: '16 vành tre chuốt tròn',
        titleEn: '16 Slender Bamboo Ribs',
        descVi: 'Con số 16 tượng trưng cho tuổi trăng tròn thuần khiết của người con gái xứ kinh kỳ.',
        descEn: '16 ribs symbolizing youthful grace and architectural perfection.'
      },
      {
        id: 'hs-poem',
        position: [0, 0.2, 0.35],
        titleVi: 'Câu thơ và họa tiết giấu giữa lớp lá',
        titleEn: 'Shadow Poem & River Landscape',
        descVi: 'Kỹ thuật chèn hoa văn bài thơ mỏng giữa 2 lớp lá cọ để tỏa sáng khi gặp ánh nắng.',
        descEn: 'Hidden verses illuminated when held toward the sky.'
      }
    ]
  },
  {
    id: 'dan-bau',
    heritageId: 'ca-tru-thang-long',
    nameVi: 'Đàn Bầu Việt Nam (Độc Huyền Cầm)',
    nameEn: 'Vietnamese Monochord (Dan Bau)',
    subtitleVi: 'Bảo vật âm nhạc dân tộc • Nhạc cụ độc nhất vô nhị trên thế giới',
    subtitleEn: 'National Musical Treasure • Unique Single-String Instrument',
    eraVi: 'Từ thời Lý - Trần (Thế kỷ 11 - 13)',
    eraEn: 'Ly - Tran Dynasties (11th - 13th Century)',
    materialVi: 'Thân gỗ ngô đồng, cần đàn bằng sừng trâu dẻo, quả bầu khô mạ vàng',
    materialEn: 'Wutong resonance body, flexible buffalo horn lever, dried gourd amplifier',
    descriptionVi: '"Đàn bầu ai gảy nấy nghe, làm thân con gái chớ nghe đàn bầu" - Nhạc cụ chỉ có một dây nhưng nhờ que gảy và cần rung uốn lượn có thể phát ra toàn bộ các nốt bồi âm thanh thoát như tiếng người trò chuyện.',
    descriptionEn: 'With only one single string and a flexible horn whammy lever, Dan Bau produces haunting harmonic glissandos that closely mirror the inflections of human voice.',
    icon: 'Music',
    hotspots: [
      {
        id: 'hs-horn-lever',
        position: [0.65, 0.5, 0],
        titleVi: 'Cần đàn sừng trâu uốn dẻo',
        titleEn: 'Buffalo Horn Whammy Lever',
        descVi: 'Tay trái người chơi kéo cần đàn để biến thiên cao độ mềm mại theo làn điệu dân ca.',
        descEn: 'Left-hand pitch modulation lever creating ethereal glissandos.'
      },
      {
        id: 'hs-gourd',
        position: [0.6, 0.15, 0],
        titleVi: 'Quả bầu khuyếch âm',
        titleEn: 'Acoustic Gourd Amplifier',
        descVi: 'Bầu khô truyền thống bọc cần đàn giúp giữ độ ngân vang thanh mảnh đặc sắc.',
        descEn: 'Natural gourd resonator anchoring the singing string.'
      }
    ]
  },
  {
    id: 'khue-van-cac',
    heritageId: 'hoang-thanh-thang-long',
    nameVi: 'Khuê Văn Các (Văn Miếu Thăng Long)',
    nameEn: 'Khue Van Cac Pavilion (Temple of Literature)',
    subtitleVi: 'Biểu tượng Thủ đô Hà Nội • Tinh hoa Đạo học nghìn năm',
    subtitleEn: 'Official Emblem of Hanoi • Thousand-Year Academic Heritage',
    eraVi: 'Xây dựng năm Gia Long thứ 4 (1805)',
    eraEn: 'Nguyen Dynasty (1805)',
    materialVi: 'Gỗ lim cổ truyền, ngói mũi hài đất nung, sơn son thếp vàng',
    materialEn: 'Precious ironwood framing, terracotta fish-scale tiles, vermilion lacquer',
    descriptionVi: 'Lầu vuông 2 tầng 8 mái mang hình tượng sao Khuê - ngôi sao chủ quản văn học và học vấn sáng soi nền văn hiến Đại Việt, bốn mặt có cửa sổ tròn tỏa ra các tia sáng chiếu rọi hồ Thiền Quang.',
    descriptionEn: 'The iconic pavilion with circular sunburst windows representing the Literary Star illuminating the sacred well of wisdom.',
    icon: 'BookOpen',
    hotspots: [
      {
        id: 'hs-sunburst-window',
        position: [0, 0.45, 0.55],
        titleVi: 'Cửa sổ tròn sao Khuê tỏa tia',
        titleEn: 'Circular Star Windows',
        descVi: 'Tượng trưng cho sao Khuê chiếu sáng muôn phương, giao hòa trời tròn đất vuông.',
        descEn: 'Sunburst wooden frames channeling cosmic academic enlightenment.'
      },
      {
        id: 'hs-tier-roof',
        position: [0, 0.95, 0],
        titleVi: 'Hệ mái chồng diêm 8 mái cổ kính',
        titleEn: 'Double-Tier Eight Roofs',
        descVi: 'Góc mái uốn cong thanh thoát lợp ngói âm dương biểu trưng cho sự uy nghiêm.',
        descEn: 'Curved eaves with traditional fish-scale earthenware tiles.'
      }
    ]
  },
  {
    id: 'thuyen-rong',
    heritageId: 'nha-nhac-cung-dinh-hue',
    nameVi: 'Thuyền Rồng Cung Đình Huế (Long Châu)',
    nameEn: 'Imperial Dragon Boat of Hue',
    subtitleVi: 'Ngự thuyền sông Hương • Không gian diễn xướng Nhã nhạc hoàng gia',
    subtitleEn: 'Royal Barge on Perfume River • Floating Court Music Stage',
    eraVi: 'Triều Nguyễn (Thế kỷ 19)',
    eraEn: 'Nguyen Dynasty (19th Century)',
    materialVi: 'Gỗ kiền kiền chạm trổ sơn son thếp vàng, rèm gấm hoàng cung',
    materialEn: 'Carved gilded hardwood, imperial golden damask curtains',
    descriptionVi: 'Chiếc thuyền rồng uy nghi lướt trên làn nước biếc sông Hương, nơi các bậc đế vương triều Nguyễn cùng văn thần thưởng ngoạn phong cảnh cố đô và lắng nghe những khúc Ca Huế thâu đêm.',
    descriptionEn: 'Magnificent gilded dragon barge carrying emperors along the Perfume River accompanied by nocturnal court melodies.',
    icon: 'Crown',
    hotspots: [
      {
        id: 'hs-dragon-prow',
        position: [0.95, 0.35, 0],
        titleVi: 'Đầu rồng sơn son thếp vàng',
        titleEn: 'Gilded Dragon Prow',
        descVi: 'Chạm khắc đầu rồng vươn mình ra ngọn sóng với đôi mắt sáng quắc uy nghiêm.',
        descEn: 'Carved mythical dragon head facing the waves with regal power.'
      },
      {
        id: 'hs-royal-cabin',
        position: [0, 0.25, 0],
        titleVi: 'Khoang ngự lợp ngói lưu ly vàng',
        titleEn: 'Imperial Enclosed Pavilion',
        descVi: 'Nơi bày biện tiệc trà, bàn cờ và dàn nhạc Cung đình phục vụ hoàng tộc.',
        descEn: 'Ornate cabin hosting royal ceremonies and chamber musicians.'
      }
    ]
  },
  {
    id: 'tuong-cham',
    heritageId: 'thanh-dia-my-son',
    nameVi: 'Tượng Vũ Nữ Apsara Chăm Pa Trà Kiệu',
    nameEn: 'Apsara Dancing Maiden of My Son (Tra Kieu)',
    subtitleVi: 'Bảo vật Quốc gia • Đỉnh cao điêu khắc đá sa thạch Champa (Thế kỷ 10)',
    subtitleEn: 'National Treasure • Masterpiece of Champa Sandstone Sculpture',
    eraVi: 'Vương quốc Champa (Thế kỷ 10)',
    eraEn: 'Champa Kingdom (10th Century)',
    materialVi: 'Sa thạch xám mịn nguyên khối gọt đẽo thủ công',
    materialEn: 'Solid fine-grained sandstone hand-carved with dynamic relief',
    descriptionVi: 'Vẻ đẹp huyền thoại của các tiên nữ Apsara múa hát dâng thần linh Shiva trên đài tháp Mỹ Sơn. Nụ cười Chăm Pa bí ẩn, đường cong uyển chuyển và chuỗi trang sức ngọc trai chạm trổ sống động.',
    descriptionEn: 'The celestial Apsara maiden performing sacred dances for Lord Shiva, known for her enigmatic smile and graceful posture carved in sandstone.',
    icon: 'Sparkles',
    hotspots: [
      {
        id: 'hs-apsara-pose',
        position: [0, 0.3, 0.3],
        titleVi: 'Dáng múa Tribhanga uốn 3 khúc',
        titleEn: 'Tribhanga Dance Posture',
        descVi: 'Điệu múa cổ điển Ấn Độ hóa với nét mềm mại, thánh thiện và tràn đầy sức sống.',
        descEn: 'Sensuous tri-bend posture symbolizing divine cosmic rhythm.'
      },
      {
        id: 'hs-champa-jewelry',
        position: [0, 0.65, 0.25],
        titleVi: 'Vương miện & Hoa tai chạm ngọc',
        titleEn: 'Royal Crown & Sandstone Jewelry',
        descVi: 'Chi tiết trang sức hoa sen và chuỗi hạt thể hiện tài hoa điêu khắc Chăm Pa cổ.',
        descEn: 'Intricate lotus crowns and bead necklaces sculpted with profound mastery.'
      }
    ]
  }
];

export const INITIAL_HERITAGE_ITEMS: HeritageItem[] = [
  // 1. Quan ho Bac Ninh
  {
    id: 'quan-ho-bac-ninh',
    titleVi: 'Dân ca Quan họ Bắc Ninh',
    titleEn: 'Bac Ninh Quan Ho Folk Songs',
    category: 'music-theater',
    region: 'north',
    province: 'Bắc Ninh & Bắc Giang',
    unescoYear: 2009,
    summaryVi: 'Di sản văn hóa phi vật thể đại diện của nhân loại với lối hát giao duyên đối đáp tao nhã, lề lối nghiêm ngặt giữa liền anh và liền chị vùng Kinh Bắc.',
    summaryEn: 'UNESCO Representative List of Intangible Cultural Heritage: refined antiphonal singing tradition between male and female troupes in the Kinh Bac region.',
    groundedFacts: [
      'Quan họ là hình thức hát đối đáp giữa "liền anh" và "liền chị" theo các lề lối nghiêm ngặt (hát giọng lề lối, giọng vặt, giọng giã bạn).',
      'Được UNESCO ghi danh vào Danh sách Di sản văn hóa phi vật thể đại diện của nhân loại ngày 30/9/2009.',
      'Trang phục Quan họ đặc trưng: Liền anh mặc áo the, khăn xếp, cầm quạt; Liền chị mặc áo tứ thân mớ ba mớ bảy, nón quai thao che nghiêng.',
      'Tục "kết chạ" và "ngủ bọn": Các làng quan họ kết nghĩa không được lấy nhau, giữ tình bạn nghệ thuật thanh cao trọn đời.'
    ],
    sources: [
      { id: 'src-qh-1', name: 'Hồ sơ Di sản Quan họ', authority: 'UNESCO Intangible Heritage', verifiedYear: 2009, url: 'https://ich.unesco.org/en/RL/quan-ho-bac-ninh-folk-songs-00183' },
      { id: 'src-qh-2', name: 'Danh mục Di sản Văn hóa Phi vật thể Quốc gia', authority: 'Bộ Văn hóa, Thể thao và Du lịch', verifiedYear: 2012 }
    ],
    promptSeedVi: 'Kể câu chuyện về một buổi hát canh thâu đêm mùa xuân tại đình làng Diềm, khi liền anh trao câu hát "Người ơi người ở đừng về" lưu luyến chia tay liền chị.',
    promptSeedEn: 'Tell the poignant story of an overnight singing gathering in Diem village as singers exchange heartfelt farewell verses.',
    heroImage: 'https://static.idctravel.com/wp-content/uploads/q/22/Quan-Ho-Bac-Ninh.jpg',
    tags: ['Dân ca', 'UNESCO', 'Kinh Bắc', 'Áo tứ thân', 'Nón quai thao'],
    artisanVillage: 'Làng Viêm Xá (Làng Diềm), TP. Bắc Ninh',
    coordinates: { lat: 21.1861, lng: 106.0763 },
    arArtifactId: 'trong-dong'
  },
  // 2. Nha nhac Hue
  {
    id: 'nha-nhac-cung-dinh-hue',
    titleVi: 'Nhã nhạc Cung đình Huế',
    titleEn: 'Hue Royal Court Music',
    category: 'music-theater',
    region: 'central',
    province: 'Thừa Thiên Huế',
    unescoYear: 2003,
    summaryVi: 'Âm nhạc cung đình bác học của triều Nguyễn, đỉnh cao của nghệ thuật biểu diễn phục vụ các nghi lễ tế giao, đại triều và yến tiệc hoàng cung.',
    summaryEn: 'First Vietnamese UNESCO Masterpiece of the Oral and Intangible Heritage (2003), representing supreme dynastic ceremonial music.',
    groundedFacts: [
      'Được UNESCO công nhận là Kiệt tác Di sản truyền khẩu và phi vật thể của nhân loại năm 2003 (năm 2008 chuyển sang Danh sách Đại diện).',
      'Đạt đến đỉnh cao hoàn thiện dưới triều Nguyễn (1802-1945), quy định rõ các dàn nhạc như Đại nhạc (trống, kèn, chũm chọe) và Tiểu nhạc (đàn nhị, tỳ bà, tam, nguyệt, tiêu, phách).',
      'Gắn liền với hơn 100 bản nhạc cổ và các điệu múa cung đình trứ danh như "Lục cúng hoa đăng", "Tứ linh", "Bát dật".'
    ],
    sources: [
      { id: 'src-nn-1', name: 'Nha Nhac, Vietnamese Court Music', authority: 'UNESCO', verifiedYear: 2003, url: 'https://ich.unesco.org/en/RL/nha-nhac-vietnamese-court-music-00074' },
      { id: 'src-nn-2', name: 'Trung tâm Bảo tồn Di tích Cố đô Huế', authority: 'UBND Thừa Thiên Huế', verifiedYear: 2021 }
    ],
    promptSeedVi: 'Tái hiện không khí uy nghiêm và huyền ảo tại điện Thái Hòa trong đêm đại triều khi tiếng Đại nhạc và khúc "Đăng đàn cung" vang vọng dưới ánh đuốc hoàng thành.',
    promptSeedEn: 'Recreate the magnificent atmosphere in Thai Hoa Palace during a grand imperial audience filled with ancient court rhythms.',
    heroImage: 'https://th.bing.com/th/id/R.3e09f58525880411974543fffdbf00da?rik=miOMgLb9pFgkmg&riu=http%3a%2f%2fthegioidisan.vn%2fassets%2fmedia%2f2016%2fThang+4%2f1142016%2fnha-nhac1.jpg&ehk=OjusvGHhWNu3tZpYSCAw3Wy7NEHPa2zEtaC2WUWBgy0%3d&risl=&pid=ImgRaw&r=0',
    tags: ['Cung đình', 'Triều Nguyễn', 'Đại nhạc', 'Tiểu nhạc', 'Cố đô Huế'],
    artisanVillage: 'Phường Đúc & Nhà hát Nghệ thuật Truyền thống Cung đình Huế',
    coordinates: { lat: 16.4698, lng: 107.5796 },
    arArtifactId: 'thuyen-rong'
  },
  // 3. Don ca Tai tu Nam Bo
  {
    id: 'don-ca-tai-tu-nam-bo',
    titleVi: 'Đờn ca Tài tử Nam Bộ',
    titleEn: 'Don Ca Tai Tu Art of Southern Vietnam',
    category: 'music-theater',
    region: 'south',
    province: '21 tỉnh thành Nam Bộ',
    unescoYear: 2013,
    summaryVi: 'Dòng nghệ thuật âm nhạc thính phòng dân gian phản ánh tâm hồn phóng khoáng, nghĩa tình của người dân vùng đồng bằng sông Cửu Long.',
    summaryEn: 'UNESCO Intangible Heritage (2013): chamber music tradition reflecting the generous and resilient spirit of the Mekong Delta.',
    groundedFacts: [
      'Ghi danh UNESCO năm 2013, hình thành từ cuối thế kỷ 19 dựa trên sự kết hợp nhạc lễ cung đình Huế và dân ca Nam Bộ.',
      'Dàn nhạc ngũ tuyệt truyền thống gồm: Đàn kìm (nguyệt), đàn cò (nhị), đàn tranh, đàn bầu kết hợp guitar phím lõm (tân nhạc hóa dân tộc).',
      'Hệ thống 20 bài bản tổ gồm: 6 bài Bắc (vui tươi, trang nhã), 3 bài Nam (thư thả, thanh thản), 4 bài Oán (bi thương, u hoài) và 7 bài Lớn (nghi lễ).'
    ],
    sources: [
      { id: 'src-dc-1', name: 'Art of Đờn ca tài tử music and song in southern Viet Nam', authority: 'UNESCO', verifiedYear: 2013, url: 'https://ich.unesco.org/en/RL/art-of-dn-ca-tai-t-music-and-song-in-southern-viet-nam-00733' },
      { id: 'src-dc-2', name: 'Viện Âm nhạc Việt Nam', authority: 'Bộ VHTTDL', verifiedYear: 2015 }
    ],
    promptSeedVi: 'Kể về buổi đờn ca dưới bóng trăng vườn vú sữa Bến Tre, khi tiếng đờn kìm hòa nhịp bài "Dạ cổ hoài lang" làm xao xuyến lòng người viễn xứ.',
    promptSeedEn: 'Narrate an evening gathering under a moonlit orchard in the Mekong Delta as traditional instruments perform Da Co Hoai Lang.',
    heroImage: 'https://baodaklak.vn/file/fb9e3a03798789de0179a1704dea238e/old-data/dataimages/201402/original/images925326_Bieu_dien_nghe_thuat_don_ca_tai_tu.jpg',
    tags: ['Nam Bộ', 'Sông nước', 'Đàn kìm', 'Dạ cổ hoài lang', 'Tài tử'],
    artisanVillage: 'Câu lạc bộ Tài tử Bạc Liêu & Cần Thơ',
    coordinates: { lat: 9.2941, lng: 105.7278 },
    arArtifactId: 'dan-kim'
  },
  // 4. Gom Bat Trang
  {
    id: 'gom-su-bat-trang',
    titleVi: 'Nghề gốm cổ truyền Bát Tràng',
    titleEn: 'Bat Trang Traditional Ceramic Craft',
    category: 'craft',
    region: 'north',
    province: 'Hà Nội',
    nationalYear: 2019,
    summaryVi: 'Làng nghề gốm hơn 700 năm bên bờ sông Hồng với bí quyết men rạn, men ngọc tam thái và kỹ thuật chuốt gốm thủ công trứ danh.',
    summaryEn: 'Over 700-year-old historic pottery village on the Red River famous for crackle glazes and centuries of master craftsmanship.',
    groundedFacts: [
      'Hình thành từ thời nhà Lý khi vua Lý Thái Tổ dời đô về Thăng Long (1010), các thợ gốm làng Bồ Bát (Ninh Bình) di cư ra lập làng gốm Bát Tràng.',
      'Sở hữu 5 dòng men cổ độc đáo: Men tro (lam), Men nâu, Men trắng ngà, Men ngọc hoàng tộc, và Men rạn tam thái độc nhất vô nhị.',
      'Sản phẩm gốm Bát Tràng từng theo các thương thuyền quốc tế xuất khẩu sang Nhật Bản (dưới tên gốm Kochi), Đông Nam Á và châu Âu từ thế kỷ 16-17.'
    ],
    sources: [
      { id: 'src-bt-1', name: 'Di sản Văn hóa Phi vật thể Quốc gia Nghề gốm Bát Tràng', authority: 'Bộ Văn hóa, Thể thao và Du lịch', verifiedYear: 2019 },
      { id: 'src-bt-2', name: 'Bảo tàng Gốm Bát Tràng', authority: 'Hội Gốm sứ Bát Tràng', verifiedYear: 2022 }
    ],
    promptSeedVi: 'Kể hành trình người nghệ nhân già truyền ngọn lửa trong lò bầu nung củi suốt 3 ngày 3 đêm để tạo ra mẻ bình men rạn quý giá mừng Thăng Long ngàn năm.',
    promptSeedEn: 'Follow an elder artisan watching the firewood kiln day and night to craft crackle glaze porcelain.',
    heroImage: 'https://bizweb.dktcdn.net/100/349/716/files/lang-gom-bat-trang-1.jpg?v=1710495850287',
    tags: ['Làng nghề', 'Gốm sứ', 'Men rạn', 'Sông Hồng', 'Thăng Long'],
    artisanVillage: 'Xã Bát Tràng, Huyện Gia Lâm, Hà Nội',
    coordinates: { lat: 20.9782, lng: 105.9129 },
    arArtifactId: 'binh-gom'
  },
  // 5. Pho co Hoi An
  {
    id: 'pho-co-hoi-an',
    titleVi: 'Phố cổ Hội An',
    titleEn: 'Hoi An Ancient Town',
    category: 'tangible',
    region: 'central',
    province: 'Quảng Nam',
    unescoYear: 1999,
    summaryVi: 'Thương cảng quốc tế thế kỷ 16-17 bảo tồn nguyên vẹn hơn 1.000 kiến trúc cổ, giao thoa tinh hoa văn hóa Việt - Hoa - Nhật - phương Tây.',
    summaryEn: 'Exceptionally well-preserved Asian international trading port from the 15th-19th centuries recognized by UNESCO in 1999.',
    groundedFacts: [
      'Ghi danh Di sản Thế giới UNESCO năm 1999 theo 2 tiêu chí: Sự kết hợp xuất sắc giữa các nền văn hóa tại một thương cảng quốc tế và tính toàn vẹn của một quần thể đô thị truyền thống.',
      'Kiến trúc nhà ống truyền thống mái ngói âm dương, tường vàng quét vôi, giếng trời đón gió và khung gỗ mít chạm trổ tinh xảo.',
      'Chùa Cầu (Lai Viễn Kiều) xây dựng bởi các thương gia Nhật Bản vào đầu thế kỷ 17, biểu tượng gắn kết hòa bình bền vững.'
    ],
    sources: [
      { id: 'src-ha-1', name: 'Hoi An Ancient Town', authority: 'UNESCO World Heritage Centre', verifiedYear: 1999, url: 'https://whc.unesco.org/en/list/948' },
      { id: 'src-ha-2', name: 'Trung tâm Quản lý Bảo tồn Di sản Văn hóa Hội An', authority: 'UBND TP. Hội An', verifiedYear: 2023 }
    ],
    promptSeedVi: 'Đưa người đọc dạo bước qua con ngõ vàng óng Hội An vào đêm rằm khi cả phố cổ tắt đèn điện, chỉ còn ánh trăng rọi qua hàng ngàn chiếc đèn lồng lụa lung linh.',
    promptSeedEn: 'Take the reader through the glowing lantern-lit alleys of Hoi An on full-moon night as lanterns illuminate the Thu Bon river.',
    heroImage: 'https://th.bing.com/th/id/R.0900814156d815b701c1397e1d73defb?rik=VIOo2eWgcjhGPQ&riu=http%3a%2f%2fhoangthanhthanglong.com%2fstore%2fuploads%2f2022%2f11%2fz3898777505778_601b6ee921b324f3be17df72810ed757.jpg&ehk=MB46MGYm2rRNO6gtK3lRzeh%2fUfn9qz9xWSmLh4CQwDE%3d&risl=&pid=ImgRaw&r=0',
    tags: ['UNESCO', 'Chùa Cầu', 'Đèn lồng', 'Thương cảng cổ', 'Sông Thu Bồn'],
    artisanVillage: 'Làng lồng đèn Phố Hội & Làng gốm Thanh Hà',
    coordinates: { lat: 15.8801, lng: 108.338 },
    arArtifactId: 'den-long'
  },
  // 6. Trang An Ninh Binh
  {
    id: 'trang-an-ninh-binh',
    titleVi: 'Quần thể danh thắng Tràng An',
    titleEn: 'Trang An Landscape Complex',
    category: 'tangible',
    region: 'north',
    province: 'Ninh Bình',
    unescoYear: 2014,
    summaryVi: 'Di sản thế giới hỗn hợp (Văn hóa và Thiên nhiên) duy nhất tại Đông Nam Á, nơi lưu giữ dấu tích cổ nhân hơn 30.000 năm và cố đô Hoa Lư lịch sử.',
    summaryEn: 'Southeast Asia’s first and only UNESCO Dual World Heritage site (Cultural & Natural), preserving prehistoric human adaptations.',
    groundedFacts: [
      'Ghi danh Di sản hỗn hợp Văn hóa và Thiên nhiên Thế giới năm 2014.',
      'Hệ thống hang động karst đá vôi ngập nước ngoạn mục cùng các di chỉ khảo cổ học Hang Muối, Hang Trống chứng minh người tiền sử sinh sống cách đây 30.000 năm.',
      'Kinh đô Hoa Lư thế kỷ 10 của vua Đinh Tiên Hoàng và vua Lê Đại Hành với thành trì thiên nhiên hiểm trở.'
    ],
    sources: [
      { id: 'src-ta-1', name: 'Trang An Landscape Complex', authority: 'UNESCO', verifiedYear: 2014, url: 'https://whc.unesco.org/en/list/1438' },
      { id: 'src-ta-2', name: 'Sở Du lịch Ninh Bình', authority: 'UBND tỉnh Ninh Bình', verifiedYear: 2024 }
    ],
    promptSeedVi: 'Kể về chiếc thuyền nan chèo tay lướt nhẹ qua Hang Tối ngập nước, đưa ta về cố đô Hoa Lư nơi Đinh Bộ Lĩnh cắm cờ lau dựng nghiệp vương quyền.',
    promptSeedEn: 'Journey by wooden sampan through misty karst caves leading to the ancient historic citadel of Hoa Lu.',
    heroImage: 'https://images.vietnamtourism.gov.vn/vn/images/2019/CNMN/99ac-sac-Quan-the-danh-thang-Trang-An.jpg',
    tags: ['Di sản hỗn hợp', 'UNESCO', 'Hoa Lư', 'Karst', 'Sông Sào Khê'],
    artisanVillage: 'Làng thêu ren Văn Lâm & Làng đá mỹ nghệ Ninh Vân',
    coordinates: { lat: 20.2506, lng: 105.9048 },
    arArtifactId: 'trong-dong'
  },
  // 7. Cong Chieng Tay Nguyen
  {
    id: 'cong-chieng-tay-nguyen',
    titleVi: 'Không gian văn hóa Cồng Chiêng Tây Nguyên',
    titleEn: 'Space of Gong Culture in Central Highlands',
    category: 'intangible',
    region: 'central',
    province: 'Gia Lai, Kon Tum, Đắk Lắk, Đắk Nông, Lâm Đồng',
    unescoYear: 2005,
    summaryVi: 'Kiệt tác truyền khẩu và phi vật thể nhân loại gắn liền với đời sống tâm linh, nghi lễ cúng lúa mới, lễ hội đâm trâu và sử thi hùng tráng của đồng bào Tây Nguyên.',
    summaryEn: 'UNESCO Masterpiece (2005): ancient communal gong orchestra connecting humans with ancestral spirits across the high plateaus.',
    groundedFacts: [
      'Ghi danh UNESCO năm 2005, bao gồm không gian 5 tỉnh Tây Nguyên thuộc các tộc người Ba Na, Gia Rai, Ê Đê, Mơ Nông, Cơ Ho...',
      'Mỗi bộ cồng chiêng là ngôn ngữ tâm linh kết nối con người với thế giới thần linh (Yàng) và cội nguồn tổ tiên.',
      'Âm thanh cồng chiêng vang vọng giữa đại ngàn được ví như hơi thở của núi rừng bazan.'
    ],
    sources: [
      { id: 'src-cc-1', name: 'Space of gong culture', authority: 'UNESCO', verifiedYear: 2005, url: 'https://ich.unesco.org/en/RL/space-of-gong-culture-00120' },
      { id: 'src-cc-2', name: 'Sở VHTTDL Đắk Lắk', authority: 'UBND tỉnh Đắk Lắk', verifiedYear: 2023 }
    ],
    promptSeedVi: 'Tái hiện đêm hội lửa bập bùng bên nhà rông Tây Nguyên khi tiếng cồng chiêng rộn rã hòa cùng điệu múa xoang của các chàng trai cô gái Ba Na.',
    promptSeedEn: 'Recreate a vibrant bonfire night by the communal Rong house with resonating gong beats and traditional Xoang dances.',
    heroImage: 'https://hoidisanvanhoa.vn/wp-content/uploads/2025/05/401-gia_lai-kyoflash@gmail_le_hoi_cong_chieng.jpg',
    tags: ['UNESCO', 'Tây Nguyên', 'Nhà Rông', 'Cồng chiêng', 'Sử thi'],
    artisanVillage: 'Buôn Akô Dhông (Buôn Ma Thuột) & Làng Đê Ktu (Gia Lai)',
    coordinates: { lat: 13.9833, lng: 108.0 },
    arArtifactId: 'trong-dong'
  },
  // 8. Le Khao le The linh Hoang Sa
  {
    id: 'le-khao-le-the-linh-hoang-sa',
    titleVi: 'Lễ Khao lề Thế lính Hoàng Sa (Lý Sơn - Hoàng Sa)',
    titleEn: 'Commemoration & Tribute Ritual for the Hoang Sa Flotilla',
    category: 'intangible',
    region: 'islands',
    province: 'Đảo Lý Sơn (Quảng Ngãi) & Quần đảo Hoàng Sa - Trường Sa',
    nationalYear: 2013,
    summaryVi: 'Nghi lễ tâm linh thiêng liêng độc nhất vô nhị của cư dân đảo Lý Sơn, tri ân Đội hùng binh Hoàng Sa kiêm quản Bắc Hải thời các chúa Nguyễn và triều Nguyễn - chứng tích lịch sử khẳng định chủ quyền biển đảo bất khả xâm phạm.',
    summaryEn: 'Unique national intangible heritage commemorating the heroic Hoang Sa flotilla who sailed across rough seas to measure maritime routes and assert Vietnamese sovereignty over Paracel and Spratly since the 17th century.',
    groundedFacts: [
      'Ghi danh Di sản Văn hóa Phi vật thể Quốc gia năm 2013 theo Quyết định của Bộ Văn hóa, Thể thao và Du lịch.',
      'Khởi nguồn từ thế kỷ 17 dưới thời các chúa Nguyễn: Mỗi năm triều đình tuyển chọn 70 tráng đinh giỏi đi biển giong thuyền buồm ra quần đảo Hoàng Sa và Trường Sa thu lượm hải vật, đo vẽ thủy trình và cắm mốc chủ quyền.',
      'Nghi thức thả thuyền tế (thuyền câu mô hình chở hình nhân bằng bột gạo, gạo, muối, củi, nước ngọt) để thế mạng cho các tráng binh trước đầu sóng ngọn gió.',
      'Được ghi chép tỉ mỉ trong các sử liệu cổ chính thống: "Phủ biên tạp lục" (Lê Quý Đôn, 1776), "Đại Nam thực lục", "Khâm định Việt sử thông giám cương mục" và hệ thống Châu bản triều Nguyễn.'
    ],
    sources: [
      { id: 'src-hs-1', name: 'Lễ Khao lề thế lính Hoàng Sa', authority: 'Cục Di sản Văn hóa - Bộ VHTTDL', verifiedYear: 2013, url: 'http://disanvanhoa.gov.vn' },
      { id: 'src-hs-2', name: 'Đại Nam Thực Lục & Châu Bản Triều Nguyễn', authority: 'Quốc Sử Quán Triều Nguyễn / Trung tâm Lưu trữ Quốc gia I', verifiedYear: 2014 }
    ],
    promptSeedVi: 'Kể về buổi sáng tháng 2 âm lịch tại đình làng An Vĩnh (đảo Lý Sơn), khi tiếng ốc u vang vọng tiễn đoàn thuyền câu vượt sóng ra quần đảo Hoàng Sa cắm mốc cương vực quốc gia.',
    promptSeedEn: 'Recreate the sacred morning in An Vinh village on Ly Son island as conch shells echo to send off wooden boats embarking for the Paracel islands.',
    heroImage: 'https://photo.znews.vn/Uploaded/Sotntb/2019_04_20/Anh_11__gui_zing0095.jpg',
    tags: ['Chủ quyền Biển Đảo', 'Hoàng Sa', 'Trường Sa', 'Lý Sơn', 'Đại Nam Thực Lục'],
    artisanVillage: 'Đình làng An Vĩnh & Nhà trưng bày Hải đội Hoàng Sa kiêm quản Bắc Hải, Đảo Lý Sơn',
    coordinates: { lat: 15.3789, lng: 109.1245 },
    arArtifactId: 'kim-bao'
  },
  // 9. Vinh Ha Long & Cat Ba
  {
    id: 'vinh-ha-long',
    titleVi: 'Vịnh Hạ Long & Quần đảo Cát Bà',
    titleEn: 'Ha Long Bay & Cat Ba Archipelago',
    category: 'tangible',
    region: 'north',
    province: 'Quảng Ninh & Hải Phòng',
    unescoYear: 1994,
    summaryVi: 'Kỳ quan thiên nhiên thế giới nổi tiếng với hàng ngàn hòn đảo đá vôi karst kỳ vĩ trên làn nước ngọc bích của Vịnh Bắc Bộ và hệ sinh thái rừng biển nhiệt đới nguyên sơ.',
    summaryEn: 'World Natural Heritage site with thousands of towering limestone karsts rising from emerald waters in the Gulf of Tonkin.',
    groundedFacts: [
      'Ghi danh Di sản Thiên nhiên Thế giới UNESCO năm 1994 về giá trị cảnh quan thẩm mỹ và năm 2000 về giá trị địa chất - địa mạo karst.',
      'Năm 2023, UNESCO chính thức mở rộng ranh giới di sản sang Quần đảo Cát Bà (Hải Phòng), trở thành di sản thế giới liên tỉnh đầu tiên của Việt Nam.',
      'Gắn liền với truyền thuyết đàn Rồng mẹ và Rồng con hạ giới phun châu nhả ngọc tạo thành nghìn hòn đảo chặn giặc ngoại xâm bảo vệ non sông.'
    ],
    sources: [
      { id: 'src-hl-1', name: 'Ha Long Bay - Cat Ba Archipelago', authority: 'UNESCO World Heritage Centre', verifiedYear: 2023, url: 'https://whc.unesco.org/en/list/672' },
      { id: 'src-hl-2', name: 'Ban Quản lý Vịnh Hạ Long', authority: 'UBND tỉnh Quảng Ninh', verifiedYear: 2024 }
    ],
    promptSeedVi: 'Kể về chiếc thuyền buồm cánh buồm nâu lướt giữa làn sương mờ hừng đông trên vịnh Hạ Long, khi ánh bình minh soi rọi huyền thoại Rồng mẹ đáp xuống biển Đông.',
    promptSeedEn: 'Narrate a dawn voyage on a traditional junk sailing between misty karst towers in Ha Long Bay.',
    heroImage: 'https://cdn-images.vtv.vn/66349b6076cb4dee98746cf1/2024/09/29/quan--ao-cat-ba---anh-xuan-thuy-70480010659816108549457.jpg',
    tags: ['UNESCO', 'Vịnh Bắc Bộ', 'Quảng Ninh', 'Cát Bà', 'Karst'],
    artisanVillage: 'Làng chài Cửa Vạn & Làng ngọc trai Tùng Sâu',
    coordinates: { lat: 20.9101, lng: 107.1839 },
    arArtifactId: 'trong-dong'
  },
  // 10. Hoang thanh Thang Long
  {
    id: 'hoang-thanh-thang-long',
    titleVi: 'Hoàng thành Thăng Long - Hà Nội',
    titleEn: 'Imperial Citadel of Thang Long - Hanoi',
    category: 'tangible',
    region: 'north',
    province: 'Hà Nội',
    unescoYear: 2010,
    summaryVi: 'Trung tâm quyền lực chính trị liên tục suốt 13 thế kỷ từ thời Lý, Trần, Lê qua Nguyễn đến thời đại Hồ Chí Minh, minh chứng cho bề dày văn hiến Đại Việt.',
    summaryEn: 'UNESCO World Heritage site: Continuous center of political power for over 13 centuries from the 7th to 20th century.',
    groundedFacts: [
      'Ghi danh Di sản Văn hóa Thế giới UNESCO năm 2010 nhân dịp Đại lễ 1.000 năm Thăng Long - Hà Nội.',
      'Khu di tích khảo cổ 18 Hoàng Diệu phát lộ nhiều tầng văn hóa chồng xếp từ thời Tiền Thăng Long (thế kỷ 7-9) qua các triều Lý, Trần, Lê Sơ, Mạc, Lê Trung Hưng đến thời Nguyễn.',
      'Các công trình tiêu biểu còn nguyên vẹn gồm Đoan Môn, Cột Cờ Hà Nội, Điện Kính Thiên và Hậu Lâu.'
    ],
    sources: [
      { id: 'src-tl-1', name: 'Central Sector of the Imperial Citadel of Thang Long - Hanoi', authority: 'UNESCO', verifiedYear: 2010, url: 'https://whc.unesco.org/en/list/1328' },
      { id: 'src-tl-2', name: 'Trung tâm Bảo tồn Di sản Thăng Long - Hà Nội', authority: 'UBND TP Hà Nội', verifiedYear: 2023 }
    ],
    promptSeedVi: 'Kể về viên gạch "Giang Tây quân" thời nhà Đinh và chân tảng đá hoa sen thời Lý được khai quật tại Hoàng thành Thăng Long.',
    promptSeedEn: 'Narrate the discovery of ancient imperial lotus stone bases and brick layers under Hanoi’s thousand-year citadel.',
    heroImage: 'https://r2.nucuoimekong.com/wp-content/uploads/cong-doan-mon-hoang-thanh-thang-long.webp',
    tags: ['UNESCO', 'Thăng Long', 'Hà Nội', 'Đoan Môn', 'Kính Thiên'],
    artisanVillage: 'Làng đúc đồng Ngũ Xã & Làng chạm bạc Định Công',
    coordinates: { lat: 21.0341, lng: 105.8402 },
    arArtifactId: 'khue-van-cac'
  },
  // 11. Ca tru Thang Long
  {
    id: 'ca-tru-thang-long',
    titleVi: 'Nghệ thuật Hát Ca Trù',
    titleEn: 'Ca Tru Singing Art',
    category: 'music-theater',
    region: 'north',
    province: 'Hà Nội, Bắc Ninh, Hải Dương, Hà Tĩnh...',
    unescoYear: 2009,
    summaryVi: 'Nghệ thuật âm nhạc thính phòng bác học độc đáo kết hợp tiếng phách tre giòn giã của đào nương, tiếng đàn đáy trầm đục của kép đàn và tiếng trống chầu của quan viên.',
    summaryEn: 'UNESCO Intangible Cultural Heritage in Need of Urgent Safeguarding (2009): ancient chamber singing with bamboo clappers, Dan Day lute, and praise drum.',
    groundedFacts: [
      'Ghi danh UNESCO năm 2009 trong Danh sách Di sản văn hóa phi vật thể cần bảo vệ khẩn cấp.',
      'Cấu trúc trình diễn tam tấu đặc thù: Đào nương vừa hát vừa gõ phách, Kép đàn bấm Đàn Đáy 3 dây không phím, và Quan viên cầm Chầu chấm điểm bằng trống chầu.',
      'Hệ thống làn điệu phong phú gắn liền với các thể thơ hát nói tao nhã của danh sĩ Nguyễn Công Trứ, Cao Bá Quát.'
    ],
    sources: [
      { id: 'src-ct-1', name: 'Ca tru singing', authority: 'UNESCO', verifiedYear: 2009, url: 'https://ich.unesco.org/en/USL/ca-tru-singing-00309' },
      { id: 'src-ct-2', name: 'Viện Âm nhạc Việt Nam', authority: 'Bộ VHTTDL', verifiedYear: 2021 }
    ],
    promptSeedVi: 'Tái hiện một canh hát ca trù tao nhã tại giáo phường Bích Câu, khi tiếng tom chát của trống chầu vang lên tán thưởng câu hát xuất thần.',
    promptSeedEn: 'Recreate a refined Ca Tru evening at a traditional singing guild with bamboo castanets and the resonant Dan Day lute.',
    heroImage: 'https://baochauelec.com/cdn/images/tin-tuc/ca-tru.jpg',
    tags: ['UNESCO', 'Ca trù', 'Đàn đáy', 'Phách', 'Đào nương'],
    artisanVillage: 'Giáo phường Ca trù Thái Hà & Giáo phường Lỗ Khê (Đông Anh)',
    coordinates: { lat: 21.0285, lng: 105.8542 },
    arArtifactId: 'dan-bau'
  },
  // 12. Tin nguong Tho cung Hung Vuong
  {
    id: 'tin-nguong-hung-vuong',
    titleVi: 'Tín ngưỡng Thờ cúng Hùng Vương ở Phú Thọ',
    titleEn: 'Worship of Hung Kings in Phu Tho',
    category: 'intangible',
    region: 'north',
    province: 'Phú Thọ',
    unescoYear: 2012,
    summaryVi: 'Biểu tượng đại đoàn kết dân tộc sâu sắc, kết nối hàng triệu con Lạc cháu Hồng hướng về ngày Giỗ Tổ mùng 10 tháng 3 âm lịch.',
    summaryEn: 'UNESCO Representative List (2012): sacred ancestral worship honoring the legendary Founding Fathers of Vietnam on Mount Nghia Linh.',
    groundedFacts: [
      'Ghi danh Di sản Văn hóa Phi vật thể Đại diện của Nhân loại năm 2012.',
      'Gắn với câu ca dao lưu truyền nghìn đời: "Dù ai đi ngược về xuôi / Nhớ ngày Giỗ Tổ mùng mười tháng ba".',
      'Khu di tích Lịch sử Đền Hùng trên núi Nghĩa Lĩnh gồm Đền Hạ, Đền Trung, Đền Thượng và Lăng Hùng Vương.'
    ],
    sources: [
      { id: 'src-hv-1', name: 'Worship of Hùng Kings in Phú Thọ', authority: 'UNESCO', verifiedYear: 2012, url: 'https://ich.unesco.org/en/RL/worship-of-hung-kings-in-phu-tho-00735' },
      { id: 'src-hv-2', name: 'Khu Di tích Lịch sử Đền Hùng', authority: 'Sở VHTTDL Phú Thọ', verifiedYear: 2023 }
    ],
    promptSeedVi: 'Kể về đoàn rước kiệu nghìn người leo lên đỉnh Nghĩa Lĩnh trong làn khói trầm hương ngào ngạt của ngày Giỗ Tổ Hùng Vương.',
    promptSeedEn: 'Narrate the sacred procession on Mount Nghia Linh as thousands of pilgrims honor the ancient Hung Kings.',
    heroImage: 'https://cly.1cdn.vn/2022/12/20/5-1-.jpg',
    tags: ['UNESCO', 'Đền Hùng', 'Giỗ Tổ', 'Phú Thọ', 'Cội nguồn'],
    artisanVillage: 'Làng bánh chưng bánh giầy Hùng Lô & Làng Hát Xoan An Thái',
    coordinates: { lat: 21.3969, lng: 105.3278 },
    arArtifactId: 'trong-dong'
  },
  // 13. Thuc hanh Then Tay Nung Thai
  {
    id: 'thuc-hanh-then-viet-bac',
    titleVi: 'Thực hành Then của người Tày, Nùng, Thái',
    titleEn: 'Practices of Then by Tày, Nùng and Thái Ethnic Groups',
    category: 'intangible',
    region: 'north',
    province: 'Cao Bằng, Lạng Sơn, Tuyên Quang, Hà Giang, Lào Cai...',
    unescoYear: 2019,
    summaryVi: 'Nghi lễ âm nhạc và tâm linh huyền bí kết hợp tiếng đàn Tính ngân vang và chùm xóc nhạc, kết nối con người trần gian với thế giới Mường Trời.',
    summaryEn: 'UNESCO Intangible Cultural Heritage (2019): spiritual and musical ritual practice guided by the Dan Tinh gourd lute across northern highlands.',
    groundedFacts: [
      'Ghi danh Di sản Văn hóa Phi vật thể UNESCO năm 2019.',
      'Cây đàn Tính (Tính tẩu) làm từ nửa quả bầu khô, cần đàn bằng gỗ dâu và dây tơ óng ả là linh hồn của các bài cúng Then.',
      'Then là bản hòa ca tổng hợp giữa hát, múa, âm nhạc, văn học dân gian và nghệ thuật trang trí cắt giấy thủ công.'
    ],
    sources: [
      { id: 'src-then-1', name: 'Practices of Then by Tày, Nùng and Thái', authority: 'UNESCO', verifiedYear: 2019, url: 'https://ich.unesco.org/en/RL/practices-of-then-by-tay-nung-and-thai-ethnic-groups-in-viet-nam-01375' },
      { id: 'src-then-2', name: 'Viện Văn hóa Nghệ thuật Quốc gia Việt Nam', authority: 'Bộ VHTTDL', verifiedYear: 2022 }
    ],
    promptSeedVi: 'Kể về đêm Then cầu an mùa xuân bên bếp lửa nhà sàn vùng núi Cao Bằng khi tiếng đàn Tính của bà Then đưa lối mường trời.',
    promptSeedEn: 'Follow an evening Then healing ritual around a highland hearth guided by the gentle chords of the Dan Tinh.',
    heroImage: 'https://th.bing.com/th/id/R.c4787adb97d353d19c1550d59999eaa5?rik=OdUtTZUXp8B%2bnQ&riu=http%3a%2f%2ftoquoc.mediacdn.vn%2fthumb_w%2f640%2f2019%2f12%2f13%2fthen-1-1576190817491745652532.jpg&ehk=Y0DLajpjYRUNpmDJqA2lw%2f5ER7Bk6CCL0Cm002gBJ48%3d&risl=&pid=ImgRaw&r=0',
    tags: ['UNESCO', 'Đàn Tính', 'Người Tày', 'Cao Bằng', 'Nghi lễ'],
    artisanVillage: 'Làng làm đàn Tính Bản Bó & Làng du lịch cộng đồng Pac Ngoi',
    coordinates: { lat: 22.6667, lng: 106.25 },
    arArtifactId: 'dan-bau'
  },
  // 14. Ruong bac thang Mu Cang Chai
  {
    id: 'ruong-bac-thang-mu-cang-chai',
    titleVi: 'Danh thắng Ruộng bậc thang Mù Cang Chải',
    titleEn: 'Mu Cang Chai Terraced Rice Fields',
    category: 'tangible',
    region: 'north',
    province: 'Yên Bái',
    nationalYear: 2019,
    summaryVi: 'Kiệt tác điêu khắc nông nghiệp kỳ vĩ trên sườn núi Hoàng Liên Sơn của đồng bào Mông, được xếp hạng Di tích Quốc gia Đặc biệt.',
    summaryEn: 'Special National Monument: breathtaking agricultural terraced slopes sculpted across the Hoang Lien Son mountain range by Hmong farmers.',
    groundedFacts: [
      'Xếp hạng Di tích Quốc gia Đặc biệt năm 2019.',
      'Hơn 2.200 ha ruộng bậc thang uốn lượn ngoạn mục qua các xã La Pán Tẩn, Chế Cu Nha, Dế Xu Phình.',
      'Kỹ thuật dẫn nước bằng ống tre từ đỉnh núi cao tạo nên mùa nước đổ tháng 5 lấp lánh như gương và mùa lúa chín tháng 9 vàng rực như sóng lụa.'
    ],
    sources: [
      { id: 'src-mcc-1', name: 'Hồ sơ Di tích Quốc gia Đặc biệt Mù Cang Chải', authority: 'Cục Di sản Văn hóa', verifiedYear: 2019 },
      { id: 'src-mcc-2', name: 'Sở VHTTDL tỉnh Yên Bái', authority: 'UBND tỉnh Yên Bái', verifiedYear: 2023 }
    ],
    promptSeedVi: 'Kể về buổi sớm mai khi sương mây tan dần trên đồi mâm xôi La Pán Tẩn, để lộ những nấc thang vàng óng ả nối đất với trời.',
    promptSeedEn: 'Capture the golden sunrise over the iconic Raspberry Hill terraces as morning clouds clear across the valley.',
    heroImage: 'https://cdnmedia.baotintuc.vn/Upload/DmtgOUlHWBO5POIHzIwr1A/files/2020/08/15/ruong-bac-thang-150820a(1).jpg',
    tags: ['Danh lam', 'Yên Bái', 'Mâm Xôi', 'Ruộng bậc thang', 'Người Mông'],
    artisanVillage: 'Bản La Pán Tẩn & Bản Lìm Mông (Mù Cang Chải)',
    coordinates: { lat: 21.8483, lng: 104.0833 },
    arArtifactId: 'non-la'
  },
  // 15. Quan the di tich Co do Hue
  {
    id: 'quan-the-di-tich-hue',
    titleVi: 'Quần thể Di tích Cố đô Huế',
    titleEn: 'Complex of Hue Monuments',
    category: 'tangible',
    region: 'central',
    province: 'Thừa Thiên Huế',
    unescoYear: 1993,
    summaryVi: 'Di sản thế giới đầu tiên của Việt Nam được UNESCO công nhận, kinh đô tráng lệ của triều Nguyễn với hệ thống thành quách, cung điện và lăng tẩm thơ mộng bên sông Hương.',
    summaryEn: 'Vietnam’s first UNESCO World Cultural Heritage site (1993): the imperial capital of the Nguyen Dynasty boasting fortresses, palaces, and royal mausoleums.',
    groundedFacts: [
      'Ghi danh Di sản Văn hóa Thế giới UNESCO năm 1993.',
      'Quy hoạch kiến trúc hài hòa theo phong thủy phương Đông với sông Hương làm minh đường, núi Ngự Bình làm tiền án, cồn Hến và cồn Dã Viên làm tả thanh long hữu bạch hổ.',
      'Bao gồm Hoàng thành, Tử Cấm Thành, đàn Nam Giao, Văn Miếu và các lăng tẩm đế vương Gia Long, Minh Mạng, Tự Đức, Khải Định.'
    ],
    sources: [
      { id: 'src-hm-1', name: 'Complex of Hué Monuments', authority: 'UNESCO', verifiedYear: 1993, url: 'https://whc.unesco.org/en/list/678' },
      { id: 'src-hm-2', name: 'Trung tâm Bảo tồn Di tích Cố đô Huế', authority: 'UBND Thừa Thiên Huế', verifiedYear: 2024 }
    ],
    promptSeedVi: 'Kể về chiếc nón bài thơ nghiêng che tà áo dài tím của cô nữ sinh Đồng Khánh bước qua Ngọ Môn trong chiều mưa xứ Huế.',
    promptSeedEn: 'Recreate a contemplative afternoon walk through the Ngo Mon Gate as rain falls softly over the imperial lotus ponds.',
    heroImage: 'https://thethaovanhoa.mediacdn.vn/372676912336973824/2023/6/17/hue2-16869779467151091346865.jpg',
    tags: ['UNESCO', 'Cố đô', 'Ngọ Môn', 'Sông Hương', 'Lăng tẩm'],
    artisanVillage: 'Làng nón Tây Hồ & Làng hương Trầm Thủy Xuân',
    coordinates: { lat: 16.4698, lng: 107.5796 },
    arArtifactId: 'non-la'
  },
  // 16. Thanh dia My Son
  {
    id: 'thanh-dia-my-son',
    titleVi: 'Khu Đền tháp Thánh địa Mỹ Sơn',
    titleEn: 'My Son Sanctuary',
    category: 'tangible',
    region: 'central',
    province: 'Quảng Nam',
    unescoYear: 1999,
    summaryVi: 'Quần thể đền tháp Ấn Độ giáo cổ kính của Vương quốc Chăm Pa ẩn mình giữa thung lũng núi Chúa, kỳ quan kỹ thuật xây gạch không lộ mạch vữa.',
    summaryEn: 'UNESCO World Heritage site (1999): ancient Hindu temple sanctuary of the Champa Kingdom nestled in a dramatic ring of mountains.',
    groundedFacts: [
      'Ghi danh Di sản Thế giới UNESCO năm 1999.',
      'Xây dựng từ thế kỷ 4 đến thế kỷ 13 để thờ thần Shiva (dưới tên Bhadresvara) và các đấng quân vương Champa.',
      'Kỹ thuật nung và liên kết gạch Chăm Pa độc nhất vô nhị bằng chất kết dính hữu cơ tự nhiên (nhựa cây dầu rái) khiến mạch ghép gạch khít khao bền vững nghìn năm.'
    ],
    sources: [
      { id: 'src-ms-1', name: 'My Son Sanctuary', authority: 'UNESCO', verifiedYear: 1999, url: 'https://whc.unesco.org/en/list/949' },
      { id: 'src-ms-2', name: 'Ban Quản lý Di sản Văn hóa Mỹ Sơn', authority: 'UBND tỉnh Quảng Nam', verifiedYear: 2023 }
    ],
    promptSeedVi: 'Kể về tia nắng rọi qua kẽ gạch đỏ rêu phong của tháp B1 Mỹ Sơn, làm bừng sáng nụ cười bí ẩn của tượng tiên nữ Apsara.',
    promptSeedEn: 'Follow the golden sunlight touching the thousand-year red bricks and sandstone Apsara reliefs in the valley of My Son.',
    heroImage: 'https://danangfantasticity.com/wp-content/uploads/2025/09/khu-den-thap-my-son-03-1024x576.jpg',
    tags: ['UNESCO', 'Champa', 'Tháp Chàm', 'Apsara', 'Quảng Nam'],
    artisanVillage: 'Làng gốm Chăm Bàu Trúc & Làng thổ cẩm Mỹ Nghiệp',
    coordinates: { lat: 15.7647, lng: 108.1242 },
    arArtifactId: 'tuong-cham'
  },
  // 17. Phong Nha Ke Bang
  {
    id: 'phong-nha-ke-bang',
    titleVi: 'Vườn Quốc gia Phong Nha - Kẻ Bàng',
    titleEn: 'Phong Nha - Ke Bang National Park',
    category: 'tangible',
    region: 'central',
    province: 'Quảng Bình',
    unescoYear: 2003,
    summaryVi: 'Vương quốc hang động thế giới với hệ địa chất karst cổ nhất châu Á hơn 400 triệu năm và hang Sơn Đoòng - hang động tự nhiên lớn nhất hành tinh.',
    summaryEn: 'UNESCO World Natural Heritage site renowned for ancient karst geology and Hang Son Doong, the largest natural cave on Earth.',
    groundedFacts: [
      'Ghi danh Di sản Thiên nhiên Thế giới UNESCO năm 2003 về địa chất địa mạo và năm 2015 về đa dạng sinh học hệ sinh thái.',
      'Sở hữu hơn 300 hang động kỳ vĩ gồm Động Phong Nha, Động Thiên Đường, Hang Én và Hang Sơn Đoòng có kích thước đủ chứa cả một tòa nhà chọc trời 40 tầng.',
      'Dòng sông ngầm dài nhất thế giới và hệ thạch nhũ đá vôi muôn hình vạn trạng phát triển qua hàng triệu năm.'
    ],
    sources: [
      { id: 'src-pn-1', name: 'Phong Nha-Ke Bang National Park', authority: 'UNESCO', verifiedYear: 2015, url: 'https://whc.unesco.org/en/list/951' },
      { id: 'src-pn-2', name: 'Ban Quản lý VQG Phong Nha - Kẻ Bàng', authority: 'UBND tỉnh Quảng Bình', verifiedYear: 2024 }
    ],
    promptSeedVi: 'Kể về chiếc thuyền chèo tay tiến vào vòm thạch nhũ lung linh của Động Phong Nha khi giọt nước triệu năm rơi tí tách giữa lòng núi đá.',
    promptSeedEn: 'Journey by river boat into the colossal limestone chambers of Phong Nha echoing with ancient subterranean droplets.',
    heroImage: 'https://bcp.cdnchinhphu.vn/334894974524682240/2025/7/13/tal-lan-toa-y-nghia-phong-trao-hanh-dong-dep-moi-ngay-xay-dung-phong-nha-tro-thanh-diem-den-than-thien-va-an-toan-66146995-10-28-5021-11-22-29-17524048453151394100904.jpg',
    tags: ['UNESCO', 'Hang động', 'Sơn Đoòng', 'Karst', 'Quảng Bình'],
    artisanVillage: 'Làng nghề mây tre đan Xuân Lai & Làng nón lá Quy Hậu',
    coordinates: { lat: 17.5833, lng: 106.2833 },
    arArtifactId: 'binh-gom'
  },
  // 18. Bai Choi Trung Bo
  {
    id: 'bai-choi-trung-bo',
    titleVi: 'Nghệ thuật Bài Chòi Trung Bộ',
    titleEn: 'Art of Bai Choi in Central Vietnam',
    category: 'music-theater',
    region: 'central',
    province: 'Quảng Nam, Bình Định, Quảng Ngãi, Đà Nẵng, Phú Yên, Khánh Hòa...',
    unescoYear: 2017,
    summaryVi: 'Hình thức sinh hoạt văn hóa dân gian kết hợp trò chơi dân gian thẻ bài trên chòi tre với các điệu hò, vè đối đáp dí dỏm của anh hiệu.',
    summaryEn: 'UNESCO Intangible Cultural Heritage (2017): festive combination of cards, poetry, acting, and singing played in elevated bamboo huts.',
    groundedFacts: [
      'Ghi danh Di sản Văn hóa Phi vật thể UNESCO năm 2017.',
      'Diễn ra trên 9 hoặc 11 chòi tre dựng theo hình chữ U; Anh Hiệu (người điều khiển) vừa rút thẻ bài vừa ứng khẩu câu thai vè hóm hỉnh.',
      'Bộ thẻ bài gồm 27 hoặc 30 cặp mang những cái tên dân dã như Nhất Nọc, Ba Gà, Tứ Cẳng, Bạch Huê, Bảy Liễu...'
    ],
    sources: [
      { id: 'src-bc-1', name: 'Art of Bài Chòi in Central Viet Nam', authority: 'UNESCO', verifiedYear: 2017, url: 'https://ich.unesco.org/en/RL/art-of-bai-choi-in-central-viet-nam-01222' },
      { id: 'src-bc-2', name: 'Sở VHTTDL tỉnh Bình Định', authority: 'UBND tỉnh Bình Định', verifiedYear: 2022 }
    ],
    promptSeedVi: 'Kể về không khí rộn rã đầu xuân tại sân đình khi Anh Hiệu cất giọng hô bài chòi vang vọng khiến cả làng hồi hộp chờ trúng thưởng.',
    promptSeedEn: 'Recreate a lively spring festival in a central village square as the caller improvises witty verses for the bamboo hut card game.',
    heroImage: 'https://danangfantasticity.com/wp-content/uploads/2025/08/nghe-thuat-bai-choi-trung-bo-viet-nam-da-nang-05-1536x864.jpg',
    tags: ['UNESCO', 'Bài Chòi', 'Bình Định', 'Anh Hiệu', 'Hội xuân'],
    artisanVillage: 'Câu lạc bộ Bài Chòi Phố cổ Hội An & Làng võ Tây Sơn',
    coordinates: { lat: 13.9167, lng: 109.0833 },
    arArtifactId: 'den-long'
  },
  // 19. Dan ca Vi Giam Nghe Tinh
  {
    id: 'dan-ca-vi-giam-nghe-tinh',
    titleVi: 'Dân ca Ví, Giặm Nghệ Tĩnh',
    titleEn: 'Vi and Giam Folk Songs of Nghe Tinh',
    category: 'music-theater',
    region: 'central',
    province: 'Nghệ An & Hà Tĩnh',
    unescoYear: 2014,
    summaryVi: 'Dòng dân ca giao duyên mộc mạc cất lên từ đồng bãi, bến nước sông Lam núi Hồng, nuôi dưỡng tâm hồn kiên trung, hiếu học của người xứ Nghệ.',
    summaryEn: 'UNESCO Intangible Cultural Heritage (2014): lyrical antiphonal songs sung by workers along the Lam River and Hong Linh Mountains.',
    groundedFacts: [
      'Ghi danh Di sản Phi vật thể Đại diện của Nhân loại năm 2014.',
      'Bao gồm các điệu Ví (Ví phường vải, Ví phường nón, Ví đò đưa...) và các điệu Giặm (Giặm kể, Giặm khuyên, Giặm đức...) ngắt nhịp chặt chẽ.',
      'Sử dụng thổ ngữ Nghệ Tĩnh phong phú và lối ví von sâu sắc, gắn liền với đại thi hào Nguyễn Du.'
    ],
    sources: [
      { id: 'src-vg-1', name: 'Ví and Giặm folk songs of Nghệ Tĩnh', authority: 'UNESCO', verifiedYear: 2014, url: 'https://ich.unesco.org/en/RL/vi-and-giam-folk-songs-of-nghe-tinh-01008' },
      { id: 'src-vg-2', name: 'Trung tâm Phát triển Nghệ thuật Truyền thống Nghệ An', authority: 'Sở VHTTDL Nghệ An', verifiedYear: 2023 }
    ],
    promptSeedVi: 'Kể về đêm trăng hát Ví phường vải tại làng Kim Liên, khi chàng nho sinh và cô thôn nữ đối đáp những câu thơ lục bát mượt mà.',
    promptSeedEn: 'Follow an evening cotton-spinning singing match along the Lam River with passionate dialect verses.',
    heroImage: 'https://baovephapluat.vn/data/images/0/2024/11/26/tienbv/danca-1637962456598494585.jpg?dpi=150&quality=100&w=820',
    tags: ['UNESCO', 'Ví Giặm', 'Sông Lam', 'Xứ Nghệ', 'Nguyễn Du'],
    artisanVillage: 'Làng dệt vải Trường Lưu & Làng nón Ba Đồn',
    coordinates: { lat: 18.6667, lng: 105.6667 },
    arArtifactId: 'dan-bau'
  },
  // 20. Thanh Nha Ho
  {
    id: 'thanh-nha-ho',
    titleVi: 'Thành Nhà Hồ (Tây Đô)',
    titleEn: 'Citadel of the Ho Dynasty',
    category: 'tangible',
    region: 'north',
    province: 'Thanh Hóa',
    unescoYear: 2011,
    summaryVi: 'Công trình kiến trúc kinh thành bằng đá đồ sộ độc nhất vô nhị ở Đông Nam Á, xây dựng từ những khối đá vôi nặng hàng chục tấn năm 1397.',
    summaryEn: 'UNESCO World Cultural Heritage (2011): monumental imperial stone fortress built in 1397 using massive interlocking limestone blocks.',
    groundedFacts: [
      'Ghi danh Di sản Thế giới UNESCO năm 2011.',
      'Được Hồ Quý Ly cho xây dựng chỉ trong vòng 3 tháng vào năm 1397 làm kinh đô Tây Đô.',
      'Kỹ thuật xây dựng ghép đá không vữa với 4 cổng vòm cuốn kiên cố (Đông, Tây, Nam, Bắc) tồn tại sừng sững hơn 600 năm.'
    ],
    sources: [
      { id: 'src-nh-1', name: 'Citadel of the Ho Dynasty', authority: 'UNESCO', verifiedYear: 2011, url: 'https://whc.unesco.org/en/list/1358' },
      { id: 'src-nh-2', name: 'Trung tâm Bảo tồn Di sản Thành Nhà Hồ', authority: 'Sở VHTTDL Thanh Hóa', verifiedYear: 2023 }
    ],
    promptSeedVi: 'Kể về kỳ tích những người thợ đá thế kỷ 14 kéo phiến đá 20 tấn qua sông Mã để dựng nên vòm cổng Nam Thành Nhà Hồ vững chãi nghìn thu.',
    promptSeedEn: 'Narrate the 14th-century engineering feat of transporting massive limestone blocks to build the majestic stone gates of Tay Do.',
    heroImage: 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/1/17/1139039/Anh-11.jpg',
    tags: ['UNESCO', 'Thành Nhà Hồ', 'Tây Đô', 'Thanh Hóa', 'Thành Đá'],
    artisanVillage: 'Làng đúc đồng Chè Đông & Làng đá mỹ nghệ Nhồi',
    coordinates: { lat: 20.0781, lng: 105.6067 },
    arArtifactId: 'khue-van-cac'
  },
  // 21. Le hoi Ba Chua Xu Nui Sam
  {
    id: 'ba-chua-xu-nui-sam',
    titleVi: 'Lễ hội Vía Bà Chúa Xứ Núi Sam',
    titleEn: 'Festival of Ba Chua Xu on Sam Mountain',
    category: 'intangible',
    region: 'south',
    province: 'An Giang',
    unescoYear: 2024,
    summaryVi: 'Lễ hội tâm linh lớn nhất vùng Tây Nam Bộ, biểu tượng dung hợp văn hóa Việt - Chăm - Hoa - Khmer dưới chân núi Sam huyền thoại.',
    summaryEn: 'UNESCO Intangible Cultural Heritage (2024): the largest pilgrimage festival of the Mekong Delta celebrating unity and cultural harmony.',
    groundedFacts: [
      'Ghi danh Di sản Văn hóa Phi vật thể Đại diện của Nhân loại năm 2024.',
      'Diễn ra từ 22 đến 27 tháng 4 âm lịch hàng năm với các nghi lễ trang nghiêm: Lễ tắm Bà, Lễ thỉnh sắc Thoại Ngọc Hầu, Lễ Túc yết và Lễ Chánh tế.',
      'Tượng Bà Chúa Xứ là tuyệt tác điêu khắc sa thạch cổ thời kỳ văn hóa Phù Nam (thế kỷ 6).'
    ],
    sources: [
      { id: 'src-bcx-1', name: 'Ba Chua Xu Festival dossier', authority: 'UNESCO / Cục Di sản Văn hóa', verifiedYear: 2024 },
      { id: 'src-bcx-2', name: 'Ban Quản lý Khu Du lịch Núi Sam', authority: 'UBND TP Châu Đốc', verifiedYear: 2024 }
    ],
    promptSeedVi: 'Kể về đêm 23 tháng 4 âm lịch khi hàng vạn người cầm nến hòa vào dòng người dự Lễ tắm Bà trong hương trầm ngào ngạt xứ Châu Đốc.',
    promptSeedEn: 'Recreate the sacred midnight bathing ritual on Mount Sam as pilgrims gather with candles and fragrant incense.',
    heroImage: 'https://travelviet.net/upload_s3/3285/via-ba-1png-1743155614.png',
    tags: ['UNESCO', 'Châu Đốc', 'Bà Chúa Xứ', 'Núi Sam', 'Tây Nam Bộ'],
    artisanVillage: 'Làng lụa Tân Châu & Làng Chăm Đa Phước',
    coordinates: { lat: 10.6667, lng: 105.1667 },
    arArtifactId: 'kim-bao'
  },
  // 22. San khau Du Ke Khmer Nam Bo
  {
    id: 'du-ke-khmer-nam-bo',
    titleVi: 'Nghệ thuật Sân khấu Dù Kê của người Khmer',
    titleEn: 'Du Ke Theater of the Khmer People in Southern Vietnam',
    category: 'music-theater',
    region: 'south',
    province: 'Sóc Trăng & Trà Vinh',
    nationalYear: 2014,
    summaryVi: 'Dòng sân khấu kịch hát dân gian độc đáo của đồng bào Khmer Nam Bộ, kết hợp ca vũ dân tộc, tuồng cổ và các tích truyện Phật giáo ly kỳ.',
    summaryEn: 'National Intangible Cultural Heritage: traditional Khmer folk musical theater blending classical dance, mythology, and regional melodies.',
    groundedFacts: [
      'Ghi danh Di sản Văn hóa Phi vật thể Quốc gia năm 2014.',
      'Hình thành từ đầu thập niên 1920 tại Sóc Trăng và Trà Vinh, giao thoa giữa nghệ thuật múa Robam, Hát bội Việt và Hí khúc Triều Châu.',
      'Nhạc cụ hòa tấu độc đáo gồm Dàn nhạc Ngũ âm (Pinpeat), đàn Khloy, trống Skô Sampho và đàn Kìm.'
    ],
    sources: [
      { id: 'src-dk-1', name: 'Di sản Nghệ thuật Sân khấu Dù Kê Khmer', authority: 'Bộ VHTTDL', verifiedYear: 2014 },
      { id: 'src-dk-2', name: 'Đoàn Nghệ thuật Khmer tỉnh Sóc Trăng', authority: 'Sở VHTTDL Sóc Trăng', verifiedYear: 2023 }
    ],
    promptSeedVi: 'Kể về đêm diễn Dù Kê rực rỡ tại sân chùa Dơi Sóc Trăng với tích truyện thần khỉ Hanuman bảo vệ công chúa.',
    promptSeedEn: 'Capture the colorful drama of a Du Ke theatrical performance at a historic Khmer pagoda courtyard.',
    heroImage: 'https://media1.thrillophilia.com/filestore/8qre1106zet9y3yird419tccg57i_8k6yyzq3zk416p6n1bda71a4pwxj_svr.jpg',
    tags: ['Di sản Quốc gia', 'Khmer', 'Sóc Trăng', 'Dù Kê', 'Chùa Dơi'],
    artisanVillage: 'Làng vẽ tranh trên kiếng Phú Tân & Làng đan lát Khmer',
    coordinates: { lat: 9.6033, lng: 105.9806 },
    arArtifactId: 'dan-kim'
  },
  // 23. Cho noi Cai Rang & Song nuoc Tay Do
  {
    id: 'cho-noi-cai-rang',
    titleVi: 'Văn hóa Chợ nổi Cái Răng - Cần Thơ',
    titleEn: 'Cai Rang Floating Market Culture - Can Tho',
    category: 'intangible',
    region: 'south',
    province: 'Cần Thơ',
    nationalYear: 2016,
    summaryVi: 'Bức tranh sinh hoạt giao thương sông nước sống động miền Tây Đô với tập quán "cây bẹo" treo hàng hóa độc nhất vô nhị trên sóng nước Cửu Long.',
    summaryEn: 'National Intangible Heritage: dynamic river marketplace where wooden boats trade fresh delta produce using iconic hanging signal poles.',
    groundedFacts: [
      'Ghi danh Di sản Văn hóa Phi vật thể Quốc gia năm 2016.',
      'Tập quán độc đáo dùng "Cây Bẹo" (cây tre cắm mũi thuyền treo nông sản): Treo gì bán nấy, treo mà không bán (quần áo phơi), không treo mà bán (thuyền bán thức ăn), treo cái này bán cái khác (treo tấm lá bán thuyền).',
      'Điểm giao nhau của 4 nhánh sông Cần Thơ, Đầu Sấu, Cái Sơn, Cái Răng với hàng trăm ghe xuồng tấp nập từ tờ mờ sáng.'
    ],
    sources: [
      { id: 'src-cr-1', name: 'Văn hóa Chợ nổi Cái Răng', authority: 'Bộ Văn hóa, Thể thao và Du lịch', verifiedYear: 2016 },
      { id: 'src-cr-2', name: 'Sở VHTTDL TP Cần Thơ', authority: 'UBND TP Cần Thơ', verifiedYear: 2024 }
    ],
    promptSeedVi: 'Kể về chiếc ghe nhỏ chở đầy dưa hấu và chôm chôm len lỏi giữa chợ nổi Cái Răng lúc bình minh vừa rạng trên sông Hậu.',
    promptSeedEn: 'Follow an early morning sampan navigating the bustling floating stalls of tropical fruits on the Hau River.',
    heroImage: 'https://timtour.vn/files/images/Choi-o-dau/cho-noi-cai-rang-1.jpg',
    tags: ['Di sản Quốc gia', 'Cần Thơ', 'Chợ nổi', 'Cây bẹo', 'Sông Tiền Sông Hậu'],
    artisanVillage: 'Làng hủ tiếu truyền thống Cái Răng & Làng bánh tráng Thuận Hưng',
    coordinates: { lat: 10.0055, lng: 105.7469 },
    arArtifactId: 'dan-kim'
  },
  // 24. Banh trang phoi suong Trang Bang
  {
    id: 'banh-trang-phoi-suong-trang-bang',
    titleVi: 'Nghề làm Bánh tráng phơi sương Trảng Bàng',
    titleEn: 'Trang Bang Dew-wetted Rice Paper Craft',
    category: 'culinary',
    region: 'south',
    province: 'Tây Ninh',
    nationalYear: 2015,
    summaryVi: 'Kỳ công ẩm thực kết tinh từ hạt gạo nàng thơm, cái nắng chói chang ban ngày và ngọn sương lành đêm đất Tây Ninh.',
    summaryEn: 'National Intangible Cultural Heritage: exquisite culinary craft capturing midnight dew to soften baked rice paper.',
    groundedFacts: [
      'Ghi danh Di sản Văn hóa Phi vật thể Quốc gia năm 2015.',
      'Quy trình chế biến công phu: Tráng 2 lớp bột gạo tẻ pha muối, phơi nắng ráo mặt, nướng qua than củi vỏ đậu phộng cho phồng xốp, rồi đem "phơi sương" từ 2-4 giờ sáng để bánh mềm dẻo tự nhiên.',
      'Ăn kèm thịt heo luộc và hơn 10 loại rau rừng sông Vàm Cỏ Đông (lá cóc, quế vị, sao nhái, đọt bứa...).'
    ],
    sources: [
      { id: 'src-tb-1', name: 'Nghề làm Bánh tráng phơi sương Trảng Bàng', authority: 'Bộ VHTTDL', verifiedYear: 2015 },
      { id: 'src-tb-2', name: 'Sở VHTTDL tỉnh Tây Ninh', authority: 'UBND tỉnh Tây Ninh', verifiedYear: 2023 }
    ],
    promptSeedVi: 'Kể về khoảnh khắc người phụ nữ Trảng Bàng canh trở sương đêm để từng tấm bánh tráng hút trọn giọt sương mát lành thơm dịu.',
    promptSeedEn: 'Follow an artisan waiting under the starlit sky at 3 AM to expose warm baked rice paper to the gentle delta dew.',
    heroImage: 'https://media.mia.vn/uploads/blog-du-lich/lang-nghe-banh-trang-trang-bang-net-dep-truyen-thong-cua-nguoi-dan-nam-bo-01-1661881528.jpg',
    tags: ['Ẩm thực', 'Tây Ninh', 'Bánh tráng', 'Phơi sương', 'Rau rừng'],
    artisanVillage: 'Làng bánh tráng Trảng Bàng & Làng mây tre đan An Hòa',
    coordinates: { lat: 11.0333, lng: 106.3667 },
    arArtifactId: 'non-la'
  },
  // 25. Gom Cham Bau Truc
  {
    id: 'gom-cham-bau-truc',
    titleVi: 'Nghệ thuật làm Gốm cổ truyền của người Chăm (Bàu Trúc)',
    titleEn: 'Art of Pottery-making of Chăm People (Bau Truc)',
    category: 'craft',
    region: 'central',
    province: 'Ninh Thuận & Bình Thuận',
    unescoYear: 2022,
    summaryVi: 'Làng gốm cổ xưa bậc nhất Đông Nam Á với kỹ thuật "tay quay, mông xoay" không dùng bàn xoay, nung lộ thiên bằng rơm củi tạo màu khói độc bản.',
    summaryEn: 'UNESCO In Need of Urgent Safeguarding (2022): archaic pottery shaped without kick-wheels by walking backwards around the clay and open-air fired.',
    groundedFacts: [
      'Ghi danh UNESCO trong Danh sách Cần bảo vệ khẩn cấp năm 2022.',
      'Phụ nữ Chăm nặn gốm hoàn toàn thủ công: Người thợ vừa đi giật lùi quanh khối đất sét vừa dùng bàn tay vuốt dáng tạo hình ("tay làm, chân đi").',
      'Nung lộ thiên ngoài trời bằng rơm rạ, củi khô và nhuộm màu bằng nước vỏ cây ngâm quả thị cho ra màu nâu đỏ chấm khói đen huyền bí.'
    ],
    sources: [
      { id: 'src-bt-c-1', name: 'Art of pottery-making of Chăm people', authority: 'UNESCO', verifiedYear: 2022, url: 'https://ich.unesco.org/en/USL/art-of-pottery-making-of-cham-people-01574' },
      { id: 'src-bt-c-2', name: 'Sở VHTTDL tỉnh Ninh Thuận', authority: 'UBND tỉnh Ninh Thuận', verifiedYear: 2023 }
    ],
    promptSeedVi: 'Kể về đôi bàn tay thô ráp nhưng kỳ diệu của người mẹ Chăm làng Bàu Trúc thoăn thoắt biến hòn đất sét sông Quao thành chiếc bình thần linh.',
    promptSeedEn: 'Follow an elder Cham craftswoman walking backwards around a clay pedestal shaping a sacred vessel by hand.',
    heroImage: 'https://static.vinwonders.com/production/optimize_lang-gom-bau-truc-03.jpg',
    tags: ['UNESCO', 'Gốm Chăm', 'Bàu Trúc', 'Ninh Thuận', 'Nung lộ thiên'],
    artisanVillage: 'Làng gốm Bàu Trúc, thị trấn Phước Dân, Ninh Phước',
    coordinates: { lat: 11.5333, lng: 108.95 },
    arArtifactId: 'tuong-cham'
  }
].map((item) => {
  const media = HERITAGE_MEDIA_MAP[item.id];
  if (!media) return item;
  return {
    ...item,
    youtubeVideoId: media.youtubeVideoId,
    youtubeTitleVi: media.youtubeTitleVi,
    youtubeTitleEn: media.youtubeTitleEn,
    musicTrack: media.musicTrack,
  };
});

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-hs-1',
    heritageId: 'le-khao-le-the-linh-hoang-sa',
    questionVi: 'Nghi lễ "Lễ Khao lề Thế lính Hoàng Sa" tại đảo Lý Sơn (Quảng Ngãi) là minh chứng lịch sử thiêng liêng tri ân lực lượng nào?',
    questionEn: 'The sacred "Khao Le The Linh Hoang Sa" ritual on Ly Son Island commemorates which historic unit?',
    optionsVi: [
      'Đội Hùng binh Hoàng Sa kiêm quản Bắc Hải',
      'Đội Thương thuyền Phố Hiến',
      'Đội Vệ binh Cố đô Hoa Lư',
      'Đội Tuần duyên sông Bạch Đằng'
    ],
    optionsEn: [
      'The Hoang Sa Flotilla administering Bac Hai',
      'Pho Hien Merchant Fleet',
      'Hoa Lu Imperial Guards',
      'Bach Dang River Coastguards'
    ],
    correctIndex: 0,
    explanationVi: 'Đội Hoàng Sa được triều đình phong kiến Việt Nam (thời các chúa Nguyễn và triều Nguyễn) thành lập từ thế kỷ 17 để hàng năm ra Hoàng Sa và Trường Sa cắm mốc cương giới và thực thi chủ quyền.',
    explanationEn: 'The Hoang Sa flotilla was established in the 17th century by Vietnamese rulers to survey, patrol, and exercise sovereignty over Paracel and Spratly.',
    sourceCitation: 'Di sản Văn hóa Phi vật thể Quốc gia (Bộ VHTTDL 2013) & Phủ Biên Tạp Lục'
  },
  {
    id: 'quiz-qh-1',
    heritageId: 'quan-ho-bac-ninh',
    questionVi: 'Dân ca Quan họ Bắc Ninh được UNESCO chính thức ghi danh vào Danh sách Di sản văn hóa phi vật thể đại diện của nhân loại vào năm nào?',
    questionEn: 'In which year were Bac Ninh Quan Ho Folk Songs inscribed on the UNESCO Intangible Cultural Heritage list?',
    optionsVi: ['Năm 2003', 'Năm 2009', 'Năm 2013', 'Năm 2018'],
    optionsEn: ['Year 2003', 'Year 2009', 'Year 2013', 'Year 2018'],
    correctIndex: 1,
    explanationVi: 'Quan họ Bắc Ninh được UNESCO công nhận ngày 30 tháng 9 năm 2009 tại kỳ họp lần thứ 4 của Ủy ban Liên chính phủ về bảo vệ Di sản văn hóa phi vật thể tại Abu Dhabi.',
    explanationEn: 'Bac Ninh Quan Ho was officially recognized on September 30, 2009 at the 4th session in Abu Dhabi.',
    sourceCitation: 'UNESCO Inscription Dossier #00183 (2009)'
  },
  {
    id: 'quiz-nn-1',
    heritageId: 'nha-nhac-cung-dinh-hue',
    questionVi: 'Nhã nhạc Cung đình Huế đạt đến đỉnh cao hoàn thiện và quy củ nhất dưới triều đại phong kiến nào của Việt Nam?',
    questionEn: 'Under which Vietnamese feudal dynasty did Hue Royal Court Music reach its supreme peak?',
    optionsVi: ['Triều Lý', 'Triều Trần', 'Triều Lê Sơ', 'Triều Nguyễn'],
    optionsEn: ['Ly Dynasty', 'Tran Dynasty', 'Early Le Dynasty', 'Nguyen Dynasty'],
    correctIndex: 3,
    explanationVi: 'Dưới triều Nguyễn (1802–1945), Nhã nhạc được hệ thống hóa bài bản nhất với hai dàn nhạc quy chuẩn là Đại nhạc và Tiểu nhạc.',
    explanationEn: 'Under the Nguyen Dynasty (1802–1945), Nha Nhac reached its highest institutional sophistication.',
    sourceCitation: 'Trung tâm Bảo tồn Di tích Cố đô Huế & UNESCO (2003)'
  },
  {
    id: 'quiz-dc-1',
    heritageId: 'don-ca-tai-tu-nam-bo',
    questionVi: 'Nhạc cụ nào sau đây được xem là cây đàn "chủ âm" không thể thiếu trong dàn nhạc Đờn ca Tài tử Nam Bộ?',
    questionEn: 'Which instrument is considered the foundational master lead in Southern Don Ca Tai Tu ensembles?',
    optionsVi: ['Đàn Kìm (Đàn Nguyệt)', 'Đàn T\'rưng', 'Kèn Saranai', 'Trống Cơm'],
    optionsEn: ['Dan Kim (Moon Lute)', 'Dan T\'rung', 'Saranai Horn', 'Trong Com'],
    correctIndex: 0,
    explanationVi: 'Đàn Kìm (đàn nguyệt) đóng vai trò giữ nhịp, dẫn dắt giai điệu và được tôn xưng là "quân tử cầm" trong Đờn ca tài tử.',
    explanationEn: 'The Dan Kim (Moon Lute) serves as the primary melodic anchor and rhythmic leader.',
    sourceCitation: 'Hồ sơ Di sản UNESCO Đờn ca Tài tử #00733 (2013)'
  },
  {
    id: 'quiz-bt-1',
    heritageId: 'gom-su-bat-trang',
    questionVi: 'Dòng men trứ danh tạo nên nét cổ kính độc bản của gốm Bát Tràng thế kỷ 16-17 với các đường vân nứt tinh tế là:',
    questionEn: 'The legendary glaze style creating delicate cracked patterns unique to 16th-17th century Bat Trang pottery is:',
    optionsVi: ['Men Thủy tinh', 'Men Rạn tam thái', 'Men Dạ quang', 'Men Nhôm phủ'],
    optionsEn: ['Glass Glaze', 'Crackle Glaze (Men Rạn)', 'Phosphor Glaze', 'Aluminum Glaze'],
    correctIndex: 1,
    explanationVi: 'Men rạn là sáng tạo độc quyền của nghệ nhân Bát Tràng từ cuối thế kỷ 16, lợi dụng độ co ngót khác nhau giữa xương gốm và men để tạo mạng rạn hoa văn kỳ ảo.',
    explanationEn: 'Crackle glaze (Men Rạn) is an exclusive masterwork of Bat Trang craft exploiting differential thermal shrinkage.',
    sourceCitation: 'Cục Di sản Văn hóa - Bộ VHTTDL (2019)'
  }
];

export const INITIAL_COLLECTIBLES: CollectibleBadge[] = [
  {
    id: 'badge-trong-dong',
    nameVi: 'Trống Đồng Đông Sơn',
    nameEn: 'Dong Son Bronze Drum',
    descriptionVi: 'Biểu tượng thiêng liêng về tinh thần quật cường và nền văn minh lúa nước ngàn năm.',
    descriptionEn: 'Sacred symbol of Vietnamese metallurgical mastery and thousand-year ancient civilization.',
    category: 'Thần Khí Việt',
    icon: 'Sun',
    rarity: 'legendary',
    unlockedAt: '2026-08-24T00:00:00Z',
    requirementVi: 'Hoàn thành 3 ngày liên tiếp tìm hiểu di sản',
    requirementEn: 'Complete 3 consecutive daily heritage quests'
  },
  {
    id: 'badge-ao-nhat-binh',
    nameVi: 'Áo Nhật Bình Hoàng Cung',
    nameEn: 'Imperial Nhat Binh Robe',
    descriptionVi: 'Trang phục triều đình Huế với hoa văn ngũ sắc tượng trưng cho ngũ hành tương sinh.',
    descriptionEn: 'Hue Royal garment with five-color embroidery representing cosmological harmony.',
    category: 'Cung Đình Mỹ Nghệ',
    icon: 'Crown',
    rarity: 'epic',
    unlockedAt: '2026-08-24T00:00:00Z',
    requirementVi: 'Khám phá trọn vẹn Di sản Cố đô Huế',
    requirementEn: 'Explore the full Hue Royal Heritage module'
  },
  {
    id: 'badge-binh-men-ran',
    nameVi: 'Bình Gốm Men Rạn Cổ',
    nameEn: 'Antique Crackle Ceramic',
    descriptionVi: 'Nét tinh hoa gốm Bát Tràng kết tinh từ đất sét sông Hồng và ngọn lửa nung củi.',
    descriptionEn: 'Essence of Bat Trang pottery made of Red River clay and wood-fired kiln.',
    category: 'Bách Nghệ Tinh Hoa',
    icon: 'Sparkles',
    rarity: 'rare',
    requirementVi: 'Đạt điểm tuyệt đối trong bài trắc nghiệm Làng nghề',
    requirementEn: 'Score 100% on the Craft Village quiz'
  },
  {
    id: 'badge-dan-kim',
    nameVi: 'Đàn Kìm Dạ Cổ',
    nameEn: 'Moon Lute of the South',
    descriptionVi: 'Âm thanh của tri âm tri kỷ bên dòng sông Cửu Long sóng vỗ mạn thuyền.',
    descriptionEn: 'Soulful resonant chords across the waterways of the Mekong Delta.',
    category: 'Âm Sắc Phương Nam',
    icon: 'Music',
    rarity: 'rare',
    requirementVi: 'Lắng nghe 2 câu chuyện Đờn ca Tài tử',
    requirementEn: 'Listen to 2 Don Ca Tai Tu audio narratives'
  },
  {
    id: 'badge-den-long-hoi-an',
    nameVi: 'Đèn Lồng Phố Hội',
    nameEn: 'Hoi An Silk Lantern',
    descriptionVi: 'Ngọn đèn lụa soi bóng dòng sông Hoài, biểu tượng của sự may mắn và bình an.',
    descriptionEn: 'Glowing silk lantern lighting up the Thu Bon river, symbolizing peace and luck.',
    category: 'Phố Cổ Lung Linh',
    icon: 'Flame',
    rarity: 'common',
    requirementVi: 'Ghé thăm trang Khám phá Hội An',
    requirementEn: 'Visit the Hoi An discovery showcase'
  }
];

export const INITIAL_ARTISANS: ArtisanProfile[] = [
  {
    id: 'artisan-bat-trang-vu',
    name: 'Nghệ nhân Ưu tú Vũ Đức Thắng',
    craftTypeVi: 'Nghệ thuật Men Rạn & Gốm Đắp Nổi',
    craftTypeEn: 'Crackle Glaze & Relief Ceramics',
    villageVi: 'Làng gốm Bát Tràng',
    villageEn: 'Bat Trang Pottery Village',
    provinceVi: 'Hà Nội',
    provinceEn: 'Hanoi',
    experienceYears: 42,
    storyVi: 'Hơn 4 thập kỷ giữ hồn đất sét sông Hồng, nghệ nhân Vũ Đức Thắng đã phục chế thành công dòng men rạn cổ thời Lê - Mạc và đào tạo hàng trăm thợ trẻ tại xưởng gốm Hồn Đất Việt.',
    storyEn: 'With over 40 years dedicated to Red River clay, Master Vu Duc Thang successfully revived Le-Mac era crackle glaze formulas and mentored hundreds of young ceramists.',
    heritageId: 'gom-su-bat-trang',
    contactPhone: '+84 912 xxx 678',
    socialOrShopUrl: 'https://mia.vn/cam-nang-du-lich/tham-quan-lang-gom-bat-trang-18795',
    footfallCount: 1420,
    verifiedMaster: true,
    avatar: 'https://gomsubattranghaotho.vn/uploads/2022/10/nghe-nhan-vu-duc-thang.jpg',
    sampleProducts: [
      { nameVi: 'Bình hút tài lộc Men rạn Phù điêu Hoa Sen', nameEn: 'Lotus Relief Crackle Wealth Vase', priceVnd: 1850000, descriptionVi: 'Gốm thủ công vuốt tay, men rạn ngà độc bản.' },
      { nameVi: 'Bộ ấm chén men lam cổ Trúc Lâm', nameEn: 'Truc Lam Blue Glaze Tea Set', priceVnd: 750000, descriptionVi: 'Họa tiết vẽ tay tinh xảo, giữ nhiệt trà thơm.' }
    ]
  },
  {
    id: 'artisan-tan-chau-tam',
    name: 'Nghệ nhân Tám Lăng',
    craftTypeVi: 'Lụa Lãnh Mỹ A (Mặc Nưa tự nhiên)',
    craftTypeEn: 'Lanh My A Silk (Natural Mac Nua Dye)',
    villageVi: 'Làng lụa Tân Châu',
    villageEn: 'Tan Chau Silk Village',
    provinceVi: 'An Giang',
    provinceEn: 'An Giang',
    experienceYears: 50,
    storyVi: 'Gia tộc 3 đời nhuộm lụa tơ tằm bằng trái mặc nưa rừng. Tấm lụa Lãnh Mỹ A đen huyền óng ả, càng mặc càng bóng mềm như da người phụ nữ Nam Bộ.',
    storyEn: 'Three generations preserving 100% natural Mac Nua fruit dyeing technique. The legendary jet-black silk becomes smoother and more lustrous with every wear.',
    heritageId: 'don-ca-tai-tu-nam-bo',
    contactPhone: '+84 908 xxx 432',
    socialOrShopUrl: 'https://www.vietnamtourism.org.vn/attractions/culture/craft-villages/tan-chau-silk-making-village.html',
    footfallCount: 890,
    verifiedMaster: true,
    avatar: 'https://thiennhienmoitruong.vn/upload2024/images/a-phuong-1/btv-phuong-9/81c.png',
    sampleProducts: [
      { nameVi: 'Khăn choàng Lãnh Mỹ A Mặc Nưa', nameEn: 'Lanh My A Black Mac Nua Scarf', priceVnd: 2200000, descriptionVi: '100% tơ tằm thượng hạng nhuộm trái mặc nưa.' },
      { nameVi: 'Túi vải lụa tơ tằm thêu tay hoa sen', nameEn: 'Hand-embroidered Silk Pouch', priceVnd: 450000, descriptionVi: 'Thiết kế tối giản sang trọng mang hơi thở miệt vườn.' }
    ]
  },
  {
    id: 'artisan-phuong-duc-dong',
    name: 'Nghệ nhân Đúc Đồng Nguyễn Văn Niệm',
    craftTypeVi: 'Nghề đúc đồng cổ truyền Cung đình',
    craftTypeEn: 'Imperial Bronze Casting',
    villageVi: 'Làng Phường Đúc',
    villageEn: 'Phuong Duc Bronze Casting Village',
    provinceVi: 'Thừa Thiên Huế',
    provinceEn: 'Thua Thien Hue',
    experienceYears: 38,
    storyVi: 'Kế thừa bí quyết phối đồng, nấu khuôn đất sét từ thời chúa Nguyễn để đúc đại hồng chung và vạc đồng hoàng cung uy nghi trường tồn qua bao mưa nắng.',
    storyEn: 'Inheritor of 300-year-old bronze bell casting formulas for Hue imperial pagodas and dynastic monuments.',
    heritageId: 'nha-nhac-cung-dinh-hue',
    contactPhone: '+84 935 xxx 233',
    socialOrShopUrl: 'https://langngheviet.com.vn/nghe-nhan-ban-tay-vang-nghe-duc-dong-xu-hue-20052.html',
    footfallCount: 1150,
    verifiedMaster: true,
    avatar: 'https://langngheviet.com.vn/stores/news_dataimages/langnghevietcomvn/112020/05/09/nghe-nhan-ban-tay-vang-nghe-duc-dong-xu-hue-32-.6494.jpg',
    sampleProducts: [
      { nameVi: 'Chuông đồng chạm khắc hoa văn Cung đình Huế', nameEn: 'Imperial Carved Bronze Bell', priceVnd: 1200000, descriptionVi: 'Âm thanh ngân vang thanh thoát, đúc thủ công.' },
      { nameVi: 'Tượng Trống đồng Đông Sơn mini nguyên khối', nameEn: 'Solid Mini Dong Son Drum', priceVnd: 680000, descriptionVi: 'Tỉ lệ chuẩn theo bảo vật quốc gia.' }
    ]
  }
];
