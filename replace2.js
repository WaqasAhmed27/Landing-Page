import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The Problem with Paper Cards
content = content.replace(/className="bg-white border-4 border-black rounded-\[2rem\] p-8 shadow-\[12px_12px_0px_0px_rgba\(0,0,0,1\)\]"/g, 'className="bg-white border-4 border-black rounded-[2rem] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_20px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer"');

// How it Works Cards
content = content.replace(/shadow-\[12px_12px_0px_0px_rgba\(0,0,0,1\)\]"/g, 'shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_20px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"');

// Form submit button 
content = content.replace(/shadow-\[8px_8px_0px_0px_rgba\(0,0,0,1\)\] hover:translate-x-\[2px\] hover:translate-y-\[2px\] hover:shadow-\[6px_6px_0px_0px_rgba\(0,0,0,1\)\] transition-all/g, 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all');

// Let's go buttons
content = content.replace(/shadow-\[8px_8px_0px_0px_rgba\(74,222,128,1\)\] hover:translate-x-\[2px\] hover:translate-y-\[2px\] hover:shadow-\[6px_6px_0px_0px_rgba\(74,222,128,1\)\] transition-all/g, 'shadow-[8px_8px_0px_0px_rgba(74,222,128,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(74,222,128,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all');

fs.writeFileSync('src/App.tsx', content);
