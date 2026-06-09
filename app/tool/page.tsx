'use client';

import Script from 'next/script';
import { useRef } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const Chart: any;

const gfCSS = `
/* â”€â”€ RESET â”€â”€ */
.gfc,.gfc *,.gfc *::before,.gfc *::after{box-sizing:border-box !important;-webkit-font-smoothing:antialiased !important;}
.gfc p,.gfc h1,.gfc h2,.gfc h3,.gfc div,.gfc span,.gfc label{margin:0 !important;padding:0 !important;}

/* â”€â”€ WRAPPER â”€â”€ */
.gfc{font-family:'Lora',serif !important;color:#1A1F36 !important;background:transparent !important;width:100% !important;max-width:100% !important;display:block !important;}

/* â”€â”€ BANNER â”€â”€ */
.gfc .gf-banner{position:relative !important;width:100% !important;overflow:hidden !important;background:#1A1F36 !important;margin-bottom:0 !important;display:block !important;}
.gfc .gf-banner img{width:100% !important;height:auto !important;display:block !important;object-fit:cover !important;max-width:100% !important;border:none !important;box-shadow:none !important;}
.gfc .gf-banner::after{content:'' !important;position:absolute !important;bottom:0 !important;left:0 !important;right:0 !important;height:120px !important;background:linear-gradient(to bottom,transparent,#F7F7FA) !important;pointer-events:none !important;}

/* â”€â”€ INTRO â”€â”€ */
.gfc .gf-intro{max-width:700px !important;margin:0 auto !important;padding:40px 24px 24px !important;text-align:center !important;}
.gfc .gf-badge{display:inline-block !important;background:rgba(107,45,132,0.1) !important;border:1px solid rgba(107,45,132,0.25) !important;border-radius:20px !important;font-family:'Montserrat',sans-serif !important;font-weight:700 !important;font-size:11px !important;letter-spacing:1.5px !important;text-transform:uppercase !important;color:#6B2D84 !important;padding:5px 14px !important;margin-bottom:18px !important;}
.gfc .gf-intro h1{font-family:'Montserrat',sans-serif !important;font-weight:800 !important;font-size:clamp(22px,4vw,36px) !important;color:#1A1F36 !important;line-height:1.15 !important;margin-bottom:16px !important;}
.gfc .gf-intro-tekst{font-family:'Lora',serif !important;font-style:italic !important;font-size:16px !important;color:#1A1F36 !important;line-height:1.7 !important;opacity:0.7 !important;margin-bottom:20px !important;display:block !important;}
.gfc .gf-pijlen{display:flex !important;justify-content:center !important;gap:20px !important;flex-wrap:wrap !important;}
.gfc .gf-pijl{display:flex !important;align-items:center !important;gap:7px !important;font-family:'Montserrat',sans-serif !important;font-weight:700 !important;font-size:12px !important;color:#6B2D84 !important;}
.gfc .gf-pijl-dot{width:7px !important;height:7px !important;background:#3EDCB1 !important;border-radius:50% !important;flex-shrink:0 !important;}

/* â”€â”€ SECTIE KOP â”€â”€ */
.gfc .gf-wrap{max-width:900px !important;margin:0 auto !important;padding:0 20px 20px !important;}
.gfc .gf-sectie-kop{text-align:center !important;margin-bottom:24px !important;padding-top:32px !important;}
.gfc .gf-sectie-kop h2{font-family:'Montserrat',sans-serif !important;font-weight:800 !important;font-size:clamp(18px,3vw,26px) !important;color:#1A1F36 !important;margin-bottom:6px !important;}
.gfc .gf-sectie-kop h2 span{color:#E21B70 !important;}
.gfc .gf-sectie-kop p{font-family:'Lora',serif !important;font-style:italic !important;font-size:14px !important;color:#1A1F36 !important;opacity:0.55 !important;}

/* â”€â”€ CARDS â”€â”€ */
.gfc .gf-card{background:#ffffff !important;border-radius:16px !important;padding:28px !important;margin-bottom:20px !important;box-shadow:0 4px 24px rgba(26,31,54,0.08) !important;border:none !important;}
.gfc .gf-card-title{font-family:'Montserrat',sans-serif !important;font-weight:800 !important;font-size:16px !important;color:#6B2D84 !important;margin-bottom:20px !important;display:flex !important;align-items:center !important;gap:10px !important;}
.gfc .gf-icon{width:32px !important;height:32px !important;background:linear-gradient(135deg,#E21B70,#6B2D84) !important;border-radius:8px !important;display:flex !important;align-items:center !important;justify-content:center !important;font-size:15px !important;flex-shrink:0 !important;line-height:1 !important;}

/* â”€â”€ GLOBAL ROW â”€â”€ */
.gfc .gf-row{display:grid !important;grid-template-columns:1fr 1fr !important;gap:16px !important;margin-bottom:24px !important;}
@media(max-width:500px){.gfc .gf-row{grid-template-columns:1fr !important;}}
.gfc .gf-ig{display:flex !important;flex-direction:column !important;gap:6px !important;}
.gfc .gf-ig label{font-family:'Montserrat',sans-serif !important;font-weight:700 !important;font-size:11px !important;letter-spacing:1px !important;text-transform:uppercase !important;color:rgba(26,31,54,0.6) !important;display:block !important;}
.gfc .gf-iw{position:relative !important;display:flex !important;align-items:center !important;}
.gfc .gf-suf{position:absolute !important;right:12px !important;font-family:'Montserrat',sans-serif !important;font-weight:600 !important;font-size:13px !important;color:rgba(26,31,54,0.4) !important;pointer-events:none !important;}

/* â”€â”€ NUMBER INPUTS â”€â”€ */
.gfc input[type="number"]{width:100% !important;padding:12px 40px 12px 14px !important;border:2px solid #E8E8F0 !important;border-radius:10px !important;font-family:'Montserrat',sans-serif !important;font-weight:700 !important;font-size:17px !important;color:#1A1F36 !important;background:#F7F7FA !important;outline:none !important;-moz-appearance:textfield !important;box-shadow:none !important;-webkit-appearance:none !important;line-height:1 !important;}
.gfc input[type="number"]::-webkit-inner-spin-button,.gfc input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none !important;margin:0 !important;}
.gfc input[type="number"]:focus{border-color:#6B2D84 !important;background:#ffffff !important;box-shadow:0 0 0 3px rgba(107,45,132,0.1) !important;}

/* â”€â”€ RANGE SLIDERS â”€â”€ */
.gfc input[type="range"]{-webkit-appearance:none !important;appearance:none !important;width:100% !important;height:5px !important;border-radius:3px !important;background:#E8E8F0 !important;outline:none !important;margin-top:6px !important;cursor:pointer !important;padding:0 !important;border:none !important;box-shadow:none !important;}
.gfc input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none !important;width:22px !important;height:22px !important;border-radius:50% !important;background:linear-gradient(135deg,#E21B70,#6B2D84) !important;cursor:pointer !important;box-shadow:0 2px 8px rgba(226,27,112,0.35) !important;border:none !important;}
.gfc input[type="range"]::-moz-range-thumb{width:22px !important;height:22px !important;border-radius:50% !important;background:linear-gradient(135deg,#E21B70,#6B2D84) !important;cursor:pointer !important;box-shadow:0 2px 8px rgba(226,27,112,0.35) !important;border:none !important;}
.gfc .gf-slider-labels{display:flex !important;justify-content:space-between !important;font-family:'Montserrat',sans-serif !important;font-size:10px !important;color:rgba(26,31,54,0.3) !important;margin-top:3px !important;}

/* â”€â”€ DIVIDER â”€â”€ */
.gfc .gf-divider{height:2px !important;background:linear-gradient(90deg,transparent,#3EDCB1,transparent) !important;margin:22px 0 !important;border:none !important;opacity:0.3 !important;}

/* â”€â”€ TIJDLIJN â”€â”€ */
.gfc .gf-tl-header{font-family:'Montserrat',sans-serif !important;font-weight:700 !important;font-size:11px !important;letter-spacing:1.5px !important;text-transform:uppercase !important;color:#6B2D84 !important;opacity:0.8 !important;margin-bottom:14px !important;display:block !important;}
.gfc .gf-conn{width:2px !important;height:12px !important;background:linear-gradient(180deg,#6B2D84,#3EDCB1) !important;margin:0 0 0 19px !important;opacity:0.3 !important;}
.gfc .gf-fase-row{display:flex !important;align-items:center !important;gap:10px !important;background:#F7F7FA !important;border-radius:12px !important;padding:13px 14px !important;border:2px solid transparent !important;box-shadow:none !important;}
.gfc .gf-fase-row:focus-within{border-color:#6B2D84 !important;background:#ffffff !important;}
.gfc .gf-dot{width:14px !important;height:14px !important;border-radius:50% !important;flex-shrink:0 !important;}
.gfc .gf-fase-fields{display:flex !important;align-items:center !important;gap:7px !important;flex:1 !important;flex-wrap:wrap !important;}
.gfc .gf-flabel{font-family:'Montserrat',sans-serif !important;font-weight:600 !important;font-size:12px !important;color:rgba(26,31,54,0.5) !important;white-space:nowrap !important;}
.gfc .gf-fi{width:68px !important;padding:7px 8px !important;border:2px solid #E0E0EC !important;border-radius:8px !important;font-family:'Montserrat',sans-serif !important;font-weight:700 !important;font-size:15px !important;color:#1A1F36 !important;background:#ffffff !important;outline:none !important;text-align:center !important;box-shadow:none !important;-moz-appearance:textfield !important;-webkit-appearance:none !important;}
.gfc .gf-fi::-webkit-inner-spin-button,.gfc .gf-fi::-webkit-outer-spin-button{-webkit-appearance:none !important;margin:0 !important;}
.gfc .gf-fi:focus{border-color:#6B2D84 !important;box-shadow:0 0 0 2px rgba(107,45,132,0.12) !important;}
.gfc .gf-fi.bedrag{width:88px !important;color:#6B2D84 !important;}
.gfc .gf-arrow{font-size:16px !important;color:#3EDCB1 !important;font-weight:700 !important;flex-shrink:0 !important;}
.gfc .gf-btn-remove{width:28px !important;height:28px !important;border-radius:50% !important;border:2px solid #E0E0EC !important;background:#ffffff !important;cursor:pointer !important;font-size:15px !important;color:#aaa !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-shrink:0 !important;line-height:1 !important;padding:0 !important;box-shadow:none !important;}
.gfc .gf-btn-remove:hover{border-color:#E21B70 !important;color:#E21B70 !important;}
.gfc .gf-btn-add{display:flex !important;align-items:center !important;justify-content:center !important;gap:8px !important;padding:10px 18px !important;border:2px dashed rgba(107,45,132,0.4) !important;border-radius:10px !important;background:transparent !important;cursor:pointer !important;font-family:'Montserrat',sans-serif !important;font-weight:700 !important;font-size:13px !important;color:#6B2D84 !important;opacity:0.65 !important;margin-top:10px !important;width:100% !important;box-shadow:none !important;}
.gfc .gf-btn-add:hover{opacity:1 !important;background:rgba(107,45,132,0.04) !important;}

/* â”€â”€ RESULTATEN â”€â”€ */
.gfc .gf-result-grid{display:grid !important;grid-template-columns:repeat(3,1fr) !important;gap:14px !important;margin-bottom:24px !important;}
@media(max-width:560px){.gfc .gf-result-grid{grid-template-columns:1fr !important;}}
.gfc .gf-ri{background:#F7F7FA !important;border-radius:12px !important;padding:18px 14px !important;text-align:center !important;box-shadow:none !important;border:none !important;}
.gfc .gf-ri.hl{background:linear-gradient(135deg,#1A1F36,#6B2D84) !important;}
.gfc .gf-rl{font-family:'Montserrat',sans-serif !important;font-weight:700 !important;font-size:10px !important;letter-spacing:1px !important;text-transform:uppercase !important;color:rgba(26,31,54,0.5) !important;margin-bottom:6px !important;display:block !important;}
.gfc .gf-ri.hl .gf-rl{color:#3EDCB1 !important;opacity:1 !important;}
.gfc .gf-rv{font-family:'Montserrat',sans-serif !important;font-weight:800 !important;font-size:clamp(20px,3.5vw,30px) !important;color:#6B2D84 !important;display:block !important;line-height:1.1 !important;}
.gfc .gf-ri.hl .gf-rv{color:#E21B70 !important;font-size:clamp(24px,4.5vw,36px) !important;}
.gfc .gf-rs{font-family:'Lora',serif !important;font-style:italic !important;font-size:11px !important;color:rgba(26,31,54,0.4) !important;margin-top:4px !important;display:block !important;}
.gfc .gf-ri.hl .gf-rs{color:rgba(255,255,255,0.5) !important;}

/* â”€â”€ BREAKDOWN â”€â”€ */
.gfc .gf-bd-list{display:flex !important;flex-direction:column !important;gap:8px !important;margin-bottom:20px !important;}
.gfc .gf-bd-row{display:flex !important;align-items:center !important;gap:10px !important;padding:10px 14px !important;background:#F7F7FA !important;border-radius:10px !important;box-shadow:none !important;border:none !important;}
.gfc .gf-bd-kleur{width:12px !important;height:12px !important;border-radius:3px !important;flex-shrink:0 !important;}
.gfc .gf-bd-info{flex:1 !important;}
.gfc .gf-bd-periode{font-family:'Montserrat',sans-serif !important;font-weight:700 !important;font-size:12px !important;color:#1A1F36 !important;}
.gfc .gf-bd-detail{font-family:'Lora',serif !important;font-style:italic !important;font-size:11px !important;color:rgba(26,31,54,0.45) !important;}
.gfc .gf-bd-waarde{font-family:'Montserrat',sans-serif !important;font-weight:800 !important;font-size:14px !important;color:#6B2D84 !important;text-align:right !important;}

/* â”€â”€ CHART â”€â”€ */
.gfc .gf-chart-wrap{position:relative !important;height:260px !important;}

/* â”€â”€ QUOTE â”€â”€ */
.gfc .gf-quote{background:linear-gradient(135deg,#1A1F36,#6B2D84) !important;border-radius:14px !important;padding:24px 28px !important;text-align:center !important;box-shadow:none !important;border:none !important;margin:0 20px 20px !important;}
.gfc .gf-qt{font-family:'Pacifico',cursive !important;font-size:clamp(16px,3vw,22px) !important;color:#E21B70 !important;margin-bottom:8px !important;line-height:1.4 !important;display:block !important;}
.gfc .gf-qs{font-family:'Lora',serif !important;font-style:italic !important;color:rgba(255,255,255,0.55) !important;font-size:13px !important;display:block !important;}
.gfc .gf-qs strong{color:#3EDCB1 !important;font-style:normal !important;font-weight:700 !important;}

/* â”€â”€ FOOTNOTE â”€â”€ */
.gfc .gf-fn{font-family:'Lora',serif !important;font-style:italic !important;font-size:11px !important;color:rgba(26,31,54,0.35) !important;text-align:center !important;margin-top:12px !important;line-height:1.6 !important;display:block !important;padding:0 20px !important;}
`;

const gfHTML = `
  <div class="gf-banner">
    <img src="/banner.jpg" alt="Generatie Fearless â€” Financiele vrijheid begint vandaag">
  </div>

  <div class="gf-intro">
    <span class="gf-badge">Generatie Fearless</span>
    <h1>Geef je kind de voorsprong die jij nooit had.</h1>
    <span class="gf-intro-tekst">Bereken hieronder wat er gebeurt als jouw kind vroeg begint met beleggen. Speel met de bedragen en de leeftijd. En zie wat compound interest doet als de tijd zijn werk mag doen.</span>
    <div class="gf-pijlen">
      <div class="gf-pijl"><div class="gf-pijl-dot"></div>Groei per fase zichtbaar</div>
      <div class="gf-pijl"><div class="gf-pijl-dot"></div>Meerdere fases instellen</div>
      <div class="gf-pijl"><div class="gf-pijl-dot"></div>Grafiek van leeftijd tot doel</div>
    </div>
  </div>

  <div class="gf-wrap">
    <div class="gf-sectie-kop">
      <h2>De <span>Infinity Money</span> Calculator</h2>
      <p>Vul de fases in om te het geld groeien</p>
    </div>

    <div class="gf-card">
      <div class="gf-card-title">
        <div class="gf-icon">&#9881;&#65039;</div>
        Instellingen
      </div>
      <div class="gf-row">
        <div class="gf-ig">
          <label for="gf-doelLeeftijd">Doelleeftijd</label>
          <div class="gf-iw">
            <input type="number" id="gf-doelLeeftijd" value="50" min="15" max="80">
            <span class="gf-suf">jaar</span>
          </div>
          <input type="range" id="gf-doelSlider" min="15" max="80" value="50" step="1">
          <div class="gf-slider-labels"><span>15</span><span>80</span></div>
        </div>
        <div class="gf-ig">
          <label for="gf-rendement">Jaarlijks rendement</label>
          <div class="gf-iw">
            <input type="number" id="gf-rendement" value="8" min="1" max="15">
            <span class="gf-suf">%</span>
          </div>
          <input type="range" id="gf-rendSlider" min="1" max="15" value="8" step="0.5">
          <div class="gf-slider-labels"><span>1%</span><span>15%</span></div>
        </div>
      </div>
      <div class="gf-divider"></div>
      <span class="gf-tl-header">Tijdlijn &#8212; wat legt je kind in per fase?</span>
      <div id="gf-fasesList"></div>
      <button class="gf-btn-add" id="gf-btnAddFase">+ Voeg fase toe</button>
    </div>

    <div class="gf-card">
      <div class="gf-card-title">
        <div class="gf-icon">&#128176;</div>
        Eindkapitaal op <span id="gf-doelLabel">50</span>-jarige leeftijd
      </div>
      <div class="gf-result-grid">
        <div class="gf-ri">
          <span class="gf-rl">Totaal ingelegd</span>
          <span class="gf-rv" id="gf-totaalIngelegd">&#8364; 0</span>
          <span class="gf-rs" id="gf-totaalJaren">over &#8212; jaar</span>
        </div>
        <div class="gf-ri hl">
          <span class="gf-rl">Eindkapitaal &#128640;</span>
          <span class="gf-rv" id="gf-eindKapitaal">&#8364; 0</span>
          <span class="gf-rs" id="gf-rendLabel">bij 8% per jaar</span>
        </div>
        <div class="gf-ri">
          <span class="gf-rl">Rendement winst</span>
          <span class="gf-rv" id="gf-rendWinst">&#8364; 0</span>
          <span class="gf-rs">geld dat geld verdiende</span>
        </div>
      </div>
      <span class="gf-tl-header">Groei per fase</span>
      <div class="gf-bd-list" id="gf-breakdownList"></div>
      <div class="gf-divider"></div>
      <div class="gf-chart-wrap">
        <canvas id="gf-growthChart"></canvas>
      </div>
      <span class="gf-fn">Gestippeld = ingelegd bedrag. Gevuld = effect van compound interest.</span>
    </div>

    <div class="gf-quote">
      <span class="gf-qt">&#8220;Dit is gewoon infinity money!!&#8221;</span>
      <span class="gf-qs">&#8212; <strong>Niels, 11 jaar</strong>, na zijn eerste les over beleggen</span>
    </div>

    <span class="gf-fn">* Berekeningen zijn ter illustratie. Rendementen uit het verleden bieden geen garantie voor de toekomst.<br>8% is gebaseerd op het historisch gemiddelde van brede aandelenindices over lange perioden.</span>
  </div>
`;

export default function MijnTool() {
  const initialized = useRef(false);

  function initCalculator() {
    if (initialized.current) return;
    initialized.current = true;

    (function () {
      'use strict';
      var EUR = 'â‚¬';
      var KLEUREN = ['#6B2D84', '#E21B70', '#3EDCB1', '#FF6B35', '#1A1F36'];
      var fases: { van: number; tot: number; bedrag: number }[] = [
        { van: 11, tot: 16, bedrag: 10 },
        { van: 16, tot: 18, bedrag: 25 },
        { van: 18, tot: 30, bedrag: 75 },
        { van: 30, tot: 50, bedrag: 150 },
      ];

      function fv(pv: number, pmt: number, jaren: number, rendPct: number): number {
        if (jaren <= 0) return pv;
        var r = rendPct / 100 / 12, n = jaren * 12;
        if (r === 0) return pv + pmt * n;
        var g = Math.pow(1 + r, n);
        return pv * g + pmt * (g - 1) / r;
      }

      function eur(n: number): string {
        if (n >= 1000000) return EUR + ' ' + (n / 1000000).toFixed(2).replace('.', ',') + ' mln';
        return EUR + ' ' + Math.round(n).toLocaleString('nl-NL');
      }

      var chart: any = null;

      function tekenChart(labels: string[], ingData: number[], kapData: number[]) {
        var canvas = document.getElementById('gf-growthChart') as HTMLCanvasElement | null;
        if (!canvas) return;
        if (chart) { chart.destroy(); chart = null; }
        chart = new Chart(canvas.getContext('2d'), {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              { label: 'Eindkapitaal', data: kapData, borderColor: '#6B2D84', backgroundColor: 'rgba(107,45,132,0.10)', borderWidth: 3, pointRadius: 0, fill: true, tension: 0.4 },
              { label: 'Ingelegd', data: ingData, borderColor: '#3EDCB1', backgroundColor: 'rgba(62,220,177,0.06)', borderWidth: 2, borderDash: [5, 4], pointRadius: 0, fill: true, tension: 0 }
            ]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { labels: { font: { family: 'Montserrat', weight: '700', size: 11 }, color: '#1A1F36', boxWidth: 14 } },
              tooltip: { callbacks: { label: function (c: any) { return ' ' + c.dataset.label + ': ' + eur(c.parsed.y); } }, bodyFont: { family: 'Montserrat', weight: '600' }, titleFont: { family: 'Montserrat', weight: '800' } }
            },
            scales: {
              x: { grid: { display: false }, ticks: { font: { family: 'Montserrat', size: 10 }, color: 'rgba(26,31,54,0.35)', maxTicksLimit: 10 } },
              y: { grid: { color: 'rgba(26,31,54,0.04)' }, ticks: { font: { family: 'Montserrat', size: 10 }, color: 'rgba(26,31,54,0.35)', callback: function (v: any) { return eur(v); } } }
            }
          }
        });
      }

      function bereken() {
        var doel = parseInt((document.getElementById('gf-doelLeeftijd') as HTMLInputElement).value) || 50;
        var rend = parseFloat((document.getElementById('gf-rendement') as HTMLInputElement).value) || 8;
        (document.getElementById('gf-doelLabel') as HTMLElement).textContent = String(doel);
        (document.getElementById('gf-rendLabel') as HTMLElement).textContent = 'bij ' + rend + '% per jaar';
        var gesorteerd = fases.slice().sort(function (a, b) { return a.van - b.van; });
        var kapitaal = 0, totaalIngelegd = 0;
        var resultaten: { van: number; tot: number; bedrag: number; ingelegd: number; kapVoor: number; kapNa: number; kleur: string }[] = [];
        for (var i = 0; i < gesorteerd.length; i++) {
          var f = gesorteerd[i];
          var van = f.van, tot = Math.min(f.tot, doel);
          if (tot <= van) continue;
          var jaren = tot - van, ingelegd = f.bedrag * jaren * 12, kapVoor = kapitaal;
          kapitaal = fv(kapitaal, f.bedrag, jaren, rend);
          totaalIngelegd += ingelegd;
          resultaten.push({ van: van, tot: tot, bedrag: f.bedrag, ingelegd: ingelegd, kapVoor: kapVoor, kapNa: kapitaal, kleur: KLEUREN[i % KLEUREN.length] });
          if (tot >= doel) break;
        }
        if (gesorteerd.length > 0) {
          const lastEind = Math.min(gesorteerd[gesorteerd.length - 1].tot, doel);
          if (lastEind < doel && kapitaal > 0) { kapitaal = fv(kapitaal, 0, doel - lastEind, rend); }
        }
        (document.getElementById('gf-totaalIngelegd') as HTMLElement).textContent = eur(totaalIngelegd);
        (document.getElementById('gf-eindKapitaal') as HTMLElement).textContent = eur(kapitaal);
        (document.getElementById('gf-rendWinst') as HTMLElement).textContent = eur(Math.max(0, kapitaal - totaalIngelegd));
        var vroegste = gesorteerd.length > 0 ? gesorteerd[0].van : 0;
        (document.getElementById('gf-totaalJaren') as HTMLElement).textContent = 'over ' + (doel - vroegste) + ' jaar';
        var bl = document.getElementById('gf-breakdownList') as HTMLElement;
        bl.innerHTML = '';
        resultaten.forEach(function (r) {
          var rw = r.kapNa - r.kapVoor - r.ingelegd;
          var el = document.createElement('div');
          el.className = 'gf-bd-row';
          el.innerHTML = '<div class="gf-bd-kleur" style="background:' + r.kleur + '"></div>'
            + '<div class="gf-bd-info"><div class="gf-bd-periode">' + r.van + 'â€“' + r.tot + ' jaar Â· â‚¬' + r.bedrag + '/mnd</div>'
            + '<div class="gf-bd-detail">ingelegd ' + eur(r.ingelegd) + ' Â· rendement ' + eur(Math.max(0, rw)) + '</div></div>'
            + '<div class="gf-bd-waarde">' + eur(r.kapNa) + '</div>';
          bl.appendChild(el);
        });
        var labels: string[] = [], kapData: number[] = [], ingData: number[] = [], chartKap = 0, chartIng = 0;
        for (var leeftijd = vroegste; leeftijd <= doel; leeftijd++) {
          var pmt = 0;
          for (var j = 0; j < gesorteerd.length; j++) {
            var gf = gesorteerd[j];
            if (leeftijd >= gf.van && leeftijd < Math.min(gf.tot, doel)) { pmt = gf.bedrag; break; }
          }
          if (leeftijd > vroegste) { chartKap = fv(chartKap, pmt, 1, rend); chartIng += pmt * 12; }
          labels.push(leeftijd + ' jr');
          kapData.push(Math.round(chartKap));
          ingData.push(Math.round(chartIng));
        }
        tekenChart(labels, ingData, kapData);
      }

      function renderFases() {
        var list = document.getElementById('gf-fasesList') as HTMLElement;
        list.innerHTML = '';
        fases.forEach(function (f, i) {
          var kleur = KLEUREN[i % KLEUREN.length];
          if (i > 0) { var c = document.createElement('div'); c.className = 'gf-conn'; list.appendChild(c); }
          var wrap = document.createElement('div');
          var row = document.createElement('div');
          row.className = 'gf-fase-row';
          row.innerHTML = '<div class="gf-dot" style="background:' + kleur + ';box-shadow:0 0 0 3px ' + kleur + '33"></div>'
            + '<div class="gf-fase-fields">'
            + '<span class="gf-flabel">Leeftijd</span>'
            + '<input class="gf-fi" type="number" min="0" max="80" value="' + f.van + '" data-i="' + i + '" data-k="van">'
            + '<span class="gf-arrow">â†’</span>'
            + '<input class="gf-fi" type="number" min="0" max="80" value="' + f.tot + '" data-i="' + i + '" data-k="tot">'
            + '<span class="gf-flabel" style="margin-left:4px">â‚¬</span>'
            + '<input class="gf-fi bedrag" type="number" min="1" max="10000" value="' + f.bedrag + '" data-i="' + i + '" data-k="bedrag">'
            + '<span class="gf-flabel">/mnd</span>'
            + '</div>'
            + (fases.length > 1 ? '<button class="gf-btn-remove" data-i="' + i + '" title="Verwijder fase">Ã—</button>' : '');
          row.querySelectorAll('.gf-fi').forEach(function (inp) {
            const input = inp as HTMLInputElement;
            input.addEventListener('input', function () {
              const idx = parseInt(input.dataset.i || '0');
              const key = input.dataset.k as 'van' | 'tot' | 'bedrag';
              fases[idx][key] = parseFloat(input.value) || 0;
              bereken();
            });
          });
          var rb = row.querySelector('.gf-btn-remove') as HTMLButtonElement | null;
          if (rb) {
            rb.addEventListener('click', function () {
              fases.splice(parseInt(rb!.dataset.i || '0'), 1);
              renderFases();
              bereken();
            });
          }
          wrap.appendChild(row);
          list.appendChild(wrap);
        });
      }

      var addBtn = document.getElementById('gf-btnAddFase');
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          var last = fases[fases.length - 1];
          fases.push({ van: last ? last.tot : 11, tot: last ? last.tot + 10 : 21, bedrag: last ? Math.round(last.bedrag * 1.5) : 50 });
          renderFases();
          bereken();
        });
      }

      function koppel(iId: string, sId: string) {
        var inp = document.getElementById(iId) as HTMLInputElement;
        var sld = document.getElementById(sId) as HTMLInputElement;
        if (!inp || !sld) return;
        inp.addEventListener('input', function () { sld.value = inp.value; bereken(); });
        sld.addEventListener('input', function () { inp.value = sld.value; bereken(); });
      }

      koppel('gf-doelLeeftijd', 'gf-doelSlider');
      koppel('gf-rendement', 'gf-rendSlider');

      renderFases();
      bereken();
    })();
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Lora:ital@0;1&family=Pacifico&display=swap"
        rel="stylesheet"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"
        strategy="afterInteractive"
        onLoad={initCalculator}
      />
      <style dangerouslySetInnerHTML={{ __html: gfCSS }} />
      <div className="gfc" dangerouslySetInnerHTML={{ __html: gfHTML }} />
    </>
  );
}

