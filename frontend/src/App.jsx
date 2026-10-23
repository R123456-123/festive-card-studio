import { useEffect, useState } from "react";

const phrases = [
  "Celebrating Festivals of Bharat",
  "त्योहार मनाइए",
  "উৎসব উদযাপন করুন",
  "सण साजरे करा",
  "திருவிழாவைக் கொண்டாடுங்கள்",
  "పండుగను జరుపుకోండి",
  "તહેવાર ઉજવો",
  "ಹಬ್ಬವನ್ನು ಆಚರಿಸಿ",
];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function Firefly() {
  return <span className="firefly" aria-hidden="true"><i /><i /><i /></span>;
}

function App() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % phrases.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);

  async function submitWaitlist(event) {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Waitlist is not configured yet. Add the Supabase environment variables.");
      }
      const response = await fetch(`${supabaseUrl}/rest/v1/waitlist_emails`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!response.ok) {
        if (response.status === 409) throw new Error("That email is already on the list.");
        throw new Error("We could not save your email. Please try again.");
      }
      setEmail("");
      setStatus("You’re on the list. We’ll see you in the festive circle ✨");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="waitlist-page">
      <nav className="site-nav" aria-label="Main navigation">
        <a className="brand" href="#home">
          <strong>festive<span>♡</span></strong>
          <em>|</em>
          <small key={phraseIndex}>{phrases[phraseIndex]}</small>
        </a>
        <a className="nav-waitlist" href="#waitlist">Join the waitlist <span>↗</span></a>
        <Firefly />
      </nav>

      <main id="home" className="waitlist-main">
        <section className="waitlist-hero" id="waitlist">
          <div className="hero-copy">
            <p className="eyebrow">something lovely is coming</p>
            <h1>Make space for<br /><span>more magic.</span></h1>
            <p className="hero-intro">A little corner for thoughtful festive moments, made personal and shared with the people who matter.</p>
          </div>
          <div className="waitlist-card">
            <div className="card-kicker"><span className="card-dot" /> early access</div>
            <h2>Be first in the<br /><span>festive circle.</span></h2>
            <p>Join the waitlist for new templates, seasonal drops, and tiny surprises.</p>
            <form onSubmit={submitWaitlist}>
              <label className="sr-only" htmlFor="waitlistEmail">Your email address</label>
              <input id="waitlistEmail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" autoComplete="email" required />
              <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Joining..." : "Join the waitlist"} <span>→</span></button>
            </form>
            <p className="status" role="status" aria-live="polite">{status}</p>
            <small className="privacy-note">No spam. Just a note when something beautiful is ready.</small>
          </div>
        </section>
      </main>

      <footer className="site-footer">made with little sparks <span>✦</span> festive card studio</footer>
    </div>
  );
}

export default App;
