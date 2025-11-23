import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFiles = [
  'Scope_and_Sequence_CAPA_1763795921400.html',
  'Scope_and_Sequence_Computing_Technology_1763795921400.html',
  'Scope_and_Sequence_Dance_1763795921402.html',
  'Scope_and_Sequence_Drama_1763795921403.html',
  'Scope_and_Sequence_D&T_1763795921401.html',
  'Scope_and_Sequence_English_1763795921404.html',
  'Scope_and_Sequence_HSIE_1763795921404.html',
  'Scope_and_Sequence_LOTE_1763795921405.html',
  'Scope_and_Sequence_Maths_1763795921406.html',
  'Scope_and_Sequence_Music_1763795921407.html',
  'Scope_and_Sequence_PDHPE_1763795921408.html',
  'Scope_and_Sequence_Science_1763795921408.html',
  'Scope_and_Sequence_TAS_1763795921409.html',
  'Scope_and_Sequence_Visual Arts_1763795921410.html',
];

const subjectMap = {
  'CAPA': 'capa',
  'Computing_Technology': 'computing',
  'Dance': 'dance',
  'Drama': 'drama',
  'D&T': 'design-tech',
  'English': 'english',
  'HSIE': 'hsie',
  'LOTE': 'lote',
  'Maths': 'maths',
  'Music': 'music',
  'PDHPE': 'pdhpe',
  'Science': 'science',
  'TAS': 'tas',
  'Visual Arts': 'visual-arts',
};

const allSubjects = {};

htmlFiles.forEach((filename) => {
  const filePath = path.join(__dirname, '../attached_assets', filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const scopeMatch = content.match(/const scopeAndSequenceData = ({[\s\S]*?});/);
  const unitsMatch = content.match(/const unitDetailsData = ({[\s\S]*?});[\s\S]*?<\/script>/);
  
  if (scopeMatch && unitsMatch) {
    const scopeData = eval(`(${scopeMatch[1]})`);
    const unitsData = eval(`(${unitsMatch[1]})`);
    
    const subjectKey = filename.replace('Scope_and_Sequence_', '').replace('_1763795921', '').replace(/\.html$/, '').replace(/\d{3}$/, '');
    const subjectId = subjectMap[subjectKey];
    
    if (subjectId) {
      allSubjects[subjectId] = {
        scopeAndSequence: scopeData,
        unitDetails: unitsData,
      };
    }
  }
});

const outputPath = path.join(__dirname, '../server/curriculum-data.json');
fs.writeFileSync(outputPath, JSON.stringify(allSubjects, null, 2));

console.log(`Extracted data for ${Object.keys(allSubjects).length} subjects`);
console.log('Data saved to server/curriculum-data.json');
