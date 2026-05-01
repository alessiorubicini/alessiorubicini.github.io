const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');

// A very naive parser just to get text from paragraphs and headings
const contentMatches = html.match(/<(p|h1|h2|h3)[^>]*>(.*?)<\/\1>/gi);

if (contentMatches) {
    contentMatches.forEach(match => {
        // Strip tags
        let text = match.replace(/<[^>]*>/g, '').trim();
        // Decode html entities
        text = text.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        
        if (text) {
             if (match.startsWith('<h')) {
                 console.log('\n## ' + text + '\n');
             } else {
                 console.log(text + '\n');
             }
        }
    });
} else {
    console.log("No content found");
}
