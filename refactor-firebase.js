import fs from 'fs';

let content = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

const importRegex = /import firebaseConfig from '\.\.\/\.\.\/firebase-applet-config\.json';\n/;
content = content.replace(importRegex, '');

const helper = `
const getEnvVar = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return '';
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),
  oAuthClientId: getEnvVar('VITE_FIREBASE_OAUTH_CLIENT_ID'),
  firestoreDatabaseId: getEnvVar('VITE_FIREBASE_FIRESTORE_DATABASE_ID'),
};
`;

content = content.replace('// Initialize Firebase App', helper + '\n// Initialize Firebase App');

fs.writeFileSync('src/lib/firebase.ts', content);
console.log('Firebase config refactored.');
