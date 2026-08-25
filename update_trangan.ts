import { db } from './src/lib/firebase.ts';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const HERITAGES_COLLECTION = 'heritages';

async function check() {
  const querySnapshot = await getDocs(collection(db, HERITAGES_COLLECTION));
  for (const docSnap of querySnapshot.docs) {
    const item = docSnap.data();
    if (item.titleVi && item.titleVi.toLowerCase().includes('tràng an')) {
      console.log(`Found: [${item.id}] ${item.titleVi}`);
      if (item.titleVi.toLowerCase().includes('đền trình') || item.titleVi.toLowerCase().includes('tràng an')) {
         await updateDoc(doc(db, HERITAGES_COLLECTION, item.id), {
           heroImage: 'https://dulichtoday.vn/wp-content/uploads/2019/11/den-trinh-trang-an.jpg'
         });
         console.log('-> Updated this item');
      }
    }
  }
  process.exit(0);
}
check().catch(console.error);
