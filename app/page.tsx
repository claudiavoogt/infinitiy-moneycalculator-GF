'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Fase {
  van: number;
  tot: number;
  bedrag: number;
}

interface Resultaat {
  van: number; tot: number; bedrag: number;
  ingelegd: number; kapVoor: number; kapNa: number; index: number;
}

interface Berekening {
  totaalIngelegd: number; eindKapitaal: number; rendWinst: number;
  totaalJaren: number; resultaten: Resultaat[];
  chartLabels: string[]; chartKap: number[]; chartIng: number[];
}

const KLEUREN = ['#6B2D84', '#E21B70', '#3EDCB1', '#FF6B35', '#1A1F36'];

const DEFAULT_FASES: Fase[] = [
  { van: 11, tot: 16, bedrag: 10 },
  { van: 16, tot: 18, bedrag: 25 },
  { van: 18, tot: 30, bedrag: 75 },
  { van: 30, tot: 50, bedrag: 150 },
];

function eur(n: number): string {
  if (n >= 1_000_000) return '€ ' + (n / 1_000_000).toFixed(2).replace('.', ',') + ' mln';
  return '€ ' + Math.round(n).toLocaleString('nl-NL');
}

export default function MijnTool() {
  const [fases, setFases] = useState<Fase[]>(DEFAULT_FASES.map(f => ({ ...f })));
  const [doel, setDoel] = useState(50);
  const [rend, setRend] = useState(10);
  const [berekening, setBerekening] = useState<Berekening | null>(null);
  const [laden, setLaden] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Roept de Netlify function aan — rekenmethode blijft server-side
  const bereken = useCallback(async (f: Fase[], d: number, r: number) => {
    setLaden(true);
    try {
      const res = await fetch('/api/bereken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fases: f, doel: d, rend: r }),
      });
      const data: Berekening = await res.json();
      setBerekening(data);
    } catch {
      // Stille fout, vorige staat blijft staan
    } finally {
      setLaden(false);
    }
  }, []);

  // Debounce: wacht 300ms na laatste wijziging voordat server wordt aangeroepen
  const berekenDebounced = useCallback((f: Fase[], d: number, r: number) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => bereken(f, d, r), 300);
  }, [bereken]);

  // Eerste berekening bij laden
  useEffect(() => {
    bereken(fases, doel, rend);
  }, []);

  // Nieuwe berekening bij elke wijziging
  useEffect(() => {
    berekenDebounced(fases, doel, rend);
  }, [fases, doel, rend]);

  const drawChart = useCallback(() => {
    if (!berekening) return;
    const Chart = (window as any).Chart;
    if (!Chart || !chartRef.current) return;
    if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; }
    chartInstance.current = new Chart(chartRef.current.getContext('2d'), {
      type: 'line',
      data: {
        labels: berekening.chartLabels,
        datasets: [
          { label: 'Eindkapitaal', data: berekening.chartKap, borderColor: '#6B2D84', backgroundColor: 'rgba(107,45,132,0.10)', borderWidth: 3, pointRadius: 0, fill: true, tension: 0.4 },
          { label: 'Ingelegd', data: berekening.chartIng, borderColor: '#3EDCB1', backgroundColor: 'rgba(62,220,177,0.06)', borderWidth: 2, borderDash: [5, 4], pointRadius: 0, fill: true, tension: 0 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { font: { family: 'Montserrat', weight: '700', size: 11 }, color: '#1A1F36', boxWidth: 14 } },
          tooltip: { callbacks: { label: (c: any) => ' ' + c.dataset.label + ': ' + eur(c.parsed.y) }, bodyFont: { family: 'Montserrat', weight: '600' }, titleFont: { family: 'Montserrat', weight: '800' } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Montserrat', size: 10 }, color: 'rgba(26,31,54,0.35)', maxTicksLimit: 10 } },
          y: { grid: { color: 'rgba(26,31,54,0.04)' }, ticks: { font: { family: 'Montserrat', size: 10 }, color: 'rgba(26,31,54,0.35)', callback: (v: number) => eur(v) } },
        },
      },
    });
  }, [berekening]);

  useEffect(() => {
    if (!berekening) return;
    if (typeof window === 'undefined') return;
    if ((window as any).Chart) { drawChart(); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    script.onload = () => drawChart();
    document.head.appendChild(script);
  }, [drawChart, berekening]);

  function updateFase(i: number, key: keyof Fase, val: number) {
    setFases(prev => prev.map((f, idx) => idx === i ? { ...f, [key]: val } : f));
  }
  function addFase() {
    const last = fases[fases.length - 1];
    setFases(prev => [...prev, { van: last ? last.tot : 11, tot: last ? last.tot + 10 : 21, bedrag: last ? Math.round(last.bedrag * 1.5) : 50 }]);
  }
  function removeFase(i: number) {
    setFases(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Lora:ital@0;1&family=Pacifico&display=swap" rel="stylesheet" />
      <style>{`
        html, body { margin: 0 !important; padding: 0 !important; background: #F7F7FA !important; font-family: 'Lora', serif; }
        *, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        .gfc { font-family: 'Lora', serif; color: #1A1F36; background: transparent; width: 100%; max-width: 100%; display: block; }
        .gf-banner { position: relative; width: 100%; overflow: hidden; background: #1A1F36; margin-bottom: 0; display: block; }
        .gf-banner img { width: 100%; height: auto; display: block; object-fit: cover; max-width: 100%; border: none; box-shadow: none; }
        .gf-banner::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 120px; background: linear-gradient(to bottom, transparent, #F7F7FA); pointer-events: none; }
        .gf-intro { max-width: 700px; margin: 0 auto; padding: 40px 24px 24px; text-align: center; }
        .gf-badge { display: inline-block; background: rgba(107,45,132,0.1); border: 1px solid rgba(107,45,132,0.25); border-radius: 20px; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #6B2D84; padding: 5px 14px; margin-bottom: 18px; }
        .gf-intro h1 { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: clamp(22px,4vw,36px); color: #1A1F36; line-height: 1.15; margin-bottom: 16px; }
        .gf-intro-tekst { font-family: 'Lora', serif; font-style: italic; font-size: 16px; color: #1A1F36; line-height: 1.7; opacity: 0.7; margin-bottom: 20px; display: block; }
        .gf-pijlen { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
        .gf-pijl { display: flex; align-items: center; gap: 7px; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; color: #6B2D84; }
        .gf-pijl-dot { width: 7px; height: 7px; background: #3EDCB1; border-radius: 50%; flex-shrink: 0; }
        .gf-wrap { max-width: 900px; margin: 0 auto; padding: 0 20px 20px; }
        .gf-sectie-kop { text-align: center; margin-bottom: 24px; padding-top: 32px; }
        .gf-sectie-kop h2 { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: clamp(18px,3vw,26px); color: #1A1F36; margin-bottom: 6px; }
        .gf-sectie-kop h2 span { color: #E21B70; }
        .gf-sectie-kop p { font-family: 'Lora', serif; font-style: italic; font-size: 14px; color: #1A1F36; opacity: 0.55; }
        .gf-card { background: #ffffff; border-radius: 16px; padding: 28px; margin-bottom: 20px; box-shadow: 0 4px 24px rgba(26,31,54,0.08); }
        .gf-card-title { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 16px; color: #6B2D84; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .gf-icon { width: 32px; height: 32px; background: linear-gradient(135deg,#E21B70,#6B2D84); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
        .gf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        @media(max-width:500px){ .gf-row { grid-template-columns: 1fr; } }
        .gf-ig { display: flex; flex-direction: column; gap: 6px; }
        .gf-ig label { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: rgba(26,31,54,0.6); display: block; }
        .gf-iw { position: relative; display: flex; align-items: center; }
        .gf-suf { position: absolute; right: 12px; font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 13px; color: rgba(26,31,54,0.4); pointer-events: none; }
        .gf-ig input[type="number"] { width: 100%; padding: 12px 40px 12px 14px; border: 2px solid #E8E8F0; border-radius: 10px; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 17px; color: #1A1F36; background: #F7F7FA; outline: none; -moz-appearance: textfield; -webkit-appearance: none; line-height: 1; }
        .gf-ig input[type="number"]::-webkit-inner-spin-button, .gf-ig input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .gf-ig input[type="number"]:focus { border-color: #6B2D84; background: #ffffff; box-shadow: 0 0 0 3px rgba(107,45,132,0.1); }
        input[type="range"] { -webkit-appearance: none; appearance: none; width: 100%; height: 5px; border-radius: 3px; background: #E8E8F0; outline: none; margin-top: 6px; cursor: pointer; padding: 0; border: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg,#E21B70,#6B2D84); cursor: pointer; box-shadow: 0 2px 8px rgba(226,27,112,0.35); border: none; }
        input[type="range"]::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg,#E21B70,#6B2D84); cursor: pointer; box-shadow: 0 2px 8px rgba(226,27,112,0.35); border: none; }
        .gf-slider-labels { display: flex; justify-content: space-between; font-family: 'Montserrat', sans-serif; font-size: 10px; color: rgba(26,31,54,0.3); margin-top: 3px; }
        .gf-uitleg { font-family: 'Lora', serif; font-style: italic; font-size: 14px; color: rgba(26,31,54,0.6); line-height: 1.65; margin: 0 0 20px; }
        .gf-divider { height: 2px; background: linear-gradient(90deg,transparent,#3EDCB1,transparent); margin: 22px 0; opacity: 0.3; }
        .gf-tl-header { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #6B2D84; opacity: 0.8; margin-bottom: 14px; display: block; }
        .gf-conn { width: 2px; height: 12px; background: linear-gradient(180deg,#6B2D84,#3EDCB1); margin: 0 0 0 19px; opacity: 0.3; }
        .gf-fase-row { display: flex; align-items: center; gap: 10px; background: #F7F7FA; border-radius: 12px; padding: 13px 14px; border: 2px solid transparent; flex-wrap: nowrap; }
        .gf-dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
        .gf-fase-fields { display: flex; align-items: center; gap: 6px; flex: 1; flex-wrap: nowrap; min-width: 0; }
        @media(max-width:480px){
          .gf-fase-fields { flex-wrap: wrap; gap: 5px; }
          .gf-fase-fields .gf-leeftijd-row { display: flex; align-items: center; gap: 5px; width: 100%; }
          .gf-fase-fields .gf-bedrag-row { display: flex; align-items: center; gap: 5px; }
        }
        .gf-flabel { font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 12px; color: rgba(26,31,54,0.5); white-space: nowrap; }
        .gf-fi { width: 60px; padding: 7px 6px; border: 2px solid #E0E0EC; border-radius: 8px; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 15px; color: #1A1F36; background: #ffffff; outline: none; text-align: center; -moz-appearance: textfield; -webkit-appearance: none; }
        .gf-fi::-webkit-inner-spin-button, .gf-fi::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .gf-fi:focus { border-color: #6B2D84; box-shadow: 0 0 0 2px rgba(107,45,132,0.12); }
        .gf-fi.bedrag { width: 72px; color: #6B2D84; }
        .gf-arrow { font-size: 16px; color: #3EDCB1; font-weight: 700; flex-shrink: 0; }
        .gf-btn-remove { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #E0E0EC; background: #ffffff; cursor: pointer; font-size: 15px; color: #aaa; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 0; }
        .gf-btn-remove:hover { border-color: #E21B70; color: #E21B70; }
        .gf-btn-add { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; border: 2px dashed rgba(107,45,132,0.4); border-radius: 10px; background: transparent; cursor: pointer; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 13px; color: #6B2D84; opacity: 0.65; margin-top: 10px; width: 100%; }
        .gf-btn-add:hover { opacity: 1; background: rgba(107,45,132,0.04); }
        .gf-result-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 24px; }
        @media(max-width:560px){ .gf-result-grid { grid-template-columns: 1fr; } }
        .gf-ri { background: #F7F7FA; border-radius: 12px; padding: 18px 14px; text-align: center; transition: opacity 0.2s; }
        .gf-ri.hl { background: linear-gradient(135deg,#1A1F36,#6B2D84); }
        .gf-rl { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: rgba(26,31,54,0.5); margin-bottom: 6px; display: block; }
        .gf-ri.hl .gf-rl { color: #3EDCB1; opacity: 1; }
        .gf-rv { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: clamp(20px,3.5vw,30px); color: #6B2D84; display: block; line-height: 1.1; }
        .gf-ri.hl .gf-rv { color: #E21B70; font-size: clamp(24px,4.5vw,36px); }
        .gf-rs { font-family: 'Lora', serif; font-style: italic; font-size: 11px; color: rgba(26,31,54,0.4); margin-top: 4px; display: block; }
        .gf-ri.hl .gf-rs { color: rgba(255,255,255,0.5); }
        .gf-laden { opacity: 0.45; pointer-events: none; }
        .gf-bd-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .gf-bd-row { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #F7F7FA; border-radius: 10px; }
        .gf-bd-kleur { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
        .gf-bd-info { flex: 1; }
        .gf-bd-periode { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; color: #1A1F36; }
        .gf-bd-detail { font-family: 'Lora', serif; font-style: italic; font-size: 11px; color: rgba(26,31,54,0.45); }
        .gf-bd-waarde { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 14px; color: #6B2D84; text-align: right; }
        .gf-chart-wrap { position: relative; height: 260px; }
        .gf-quote { background: linear-gradient(135deg,#1A1F36,#6B2D84); border-radius: 14px; padding: 24px 28px; text-align: center; margin: 0 20px 20px; }
        .gf-qt { font-family: 'Pacifico', cursive; font-size: clamp(16px,3vw,22px); color: #E21B70; margin-bottom: 8px; line-height: 1.4; display: block; }
        .gf-qs { font-family: 'Lora', serif; font-style: italic; color: rgba(255,255,255,0.55); font-size: 13px; display: block; }
        .gf-qs strong { color: #3EDCB1; font-style: normal; font-weight: 700; }
        .gf-fn { font-family: 'Lora', serif; font-style: italic; font-size: 11px; color: rgba(26,31,54,0.35); text-align: center; margin-top: 12px; line-height: 1.6; display: block; padding: 0 20px; }
      `}</style>

      <div className="gfc">
        <div className="gf-banner">
          <img src="/banner-gf.jpg" alt="Generatie Fearless" />
        </div>

        <div className="gf-intro">
          <span className="gf-badge">Generatie Fearless</span>
          <h1>Geef je kind de voorsprong die jij nooit had.</h1>
          <span className="gf-intro-tekst">Bereken hieronder wat er gebeurt als jouw kind vroeg begint met beleggen. Speel met de bedragen en de leeftijd. En zie wat compound interest doet als de tijd zijn werk mag doen.</span>
          <div className="gf-pijlen">
            <div className="gf-pijl"><div className="gf-pijl-dot"></div>Groei per fase zichtbaar</div>
            <div className="gf-pijl"><div className="gf-pijl-dot"></div>Meerdere fases instellen</div>
            <div className="gf-pijl"><div className="gf-pijl-dot"></div>Grafiek van leeftijd tot doel</div>
          </div>
        </div>

        <div className="gf-wrap">
          <div className="gf-sectie-kop">
            <h2>De <span>Infinity Money</span> Calculator</h2>
            <p>Vul de fases in om het geld te zien groeien</p>
          </div>

          <div className="gf-card">
            <p className="gf-uitleg">Vul de doelleeftijd in. Dit is de leeftijd waarop je kind het vermogen beschikbaar wil hebben, bijv. op 50 jaar.</p>
            <div className="gf-row">
              <div className="gf-ig">
                <label>Doelleeftijd</label>
                <div className="gf-iw">
                  <input type="number" value={doel} min={15} max={80} onFocus={e => e.target.select()} onChange={e => setDoel(parseInt(e.target.value) || 50)} />
                  <span className="gf-suf">jaar</span>
                </div>
                <input type="range" min={15} max={80} step={1} value={doel} onChange={e => setDoel(parseInt(e.target.value))} />
                <div className="gf-slider-labels"><span>15</span><span>80</span></div>
              </div>
              <div className="gf-ig">
                <label>Jaarlijks rendement</label>
                <div className="gf-iw">
                  <input type="number" value={rend} min={1} max={15} onFocus={e => e.target.select()} onChange={e => setRend(parseFloat(e.target.value) || 10)} />
                  <span className="gf-suf">%</span>
                </div>
                <input type="range" min={1} max={15} step={0.5} value={rend} onChange={e => setRend(parseFloat(e.target.value))} />
                <div className="gf-slider-labels"><span>1%</span><span>15%</span></div>
              </div>
            </div>
            <div className="gf-divider"></div>
            <p className="gf-uitleg">Vul hieronder in wat je kind inlegt per maand en tot welke leeftijd. Je kunt de leeftijden aanpassen, spelen met bedragen of een leeftijdfase toevoegen.</p>
            <span className="gf-tl-header">Tijdlijn — wat legt je kind in per fase?</span>
            <div>
              {fases.map((f, i) => (
                <div key={i}>
                  {i > 0 && <div className="gf-conn"></div>}
                  <div className="gf-fase-row">
                    <div className="gf-dot" style={{ background: KLEUREN[i % KLEUREN.length], boxShadow: `0 0 0 3px ${KLEUREN[i % KLEUREN.length]}33` }}></div>
                    <div className="gf-fase-fields">
                      <div className="gf-leeftijd-row">
                        <span className="gf-flabel">Leeftijd</span>
                        <input className="gf-fi" type="number" min={0} max={80} value={f.van} onFocus={e => e.target.select()} onChange={e => updateFase(i, 'van', parseFloat(e.target.value) || 0)} />
                        <span className="gf-arrow">→</span>
                        <input className="gf-fi" type="number" min={0} max={80} value={f.tot} onFocus={e => e.target.select()} onChange={e => updateFase(i, 'tot', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="gf-bedrag-row">
                        <span className="gf-flabel">€</span>
                        <input className="gf-fi bedrag" type="number" min={1} max={10000} value={f.bedrag} onFocus={e => e.target.select()} onChange={e => updateFase(i, 'bedrag', parseFloat(e.target.value) || 0)} />
                        <span className="gf-flabel">/mnd</span>
                      </div>
                    </div>
                    {fases.length > 1 && (
                      <button className="gf-btn-remove" onClick={() => removeFase(i)} title="Verwijder fase">×</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="gf-btn-add" onClick={addFase}>+ Voeg fase toe</button>
          </div>

          {berekening && (
            <div className={`gf-card${laden ? ' gf-laden' : ''}`}>
              <div className="gf-card-title">
                <div className="gf-icon">💰</div>
                Eindkapitaal op {doel}-jarige leeftijd
              </div>
              <div className="gf-result-grid">
                <div className="gf-ri">
                  <span className="gf-rl">Totaal ingelegd</span>
                  <span className="gf-rv">{eur(berekening.totaalIngelegd)}</span>
                  <span className="gf-rs">over {berekening.totaalJaren} jaar</span>
                </div>
                <div className="gf-ri hl">
                  <span className="gf-rl">Eindkapitaal 🚀</span>
                  <span className="gf-rv">{eur(berekening.eindKapitaal)}</span>
                  <span className="gf-rs">bij {rend}% per jaar</span>
                </div>
                <div className="gf-ri">
                  <span className="gf-rl">Rendement winst</span>
                  <span className="gf-rv">{eur(berekening.rendWinst)}</span>
                  <span className="gf-rs">geld dat geld verdiende</span>
                </div>
              </div>
              <span className="gf-tl-header">Groei per fase</span>
              <div className="gf-bd-list">
                {berekening.resultaten.map((r, i) => {
                  const rw = r.kapNa - r.kapVoor - r.ingelegd;
                  return (
                    <div key={i} className="gf-bd-row">
                      <div className="gf-bd-kleur" style={{ background: KLEUREN[r.index % KLEUREN.length] }}></div>
                      <div className="gf-bd-info">
                        <div className="gf-bd-periode">{r.van}–{r.tot} jaar · €{r.bedrag}/mnd</div>
                        <div className="gf-bd-detail">ingelegd {eur(r.ingelegd)} · rendement {eur(Math.max(0, rw))}</div>
                      </div>
                      <div className="gf-bd-waarde">{eur(r.kapNa)}</div>
                    </div>
                  );
                })}
              </div>
              <div className="gf-divider"></div>
              <div className="gf-chart-wrap">
                <canvas ref={chartRef}></canvas>
              </div>
              <span className="gf-fn">Gestippeld = ingelegd bedrag. Gevuld = effect van compound interest.</span>
            </div>
          )}

          <div className="gf-quote">
            <span className="gf-qt">"Dit is gewoon infinity money!!"</span>
            <span className="gf-qs">— <strong>Niels, 11 jaar</strong>, na zijn eerste les over beleggen</span>
          </div>

          <span className="gf-fn">* Berekeningen zijn ter illustratie. Rendementen uit het verleden bieden geen garantie voor de toekomst.<br />10% is gebaseerd op het historisch gemiddelde van brede aandelenindices over lange perioden.</span>
        </div>
      </div>
    </>
  );
}
