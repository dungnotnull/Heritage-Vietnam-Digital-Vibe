import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  MapPin, Sparkles, Navigation, Layers, Compass, ExternalLink, 
  ShieldCheck, Eye, Box, ZoomIn, ZoomOut, RotateCcw, Info, Flag, 
  Anchor, Waves, Map as MapIcon, Globe, CheckCircle2, ChevronRight,
  Maximize2
} from 'lucide-react';
import { HeritageItem, Language } from '../types';

interface VietnamHeritageMapProps {
  heritages: HeritageItem[];
  selectedHeritageId: string;
  onSelectHeritage: (heritage: HeritageItem) => void;
  onExploreAr?: (heritage: HeritageItem) => void;
  language: Language;
}

interface IslandInfo {
  id: string;
  nameVi: string;
  nameEn: string;
  adminVi: string;
  adminEn: string;
  coordsText: string;
  coordinates: { lat: number; lng: number };
  zoomLevel: number;
  descriptionVi: string;
  descriptionEn: string;
  historicalProofVi: string;
  historicalProofEn: string;
  islandsListVi: string[];
  islandsListEn: string[];
}

const SOVEREIGNTY_DATA: Record<string, IslandInfo> = {
  'hoang-sa': {
    id: 'hoang-sa',
    nameVi: 'Quần đảo Hoàng Sa',
    nameEn: 'Paracel Islands (Hoang Sa Archipelago)',
    adminVi: 'Huyện Hoàng Sa, Thành phố Đà Nẵng, Việt Nam',
    adminEn: 'Hoang Sa District, Da Nang City, Vietnam',
    coordsText: '15°45′N - 17°15′N, 111°00′E - 113°00′E (Biển Đông)',
    coordinates: { lat: 16.5333, lng: 112.0000 },
    zoomLevel: 8,
    descriptionVi: 'Quần đảo san hô thiêng liêng trên Biển Đông gồm hơn 30 đảo, cồn, bãi đá ngầm chia làm 2 nhóm chính: Nhóm An Vĩnh (Đảo Phú Lâm, Đảo Cây, Đảo Linh Côn) và Nhóm Lưỡi Liềm/Trăng Khuyết (Đảo Hoàng Sa, Đảo Tri Tôn, Đảo Quang Hòa, Đảo Duy Mộng). Việt Nam có đầy đủ bằng chứng lịch sử và cơ sở pháp lý khẳng định chủ quyền trọn vẹn và liên tục.',
    descriptionEn: 'Sacred coral archipelago in the East Sea with over 30 islands, cays, and reefs in two main groups: Amphitrite and Crescent. Vietnam possesses indisputable historical evidence and continuous lawful sovereignty.',
    historicalProofVi: 'Từ thế kỷ 17, các chúa Nguyễn đã lập Đội Hoàng Sa kiêm quản Bắc Hải hàng năm giong thuyền buồm ra Hoàng Sa cắm mốc chủ quyền, đo vẽ thủy trình và thu lượm hải vật. Được ghi nhận trong "Phủ biên tạp lục" (Lê Quý Đôn 1776), "Đại Nam thực lục", Châu bản triều Nguyễn và "Đại Nam nhất thống toàn đồ" (1838).',
    historicalProofEn: 'Since the 17th century, Nguyen Lords established the Hoang Sa flotilla to patrol, map sea routes, and erect sovereignty markers annually, meticulously documented in official dynastic archives including Phu Bien Tap Luc (1776) and the 1838 Dai Nam Complete Map.',
    islandsListVi: ['Đảo Hoàng Sa (Pattle)', 'Đảo Phú Lâm (Woody)', 'Đảo Tri Tôn (Triton)', 'Đảo Cây (Tree)', 'Đảo Quang Hòa (Duncan)', 'Đảo Linh Côn (Lincoln)', 'Đảo Duy Mộng', 'Đảo Hữu Nhật', 'Đảo Bạch Quy'],
    islandsListEn: ['Pattle Island', 'Woody Island', 'Triton Island', 'Tree Island', 'Duncan Island', 'Lincoln Island', 'Drummond Island', 'Robert Island', 'Passu Keah']
  },
  'truong-sa': {
    id: 'truong-sa',
    nameVi: 'Quần đảo Trường Sa',
    nameEn: 'Spratly Islands (Truong Sa Archipelago)',
    adminVi: 'Huyện Trường Sa, Tỉnh Khánh Hòa, Việt Nam',
    adminEn: 'Truong Sa District, Khanh Hoa Province, Vietnam',
    coordsText: '6°30′N - 12°00′N, 111°30′E - 117°20′E (Biển Đông)',
    coordinates: { lat: 9.5000, lng: 114.5000 },
    zoomLevel: 7,
    descriptionVi: 'Quần đảo tiền tiêu phía Nam Biển Đông với hơn 100 đảo, đá, bãi ngầm trải dài trên hải trình quốc tế huyết mạch. Cương vực thiêng liêng được bao thế hệ người Việt gìn giữ, với hệ thống phòng thủ vững chắc và các cụm Nhà giàn DK1 trên thềm lục địa phía Nam.',
    descriptionEn: 'Southern vanguard archipelago of over 100 islands, reefs, and cays across critical international sea lanes, safeguarded by generations of Vietnamese soldiers and fishermen.',
    historicalProofVi: 'Nhà nước phong kiến Việt Nam đã thực thi chủ quyền hòa bình, liên tục và hợp pháp tại Trường Sa suốt nhiều thế kỷ. Các đội thuyền buồm Bắc Hải dưới sự chỉ đạo của triều đình Huế đã liên tục khảo sát, cắm mốc và bảo vệ cương giới.',
    historicalProofEn: 'Vietnam has established continuous, peaceful, and lawful state sovereignty over the Spratlys for centuries through official imperial patrols, cartographic expeditions, and administrative decrees.',
    islandsListVi: ['Đảo Trường Sa Lớn', 'Đảo Song Tử Tây', 'Đảo Sinh Tồn', 'Đảo Nam Yết', 'Đảo Sơn Ca', 'Đảo Phan Vinh', 'Đảo An Bang', 'Đảo Thuyền Chài', 'Đảo Đá Tây', 'Cụm Nhà giàn DK1'],
    islandsListEn: ['Spratly Island', 'Southwest Cay', 'Sin Cowe Island', 'Namyit Island', 'Sand Cay', 'Pearson Reef', 'Amboyna Cay', 'Barque Canada Reef', 'West Reef', 'DK1 Offshore Platforms']
  },
  'phu-quoc': {
    id: 'phu-quoc',
    nameVi: 'Thành phố Đảo Phú Quốc',
    nameEn: 'Phu Quoc Island City',
    adminVi: 'Tỉnh Kiên Giang, Vịnh Thái Lan, Việt Nam',
    adminEn: 'Kien Giang Province, Gulf of Thailand, Vietnam',
    coordsText: '10°13′N, 103°57′E (Vịnh Thái Lan)',
    coordinates: { lat: 10.2289, lng: 103.9572 },
    zoomLevel: 10,
    descriptionVi: 'Đảo ngọc lớn nhất Việt Nam với diện tích 589 km², nổi tiếng với nghề làm nước mắm truyền thống hơn 200 năm, nuôi cấy ngọc trai và khu dự trữ sinh quyển thế giới UNESCO.',
    descriptionEn: 'Vietnam’s largest island spanning 589 km², world-renowned for traditional fish sauce crafting, pearl farming, and UNESCO biosphere reserve.',
    historicalProofVi: 'Gắn liền với công cuộc khai phá phương Nam của Mạc Cửu đầu thế kỷ 18 dâng vùng đất Hà Tiên - Phú Quốc cho Chúa Nguyễn Phúc Chu (1708), là căn cứ lịch sử thời chúa Nguyễn Ánh.',
    historicalProofEn: 'Developed during southern pioneering under Mac Cuu who integrated the archipelago into Lord Nguyen Phuc Chu’s territory in 1708.',
    islandsListVi: ['Đảo Phú Quốc', 'Quần đảo An Thới (18 hòn đảo)', 'Quần đảo Thổ Chu', 'Quần đảo Nam Du'],
    islandsListEn: ['Phu Quoc Main Island', 'An Thoi Archipelago (18 islets)', 'Tho Chu Archipelago', 'Nam Du Archipelago']
  },
  'con-dao': {
    id: 'con-dao',
    nameVi: 'Quần đảo Côn Đảo',
    nameEn: 'Con Dao Archipelago',
    adminVi: 'Huyện Côn Đảo, Tỉnh Bà Rịa - Vũng Tàu, Việt Nam',
    adminEn: 'Con Dao District, Ba Ria - Vung Tau Province, Vietnam',
    coordsText: '8°41′N, 106°36′E (Biển Đông)',
    coordinates: { lat: 8.6833, lng: 106.6000 },
    zoomLevel: 11,
    descriptionVi: 'Quần đảo gồm 16 hòn đảo ngoài khơi Nam Bộ, sở hữu vườn quốc gia Côn Đảo với hệ sinh thái rạn san hô, bãi đẻ rùa biển quý hiếm và di tích lịch sử quốc gia đặc biệt.',
    descriptionEn: '16-island archipelago off the southern coast featuring Con Dao National Park coral reefs, sea turtle sanctuaries, and special national historic sites.',
    historicalProofVi: 'Được ghi nhận trong các bản đồ hàng hải quốc tế từ thế kỷ 16 và địa bạ triều Nguyễn, giữ vị thế tiền tiêu kiểm soát hải trình Biển Đông.',
    historicalProofEn: 'Recorded in international maritime cartography since the 16th century and Nguyen Dynasty gazetteers as a strategic maritime sentinel.',
    islandsListVi: ['Đảo Côn Sơn (Côn Lôn)', 'Hòn Bảy Cạnh', 'Hòn Cau', 'Hòn Bà', 'Hòn Trứng'],
    islandsListEn: ['Con Son Island', 'Bay Canh Islet', 'Cau Islet', 'Ba Islet', 'Trung Islet']
  },
  'ly-son': {
    id: 'ly-son',
    nameVi: 'Đảo Lý Sơn (Cù Lao Ré)',
    nameEn: 'Ly Son Island (Cu Lao Re)',
    adminVi: 'Huyện Lý Sơn, Tỉnh Quảng Ngãi, Việt Nam',
    adminEn: 'Ly Son District, Quang Ngai Province, Vietnam',
    coordsText: '15°22′N, 109°07′E (Biển Đông)',
    coordinates: { lat: 15.3789, lng: 109.1245 },
    zoomLevel: 12,
    descriptionVi: 'Cái nôi của Đội hùng binh Hoàng Sa thời các chúa Nguyễn và triều Nguyễn. Nơi lưu giữ hàng trăm tư liệu, sắc phong, văn tế và Lễ Khao lề thế lính Hoàng Sa bất hủ.',
    descriptionEn: 'The sacred birthplace of the historic Hoang Sa flotilla, preserving ancestral imperial decrees and the heroic Khao Le The Linh Hoang Sa ritual.',
    historicalProofVi: 'Đình làng An Vĩnh và Âm linh tự trên đảo Lý Sơn là nơi tế tự thiêng liêng các thế hệ tráng đinh đã hy sinh thân mình vì chủ quyền biển đảo Tổ quốc từ hơn 400 năm trước.',
    historicalProofEn: 'An Vinh communal hall and Am Linh shrine stand as living testaments to generations of naval pioneers defending national sovereignty.',
    islandsListVi: ['Đảo Lớn (Cù Lao Ré)', 'Đảo Bé (An Bình)', 'Hòn Mù Cu'],
    islandsListEn: ['Big Island (Cu Lao Re)', 'Little Island (An Binh)', 'Mu Cu Islet']
  },
  'bach-long-vi': {
    id: 'bach-long-vi',
    nameVi: 'Đảo Bạch Long Vĩ',
    nameEn: 'Bach Long Vi Island',
    adminVi: 'Huyện đảo Bạch Long Vĩ, TP. Hải Phòng, Việt Nam',
    adminEn: 'Bach Long Vi Island District, Hai Phong City, Vietnam',
    coordsText: '20°08′N, 107°43′E (Vịnh Bắc Bộ)',
    coordinates: { lat: 20.1333, lng: 107.7167 },
    zoomLevel: 11,
    descriptionVi: 'Đảo tiền tiêu trọng yếu giữa Vịnh Bắc Bộ, cách đất liền Hải Phòng 110 km, là trung tâm dịch vụ hậu cần nghề cá và bảo vệ chủ quyền an ninh biển đảo phía Bắc.',
    descriptionEn: 'Strategic sentinel island in the middle of the Gulf of Tonkin, 110 km offshore Hai Phong.',
    historicalProofVi: 'Nằm trọn trong vùng phân định Vịnh Bắc Bộ theo luật pháp quốc tế và là huyện đảo anh hùng của Việt Nam.',
    historicalProofEn: 'Officially recognized within Vietnam’s sovereign maritime baseline under international maritime agreements.',
    islandsListVi: ['Đảo Bạch Long Vĩ'],
    islandsListEn: ['Bach Long Vi Island']
  }
};

// Map Layer Tile Sources
const TILE_LAYERS = {
  heritageDark: {
    nameVi: 'Bản đồ Di sản (Cổ kính)',
    nameEn: 'Heritage Dark Map',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    maxZoom: 19
  },
  satellite: {
    nameVi: 'Bản đồ Vệ tinh (Esri Imagery)',
    nameEn: 'Satellite Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
  },
  osmStandard: {
    nameVi: 'Bản đồ Tiêu chuẩn (Không chữ)',
    nameEn: 'Standard OpenStreetMap (No Labels)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abc',
    maxZoom: 19
  }
};

export const VietnamHeritageMap: React.FC<VietnamHeritageMapProps> = ({
  heritages,
  selectedHeritageId,
  onSelectHeritage,
  onExploreAr,
  language,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const boundaryLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const [activeTileKey, setActiveTileKey] = useState<keyof typeof TILE_LAYERS>('heritageDark');
  const [filterRegion, setFilterRegion] = useState<'all' | 'north' | 'central' | 'south' | 'islands'>('all');
  const [selectedIslandInfo, setSelectedIslandInfo] = useState<IslandInfo | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Heritage
  const activeHeritage = useMemo(() => {
    return heritages.find((h) => h.id === selectedHeritageId) || heritages[0];
  }, [heritages, selectedHeritageId]);

  
  const getCustomIcon = (item: HeritageItem, isSelected: boolean, language: Language) => {
    let badgeColor = 'bg-amber-600 border-amber-400 text-stone-950';
    if (item.region === 'north') badgeColor = 'bg-orange-600 border-orange-300 text-white';
    if (item.region === 'central') badgeColor = 'bg-rose-600 border-rose-300 text-white';
    if (item.region === 'south') badgeColor = 'bg-cyan-600 border-cyan-300 text-white';
    if (item.region === 'islands') badgeColor = 'bg-red-600 border-amber-300 text-amber-100 ring-2 ring-red-400';

    return L.divIcon({
      className: 'custom-heritage-pin-simple',
      html: `
        <div class="relative flex flex-col items-center justify-center cursor-pointer group">
          <div class="rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border-[3px] w-6 h-6 flex items-center justify-center transition-transform duration-300 ${isSelected ? 'scale-125 z-50 animate-pulse' : 'hover:scale-125 hover:z-50 z-40'} ${badgeColor.split(' ')[0]} ${badgeColor.split(' ')[1]}">
             <span class="w-2 h-2 bg-white rounded-full"></span>
          </div>
          <div class="absolute top-7 whitespace-nowrap bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-stone-700/50 ${isSelected ? 'block z-50' : 'hidden group-hover:block z-50'}">
            ${language === 'vi' ? item.titleVi : item.titleEn}
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Coordinates helper for heritages
  const getHeritageLatLng = (item: HeritageItem): [number, number] => {
    if (item.coordinates) {
      return [item.coordinates.lat, item.coordinates.lng];
    }
    switch (item.id) {
      case 'quan-ho-bac-ninh':
        return [21.186, 106.076];
      case 'gom-su-bat-trang':
        return [20.978, 105.913];
      case 'vinh-ha-long':
        return [20.9101, 107.1839];
      case 'trang-an-ninh-binh':
        return [20.251, 105.905];
      case 'nha-nhac-cung-dinh-hue':
        return [16.470, 107.580];
      case 'pho-co-hoi-an':
        return [15.880, 108.338];
      case 'le-khao-le-the-linh-hoang-sa':
        return [15.3789, 109.1245];
      case 'cong-chieng-tay-nguyen':
        return [13.9833, 108.000];
      case 'don-ca-tai-tu-nam-bo':
        return [9.294, 105.728];
      default:
        return [16.0471, 108.2068];
    }
  };

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center map on Vietnam territory (includes mainland + East Sea islands)
    const map = L.map(mapContainerRef.current, {
      center: [16.0, 108.0],
      zoom: 6,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false, // Custom controls
      attributionControl: true,
      maxBounds: [
        [3.0, 98.0], // Southwest bounds (covers Gulf of Thailand, southern islands)
        [26.0, 122.0] // Northeast bounds (covers North Vietnam, Paracel, Spratly)
      ]
    });

    // Add Tile Layer
    const tileConfig = TILE_LAYERS[activeTileKey];
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      subdomains: (tileConfig as any).subdomains || 'abc',
      maxZoom: tileConfig.maxZoom,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Create Layer Groups for markers & sovereignty polygons
    const boundaryLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    boundaryLayerGroupRef.current = boundaryLayer;
    markersLayerGroupRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Invalidate size on resize
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle Tile Layer Switch
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileConfig = TILE_LAYERS[activeTileKey];
    tileLayerRef.current.setUrl(tileConfig.url);
  }, [activeTileKey]);

  // 3. Render Sovereignty Maritime Zones & Islands
  useEffect(() => {
    const map = mapInstanceRef.current;
    const boundaryLayer = boundaryLayerGroupRef.current;
    if (!map || !boundaryLayer) return;

    boundaryLayer.clearLayers();

    // -------------------------------------------------------------
    // A. QUẦN ĐẢO HOÀNG SA (PARACEL ISLANDS - DA NANG CITY)
    // -------------------------------------------------------------
    const hoangSaBounds: [number, number][] = [
      [17.3, 111.0],
      [17.3, 113.2],
      [15.6, 113.2],
      [15.6, 111.0]
    ];

    const hoangSaPolygon = L.polygon(hoangSaBounds, {
      color: '#ef4444',
      weight: 2,
      dashArray: '5, 5',
      fillColor: '#ef4444',
      fillOpacity: 0.08,
    }).addTo(boundaryLayer);

    hoangSaPolygon.on('click', () => {
      setSelectedIslandInfo(SOVEREIGNTY_DATA['hoang-sa']);
      map.flyTo([16.5333, 112.0], 8, { duration: 1.2 });
    });

    // Custom Vietnamese Sovereignty Flag Icon for Hoang Sa
    const hoangSaFlagIcon = L.divIcon({
      className: 'custom-island-flag-icon',
      html: `
        <div class="flex flex-col items-center group cursor-pointer -translate-x-1/2 -translate-y-1/2">
          <div class="flex items-center gap-1.5 bg-red-600/95 hover:bg-red-500 text-amber-200 border-2 border-amber-400 px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-sm transition-transform group-hover:scale-110">
            <span class="text-sm">🇻🇳</span>
            <div class="flex flex-col text-left">
              <span class="text-[11px] font-extrabold text-amber-300 whitespace-nowrap leading-none">QUẦN ĐẢO HOÀNG SA</span>
              <span class="text-[8.5px] text-white/90 whitespace-nowrap leading-tight mt-0.5">TP. Đà Nẵng, Việt Nam</span>
            </div>
          </div>
          <div class="w-2 h-2 bg-red-600 rotate-45 -mt-1 border-r border-b border-amber-400"></div>
        </div>
      `,
      iconSize: [160, 40],
      iconAnchor: [80, 20],
    });

    const hoangSaMarker = L.marker([16.7, 112.1], { icon: hoangSaFlagIcon }).addTo(boundaryLayer);
    hoangSaMarker.on('click', () => {
      setSelectedIslandInfo(SOVEREIGNTY_DATA['hoang-sa']);
      map.flyTo([16.5333, 112.0], 8, { duration: 1.2 });
    });

    // Specific Major Islands in Paracel (Hoàng Sa)
    const hoangSaIslands = [
      { nameVi: 'Đảo Hoàng Sa (Pattle)', coords: [16.5333, 111.6000], isMain: true },
      { nameVi: 'Đảo Phú Lâm (Woody)', coords: [16.8333, 112.3333], isMain: true },
      { nameVi: 'Đảo Tri Tôn (Triton)', coords: [15.7833, 111.2000], isMain: false },
      { nameVi: 'Đảo Cây (Tree Island)', coords: [16.8833, 112.2667], isMain: false },
      { nameVi: 'Đảo Linh Côn (Lincoln)', coords: [16.6667, 112.7333], isMain: false },
      { nameVi: 'Đảo Quang Hòa (Duncan)', coords: [16.4500, 111.7000], isMain: false },
    ];

    hoangSaIslands.forEach(island => {
      const icon = L.divIcon({
        className: 'custom-sub-island-icon',
        html: `
          <div class="flex items-center gap-1 -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
            <span class="w-2.5 h-2.5 rounded-full ${island.isMain ? 'bg-amber-400 ring-2 ring-red-500 animate-pulse' : 'bg-red-400'} border border-stone-900 shadow-md"></span>
            <span class="text-[9px] font-bold text-amber-200 bg-stone-950/85 px-1.5 py-0.5 rounded border border-amber-500/40 whitespace-nowrap shadow-sm group-hover:text-amber-100">
              ${island.nameVi}
            </span>
          </div>
        `,
        iconSize: [120, 20],
        iconAnchor: [10, 10],
      });
      const m = L.marker(island.coords as [number, number], { icon }).addTo(boundaryLayer);
      m.on('click', () => {
        setSelectedIslandInfo(SOVEREIGNTY_DATA['hoang-sa']);
      });
    });

    // -------------------------------------------------------------
    // B. QUẦN ĐẢO TRƯỜNG SA (SPRATLY ISLANDS - KHANH HOA PROVINCE)
    // -------------------------------------------------------------
    const truongSaBounds: [number, number][] = [
      [12.2, 111.5],
      [12.2, 117.4],
      [6.8, 117.4],
      [6.8, 111.5]
    ];

    const truongSaPolygon = L.polygon(truongSaBounds, {
      color: '#ef4444',
      weight: 2,
      dashArray: '5, 5',
      fillColor: '#ef4444',
      fillOpacity: 0.08,
    }).addTo(boundaryLayer);

    truongSaPolygon.on('click', () => {
      setSelectedIslandInfo(SOVEREIGNTY_DATA['truong-sa']);
      map.flyTo([9.5, 114.5], 7, { duration: 1.2 });
    });

    // Custom Vietnamese Sovereignty Flag Icon for Truong Sa
    const truongSaFlagIcon = L.divIcon({
      className: 'custom-island-flag-icon',
      html: `
        <div class="flex flex-col items-center group cursor-pointer -translate-x-1/2 -translate-y-1/2">
          <div class="flex items-center gap-1.5 bg-red-600/95 hover:bg-red-500 text-amber-200 border-2 border-amber-400 px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-sm transition-transform group-hover:scale-110">
            <span class="text-sm">🇻🇳</span>
            <div class="flex flex-col text-left">
              <span class="text-[11px] font-extrabold text-amber-300 whitespace-nowrap leading-none">QUẦN ĐẢO TRƯỜNG SA</span>
              <span class="text-[8.5px] text-white/90 whitespace-nowrap leading-tight mt-0.5">Tỉnh Khánh Hòa, Việt Nam</span>
            </div>
          </div>
          <div class="w-2 h-2 bg-red-600 rotate-45 -mt-1 border-r border-b border-amber-400"></div>
        </div>
      `,
      iconSize: [160, 40],
      iconAnchor: [80, 20],
    });

    const truongSaMarker = L.marker([9.8, 114.2], { icon: truongSaFlagIcon }).addTo(boundaryLayer);
    truongSaMarker.on('click', () => {
      setSelectedIslandInfo(SOVEREIGNTY_DATA['truong-sa']);
      map.flyTo([9.5, 114.5], 7, { duration: 1.2 });
    });

    // Specific Major Islands in Spratly (Trường Sa)
    const truongSaIslands = [
      { nameVi: 'Đ. Trường Sa Lớn', coords: [8.6433, 111.9189], isMain: true },
      { nameVi: 'Đ. Song Tử Tây', coords: [11.4283, 114.3317], isMain: true },
      { nameVi: 'Đ. Sinh Tồn', coords: [9.8850, 114.3300], isMain: false },
      { nameVi: 'Đ. Nam Yết', coords: [10.1800, 114.3633], isMain: false },
      { nameVi: 'Đ. Sơn Ca', coords: [10.3767, 114.4783], isMain: false },
      { nameVi: 'Đ. Phan Vinh', coords: [8.9667, 113.6833], isMain: false },
      { nameVi: 'Đ. An Bang', coords: [7.8833, 112.9167], isMain: false },
      { nameVi: 'Đ. Thuyền Chài', coords: [8.1667, 113.3000], isMain: false },
      { nameVi: 'Cụm Nhà giàn DK1', coords: [7.5000, 110.5000], isMain: true },
    ];

    truongSaIslands.forEach(island => {
      const icon = L.divIcon({
        className: 'custom-sub-island-icon',
        html: `
          <div class="flex items-center gap-1 -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
            <span class="w-2.5 h-2.5 rounded-full ${island.isMain ? 'bg-amber-400 ring-2 ring-red-500 animate-pulse' : 'bg-red-400'} border border-stone-900 shadow-md"></span>
            <span class="text-[9px] font-bold text-amber-200 bg-stone-950/85 px-1.5 py-0.5 rounded border border-amber-500/40 whitespace-nowrap shadow-sm group-hover:text-amber-100">
              ${island.nameVi}
            </span>
          </div>
        `,
        iconSize: [120, 20],
        iconAnchor: [10, 10],
      });
      const m = L.marker(island.coords as [number, number], { icon }).addTo(boundaryLayer);
      m.on('click', () => {
        setSelectedIslandInfo(SOVEREIGNTY_DATA['truong-sa']);
      });
    });

    // -------------------------------------------------------------
    // C. KEY COASTAL SENTINEL ISLANDS (Phú Quốc, Côn Đảo, Lý Sơn, Bạch Long Vĩ)
    // -------------------------------------------------------------
    const coastalIslands = [
      { key: 'phu-quoc', nameVi: '★ TP. Đảo Phú Quốc', coords: [10.2289, 103.9572] },
      { key: 'con-dao', nameVi: '★ Quần đảo Côn Đảo', coords: [8.6833, 106.6000] },
      { key: 'ly-son', nameVi: '⚓ Đảo Lý Sơn (Đội Hoàng Sa)', coords: [15.3789, 109.1245] },
      { key: 'bach-long-vi', nameVi: 'Đảo Bạch Long Vĩ', coords: [20.1333, 107.7167] },
    ];

    coastalIslands.forEach(island => {
      const icon = L.divIcon({
        className: 'custom-coastal-island-icon',
        html: `
          <div class="flex items-center gap-1.5 -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
            <span class="w-3.5 h-3.5 rounded-full bg-amber-500 ring-2 ring-red-600 border-2 border-stone-900 shadow-md animate-pulse"></span>
            <span class="text-[10px] font-extrabold text-amber-100 bg-stone-950/90 px-2 py-0.5 rounded-md border border-amber-500/50 whitespace-nowrap shadow-md group-hover:text-amber-300">
              ${island.nameVi}
            </span>
          </div>
        `,
        iconSize: [140, 24],
        iconAnchor: [12, 12],
      });
      const m = L.marker(island.coords as [number, number], { icon }).addTo(boundaryLayer);
      m.on('click', () => {
        const info = SOVEREIGNTY_DATA[island.key];
        if (info) {
          setSelectedIslandInfo(info);
          map.flyTo(island.coords as [number, number], info.zoomLevel, { duration: 1.2 });
        }
      });
    });

  }, []);

  // 4. Render Heritage Markers & Popups
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerGroupRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const filtered = filterRegion === 'all'
      ? heritages
      : filterRegion === 'islands'
      ? heritages.filter(h => h.region === 'islands' || h.tags.some(t => t.includes('Hoàng Sa') || t.includes('Biển') || t.includes('Lý Sơn') || t.includes('Vịnh')))
      : heritages.filter(h => h.region === filterRegion);

    filtered.forEach((item) => {
      const coords = getHeritageLatLng(item);
      const isSelected = item.id === selectedHeritageId;

      let badgeColor = 'bg-amber-600 border-amber-400 text-stone-950';
      if (item.region === 'north') badgeColor = 'bg-orange-600 border-orange-300 text-white';
      if (item.region === 'central') badgeColor = 'bg-rose-600 border-rose-300 text-white';
      if (item.region === 'south') badgeColor = 'bg-cyan-600 border-cyan-300 text-white';
      if (item.region === 'islands') badgeColor = 'bg-red-600 border-amber-300 text-amber-100 ring-2 ring-red-400';

      const customIcon = L.divIcon({
        className: 'custom-heritage-pin-simple',
        html: `
          <div class="relative flex flex-col items-center justify-center cursor-pointer group">
            <div class="rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border-[3px] w-6 h-6 flex items-center justify-center transition-transform duration-300 ${isSelected ? 'scale-125 z-50 animate-pulse' : 'hover:scale-125 hover:z-50 z-40'} ${badgeColor.split(' ')[0]} ${badgeColor.split(' ')[1]}">
               <span class="w-2 h-2 bg-white rounded-full"></span>
            </div>
            <div class="absolute top-7 whitespace-nowrap bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-stone-700/50 ${isSelected ? 'block z-50' : 'hidden group-hover:block z-50'}">
              ${language === 'vi' ? item.titleVi : item.titleEn}
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(coords, { icon: customIcon }).addTo(markersLayer);

      // Popup with rich information and dark high-contrast theme
      const popupContent = `
        <div style="font-family: 'Be Vietnam Pro', sans-serif; min-width: 230px; max-width: 280px; padding: 10px; background: #1c1917; color: #f5f5f4; border-radius: 12px;">
          <img src="${item.heroImage}" alt="${item.titleVi}" style="width: 100%; height: 115px; object-fit: cover; border-radius: 10px; margin-bottom: 8px; border: 1px solid rgba(245, 158, 11, 0.35);" />
          <div style="font-size: 10px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.5px;">${item.province}</div>
          <div style="font-size: 14px; font-weight: 800; color: #fef3c7; margin: 2px 0 6px 0;">${language === 'vi' ? item.titleVi : item.titleEn}</div>
          <div style="font-size: 11px; color: #d6d3d1; line-height: 1.4; margin-bottom: 8px;">${language === 'vi' ? item.summaryVi : item.summaryEn}</div>
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            ${item.unescoYear ? `<span style="font-size: 9px; font-weight: 700; background: #0c4a6e; color: #7dd3fc; padding: 2px 6px; border-radius: 4px; border: 1px solid #0284c7;">UNESCO ${item.unescoYear}</span>` : ''}
            ${item.arArtifactId ? `<span style="font-size: 9px; font-weight: 700; background: #78350f; color: #fde68a; padding: 2px 6px; border-radius: 4px; border: 1px solid #d97706;">AR 3D</span>` : ''}
            <span style="font-size: 9px; font-weight: 600; background: #292524; color: #a8a29e; padding: 2px 6px; border-radius: 4px;">${item.category === 'tangible' ? (language === 'vi' ? 'Vật thể' : 'Tangible') : (language === 'vi' ? 'Phi vật thể' : 'Intangible')}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'heritage-leaflet-popup',
        closeButton: true,
        offset: [0, -35],
        autoPan: true,
        autoPanPadding: [40, 40],
        maxWidth: 290,
        minWidth: 230,
        keepInView: true,
      });

      marker.on('click', () => {
        onSelectHeritage(item);
        setSelectedIslandInfo(null); // đóng panel chủ quyền để hiện heritage detail
        map.flyTo(coords, Math.max(map.getZoom(), 8), { duration: 1.0 });
      });
    });

  }, [heritages, filterRegion, language]);

  // 5. Handle Selection Styles efficiently
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const item = heritages.find(h => h.id === id);
      if (item) {
        const isSelected = id === selectedHeritageId;
        marker.setIcon(getCustomIcon(item, isSelected, language));
      }
    });
  }, [selectedHeritageId, heritages, language]);

  // Handle fly to selected heritage when updated externally
  const handleFlyToHeritage = (item: HeritageItem) => {
    onSelectHeritage(item);
    if (mapInstanceRef.current) {
      const coords = getHeritageLatLng(item);
      mapInstanceRef.current.flyTo(coords, 9, { duration: 1.2 });
    }
  };

  // Quick Region Center Fly
  const handleQuickRegionFocus = (regionKey: 'all' | 'north' | 'central' | 'south' | 'hoang-sa' | 'truong-sa') => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    switch (regionKey) {
      case 'all':
        setFilterRegion('all');
        map.flyTo([16.0, 108.0], 6, { duration: 1.2 });
        break;
      case 'north':
        setFilterRegion('north');
        map.flyTo([21.0, 106.0], 8, { duration: 1.2 });
        break;
      case 'central':
        setFilterRegion('central');
        map.flyTo([16.2, 107.8], 8, { duration: 1.2 });
        break;
      case 'south':
        setFilterRegion('south');
        map.flyTo([10.2, 106.0], 8, { duration: 1.2 });
        break;
      case 'hoang-sa':
        setFilterRegion('islands');
        setSelectedIslandInfo(SOVEREIGNTY_DATA['hoang-sa']);
        map.flyTo([16.5333, 112.0], 8, { duration: 1.2 });
        break;
      case 'truong-sa':
        setFilterRegion('islands');
        setSelectedIslandInfo(SOVEREIGNTY_DATA['truong-sa']);
        map.flyTo([9.5, 114.5], 7, { duration: 1.2 });
        break;
    }
  };

  return (
    <div className={`w-full bg-gradient-to-b from-stone-900 via-stone-925 to-stone-950 rounded-3xl p-4 sm:p-7 border border-amber-900/40 shadow-2xl relative overflow-hidden transition-all ${isFullscreen ? 'fixed inset-0 z-50 rounded-none p-4' : ''}`}>
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-stone-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              {language === 'vi' ? 'Bản Đồ Di Sản Việt Nam' : 'Vietnam Heritage Map'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {language === 'vi' ? 'Hoàng Sa & Trường Sa là của Việt Nam' : 'Hoàng Sa and Trường Sa are inseparable parts of Vietnam'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heritage text-stone-100 mt-2 flex items-center gap-2">
            {language === 'vi' ? 'Không Gian Di Sản & Cương Vực Non Sông Việt Nam' : 'Geospatial Heritage Map of Vietnam'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
            {language === 'vi' 
              ? 'Xây dựng trên thư viện bản đồ số Leaflet với dữ liệu tọa độ địa lý chính xác, lớp nền vệ tinh, định vị các điểm di sản văn hóa cùng các quần đảo thiêng liêng Hoàng Sa, Trường Sa, Côn Đảo và Phú Quốc.'
              : 'Built with the Leaflet geospatial library with precise GPS coordinates, satellite layers, cultural heritage sites, and Vietnamese sovereign islands.'}
          </p>
        </div>

        {/* Map View & Layer Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-stone-900/90 p-1.5 rounded-2xl border border-stone-800 self-stretch sm:self-auto shadow-inner">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTileKey('heritageDark')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTileKey === 'heritageDark'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
              title="Bản đồ Di sản (CartoDB)"
            >
              🏛️ {language === 'vi' ? 'Di sản' : 'Heritage'}
            </button>
            <button
              onClick={() => setActiveTileKey('satellite')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTileKey === 'satellite'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
              title="Ảnh Vệ tinh (Esri Imagery)"
            >
              🛰️ {language === 'vi' ? 'Vệ tinh' : 'Satellite'}
            </button>
            <button
              onClick={() => setActiveTileKey('osmStandard')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTileKey === 'osmStandard'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
              title="Bản đồ Tiêu chuẩn (OSM)"
            >
              🗺️ {language === 'vi' ? 'Đường sá' : 'OSM'}
            </button>
          </div>

          {/* <div className="h-5 w-px bg-stone-700 mx-0.5" /> */}

          {/* <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl text-stone-300 hover:text-amber-300 hover:bg-stone-800 transition-colors cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            <Maximize2 className="w-4 h-4" />
          </button> */}
        </div>
      </div>

      {/* Region Fast Jump Bar */}
      <div className="flex flex-wrap items-center gap-1.5 py-3 border-b border-stone-800/80">
        <span className="text-xs font-bold text-stone-400 mr-1 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-amber-400" />
          {language === 'vi' ? 'Điểm đến:' : 'Jump to:'}
        </span>
        {[
          { id: 'all', labelVi: 'Toàn cảnh Việt Nam', action: () => handleQuickRegionFocus('all') },
          { id: 'north', labelVi: 'Bắc Bộ', action: () => handleQuickRegionFocus('north') },
          { id: 'central', labelVi: 'Trung Bộ & Tây Nguyên', action: () => handleQuickRegionFocus('central') },
          { id: 'south', labelVi: 'Nam Bộ', action: () => handleQuickRegionFocus('south') },
          { id: 'hoang-sa', labelVi: 'Quần đảo Hoàng Sa (Đà Nẵng)', action: () => handleQuickRegionFocus('hoang-sa') },
          { id: 'truong-sa', labelVi: 'Quần đảo Trường Sa (Khánh Hòa)', action: () => handleQuickRegionFocus('truong-sa') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={tab.action}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-amber-500/20 hover:text-amber-300 text-stone-300 border border-white/60 hover:border-amber-500/40 transition-all cursor-pointer"
          >
            {tab.labelVi}
          </button>
        ))}
      </div>

      {/* Main Grid: Leaflet Map (Left) & Heritage Detail / Sovereignty Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-start">
        
        {/* Left Column: Leaflet GIS Interactive Map */}
        <div className="lg:col-span-7 bg-stone-950 rounded-2xl p-2 sm:p-3 border border-stone-800 relative flex flex-col items-center justify-center min-h-[520px] sm:min-h-[640px] overflow-hidden shadow-2xl">
          
          {/* Custom Floating Zoom & Reset Map Controls */}
          <div className="absolute top-5 right-5 z-[1000] flex flex-col gap-1.5 bg-stone-900/90 backdrop-blur-md p-1.5 rounded-xl border border-stone-700 shadow-2xl">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              title="Phóng to"
              className="p-2 rounded-lg text-stone-200 hover:text-amber-300 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              title="Thu nhỏ"
              className="p-2 rounded-lg text-stone-200 hover:text-amber-300 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleQuickRegionFocus('all')}
              title="Mặc định toàn cảnh"
              className="p-2 rounded-lg text-stone-200 hover:text-amber-300 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Left Sovereignty Quick Badges */}
          <div className="absolute bottom-5 left-5 z-[1000] flex flex-wrap gap-2 pointer-events-auto">
            <button
              onClick={() => handleQuickRegionFocus('hoang-sa')}
              className="bg-red-950/90 hover:bg-red-900 border border-red-500/60 hover:border-amber-400 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-amber-200 shadow-2xl transition-all cursor-pointer flex items-center gap-1.5 group"
            >
              <Flag className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-amber-300">★ Quần đảo Hoàng Sa</span>
            </button>
            <button
              onClick={() => handleQuickRegionFocus('truong-sa')}
              className="bg-red-950/90 hover:bg-red-900 border border-red-500/60 hover:border-amber-400 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-amber-200 shadow-2xl transition-all cursor-pointer flex items-center gap-1.5 group"
            >
              <Flag className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-amber-300">★ Quần đảo Trường Sa</span>
            </button>
          </div>

          {/* The Actual Leaflet Map Canvas Container */}
          <div
            ref={mapContainerRef}
            className="w-full h-[500px] sm:h-[620px] rounded-xl overflow-hidden z-10"
            style={{ background: '#0c0a09' }}
          />
        </div>

        {/* Right Column: Selected Heritage Focus Panel OR Island Sovereignty Inspector */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* If Island Modal/Inspector is Active */}
          {selectedIslandInfo ? (
            <div className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 rounded-2xl p-5 border border-red-500/40 shadow-2xl relative overflow-hidden animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-red-500 fill-red-500" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                    {language === 'vi' ? 'Hồ Sơ Chủ Quyền Biển Đảo' : 'National Maritime Sovereignty Archive'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedIslandInfo(null)}
                  className="text-xs text-stone-400 hover:text-stone-200 px-2 py-1 rounded-lg bg-stone-800/80 cursor-pointer"
                >
                  {language === 'vi' ? 'Đóng' : 'Close'}
                </button>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold font-heritage text-amber-300">
                  {language === 'vi' ? selectedIslandInfo.nameVi : selectedIslandInfo.nameEn}
                </h3>
                <p className="text-xs font-medium text-red-300 mt-0.5">
                  {language === 'vi' ? selectedIslandInfo.adminVi : selectedIslandInfo.adminEn}
                </p>
                <div className="inline-block mt-1 text-[10px] text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800 font-mono">
                  {selectedIslandInfo.coordsText}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs text-stone-300 leading-relaxed">
                  {language === 'vi' ? selectedIslandInfo.descriptionVi : selectedIslandInfo.descriptionEn}
                </p>
              </div>

              {/* Historical Evidences Section */}
              <div className="mt-4 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 uppercase">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  {language === 'vi' ? 'Cơ sở Lịch sử & Pháp lý khẳng định chủ quyền:' : 'Historical & Legal Basis of Sovereignty:'}
                </span>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                  {language === 'vi' ? selectedIslandInfo.historicalProofVi : selectedIslandInfo.historicalProofEn}
                </p>
              </div>

              {/* Key Islands List */}
              <div className="mt-4">
                <span className="text-[11px] font-bold text-stone-400 mb-1.5 block">
                  {language === 'vi' ? 'Các đảo, cồn và rạn đá tiêu biểu:' : 'Key Islands, Cays & Reefs:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(language === 'vi' ? selectedIslandInfo.islandsListVi : selectedIslandInfo.islandsListEn).map((island, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-stone-950 text-stone-300 border border-stone-800 px-2 py-0.5 rounded-md"
                    >
                      {island}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button: Fly into Island Group */}
              <div className="mt-5 pt-3 border-t border-stone-800 flex gap-2">
                <button
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo(
                        [selectedIslandInfo.coordinates.lat, selectedIslandInfo.coordinates.lng],
                        selectedIslandInfo.zoomLevel,
                        { duration: 1.2 }
                      );
                    }
                  }}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-stone-950" />
                  <span>{language === 'vi' ? 'Phóng to Tọa độ Biển Đảo' : 'Fly to Island Coordinates'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Selected Heritage Dossier Card */
            <div className="bg-stone-900 rounded-2xl p-5 border border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {activeHeritage.province}
                </span>
                {activeHeritage.unescoYear && (
                  <span className="text-[10px] font-bold bg-blue-900/60 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded">
                    UNESCO {activeHeritage.unescoYear}
                  </span>
                )}
              </div>

              <div className="relative rounded-xl overflow-hidden border border-stone-800 h-44 group">
                <img
                  src={activeHeritage.heroImage}
                  alt={activeHeritage.titleVi}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold font-heritage text-white">
                    {language === 'vi' ? activeHeritage.titleVi : activeHeritage.titleEn}
                  </h3>
                  <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5">
                    {activeHeritage.artisanVillage}
                  </p>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                {language === 'vi' ? activeHeritage.summaryVi : activeHeritage.summaryEn}
              </p>

              {/* Verified Facts */}
              <div className="space-y-1.5 bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
                <div className="text-[11px] font-bold text-amber-300 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {language === 'vi' ? 'Dữ kiện Lịch sử Xác thực:' : 'Verified Grounded Facts:'}
                </div>
                <ul className="space-y-1 text-xs text-stone-300">
                  {activeHeritage.groundedFacts.slice(0, 2).map((fact, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span className="line-clamp-2">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                {activeHeritage.arArtifactId && onExploreAr && (
                  <button
                    onClick={() => onExploreAr(activeHeritage)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>{language === 'vi' ? 'Khám phá 3D AR' : 'Experience 3D AR'}</span>
                  </button>
                )}
                <button
                  onClick={() => handleFlyToHeritage(activeHeritage)}
                  className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Định vị tâm bản đồ"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'vi' ? 'Định vị' : 'Locate'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick List of All Cultural Sites (Fixed Height with Vertical Scroll) */}
          <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                {language === 'vi' ? 'Tọa độ Di sản trên Bản đồ' : 'Heritage Locations on Map'}
              </span>
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                {heritages.length} {language === 'vi' ? 'tọa độ' : 'sites'}
              </span>
            </div>
            
            <div className="h-44 sm:h-52 overflow-y-auto pr-1.5 space-y-1.5 scrollbar-thin scrollbar-thumb-amber-600/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {heritages.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleFlyToHeritage(item)}
                    className={`p-2 rounded-xl text-left text-xs transition-all cursor-pointer flex items-center justify-between border ${
                      selectedHeritageId === item.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold shadow-xs'
                        : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-amber-600/40 hover:text-white'
                    }`}
                  >
                    <span className="truncate mr-1">{language === 'vi' ? item.titleVi : item.titleEn}</span>
                    <ChevronRight className="w-3 h-3 flex-shrink-0 text-amber-500/70" />
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
