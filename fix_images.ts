import { db } from './src/lib/firebase.ts';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { INITIAL_HERITAGE_ITEMS } from './src/data/heritageKnowledge.ts';

const HERITAGES_COLLECTION = 'heritages';

async function fixImages() {
  console.log('Fetching heritages...');
  const querySnapshot = await getDocs(collection(db, HERITAGES_COLLECTION));
  const initialIds = new Set(INITIAL_HERITAGE_ITEMS.map(i => i.id));

  for (const docSnap of querySnapshot.docs) {
    const item = docSnap.data();
    if (!initialIds.has(item.id)) {
      if (!item.heroImage.includes('tse1.mm.bing.net')) {
        const query = `Hinh anh ${item.titleVi}`;
        const newImage = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(query)}`;
        await updateDoc(doc(db, HERITAGES_COLLECTION, item.id), { heroImage: newImage });
        console.log(`Updated image for ${item.titleVi}: ${newImage}`);
      }
    }
  }
  console.log('Fix complete.');
  process.exit(0);
}
fixImages().catch(console.error);
