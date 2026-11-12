"use client";

import { FormEvent, useEffect, useState } from "react";

type Profile = { level: string; terrain: string; height: string; weight: string; boot: string; budget: string };
type Setup = { name: string; category: string; width: string; length: string; binding: string; note: string; price: number; color: string };

const ridingStyles = [
  { value: "piste", title: "Piste", detail: <>Virages sur neige<br />damée</> },
  { value: "partout", title: "Polyvalent", detail: <>Un peu de piste,<br />un peu d’ailleurs</> },
  { value: "hors-piste", title: "Freeride", detail: <>Poudreuse et<br />grands espaces</> },
];

const options: Setup[] = [
  { name: "MINDbender 89Ti", category: "ALL-MOUNTAIN", width: "89 mm au patin", length: "170 cm", binding: "Marker Griffon 13 · 90 mm", note: "Précis sur piste, assez joueur pour sortir des traces.", price: 649, color: "#d5b58a" },
  { name: "QST 94", category: "FREERIDE · ALL-MOUNTAIN", width: "94 mm au patin", length: "176 cm", binding: "Salomon Strive 12 · 100 mm", note: "Une ligne polyvalente pour chercher la neige fraîche.", price: 779, color: "#a8bdc1" },
  { name: "Enforcer 94", category: "ALL-MOUNTAIN · PERFORMANCE", width: "94 mm au patin", length: "179 cm", binding: "Marker Griffon 13 · 100 mm", note: "Stable et accrocheur, pour skier vite et avec confiance.", price: 899, color: "#bcaa91" },
  { name: "M-Free 99", category: "FREERIDE · BIG MOUNTAIN", width: "99 mm au patin", length: "178 cm", binding: "Look Pivot 14 · 100 mm", note: "Du répondant, de la portance et une vraie liberté de mouvement.", price: 1049, color: "#b9b6ce" },
  { name: "Mantra 102", category: "FREERIDE · EXPERT", width: "102 mm au patin", length: "184 cm", binding: "Marker Jester 16 · 110 mm", note: "Une plateforme solide pour les grands espaces et les grandes journées.", price: 1249, color: "#d2a895" },
];

function Mountain({ entering }: { entering: boolean }) {
  return <div className={`mountain-scene ${entering ? "is-entering" : ""}`} aria-hidden="true" />;
}

export default function Home() {
  const [profile, setProfile] = useState<Profile>({ level: "intermédiaire", terrain: "partout", height: "", weight: "", boot: "", budget: "900" });
  const [entered, setEntered] = useState(false);
  const [selected, setSelected] = useState(2);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!entered) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") setSelected((current) => Math.max(0, current - 1));
      if (event.key === "ArrowDown") setSelected((current) => Math.min(options.length - 1, current + 1));
      if (event.key === "Escape") setEntered(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [entered]);

  useEffect(() => {
    if (entered) document.getElementById(`setup-${selected}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [entered, selected]);

  function update(field: keyof Profile, value: string) { setProfile((current) => ({ ...current, [field]: value })); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const budget = Number(profile.budget) || 900;
    let closest = 0;
    options.forEach((item, index) => { if (item.price <= budget) closest = index; });
    setSelected(closest);
    setEntered(true);
  }

  const setup = options[selected];
  return <main className={entered ? "app results-mode" : "app"}>
    <Mountain entering={entered} />
    <header className="topbar">
      <a className="wordmark" href="#home" onClick={(event) => { event.preventDefault(); setEntered(false); }}>sking.</a>
      <span className="top-note">LE BON MATÉRIEL. VOTRE TERRAIN.</span>
      <nav className="top-links" aria-label="Navigation principale">
        <a href="#approche">Notre approche</a>
        <a href="#conseils">Conseils &amp; sécurité <span aria-hidden="true">↗</span></a>
      </nav>
    </header>

    {!entered ? <section className="hero" id="home">
      <div className="hero-copy" id="approche">
        <div className="eyebrow">LE MATCH PARFAIT, PAS LE HASARD.</div>
        <h1>À chaque skieur,<br />son bon duo.</h1>
        <p className="hero-intro">Des skis et des fixations choisis pour votre gabarit,<br className="desktop-break" /> votre terrain et votre façon de skier.</p>
        <div className="hero-manifesto">
          <span className="eyebrow">LA MONTAGNE VOUS ATTEND.</span>
          <p>Moins d’hésitation.<br />Plus de sensations.</p>
          <span className="terrain-note">PISTE&nbsp; /&nbsp; ALL-MOUNTAIN&nbsp; /&nbsp; FREERIDE</span>
        </div>
        <div className="hero-steps"><span><b>01</b> Décrivez votre profil</span><span><b>02</b> Découvrez votre duo</span></div>
        <p className="hero-footnote">Une sélection expliquée, jamais une boîte noire.</p>
      </div>
      <form className="profile-card" onSubmit={submit}>
        <div className="card-heading">
          <span className="step-label">VOTRE PROFIL</span>
          <span className="card-step">01 / 02</span>
          <h2>On part de vous.</h2>
          <p>Quelques infos pour trouver votre équilibre.</p>
        </div>

        <section className="form-section">
          <h3>01&nbsp; Votre gabarit</h3>
          <div className="field-row">
            <label><span className="field-label">Poids</span><span className="metric-input"><input aria-label="Poids" type="number" min="35" max="180" placeholder="75" value={profile.weight} onChange={(e) => update("weight", e.target.value)} /><i>kg</i></span></label>
            <label><span className="field-label">Taille</span><span className="metric-input"><input aria-label="Taille" type="number" min="130" max="220" placeholder="178" value={profile.height} onChange={(e) => update("height", e.target.value)} /><i>cm</i></span></label>
          </div>
        </section>

        <fieldset className="form-section style-section">
          <legend>02&nbsp; Votre style de ski</legend>
          <p className="section-description">Le terrain sur lequel vous aimez passer la journée.</p>
          <div className="style-grid">
            {ridingStyles.map((style) => <button className={`style-card ${profile.terrain === style.value ? "selected" : ""}`} type="button" key={style.value} aria-pressed={profile.terrain === style.value} onClick={() => update("terrain", style.value)}>
              <img src={profile.terrain === style.value ? "/assets/style-selected.svg" : "/assets/style-unselected.svg"} alt="" />
              <strong>{style.title}</strong>
              <span>{style.detail}</span>
            </button>)}
          </div>
        </fieldset>

        <fieldset className="form-section level-section">
          <legend>03&nbsp; Votre niveau</legend>
          <div className="level-picker" role="group" aria-label="Votre niveau de ski">
            {[{ value: "débutant", label: "Débutant" }, { value: "intermédiaire", label: "Intermédiaire" }, { value: "expert", label: "Confirmé" }].map(({ value, label }) => <button type="button" key={value} className={profile.level === value ? "active" : ""} aria-pressed={profile.level === value} onClick={() => update("level", value)}>{label}</button>)}
          </div>
        </fieldset>

        <div className="detail-fields">
          <label className="budget-field" htmlFor="budget"><span className="field-label">Budget max. <span className="optional">SKIS + FIXATIONS</span></span><span className="budget-input"><span>€</span><input id="budget" type="number" min="300" step="50" value={profile.budget} onChange={(e) => update("budget", e.target.value)} /></span></label>
          <label className="boot-field" htmlFor="boot"><span className="field-label">Semelle <span className="optional">OPTIONNEL</span></span><span className="metric-input compact"><input id="boot" type="number" min="200" max="380" placeholder="305" value={profile.boot} onChange={(e) => update("boot", e.target.value)} /><i>mm</i></span></label>
        </div>
        <button type="submit" className="submit-button"><span>Trouver mon duo idéal</span><span className="button-arrow" aria-hidden="true">→</span></button>
        <p className="privacy-note">Sans inscription · Vos informations restent privées.</p>
      </form>
    </section> : <section className="results" aria-live="polite">
      <div className="results-heading"><button className="back-link" onClick={() => setEntered(false)}>← <span>MODIFIER MON PROFIL</span></button><div className="result-title"><div className="eyebrow"><span className="eyebrow-line" /> VOTRE LIGNE IDÉALE</div><h1>On a trouvé<br /><em>votre terrain.</em></h1><p>Taillé pour le {profile.terrain === "partout" ? "all-mountain" : profile.terrain}, avec un budget de <strong>{Number(profile.budget || 0).toLocaleString("fr-FR")} €.</strong></p></div><div className="price-guide"><span>FAITES DÉFILER POUR AJUSTER</span><div><i>↑</i> PLUS PERFORMANCE <b>·</b> PLUS CHER</div><div><i>↓</i> PLUS ACCESSIBLE</div></div></div>
      <div className="setup-rail" aria-label="Faire défiler les recommandations" onScroll={(event) => {
        const rail = event.currentTarget;
        const center = rail.getBoundingClientRect().top + rail.clientHeight / 2;
        let closest = selected;
        let distance = Number.POSITIVE_INFINITY;
        options.forEach((_, index) => {
          const card = document.getElementById(`setup-${index}`);
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const nextDistance = Math.abs(rect.top + rect.height / 2 - center);
          if (nextDistance < distance) { distance = nextDistance; closest = index; }
        });
        if (closest !== selected) setSelected(closest);
      }}>
        {options.map((item, index) => <article className={`setup-card ${selected === index ? "is-selected" : ""}`} id={`setup-${index}`} key={item.name} onClick={() => setSelected(index)}>
          <div className="setup-card-left"><span className="setup-number">0{index + 1} / 05</span><span className="setup-category">{item.category}</span><h2>{item.name}</h2><p>{item.note}</p><div className="specs"><span>{item.width}</span><span>·</span><span>{item.length}</span></div></div>
          <div className="ski-art" style={{ "--ski-color": item.color } as React.CSSProperties}><div className="ski-shape ski-one"><b>SKING</b><i></i><i></i></div><div className="ski-shape ski-two"><b>SKING</b><i></i><i></i></div><div className="binding-shape"><span></span><span></span></div><span className="ski-shadow"></span></div>
          <div className="setup-card-right"><div className="binding-label">FIXATION RECOMMANDÉE</div><h3>{item.binding}</h3><p>Montage et réglage à faire réaliser par un atelier qualifié.</p><div className="price-block"><span>SET COMPLET À PARTIR DE</span><strong>{item.price.toLocaleString("fr-FR")}<i>€</i></strong></div><button className={`save-button ${saved ? "saved" : ""}`} onClick={(event) => { event.stopPropagation(); setSaved(!saved); }}>{saved ? "✓  SETUP SAUVEGARDÉ" : "GARDER CE SETUP  ↗"}</button></div>
        </article>)}
      </div><div className="rail-footer"><span>UNE SÉLECTION, CINQ LIGNES.</span><span>FAITES DÉFILER <b>↓</b></span></div>
    </section>}
    <footer className="site-footer" id="conseils"><span>© 2026 sking.&nbsp; Pensé pour vos prochains virages.</span><span>Le conseil digital, l’expertise en magasin.</span></footer>
  </main>;
}
