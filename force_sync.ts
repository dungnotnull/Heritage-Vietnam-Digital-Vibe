import { db } from './src/lib/firebase.ts';
import { doc, setDoc } from 'firebase/firestore';
import { INITIAL_HERITAGE_ITEMS } from './src/data/heritageKnowledge.ts';

const HERITAGES_COLLECTION = 'heritages';

async function forceSync() {
  console.log('Force syncing local heritageKnowledge to Firestore...');
  for (const item of INITIAL_HERITAGE_ITEMS) {
    const docRef = doc(db, HERITAGES_COLLECTION, item.id);
    await setDoc(docRef, item, { merge: true });
    console.log(`Synced ${item.id}`);
  }
  console.log('Done!');
  process.exit(0);
}

forceSync().catch(console.error);
