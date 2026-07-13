import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(/px-16 md:px-32 lg:px-48/g, 'px-6');
fs.writeFileSync('src/App.tsx', content);
