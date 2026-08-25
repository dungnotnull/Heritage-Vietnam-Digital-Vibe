import fs from 'fs';

let content = fs.readFileSync('src/components/VietnamHeritageMap.tsx', 'utf-8');

// 1. Add markersRef
content = content.replace(
  "const tileLayerRef = useRef<L.TileLayer | null>(null);",
  "const tileLayerRef = useRef<L.TileLayer | null>(null);\n  const markersRef = useRef<Record<string, L.Marker>>({});"
);

// 2. Extract getCustomIcon helper
const getCustomIconCode = `
  const getCustomIcon = (item: HeritageItem, isSelected: boolean, language: Language) => {
    let badgeColor = 'bg-amber-600 border-amber-400 text-stone-950';
    if (item.region === 'north') badgeColor = 'bg-orange-600 border-orange-300 text-white';
    if (item.region === 'central') badgeColor = 'bg-rose-600 border-rose-300 text-white';
    if (item.region === 'south') badgeColor = 'bg-cyan-600 border-cyan-300 text-white';
    if (item.region === 'islands') badgeColor = 'bg-red-600 border-amber-300 text-amber-100 ring-2 ring-red-400';

    return L.divIcon({
      className: 'custom-heritage-pin-simple',
      html: \`
        <div class="relative flex flex-col items-center justify-center cursor-pointer group">
          <div class="rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border-[3px] w-6 h-6 flex items-center justify-center transition-transform duration-300 \${isSelected ? 'scale-125 z-50 animate-pulse' : 'hover:scale-125 hover:z-50 z-40'} \${badgeColor.split(' ')[0]} \${badgeColor.split(' ')[1]}">
             <span class="w-2 h-2 bg-white rounded-full"></span>
          </div>
          <div class="absolute top-7 whitespace-nowrap bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-stone-700/50 \${isSelected ? 'block z-50' : 'hidden group-hover:block z-50'}">
            \${language === 'vi' ? item.titleVi : item.titleEn}
          </div>
        </div>
      \`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };
`;

content = content.replace(
  "// Coordinates helper for heritages",
  getCustomIconCode + "\n  // Coordinates helper for heritages"
);

// 3. Update useEffect for markers
const oldUseEffect = `    filtered.forEach((item) => {
      const coords = getHeritageLatLng(item);
      const isSelected = item.id === selectedHeritageId;

      let badgeColor = 'bg-amber-600 border-amber-400 text-stone-950';
      if (item.region === 'north') badgeColor = 'bg-orange-600 border-orange-300 text-white';
      if (item.region === 'central') badgeColor = 'bg-rose-600 border-rose-300 text-white';
      if (item.region === 'south') badgeColor = 'bg-cyan-600 border-cyan-300 text-white';
      if (item.region === 'islands') badgeColor = 'bg-red-600 border-amber-300 text-amber-100 ring-2 ring-red-400';

      const customIcon = L.divIcon({
        className: 'custom-heritage-pin-simple',
        html: \`
          <div class="relative flex flex-col items-center justify-center cursor-pointer group">
            <div class="rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border-[3px] w-6 h-6 flex items-center justify-center transition-transform duration-300 \${isSelected ? 'scale-125 z-50 animate-pulse' : 'hover:scale-125 hover:z-50 z-40'} \${badgeColor.split(' ')[0]} \${badgeColor.split(' ')[1]}">
               <span class="w-2 h-2 bg-white rounded-full"></span>
            </div>
            <div class="absolute top-7 whitespace-nowrap bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-stone-700/50 \${isSelected ? 'block z-50' : 'hidden group-hover:block z-50'}">
              \${language === 'vi' ? item.titleVi : item.titleEn}
            </div>
          </div>
        \`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(coords, { icon: customIcon }).addTo(markersLayer);`;

const newUseEffect = `    markersRef.current = {};
    filtered.forEach((item) => {
      const coords = getHeritageLatLng(item);
      const isSelected = item.id === selectedHeritageId;

      const customIcon = getCustomIcon(item, isSelected, language);
      const marker = L.marker(coords, { icon: customIcon }).addTo(markersLayer);
      markersRef.current[item.id] = marker;`;

content = content.replace(oldUseEffect, newUseEffect);

// 4. Update the dependencies of the first useEffect
content = content.replace(
  "}, [heritages, selectedHeritageId, filterRegion, language]);",
  "}, [heritages, filterRegion, language]);\n\n  // 5. Handle Selection Styles efficiently\n  useEffect(() => {\n    Object.entries(markersRef.current).forEach(([id, marker]) => {\n      const item = heritages.find(h => h.id === id);\n      if (item) {\n        const isSelected = id === selectedHeritageId;\n        marker.setIcon(getCustomIcon(item, isSelected, language));\n      }\n    });\n  }, [selectedHeritageId, heritages, language]);"
);

fs.writeFileSync('src/components/VietnamHeritageMap.tsx', content);
console.log('Done refactoring map markers for performance.');
