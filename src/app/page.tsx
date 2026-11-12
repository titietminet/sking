"use client";

import { FormEvent, useEffect, useState } from "react";

type Profile = { level: string; terrain: string; height: string; weight: string; boot: string; budget: string };
type Setup = { name: string; category: string; width: string; length: string; binding: string; note: string; price: number; color: string };

const options: Setup[] = [
  { name: "MINDbender 89Ti", category: "ALL-MOUNTAIN", width: "89 mm au patin", length: "170 cm", binding: "Marker Griffon 13 · 90 mm", note: "Précis sur piste, assez joueur pour sortir des traces.", price: 649, color: "#d5b58a" },
  { name: "QST 94", category: "FREERIDE · ALL-MOUNTAIN", width: "94 mm au patin", length: "176 cm", binding: "Salomon Strive 12 · 100 mm", note: "Une ligne polyvalente pour chercher la neige fraîche.", price: 779, color: "#a8bdc1" },
  { name: "Enforcer 94", category: "ALL-MOUNTAIN · PERFORMANCE", width: "94 mm au patin", length: "179 cm", binding: "Marker Griffon 13 · 100 mm", note: "Stable et accrocheur, pour skier vite et avec confiance.", price: 899, color: "#bcaa91" },
  { name: "M-Free 99", category: "FREERIDE · BIG MOUNTAIN", width: "99 mm au patin", length: "178 cm", binding: "Look Pivot 14 · 100 mm", note: "Du répondant, de la portance et une vraie liberté de mouvement.", price: 1049, color: "#b9b6ce" },
  { name: "Mantra 102", category: "FREERIDE · EXPERT", width: "102 mm au patin", length: "184 cm", binding: "Marker Jester 16 · 110 mm", note: "Une plateforme solide pour les grands espaces et les grandes journées.", price: 1249, color: "#d2a895" },
];

function Mountain({ entering }: { entering: boolean }) {
  return <div className={`mountain-scene ${entering ? "is-entering" : ""}`} aria-hidden="true">
    <div className="sun" />
    <svg className="range range-far" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice"><path d="M0 393 160 228l71 78 171-185 163 197 129-135 154 125 141-190 180 214 112-104 159 175v197H0Z" fill="#bdcbd0"/><path d="m299 236 103-115 89 108-45-19-27 27-25-22-31 32-23-8-18 21Z M789 298l59-110 52 76-29-13-17 19-17-12-19 23-15-10Z" fill="#f4f3ea" opacity=".9"/></svg>
    <svg className="range range-mid" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice"><path d="M0 405 168 268l93 91 174-190 169 177 132-122 198 171 155-200 151 142 200-88v351H0Z" fill="#809ba0"/><path d="m435 169 46 5 55 80-45-19-23 20-23-28-18 22-21-14Z M915 231l30 5 45 61-38-16-22 20-12-18-18 5Z" fill="#e9ece5" opacity=".85"/></svg>
    <svg className="range range-near" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice"><path d="M0 375 130 331l88 47 105-81 91 40 91-107 130 101 111-49 92 60 117-86 94 35 98-57 107 92 186-50v324H0Z" fill="#425e60"/><path d="M0 465c225-130 359-20 550-105s312-4 489-79 268-17 401 15v304H0Z" fill="#253d3c"/></svg>
    <div className="mountain-grain" />
  </div>;
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
    <header className="topbar"><a className="wordmark" href="#home" onClick={(event) => { event.preventDefault(); setEntered(false); }}>sking<span>.</span></a><span className="top-note">THE ART OF A GOOD LINE</span><button className="menu-button" onClick={() => setEntered(false)} aria-label="Retour à l’accueil"><span></span><span></span></button></header>

    {!entered ? <section className="hero" id="home">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> LE BON SKI, POUR VOUS</div><h1>Votre prochaine<br />ligne <em>commence ici.</em></h1><p>Un bon ski change une journée. Le bon, lui, change toute la saison. Dites-nous comment vous skiez — on s’occupe du reste.</p><div className="hero-bottom"><span className="scroll-hint"><i>↓</i> VOTRE SETUP EN 2 MIN</span><span className="index">01 <b>—</b> 02</span></div></div>
      <form className="profile-card" onSubmit={submit}>
        <div className="card-heading"><div><span className="step-label">01 / VOTRE PROFIL</span><h2>On fait connaissance ?</h2></div><span className="card-spark">✳</span></div>
        <label className="field-label">VOTRE NIVEAU</label>
        <div className="segmented" role="group" aria-label="Votre niveau">{["débutant", "intermédiaire", "expert"].map((level) => <button key={level} type="button" className={profile.level === level ? "active" : ""} onClick={() => update("level", level)}>{level}</button>)}</div>
        <label className="field-label" htmlFor="terrain">VOTRE TERRAIN DE JEU</label>
        <select id="terrain" value={profile.terrain} onChange={(e) => update("terrain", e.target.value)}><option value="partout">Un peu partout</option><option value="piste">Piste avant tout</option><option value="hors-piste">Hors-piste & poudreuse</option><option value="park">Park & freestyle</option></select>
        <div className="field-row"><label><span className="field-label">VOTRE TAILLE</span><span className="input-wrap"><input type="number" min="130" max="220" placeholder="175" value={profile.height} onChange={(e) => update("height", e.target.value)} /><i>cm</i></span></label><label><span className="field-label">VOTRE POIDS</span><span className="input-wrap"><input type="number" min="35" max="180" placeholder="70" value={profile.weight} onChange={(e) => update("weight", e.target.value)} /><i>kg</i></span></label></div>
        <label className="field-label" htmlFor="boot">LONGUEUR DE SEMELLE DE CHAUSSURE <span className="optional">OPTIONNEL</span></label><div className="input-wrap"><input id="boot" type="number" min="200" max="380" placeholder="ex. 305" value={profile.boot} onChange={(e) => update("boot", e.target.value)} /><i>mm</i></div>
        <label className="field-label budget-label" htmlFor="budget">VOTRE BUDGET MAXIMUM <span className="optional">SKIS + FIXATIONS</span></label><div className="budget-input"><span>€</span><input id="budget" type="number" min="300" step="50" value={profile.budget} onChange={(e) => update("budget", e.target.value)} /></div>
        <button type="submit" className="submit-button"><span>TRACER MA LIGNE</span><span className="button-arrow">↗</span></button>
        <p className="privacy-note"><span>✳</span> Une recommandation pensée pour vous. Rien de plus.</p>
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
    <footer className="site-footer"><span>© SKING 2026</span><span>CONÇU POUR LES JOURS DE NEIGE <b>✳</b></span><span>ALPES FRANÇAISES</span></footer>
  </main>;
}
