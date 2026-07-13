import fs from 'fs';
const file = 'src/App.tsx';
const content = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file, content.replace(/1130px/g, '70.625rem'));
console.log('done');
