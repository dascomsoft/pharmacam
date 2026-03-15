// scripts/test-import.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 TEST D\'IMPORT GITHUB ACTIONS');
console.log('='.repeat(50));

// 1. Vérifier le dossier courant
console.log('📁 Dossier courant:', process.cwd());
console.log('📁 __dirname:', __dirname);

// 2. Vérifier le chemin vers client.js
const clientPath = path.resolve(process.cwd(), 'src/lib/db/client.js');
console.log('\n🔍 Chemin client.js:', clientPath);
console.log('📁 Fichier existe?', fs.existsSync(clientPath) ? '✅ OUI' : '❌ NON');

if (fs.existsSync(clientPath)) {
  console.log('📄 Contenu (début):');
  const content = fs.readFileSync(clientPath, 'utf8');
  console.log(content.split('\n').slice(0, 3).join('\n'));
}

// 3. Vérifier le chemin relatif
const relativePath = path.join(__dirname, '../src/lib/db/client.js');
console.log('\n🔍 Chemin relatif:', relativePath);
console.log('📁 Fichier existe?', fs.existsSync(relativePath) ? '✅ OUI' : '❌ NON');

// 4. Lister le dossier db
const dbDir = path.resolve(process.cwd(), 'src/lib/db');
console.log('\n📁 Contenu du dossier src/lib/db/:');
if (fs.existsSync(dbDir)) {
  const files = fs.readdirSync(dbDir);
  files.forEach(f => console.log(`   - ${f}`));
} else {
  console.log('❌ Dossier non trouvé!');
  
  // Lister le dossier lib
  const libDir = path.resolve(process.cwd(), 'src/lib');
  console.log('\n📁 Contenu du dossier src/lib/:');
  if (fs.existsSync(libDir)) {
    const files = fs.readdirSync(libDir);
    files.forEach(f => console.log(`   - ${f}`));
  }
}