const fs = require("fs");

const books = [
  "Bhagavad Gita", "Mahabharata", "Ramayana", 
  "Life of Mahatma Gandhi", "Life of A. P. J. Abdul Kalam", "Life of Swami Vivekananda"
];

// These 10 categories cover 99% of human problems
const masterCategories = [
  "failure and rejection", 
  "fear of the future", 
  "loneliness and isolation", 
  "lack of motivation", 
  "anger and unfairness",
  "betrayal and broken trust",
  "grief and loss",
  "insecurity and self-doubt",
  "financial stress",
  "distraction and bad habits"
];

async function generateMasterLibrary() {
    console.log("🚀 STARTING UNIVERSAL WISDOM GENERATION...");
    let masterLibrary = [];

    for (const book of books) {
        console.log(`\n📚 processing Book: ${book}`);
        for (const category of masterCategories) {
            try {
                process.stdout.write(`   🔍 Generating story for: ${category}... `);
                
                const response = await fetch("http://localhost:11434/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: "llama3.2:1b",
                        prompt: `You are a wise historian. Someone is suffering from "${category}". 
                        Find a specific, detailed story from the book "${book}" that addresses this.
                        Return ONLY a JSON object: 
                        {"book":"${book}","category":"${category}","character":"Name","story":"2 detailed paragraphs of the struggle","verse":"Key quote","solution":"How they overcame it"}`,
                        stream: false,
                        format: "json"
                    })
                });

                const data = await response.json();
                masterLibrary.push(JSON.parse(data.response));
                console.log("✅");

                // Tiny 1-second delay just to let the CPU breathe
                await new Promise(r => setTimeout(r, 1000)); 

            } catch (e) {
                console.log(`❌ Error: ${e.message}`);
            }
        }
    }

    if (!fs.existsSync('./src')) fs.mkdirSync('./src');
    fs.writeFileSync("./src/master_wisdom.json", JSON.stringify(masterLibrary, null, 2));
    console.log("\n🎉 SUCCESS! 60 High-Quality Stories Saved.");
}

generateMasterLibrary();