import fs from 'fs';

function main() {
  const html = fs.readFileSync('framer_dump.html', 'utf-8');
  
  // Let's write out the text chunks in the HTML that are larger than 10 chars, excluding scripts/styles
  let cleanHtml = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');
    
  // Now let's extract all visible texts
  const textChunks: string[] = [];
  const rawChunks = cleanHtml.split(/[><]/);
  for (const chunk of rawChunks) {
    const trimmed = chunk
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .trim();
    if (trimmed.length > 2 && !trimmed.startsWith('!--') && !trimmed.startsWith('/') && !trimmed.includes('framer-') && !trimmed.includes('style=')) {
      textChunks.push(trimmed);
    }
  }

  // Let's filter out some boilerplate or empty elements
  const filtered = textChunks.filter(c => {
    if (c.startsWith('input') || c.startsWith('form') || c.startsWith('link') || c.startsWith('meta') || c.startsWith('div') || c.startsWith('p dir=') || c.startsWith('span')) {
      return false;
    }
    return true;
  });

  console.log("--- CHUNKS (length = " + filtered.length + ") ---");
  for (let i = 0; i < filtered.length; i++) {
    console.log(`${i}: ${filtered[i]}`);
  }
}

main();
