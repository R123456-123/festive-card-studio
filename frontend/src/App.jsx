import { useEffect, useRef, useState } from "react";
import { festivals } from "./data/festivals";
import videoPath from "../videos/video_2_karwa_chauth.mp4";

const phrase = "Celebrating the festivals of India, together.";
const xShareImage = "/assets/x_share_image.png";
const siteUrl = "https://festive-card-studio.vercel.app";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const templates = [
  {
    id: "moonlit",
    name: "Moonlit romance",
    className: "template-moonlit",
    background: "/assets/Moonlit Karva Chauth Celebration.png",
    prompt: "For the love that waits for the moon.",
  },
  {
    id: "traditional",
    name: "Traditional warmth",
    className: "template-traditional",
    background: "/assets/Moonlit Diwali Puja on the Rooftop.png",
    prompt: "May our love glow brighter than every diya.",
  },
  {
    id: "distance",
    name: "Across the distance",
    className: "template-distance",
    background: "/assets/Moonlit Karwa Chauth Rooftop Ritual.png",
    prompt: "No distance is big enough for what we share.",
  },
];
const formats = [
  { id: "post", name: "Post", width: 1080, height: 1080, ratio: "1:1" },
  { id: "story", name: "Story", width: 1080, height: 1920, ratio: "9:16" },
  { id: "postcard", name: "Postcard", width: 1600, height: 1100, ratio: "4:3" },
  { id: "ticket", name: "Ticket", width: 1600, height: 700, ratio: "wide" },
];
const giftIdeas = [
  ["01", "Personalized photo frame", "A tiny memory for the bedside table."],
  ["02", "Sargi & self-care box", "Thoughtful, useful, and easy to share."],
  ["03", "Moon-and-star jewellery", "A keepsake inspired by the evening sky."],
  [
    "04",
    "Mehndi-inspired candle set",
    "Warm light for a slow evening together.",
  ],
  ["05", "Couple journal", "For all the little things you want to remember."],
  ["06", "Silk sleep set", "A soft, practical gift after a long day."],
  [
    "07",
    "Personalized phone case",
    "A daily reminder of your favourite person.",
  ],
  ["08", "Puja thali set", "A beautiful addition to the celebration."],
  ["09", "Long-distance care parcel", "A little box of comfort from far away."],
  ["10", "Handwritten letter kit", "Because some feelings deserve paper."],
];

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Festive Card Studio home">
      <strong>
        festive<span>♡</span>
      </strong>
      <em>|</em>
      <small>{phrase}</small>
    </a>
  );
}

function getXShareText(name) {
  const cleanName = name.trim();
  return cleanName
    ? `${cleanName} is celebrating with us ✨\n\n${phrase}\n\nCreate your own festive moment: ${siteUrl}`
    : `${phrase}\n\nCreate your own festive moment: ${siteUrl}`;
}

async function createXShareFile(name) {
  const response = await fetch(xShareImage);
  if (!response.ok) throw new Error("The X share image could not be loaded.");
  const imageUrl = URL.createObjectURL(await response.blob());
  const source = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("The X share image could not be decoded."));
    image.src = imageUrl;
  });
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const context = canvas.getContext("2d");
  URL.revokeObjectURL(imageUrl);
  if (!context) throw new Error("Your browser could not prepare the X image.");
  context.drawImage(source, 0, 0);
  const cleanName = name.trim();
  if (cleanName) {
    const fontSize = Math.max(34, Math.round(canvas.width * 0.035));
    const text = `${cleanName} is celebrating with us`;
    context.font = `800 ${fontSize}px "DM Sans", sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    const textWidth = context.measureText(text).width;
    const horizontalPadding = fontSize * 0.7;
    const highlightWidth = textWidth + horizontalPadding * 2;
    const highlightHeight = fontSize * 2;
    const highlightX = (canvas.width - highlightWidth) / 2;
    const highlightY = canvas.height * 0.82 - highlightHeight / 2;
    context.fillStyle = "#101b35cc";
    context.shadowColor = "#050b18aa";
    context.shadowBlur = fontSize * 0.7;
    const radius = highlightHeight / 2;
    context.beginPath();
    context.moveTo(highlightX + radius, highlightY);
    context.lineTo(highlightX + highlightWidth - radius, highlightY);
    context.arcTo(
      highlightX + highlightWidth,
      highlightY,
      highlightX + highlightWidth,
      highlightY + radius,
      radius,
    );
    context.lineTo(
      highlightX + highlightWidth,
      highlightY + highlightHeight - radius,
    );
    context.arcTo(
      highlightX + highlightWidth,
      highlightY + highlightHeight,
      highlightX + highlightWidth - radius,
      highlightY + highlightHeight,
      radius,
    );
    context.lineTo(highlightX + radius, highlightY + highlightHeight);
    context.arcTo(
      highlightX,
      highlightY + highlightHeight,
      highlightX,
      highlightY + highlightHeight - radius,
      radius,
    );
    context.lineTo(highlightX, highlightY + radius);
    context.arcTo(
      highlightX,
      highlightY,
      highlightX + radius,
      highlightY,
      radius,
    );
    context.closePath();
    context.fill();
    context.shadowBlur = 0;
    context.strokeStyle = "#f8d994cc";
    context.lineWidth = Math.max(2, fontSize * 0.045);
    context.stroke();
    context.fillStyle = "#fff8eb";
    context.shadowColor = "#091426cc";
    context.shadowBlur = Math.round(fontSize * 0.35);
    context.fillText(text, canvas.width / 2, canvas.height * 0.82);
    context.shadowBlur = 0;
  }
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result
          ? resolve(result)
          : reject(new Error("The X image could not be created.")),
      "image/png",
    );
  });
  return new File([blob], "festive-card-studio-x.png", { type: "image/png" });
}

function XPromotion() {
  const [name, setName] = useState(
    () => localStorage.getItem("x-share-name") || "",
  );
  const [status, setStatus] = useState("");
  const shareText = getXShareText(name);

  useEffect(() => {
    localStorage.setItem("x-share-name", name);
  }, [name]);

  async function shareOnX() {
    const composer = window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer",
    );
    try {
      const file = await createXShareFile(name);
      if (navigator.clipboard?.write && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ [file.type]: file }),
        ]);
        if (composer) composer.focus();
        setStatus(
          "X is open with your message. Paste the personalized image into the post.",
        );
        return;
      }
      if (composer) composer.focus();
      setStatus(
        "X is open with your message. Use Copy image to add the artwork.",
      );
    } catch (error) {
      if (composer && !composer.closed) composer.focus();
      setStatus(
        error instanceof Error
          ? error.message
          : "The X post could not be prepared.",
      );
    }
  }

  async function copyXImage() {
    try {
      const file = await createXShareFile(name);
      if (!navigator.clipboard?.write || !window.ClipboardItem) {
        throw new Error("Image copy is not supported in this browser.");
      }
      await navigator.clipboard.write([
        new ClipboardItem({ [file.type]: file }),
      ]);
      setStatus("Personalized image copied. Paste it into your X post.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "The image could not be copied.",
      );
    }
  }

  return (
    <div className="x-promotion">
      <label htmlFor="xShareName">Put your name on the celebration</label>
      <input
        id="xShareName"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name"
        maxLength="50"
      />
      <p className="x-preview-text">
        {name.trim()
          ? `${name.trim()} is celebrating with us`
          : "Your name is celebrating with us"}
      </p>
      <div className="x-promotion-actions">
        <button className="x-share-button" type="button" onClick={shareOnX}>
          Share on X <span>↗</span>
        </button>
        <button className="x-copy-button" type="button" onClick={copyXImage}>
          Copy image
        </button>
      </div>
      <small className="x-share-note">
        {status || "Your name is written onto the artwork before sharing."}
      </small>
    </div>
  );
}

function VideoHero() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  function toggleVideo() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  return (
    <div className="hero-video-wrap">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/assets/Moonlit Karva Chauth Celebration.png"
        aria-label="A quiet Karwa Chauth celebration under the moon"
      >
        <source src={videoPath} type="video/mp4" />
      </video>
      <div className="video-shade" aria-hidden="true" />
      <button
        className="video-control"
        type="button"
        onClick={toggleVideo}
        aria-label={
          isPlaying ? "Pause celebration video" : "Play celebration video"
        }
      >
        {isPlaying ? "Ⅱ" : "▶"}
      </button>
      <button
        className="audio-control"
        type="button"
        onClick={() => {
          const video = videoRef.current;
          if (!video) return;
          video.muted = !video.muted;
          setIsMuted(video.muted);
          if (!video.muted && video.paused) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                video.muted = true;
                setIsMuted(true);
              });
          }
        }}
        aria-label={
          isMuted ? "Unmute celebration video" : "Mute celebration video"
        }
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
      <span className="video-caption">
        A little love, sent across the distance
      </span>
    </div>
  );
}

function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitWaitlist(event) {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
          "Waitlist is not configured yet. Please try again soon.",
        );
      }
      const response = await fetch(`${supabaseUrl}/rest/v1/waitlist_emails`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: "Bearer " + supabaseAnonKey,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
        }),
      });
      if (!response.ok) {
        if (response.status === 409)
          throw new Error("That email is already on the list.");
        throw new Error("We could not save your email. Please try again.");
      }
      setEmail("");
      setName("");
      setStatus(
        "You’re on the exclusive perks list. Gift store access is coming soon.",
      );
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="interest-form" onSubmit={submitWaitlist}>
      <label className="sr-only" htmlFor="interestName">
        Your name
      </label>
      <input
        id="interestName"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name"
        autoComplete="name"
        maxLength="80"
        required
      />
      <label className="sr-only" htmlFor="interestEmail">
        Your email address
      </label>
      <input
        id="interestEmail"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="your@email.com"
        autoComplete="email"
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Joining..." : "Keep me posted"} <span>→</span>
      </button>
      <p className="status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}

function CardStudio() {
  const [templateId, setTemplateId] = useState(
    () => localStorage.getItem("festive-template") || templates[0].id,
  );
  const [recipient, setRecipient] = useState(
    () => localStorage.getItem("festive-recipient") || "",
  );
  const [message, setMessage] = useState(
    () => localStorage.getItem("festive-message") || templates[0].prompt,
  );
  const [formatId, setFormatId] = useState(
    () => localStorage.getItem("festive-format") || formats[0].id,
  );
  const [shareStatus, setShareStatus] = useState("");
  const selectedTemplate =
    templates.find((template) => template.id === templateId) || templates[0];
  const selectedFormat =
    formats.find((format) => format.id === formatId) || formats[0];
  const greeting = recipient.trim()
    ? `For ${recipient.trim()}, with love`
    : "For someone very special, with love";

  useEffect(() => {
    localStorage.setItem("festive-template", templateId);
  }, [templateId]);

  useEffect(() => {
    localStorage.setItem("festive-recipient", recipient);
  }, [recipient]);

  useEffect(() => {
    localStorage.setItem("festive-message", message);
  }, [message]);

  useEffect(() => {
    localStorage.setItem("festive-format", formatId);
  }, [formatId]);

  function chooseTemplate(template) {
    setTemplateId(template.id);
    if (!message || templates.some((item) => item.prompt === message))
      setMessage(template.prompt);
  }

  function shareText() {
    return `${greeting}\n\n${message.trim()}\n\nThis Karwa Chauth, I’m sending you a little piece of my heart.`;
  }

  async function createCardCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = selectedFormat.width;
    canvas.height = selectedFormat.height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Your browser could not prepare the card.");
    }

    const palettes = {
      "template-moonlit": ["#202847", "#6a4863", "#f8d994"],
      "template-traditional": ["#67293c", "#dd826b", "#f8d994"],
      "template-distance": ["#263b52", "#668c91", "#f8d994"],
    };
    const [background, glow, accent] = palettes[selectedTemplate.className];
    const scale = Math.min(canvas.width, canvas.height);
    const gradient = context.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    gradient.addColorStop(0, glow);
    gradient.addColorStop(0.55, background);
    gradient.addColorStop(1, "#171319");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    await new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const imageRatio = image.naturalWidth / image.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;
        let sourceWidth = image.naturalWidth;
        let sourceHeight = image.naturalHeight;
        let sourceX = 0;
        let sourceY = 0;
        if (imageRatio > canvasRatio) {
          sourceWidth = image.naturalHeight * canvasRatio;
          sourceX = (image.naturalWidth - sourceWidth) / 2;
        } else {
          sourceHeight = image.naturalWidth / canvasRatio;
          sourceY = (image.naturalHeight - sourceHeight) / 2;
        }
        context.drawImage(
          image,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const overlay = context.createLinearGradient(0, 0, 0, canvas.height);
        overlay.addColorStop(0, "#17131922");
        overlay.addColorStop(1, "#171319cc");
        context.fillStyle = overlay;
        context.fillRect(0, 0, canvas.width, canvas.height);
        resolve();
      };
      image.onerror = resolve;
      image.src = selectedTemplate.background;
    });
    context.fillStyle = accent;
    context.font = `${Math.max(70, scale * 0.14)}px serif`;
    context.fillText("☾", canvas.width * 0.1, canvas.height * 0.36);
    context.font = `bold ${Math.max(22, scale * 0.025)}px DM Sans, sans-serif`;
    context.fillText(
      "KARWA CHAUTH · 2026",
      canvas.width * 0.1,
      canvas.height * 0.14,
    );
    context.fillStyle = "#fff8eb";
    context.font = `bold ${Math.max(30, scale * 0.055)}px DM Sans, sans-serif`;
    context.fillText(greeting, canvas.width * 0.1, canvas.height * 0.52);
    context.font = `${Math.max(26, scale * 0.035)}px DM Sans, sans-serif`;
    const lines = [];
    let line = "";
    message
      .trim()
      .split(/\s+/)
      .forEach((word) => {
        const nextLine = line ? `${line} ${word}` : word;
        if (context.measureText(nextLine).width > canvas.width * 0.8 && line) {
          lines.push(line);
          line = word;
        } else {
          line = nextLine;
        }
      });
    if (line) lines.push(line);
    lines.slice(0, 5).forEach((text, index) => {
      context.fillText(
        text,
        canvas.width * 0.1,
        canvas.height * 0.62 + index * Math.max(38, scale * 0.05),
      );
    });
    context.fillStyle = accent;
    context.font = `italic ${Math.max(22, scale * 0.027)}px serif`;
    context.fillText(
      "Chaand ka intezaar, tumhare naam.",
      canvas.width * 0.1,
      canvas.height * 0.88,
    );
    return canvas;
  }

  async function createCardFile() {
    const canvas = await createCardCanvas();
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result
            ? resolve(result)
            : reject(new Error("The card image could not be created.")),
        "image/png",
      );
    });
    return new File([blob], `karwa-chauth-${selectedFormat.id}.png`, {
      type: "image/png",
    });
  }

  async function shareOnWhatsApp() {
    try {
      const file = await createCardFile();
      const link = document.createElement("a");
      link.download = file.name;
      link.href = URL.createObjectURL(file);
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${shareText()}\n\nThe card image has been downloaded—attach it in WhatsApp.`)}`,
        "_blank",
        "noopener,noreferrer",
      );
      setShareStatus("The card was downloaded. Attach it in WhatsApp.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus(
        error instanceof Error
          ? error.message
          : "The card could not be shared.",
      );
    }
  }

  async function downloadCard() {
    try {
      const canvas = await createCardCanvas();
      const link = document.createElement("a");
      link.download = `karwa-chauth-${selectedFormat.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setShareStatus("Your card is ready to share.");
    } catch (error) {
      setShareStatus(
        error instanceof Error
          ? error.message
          : "The card could not be downloaded.",
      );
    }
  }

  async function shareCardImage() {
    try {
      const file = await createCardFile();
      if (!navigator.clipboard?.write || !window.ClipboardItem) {
        const link = document.createElement("a");
        link.download = file.name;
        link.href = URL.createObjectURL(file);
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        setShareStatus(
          "Your card was downloaded. Attach it wherever you share.",
        );
        return;
      }
      await navigator.clipboard.write([
        new ClipboardItem({ [file.type]: file }),
      ]);
      setShareStatus(
        "Your card image was copied. Paste it into WhatsApp or any app.",
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus(
        error instanceof Error
          ? error.message
          : "The card could not be shared.",
      );
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(shareText());
      setShareStatus("Message copied. Send it wherever they are.");
    } catch {
      setShareStatus("Copy was unavailable. Select the message and try again.");
    }
  }

  return (
    <div className="card-studio">
      <div className="studio-editor">
        <div className="field-group">
          <label htmlFor="recipientName">Who is this for?</label>
          <input
            id="recipientName"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            placeholder="Their name"
            maxLength="50"
          />
        </div>
        <fieldset className="template-picker">
          <legend>Choose a mood</legend>
          <div className="template-options">
            {templates.map((template) => (
              <button
                className={
                  template.id === templateId
                    ? "template-option selected"
                    : "template-option"
                }
                type="button"
                key={template.id}
                onClick={() => chooseTemplate(template)}
                aria-pressed={template.id === templateId}
              >
                <span className={`template-swatch ${template.className}`} />
                {template.name}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="field-group">
          <label htmlFor="cardMessage">Add your words</label>
          <textarea
            id="cardMessage"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength="180"
            rows="4"
          />
          <small>{message.length}/180</small>
        </div>
        <fieldset className="template-picker format-picker">
          <legend>Choose a format</legend>
          <div className="format-options">
            {formats.map((format) => (
              <button
                className={
                  format.id === formatId
                    ? "format-option selected"
                    : "format-option"
                }
                type="button"
                key={format.id}
                onClick={() => setFormatId(format.id)}
                aria-pressed={format.id === formatId}
              >
                <span>{format.name}</span>
                <small>{format.ratio}</small>
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      <div
        className={`card-preview ${selectedTemplate.className} format-${selectedFormat.id}`}
      >
        <span className="preview-kicker">Karwa Chauth · 2026</span>
        <div className="preview-moon" aria-hidden="true">
          ☾
        </div>
        <p className="preview-greeting">{greeting}</p>
        <p className="preview-message">
          {message || "Write a little something from the heart."}
        </p>
        <span className="preview-signoff">
          Chaand ka intezaar, tumhare naam.
        </span>
        <div className="share-actions">
          <button type="button" onClick={shareOnWhatsApp}>
            Share on WhatsApp <span>↗</span>
          </button>
          <button type="button" onClick={shareCardImage}>
            Share card
          </button>
          <button type="button" onClick={downloadCard}>
            Download PNG
          </button>
          <button type="button" onClick={copyMessage}>
            Copy message
          </button>
        </div>
        <p className="share-status" role="status" aria-live="polite">
          {shareStatus}
        </p>
      </div>
    </div>
  );
}

function FestivalStory() {
  return (
    <section className="festival-story section-shell" id="festival-story">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A little context</p>
          <h2>
            The story behind
            <br />
            <span>the moonlight.</span>
          </h2>
        </div>
        <p>
          Karwa Chauth is a day of love, prayer, care, and togetherness. Every
          family and region may celebrate it a little differently.
        </p>
      </div>
      <div className="story-panels">
        <article>
          <span>01</span>
          <h3>Before the fast</h3>
          <p>
            Many families begin with sargi, shared before sunrise, as a gesture
            of care and blessings.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Through the day</h3>
          <p>
            Women gather for stories, mehndi, prayer, and the warmth of friends
            and family.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>When the moon arrives</h3>
          <p>
            The evening closes with moon sighting, water offering, and a moment
            of gratitude together.
          </p>
        </article>
      </div>
    </section>
  );
}

function GiftGuide() {
  return (
    <section className="gift-guide section-shell" id="gift-guide">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A thoughtful little guide</p>
          <h2>
            Top 10 gifts
            <br />
            <span>they’ll actually love.</span>
          </h2>
        </div>
        <p>
          Save this list, send it to someone who needs a hint, or use it as
          inspiration for a gift that feels personal.
        </p>
      </div>
      <div className="gift-grid">
        {giftIdeas.map(([number, title, description]) => (
          <article className="gift-card" key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <small className="gift-note">
        Gift links are coming soon. We’ll only feature products and stores we
        can verify.
      </small>
    </section>
  );
}

function App() {
  return (
    <div className="festive-page">
      <nav className="site-nav" aria-label="Main navigation">
        <Brand />
        <div className="nav-links">
          <a href="#studio">Card studio</a>
          <a href="#upcoming">Upcoming</a>
          <a className="nav-cta" href="#studio">
            Make a card <span>↗</span>
          </a>
        </div>
      </nav>

      <main>
        <section className="hero section-shell" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Karwa Chauth · 29 October 2026</p>
            <h1>
              For the love
              <br />
              that waits for <span>the moon.</span>
            </h1>
            <p className="hero-intro">
              Make a personal Karwa Chauth card for the one who makes every
              distance feel smaller.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#studio">
                Create your card <span>→</span>
              </a>
              <a className="text-link" href="#story">
                Our little story <span>↓</span>
              </a>
            </div>
            <XPromotion />
            <p className="hero-note">Chaand ka intezaar, tumhare naam.</p>
          </div>
          <VideoHero />
        </section>

        <section className="story section-shell" id="story">
          <p className="eyebrow">Made for meaningful moments</p>
          <div className="story-grid">
            <h2>
              Some feelings deserve
              <br />
              <span>more than a text.</span>
            </h2>
            <p>
              Whether you are celebrating side by side or sending love from far
              away, create a small, beautiful moment they can keep.
            </p>
          </div>
        </section>

        <section className="studio section-shell" id="studio">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The card studio</p>
              <h2>
                Give your love a little <span>happiness.</span>
              </h2>
            </div>
            <p>
              Choose a mood, write what you feel, and send something made just
              for them.
            </p>
          </div>
          <div className="studio-steps">
            {["Choose a mood", "Add your words", "Share the feeling"].map(
              (step, index) => (
                <article className="step-card" key={step}>
                  <span>0{index + 1}</span>
                  <h3>{step}</h3>
                  <p>
                    {
                      [
                        "Moonlit romance, traditional warmth, or something softly modern.",
                        "Start with a little help or make the message completely yours.",
                        "One tap for WhatsApp, a link, or a keepsake to download.",
                      ][index]
                    }
                  </p>
                </article>
              ),
            )}
          </div>
          <CardStudio />
          <div className="studio-prompt">
            <div>
              <span className="card-dot" />
              <strong>Want the next festive drop?</strong>
              <p>
                Leave your email and we’ll let you know when new celebrations
                arrive.
              </p>
            </div>
            <WaitlistForm />
          </div>
        </section>

        <section className="upcoming section-shell" id="upcoming">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The festive circle</p>
              <h2>
                More moments
                <br />
                <span>are on their way.</span>
              </h2>
            </div>
            <p>
              Karwa Chauth is only the beginning. We are making room for every
              feeling worth celebrating.
            </p>
          </div>
          <div className="festival-grid">
            {festivals.map((festival) => (
              <article
                className={`festival-card ${festival.status}`}
                key={festival.id}
              >
                <span className="festival-label">{festival.label}</span>
                <h3>{festival.name}</h3>
                <time dateTime={festival.dateISO}>{festival.date}</time>
                <p>{festival.description}</p>
              </article>
            ))}
          </div>
        </section>
        <FestivalStory />
        <GiftGuide />
      </main>

      <footer className="site-footer section-shell">
        <Brand />
        <p>Made for the people we celebrate—and the people we miss.</p>
        <small>
          Festival dates and timings may vary by location and tradition.
        </small>
      </footer>
    </div>
  );
}

export default App;
