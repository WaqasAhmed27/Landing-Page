import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. The Problem with Paper section background
content = content.replace(
  /<section className="py-24 px-6 max-w-7xl mx-auto">([\s\S]*?)<Pill text="The Problem with Paper" colorClass="bg-\[#FFF248\]" \/>/g,
  '<section className="py-24 px-6 w-full bg-[#FFF248]">\n        <div className="max-w-7xl mx-auto">\n        <div className="flex justify-center mb-16">\n          <Pill text="The Problem with Paper" colorClass="bg-[#FFF248]" />'
);
// Fix the closing div for Problem with Paper
content = content.replace(
  /Every\. Single\. Year\. — There's a better way\.\n          <\/div>\n        <\/div>\n      <\/section>/g,
  'Every. Single. Year. — There\'s a better way.\n          </div>\n        </div>\n        </div>\n      </section>'
);

// 2. How it works section background
content = content.replace(
  /<section className="py-24 px-6 max-w-7xl mx-auto">([\s\S]*?)<Pill text="How It Works" colorClass="bg-\[#4ADE80\]" \/>/g,
  '<section className="py-24 px-6 w-full bg-[#FDFBEE]">\n        <div className="max-w-7xl mx-auto">\n        <div className="flex justify-center mb-10">\n          <Pill text="How It Works" colorClass="bg-[#4ADE80]" />'
);
// Fix the closing div for How it works
content = content.replace(
  /searchable and stored forever\.<\/p>\n          <\/div>\n        <\/div>\n      <\/section>/g,
  'searchable and stored forever.</p>\n          </div>\n        </div>\n        </div>\n      </section>'
);

// 3. The Interaction section background
content = content.replace(
  /<section className="py-24 px-6 max-w-7xl mx-auto bg-\[#dcfce7\] border-y-4 border-black relative rounded-\[3rem\] mx-4 md:mx-auto mb-24 shadow-\[12px_12px_0px_0px_rgba\(0,0,0,1\)\] overflow-hidden">/g,
  '<section className="py-24 px-6 w-full bg-[#dcfce7] border-y-4 border-black">\n        <div className="max-w-7xl mx-auto relative">'
);
// Fix the closing div for The Interaction
content = content.replace(
  /Receipt stored\n                 <\/p>\n              <\/div>\n            <\/div>\n\n          <\/div>\n        <\/div>\n      <\/section>/g,
  'Receipt stored\n                 </p>\n              </div>\n            </div>\n\n          </div>\n        </div>\n        </div>\n      </section>'
);

// 4. Infrastructure section background
content = content.replace(
  /<section className="py-24 px-6 max-w-7xl mx-auto">([\s\S]*?)<Pill text="Infrastructure" colorClass="bg-\[#eef2ff\]" \/>/g,
  '<section className="py-24 px-6 w-full bg-[#eef2ff]">\n        <div className="max-w-7xl mx-auto">\n        <div className="flex justify-center mb-10">\n          <Pill text="Infrastructure" colorClass="bg-[#eef2ff]" />'
);
// Fix the closing div for Infrastructure
content = content.replace(
  /<span className="font-mono text-\[10px\] uppercase font-bold text-black">Browser<\/span>\n          <\/div>\n        <\/div>\n      <\/section>/g,
  '<span className="font-mono text-[10px] uppercase font-bold text-black">Browser</span>\n          </div>\n        </div>\n        </div>\n      </section>'
);

// 5. Interactive Calculator section background (keep it white)
content = content.replace(
  /<section className="py-24 px-6 max-w-7xl mx-auto">\n        <div className="bg-white border-4 border-black rounded-\[3rem\] p-10 md:p-16/g,
  '<section className="py-24 px-6 w-full bg-[#FDFBEE]">\n        <div className="max-w-7xl mx-auto">\n        <div className="bg-white border-4 border-black rounded-[3rem] p-10 md:p-16'
);
content = content.replace(
  /<p className="font-syne text-3xl font-extrabold text-\[#4ADE80\]">PKR \{expenses\}<\/p>\n              <\/div>\n            <\/div>\n          <\/div>\n        <\/div>\n      <\/section>/g,
  '<p className="font-syne text-3xl font-extrabold text-[#4ADE80]">PKR {expenses}</p>\n              </div>\n            </div>\n          </div>\n        </div>\n        </div>\n      </section>'
);

// 6. Built for everyone section background
content = content.replace(
  /<section className="py-24 px-6 max-w-7xl mx-auto">\n        <div className="bg-\[#dcfce7\]/g,
  '<section className="py-24 px-6 w-full bg-[#FFF248]">\n        <div className="max-w-7xl mx-auto">\n        <div className="bg-white'
);
content = content.replace(
  /<p className="text-gray-700 font-medium mb-6">A verified badge for your store window, receipts, and digital customer touchpoints\.<\/p>\n              <span className="font-bold border-b-2 border-black pb-1 hover:text-\[#4ADE80\] hover:border-\[#4ADE80\] transition-colors cursor-pointer">Learn more →<\/span>\n            <\/div>\n          <\/div>\n        <\/div>\n      <\/section>/g,
  '<p className="text-gray-700 font-medium mb-6">A verified badge for your store window, receipts, and digital customer touchpoints.</p>\n              <span className="font-bold border-b-2 border-black pb-1 hover:text-[#4ADE80] hover:border-[#4ADE80] transition-colors cursor-pointer">Learn more →</span>\n            </div>\n          </div>\n        </div>\n        </div>\n      </section>'
);

// 7. Security section background
content = content.replace(
  /<section className="py-24 px-6 max-w-7xl mx-auto">\n        <div className="flex flex-col lg:flex-row/g,
  '<section className="py-24 px-6 w-full bg-[#FDFBEE]">\n        <div className="max-w-7xl mx-auto">\n        <div className="flex flex-col lg:flex-row'
);
content = content.replace(
  /<div className="flex-1 w-full md:w-auto">CLOUD BACKEND<\/div>\n        <\/div>\n      <\/section>/g,
  '<div className="flex-1 w-full md:w-auto">CLOUD BACKEND</div>\n        </div>\n        </div>\n      </section>'
);

// 8. FAQ section background
content = content.replace(
  /<section className="py-24 px-6 max-w-4xl mx-auto">([\s\S]*?)<Pill text="FAQ" colorClass="bg-\[#4ADE80\]" \/>/g,
  '<section className="py-24 px-6 w-full bg-[#dcfce7]">\n        <div className="max-w-4xl mx-auto">\n        <div className="flex justify-center mb-10">\n          <Pill text="FAQ" colorClass="bg-[#4ADE80]" />'
);
content = content.replace(
  /\{faq\.a\}\n                <\/div>\n              \)}\n            <\/div>\n          \)\)}\n        <\/div>\n      <\/section>/g,
  '{faq.a}\n                </div>\n              )}\n            </div>\n          ))}\n        </div>\n        </div>\n      </section>'
);

// 9. CTA Let's Go section background
content = content.replace(
  /<section className="py-32 px-6 bg-white border-y-4 border-black text-center relative overflow-hidden">/g,
  '<section className="py-32 px-6 bg-[#4ADE80] border-y-4 border-black text-center relative overflow-hidden">'
);
content = content.replace(
  /Stop buying<br\/>paper\.\n          <\/h2>/g,
  'Stop buying<br/>paper.\n          </h2>'
);
content = content.replace(
  /class="font-syne text-\[5rem\] sm:text-\[7rem\] lg:text-\[8rem\] font-extrabold mb-8 leading-\[0.9\] tracking-tight text-\[#4ADE80\]"/g,
  'className="font-syne text-[5rem] sm:text-[7rem] lg:text-[8rem] font-extrabold mb-8 leading-[0.9] tracking-tight text-black"'
);
content = content.replace(
  /<h2 className="font-syne text-\[5rem\] sm:text-\[7rem\] lg:text-\[8rem\] font-extrabold mb-8 leading-\[0.9\] tracking-tight text-\[#4ADE80\]">/g,
  '<h2 className="font-syne text-[5rem] sm:text-[7rem] lg:text-[8rem] font-extrabold mb-8 leading-[0.9] tracking-tight text-black">'
);

// 10. Get in Touch section
content = content.replace(
  /<section className="py-24 px-6 max-w-7xl mx-auto">\n        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">/g,
  '<section className="py-24 px-6 w-full bg-[#FDFBEE]">\n        <div className="max-w-7xl mx-auto">\n        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">'
);
content = content.replace(
  /© 2026 · Karachi, Pakistan\n          <\/div>\n        <\/footer>\n      <\/section>/g,
  '© 2026 · Karachi, Pakistan\n          </div>\n        </footer>\n        </div>\n      </section>'
);

// 11. Footer background should be black
content = content.replace(
  /<footer className="border-t-4 border-black pt-12 flex flex-col md:flex-row justify-between items-center gap-8">/g,
  '<footer className="bg-[#111111] text-white py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8 mt-24 border-t-4 border-black absolute left-0 w-full">'
);
content = content.replace(
  /<div className="w-10 h-10 border-2 border-black bg-black text-white rounded-lg flex items-center justify-center shadow-\[2px_2px_0px_0px_rgba\(255,255,255,1\)\]">/g,
  '<div className="w-10 h-10 border-2 border-white bg-black text-white rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">'
);
content = content.replace(
  /<section className="py-24 px-6 w-full bg-\[#FDFBEE\]">\n        <div className="max-w-7xl mx-auto">\n        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">/g,
  '<section className="pt-24 pb-48 px-6 w-full bg-[#FDFBEE] relative overflow-hidden">\n        <div className="max-w-7xl mx-auto">\n        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">'
);

// 12. Left/Right Padding + borders container
content = content.replace(
  /<div className="min-h-screen bg-\[#FDFBEE\] text-\[#111111\] font-sans selection:bg-\[#4ADE80\] selection:text-black overflow-x-hidden">/g,
  '<div className="min-h-screen bg-[#e5e5e5] text-[#111111] font-sans selection:bg-[#4ADE80] selection:text-black overflow-x-hidden">\n    <div className="max-w-[1440px] mx-auto border-x-4 border-black bg-[#FDFBEE] min-h-screen relative shadow-2xl">'
);

// Fix Navbar so it matches the new container
content = content.replace(
  /<nav className="sticky top-0 z-50 bg-\[#FDFBEE\] border-b-2 border-black">/g,
  '<nav className="sticky top-0 z-50 bg-[#FDFBEE] border-b-4 border-black">'
);

content = content.replace(
  /<\/div>\n  \);\n}/g,
  '    </div>\n    </div>\n  );\n}'
);

fs.writeFileSync('src/App.tsx', content);
