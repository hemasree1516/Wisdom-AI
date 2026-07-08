import React, { useState } from 'react';
import { Loader2, Sparkles, Activity } from 'lucide-react';
import { supabase } from './supabaseClient';
function App() {
  const [userInput, setUserInput] = useState('');
  const [wisdom, setWisdom] = useState(null);
  const [loading, setLoading] = useState(false);

  // Uses the hidden key from your .env file
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;

  const generateWisdom = async (bookSource) => {
    if (!userInput.trim()) return alert("Please share your heart first!");
    setLoading(true);
    setWisdom(null);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
 messages: [
  {
    role: "system",
    content: `You are Wisdom AI, an Explainable Neuro-Symbolic AI based on the Indian Knowledge Systems (IKS).

The user selects ONE knowledge source.

You MUST use ONLY that source.
Never mix teachings from different sources.

Rules:

1. Base the story on ONE authentic incident, teaching, dialogue, or episode from the selected source.
────────────────────────────────────────
STORY
────────────────────────────────────────

Choose ONE authentic incident from the selected knowledge source.

The story MUST be detailed and immersive.

Length requirements:
- Minimum 250 words.
- Maximum 350 words.

The story must include:

1. The background of the incident.
2. The emotional struggle of the selected character.
3. The decisions the character made.
4. The philosophical lesson demonstrated.
5. How that lesson directly applies to the user's current distress.

Do NOT summarize the incident in a few sentences.

Do NOT merely describe the teaching.

Narrate the event like a story with a beginning, middle, and conclusion.

The story should naturally connect the user's situation with the character's experience.

Avoid repeating sentences or ideas.

Do NOT invent incidents, verses, or conversations.

Use only authentic events from the selected source.
2. Never invent verses, conversations, quotations, or historical events.

3. The selected character MUST belong to the selected source.

4. The Principle must summarize the lesson from the selected incident.

5. The story must explain why that incident relates to the user's problem.

6. If an authentic verse cannot be recalled with confidence, return a meaningful teaching instead.

7. Generate an Explainable AI Score from 0-100.

Generate an IKS-based Action Path.

The Action Path MUST be derived ONLY from:
- the selected source
- the selected character
- the selected story
- the selected principle
- the selected verse

Never introduce another scripture.

Never introduce another character.

Never introduce another philosophy.

Every action should answer:
"How would this character guide this user?"

Today's actions:
- Exactly 3

This Week:
- Exactly 3

Reflection:
- Exactly 1 question.

Return ONLY valid JSON.

{
  "emotion":"",
  "hope":"",
  "conflict":"",
  "principle":"",
  "outcome":"",
  "character":"",
  "story":"A detailed narrative between 100 and 200 words."
  "verse":"",
  "solution":"",
  "action_path":{
    "today":["","",""],
    "this_week":["","",""],
    "reflection":""
  },
  "xai_score":0
}`
  },
  {
    role: "user",
    content: `Distress: "${userInput}". Book Source: "${bookSource}". Generate the reasoning chain, story and action path.`
  }
],
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();

      const parsed = JSON.parse(
        data.choices[0].message.content
      );

      setWisdom(parsed);

      const { error } = await supabase
        .from('wisdom_logs')
        .insert([
          {
            user_input: userInput,
            book_source: bookSource,
            emotion: parsed.emotion,
            hope: parsed.hope,
            conflict: parsed.conflict,
            principle: parsed.principle,
            outcome: parsed.outcome,
            character_name: parsed.character,
            story: parsed.story,
            verse: parsed.verse,
            solution: parsed.solution,
            action_path: parsed.action_path
  ? `Today:
• ${parsed.action_path.today.join('\n• ')}

Next Few Days:
• ${parsed.action_path.this_week.join('\n• ')}

Reflection:
${parsed.action_path.reflection}`
  : null,
            xai_score: parsed.xai_score
          }
        ]);

      if (error) {
        console.log("FULL ERROR:", error);
        alert(JSON.stringify(error));
      } else {
        console.log("INSERT SUCCESS");
      }

    } catch (err) {
      console.error(err);
      alert("System Error: Check your API connection and ensure .env is in the Wisdom-AI-App folder.");
    } finally {
      setLoading(false);
    }
  };
  const books = [
    "Srimad Bhagavat Gita", 
    "Srimad Ramayana", 
    "The Mahabharata", 
    "Life of Mahatma Gandhi", 
    "Life of Dr. A.P.J. Abdul Kalam", 
    "Life of Swami Vivekananda"
  ];

  return (
    <div style={{ backgroundColor: '#fcfaf5', minHeight: '100vh', padding: '20px', fontFamily: 'serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
          <h1 style={{ color: '#5d4037', margin: 0, fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 'bold' }}>Wisdom AI</h1>
          <p style={{ color: '#8d6e63', fontSize: '1.1rem', fontStyle: 'italic', marginTop: '10px', maxWidth: '600px', margin: '10px auto' }}>
            "Ontology is the study of being. Wisdom is the art of being well."
          </p>
        </header>

        {/* Dashboard Layout: Left for Input, Right for Results */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', alignItems: 'start' }}>
          
          {/* LEFT: INPUT PANEL */}
{/* LEFT: INPUT PANEL */}
<section
  style={{
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '25px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
    border: '1px solid #e0d5c1'
  }}
>
  <h3
    style={{
      color: '#5d4037',
      marginBottom: '15px',
      fontSize: '1.3rem'
    }}
  >
    Consult the Sages
  </h3>

  <textarea
    style={{
      width: '100%',
      height: '180px',
      padding: '20px',
      borderRadius: '15px',
      border: '1px solid #e0d5c1',
      marginBottom: '25px',
      boxSizing: 'border-box',
      fontSize: '1.1rem',
      fontFamily: 'inherit',
      outline: 'none',
      resize: 'none',
      backgroundColor: '#fdfbf7'
    }}
    placeholder="Describe what is weighing on your heart..."
    value={userInput}
    onChange={(e) => setUserInput(e.target.value)}
  />

  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px'
    }}
  >
    {books.map((b) => (
      <button
        key={b}
        onClick={() => generateWisdom(b)}
        disabled={loading}
        className="book-btn"
        style={{
          padding: '15px',
          backgroundColor: '#5d4037',
          color: '#fff',
          borderRadius: '12px',
          border: 'none',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          minHeight: '80px',
          transition: 'all 0.3s ease'
        }}
      >
        {b}
      </button>
    ))}
  </div>
</section>

          {/* RIGHT: OUTPUT PANEL */}
          <section style={{ minHeight: '500px' }}>
            {loading && (
              <div style={{ textAlign: 'center', padding: '120px 0' }}>
                <Loader2 className="animate-spin" size={50} color="#d4af37" style={{ margin: '0 auto' }} />
                <p style={{ color: '#8d6e63', marginTop: '20px', fontSize: '1.2rem' }}>Extracting wisdom from the source...</p>
              </div>
            )}

            {!wisdom && !loading && (
              <div style={{ height: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e0d5c1', borderRadius: '25px', color: '#b0a491', padding: '40px', textAlign: 'center', fontSize: '1.1rem', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                Your guidance and reasoning chain will appear here after you select a source.
              </div>
            )}

            {wisdom && (
              <div style={{ animation: 'fadeIn 0.8s ease-out' }}>

                <div
  style={{
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
    marginBottom: "20px"
  }}
>
 <h3
  style={{
    color: "#5d4037",
    margin: 0,
    marginBottom: "10px",
    fontSize: "1.5rem",
    fontWeight: "bold"
  }}
>
  Explainable AI Score
</h3>

  <h1 style={{ color: "#2e7d32", fontSize: "42px" }}>
    {wisdom.xai_score}/100
  </h1>
</div>
                
                {/* 🔗 THE REASONING CHAIN FLOWCHART */}
                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '25px', border: '1px solid #e0d5c1', marginBottom: '30px', boxShadow: '0 5px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '25px' }}>
                    <Activity size={22} color="#d4af37" />
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#5d4037', fontWeight: 'bold', letterSpacing: '2px' }}>REASONING CHAIN</h4>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ReasoningStep label="Your Distress" value={userInput.substring(0, 40) + "..."} trigger="triggers" />
                    <ReasoningStep label="Emotion" value={wisdom.emotion} trigger="breaks" />
                    <ReasoningStep label="Hope" value={wisdom.hope} trigger="causes" />
                    <ReasoningStep label="Conflict" value={wisdom.conflict} trigger="resolved_by" />
                    <ReasoningStep label="Principle" value={wisdom.principle} trigger="leads_to" />
                    
                    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f1f8e9', borderRadius: '15px', border: '1px solid #c8e6c9', width: '100%', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '0.8rem', color: '#2e7d32', fontWeight: 'bold', letterSpacing: '1px' }}>OUTCOME</div>
                      <div style={{ fontSize: '1.2rem', color: '#1b5e20', fontWeight: 'bold' }}>{wisdom.outcome}</div>
                    </div>
                  </div>
                </div>

                {/* THE STORY & GUIDANCE CARD */}
                <div style={{ padding: '35px', backgroundColor: '#fff', borderRadius: '25px', borderTop: '10px solid #5d4037', boxShadow: '0 15px 35px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#5d4037', fontSize: '1.8rem' }}>{wisdom.character}</h3>
                  <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#3e2723' }}>{wisdom.story}</p>
                  
                  <div style={{ padding: '20px', backgroundColor: '#fdfbf7', borderLeft: '5px solid #d4af37', fontStyle: 'italic', margin: '25px 0', fontSize: '1.1rem', color: '#5d4037', borderRadius: '0 10px 10px 0' }}>
                    {/* Safeguard against "Object" error */}
                    "{typeof wisdom.verse === 'object' ? (wisdom.verse.quote || JSON.stringify(wisdom.verse)) : wisdom.verse}"
                  </div>

                  <div style={{ padding: '20px', backgroundColor: '#5d4037', color: '#fff', borderRadius: '15px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    <Sparkles size={20} style={{ marginRight: '10px', display: 'inline', verticalAlign: 'middle' }} />
                    <strong style={{ color: '#d4af37' }}>Path of Hope:</strong> {wisdom.solution}
                  </div>
                  
                </div>
              </div>
            )}
      </section>
</div>

{wisdom?.action_path && (
<section
style={{
maxWidth:'1100px',
width:'100%',
margin:'35px auto 0',
background:'#fff',
padding:'30px',
borderRadius:'25px',
border:'1px solid #e0d5c1',
boxShadow:'0 10px 30px rgba(0,0,0,0.02)'
}}
>

<h2
style={{
textAlign:'center',
color:'#5d4037',
marginBottom:'25px'
}}
>
Wisdom in Practice
</h2>

<div
style={{
display:'grid',
gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',
gap:'20px'
}}
>

<div
style={{
padding:'20px',
background:'#fdfbf7',
borderRadius:'15px',
border:'1px solid #e0d5c1'
}}
>

<h3 style={{color:'#8d6e63'}}>🌞 Today</h3>

<ul>
{wisdom.action_path.today.map((item,index)=>(
<li key={index}>{item}</li>
))}
</ul>

</div>

<div
style={{
padding:'20px',
background:'#fdfbf7',
borderRadius:'15px',
border:'1px solid #e0d5c1'
}}
>

<h3 style={{color:'#8d6e63'}}>📅 Next Few Days</h3>

<ul>
{wisdom.action_path.this_week.map((item,index)=>(
<li key={index}>{item}</li>
))}
</ul>

</div>

</div>

<div
style={{
marginTop:'20px',
padding:'20px',
background:'#fffdf8',
borderLeft:'5px solid #d4af37',
borderRadius:'12px'
}}
>

<h3 style={{color:'#8d6e63'}}>💭 Reflection</h3>

<p style={{fontStyle:'italic'}}>
{wisdom.action_path.reflection}
</p>

</div>

</section>
)}
      </div>
      <footer style={{ marginTop: 'auto', padding: '60px 0 20px', color: '#8d6e63', fontSize: '0.9rem', textAlign: 'center', opacity: 0.7 }}>
        Wisdom AI • Neuro-Symbolic Guidance System • 2026
      </footer>
      <style>{`
        .book-btn:hover { background-color: #4e342e !important; transform: translateY(-3px); box-shadow: 0 6px 15px rgba(0,0,0,0.15); }
        .book-btn:active { transform: translateY(-1px); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

const ReasoningStep = ({ label, value, trigger }) => (
  <div style={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>
    <div style={{ padding: '12px', border: '1px solid #f0f0f0', backgroundColor: '#fafafa', borderRadius: '12px', fontSize: '1.05rem', color: '#5d4037', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)' }}>
      <span style={{ fontWeight: 'bold', color: '#8d6e63' }}>{label}:</span> {value}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5px 0' }}>
      <div style={{ fontSize: '1.5rem', color: '#d4af37', lineHeight: '1' }}>↓</div>
      <div style={{ fontSize: '0.7rem', color: '#d4af37', fontStyle: 'italic', textTransform: 'uppercase', marginTop: '2px', fontWeight: 'bold', letterSpacing: '1px' }}>{trigger}</div>
    </div>
  </div>
);

export default App;
