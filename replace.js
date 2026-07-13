import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(/#fffdf7/g, '#FDFBEE');
content = content.replace(/#22c55e/g, '#4ADE80');
content = content.replace(/rgba\(34,197,94,1\)/g, 'rgba(74,222,128,1)');
content = content.replace(/#ffe449/g, '#FFF248');

// Also update hover effects for buttons:
// hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
content = content.replace(/hover:translate-x-\[2px\] hover:translate-y-\[2px\] hover:shadow-\[2px_2px_0px_0px_rgba\(0,0,0,1\)\]/g, 'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none');

content = content.replace(/hover:translate-x-\[2px\] hover:translate-y-\[2px\] hover:shadow-\[4px_4px_0px_0px_rgba\(0,0,0,1\)\]/g, 'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none');

fs.writeFileSync('src/App.tsx', content);
