import { NextRequest, NextResponse } from 'next/server';

interface Fase {
  van: number;
  tot: number;
  bedrag: number;
}

// --- REKENMETHODE: server-side, nooit zichtbaar in de browser ---

function fv(pv: number, pmt: number, jaren: number, rendPct: number): number {
  if (jaren <= 0) return pv;
  const r = rendPct / 100 / 12;
  const n = jaren * 12;
  if (r === 0) return pv + pmt * n;
  const g = Math.pow(1 + r, n);
  return pv * g + pmt * ((g - 1) / r);
}

function berekenAlles(fases: Fase[], doel: number, rend: number) {
  const gesorteerd = [...fases].sort((a, b) => a.van - b.van);
  let kapitaal = 0, totaalIngelegd = 0;
  const resultaten = [];

  for (let i = 0; i < gesorteerd.length; i++) {
    const f = gesorteerd[i];
    const van = f.van, tot = Math.min(f.tot, doel);
    if (tot <= van) continue;
    const jaren = tot - van, ingelegd = f.bedrag * jaren * 12, kapVoor = kapitaal;
    kapitaal = fv(kapitaal, f.bedrag, jaren, rend);
    totaalIngelegd += ingelegd;
    resultaten.push({ van, tot, bedrag: f.bedrag, ingelegd, kapVoor, kapNa: kapitaal, index: i });
    if (tot >= doel) break;

    const volgende = gesorteerd[i + 1];
    if (volgende && volgende.van > tot) {
      kapitaal = fv(kapitaal, 0, volgende.van - tot, rend);
    }
  }

  if (gesorteerd.length > 0) {
    const lastEind = Math.min(gesorteerd[gesorteerd.length - 1].tot, doel);
    if (lastEind < doel && kapitaal > 0) kapitaal = fv(kapitaal, 0, doel - lastEind, rend);
  }

  const vroegste = gesorteerd.length > 0 ? gesorteerd[0].van : 0;
  const chartLabels: string[] = [], chartKap: number[] = [], chartIng: number[] = [];
  let chartKapVal = 0, chartIngVal = 0;

  for (let leeftijd = vroegste; leeftijd <= doel; leeftijd++) {
    let pmt = 0;
    for (const gf of gesorteerd) {
      if (leeftijd >= gf.van && leeftijd < Math.min(gf.tot, doel)) {
        pmt = gf.bedrag;
        break;
      }
    }
    if (leeftijd > vroegste) {
      chartKapVal = fv(chartKapVal, pmt, 1, rend);
      chartIngVal += pmt * 12;
    }
    chartLabels.push(leeftijd + ' jr');
    chartKap.push(Math.round(chartKapVal));
    chartIng.push(Math.round(chartIngVal));
  }

  return {
    totaalIngelegd,
    eindKapitaal: kapitaal,
    rendWinst: Math.max(0, kapitaal - totaalIngelegd),
    totaalJaren: doel - vroegste,
    resultaten,
    chartLabels,
    chartKap,
    chartIng,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { fases, doel, rend } = await request.json();

    if (!Array.isArray(fases) || !doel || !rend) {
      return NextResponse.json({ error: 'Ongeldige invoer' }, { status: 400 });
    }

    const resultaat = berekenAlles(fases, doel, rend);
    return NextResponse.json(resultaat);
  } catch {
    return NextResponse.json({ error: 'Serverfout' }, { status: 500 });
  }
}
