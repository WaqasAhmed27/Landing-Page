import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// replace px-6 with px-8 md:px-16 lg:px-24
content = content.replace(/px-6/g, 'px-8 md:px-16 lg:px-24');

fs.writeFileSync('src/App.tsx', content);
