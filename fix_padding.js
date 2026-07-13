import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace background
content = content.replace(/bg-\[#e5e5e5\]/g, 'bg-white');

// Double padding
content = content.replace(/px-8 md:px-16 lg:px-24/g, 'px-16 md:px-32 lg:px-48');

fs.writeFileSync('src/App.tsx', content);
