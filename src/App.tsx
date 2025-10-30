// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const THEME = { bg: "#0b0b0f", panel: "#13131a", accent: "#FFD700", accent2: "#00FFFF", accent3: "#FF4D4D", text: "#e8e6e3", sub: "#a7a7a7" };
const appStyles = { fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial', background: `radial-gradient(1200px 800px at 20% -10%, rgba(0,255,255,0.06), transparent), radial-gradient(1000px 700px at 120% 20%, rgba(255,215,0,0.06), transparent), ${THEME.bg}`, color: THEME.text, minHeight: "100vh", padding: 20 };
const card = { background: THEME.panel, border: `1px solid ${THEME.accent}22`, borderRadius: 12, padding: 16 };
const btn = { background: THEME.accent, color: "#000", border: `1px solid ${THEME.accent}`, borderRadius: 10, padding: "10px 14px", fontWeight: 700, cursor: "pointer" };
const btnGhost = { background: "transparent", color: THEME.accent, border: `1px solid ${THEME.accent}88`, borderRadius: 10, padding: "10px 14px", fontWeight: 700, cursor: "pointer" };
const selectStyle = { background: "#0f0f13", color: THEME.text, border: `1px solid ${THEME.accent}55`, borderRadius: 8, padding: 8 };
const inputStyle = { ...selectStyle };
const badge = (bg = THEME.accent) => ({ background: bg, color: bg === THEME.accent ? "#000" : THEME.text, padding: "2px 8px", borderRadius: 8, fontSize: 12, fontWeight: 700 });

const DEFAULT_TEAMS = [
  { name: "2015 Barcelona", stars: [{ name: "Lionel Messi", quality: 100 }, { name: "Andrés Iniesta", quality: 95 }, { name: "Xavi", quality: 94 }, { name: "Neymar", quality: 95 }, { name: "Luis Suárez", quality: 96 }], teamStrength: 96, goalie: { name: "Claudio Bravo" } },
  { name: "2017 Real Madrid", stars: [{ name: "Cristiano Ronaldo", quality: 98 }, { name: "Luka Modrić", quality: 94 }, { name: "Sergio Ramos", quality: 91 }, { name: "Toni Kroos", quality: 93 }, { name: "Marcelo", quality: 90 }], teamStrength: 95, goalie: { name: "Keylor Navas" } },
  { name: "2013 Bayern Munich", stars: [{ name: "Arjen Robben", quality: 92 }, { name: "Franck Ribéry", quality: 91 }, { name: "Thomas Müller", quality: 90 }, { name: "Bastian Schweinsteiger", quality: 90 }, { name: "Philipp Lahm", quality: 91 }], teamStrength: 94, goalie: { name: "Manuel Neuer" } },
  { name: "2023 Manchester City", stars: [{ name: "Erling Haaland", quality: 95 }, { name: "Kevin De Bruyne", quality: 94 }, { name: "Bernardo Silva", quality: 90 }, { name: "Rodri", quality: 93 }, { name: "Rúben Dias", quality: 90 }], teamStrength: 95, goalie: { name: "Ederson" } },
  { name: "1989 AC Milan", stars: [{ name: "Marco van Basten", quality: 96 }, { name: "Ruud Gullit", quality: 94 }, { name: "Franco Baresi", quality: 92 }, { name: "Paolo Maldini", quality: 92 }, { name: "Frank Rijkaard", quality: 93 }], teamStrength: 94, goalie: { name: "Giovanni Galli" } },
  { name: "2010 Inter Milan", stars: [{ name: "Diego Milito", quality: 90 }, { name: "Wesley Sneijder", quality: 92 }, { name: "Samuel Eto'o", quality: 93 }, { name: "Javier Zanetti", quality: 90 }, { name: "Esteban Cambiasso", quality: 89 }], teamStrength: 90, goalie: { name: "Julio Cesar" } },
  { name: "2004 Arsenal", stars: [{ name: "Thierry Henry", quality: 96 }, { name: "Dennis Bergkamp", quality: 93 }, { name: "Patrick Vieira", quality: 92 }, { name: "Robert Pires", quality: 90 }, { name: "Sol Campbell", quality: 89 }], teamStrength: 90, goalie: { name: "Jens Lehmann" } },
  { name: "1984 Liverpool", stars: [{ name: "Kenny Dalglish", quality: 91 }, { name: "Ian Rush", quality: 92 }, { name: "Graeme Souness", quality: 90 }, { name: "Alan Hansen", quality: 88 }, { name: "Phil Neal", quality: 86 }], teamStrength: 90, goalie: { name: "Bruce Grobbelaar" } },
  { name: "1971 Ajax", stars: [{ name: "Johan Cruyff", quality: 97 }, { name: "Johan Neeskens", quality: 92 }, { name: "Arie Haan", quality: 88 }, { name: "Ruud Krol", quality: 90 }, { name: "Sjaak Swart", quality: 86 }], teamStrength: 92, goalie: { name: "Heinz Stuy" } },
  { name: "2012 Chelsea", stars: [{ name: "Didier Drogba", quality: 92 }, { name: "Frank Lampard", quality: 91 }, { name: "John Terry", quality: 88 }, { name: "Eden Hazard", quality: 90 }, { name: "Ashley Cole", quality: 88 }], teamStrength: 88, goalie: { name: "Petr Čech" } },
  { name: "1997 Borussia Dortmund", stars: [{ name: "Karl-Heinz Riedle", quality: 88 }, { name: "Andreas Möller", quality: 90 }, { name: "Lars Ricken", quality: 86 }, { name: "Matthias Sammer", quality: 90 }, { name: "Jürgen Kohler", quality: 88 }], teamStrength: 88, goalie: { name: "Stefan Klos" } },
  { name: "1996 Juventus", stars: [{ name: "Zinedine Zidane", quality: 95 }, { name: "Didier Deschamps", quality: 89 }, { name: "Alessandro Del Piero", quality: 93 }, { name: "Antonio Conte", quality: 87 }, { name: "Ciro Ferrara", quality: 87 }], teamStrength: 92, goalie: { name: "Angelo Peruzzi" } },
  { name: "2014 Atlético Madrid", stars: [{ name: "Diego Godín", quality: 89 }, { name: "Antoine Griezmann", quality: 90 }, { name: "Koke", quality: 89 }, { name: "Gabi", quality: 87 }, { name: "Felipe Luis", quality: 86 }], teamStrength: 90, goalie: { name: "Jan Oblak" } },
  { name: "1963 Santos", stars: [{ name: "Pelé", quality: 99 }, { name: "Coutinho", quality: 92 }, { name: "Pepe", quality: 92 }, { name: "Zito", quality: 90 }, { name: "Carlos Alberto", quality: 92 }], teamStrength: 93, goalie: { name: "Gilmar" } },
  { name: "1962 Benfica", stars: [{ name: "Eusébio", quality: 96 }, { name: "Mário Coluna", quality: 92 }, { name: "José Águas", quality: 90 }, { name: "Germano", quality: 88 }, { name: "Ántonio Simões", quality: 88 }], teamStrength: 92, goalie: { name: "Costa Pereira" } },
  { name: "1979 Nottingham Forest", stars: [{ name: "Trevor Francis", quality: 88 }, { name: "John Robertson", quality: 87 }, { name: "Peter Shilton", quality: 89 }, { name: "Viv Anderson", quality: 87 }, { name: "Kenny Burns", quality: 86 }], teamStrength: 87, goalie: { name: "Peter Shilton" } },
  { name: "1988 PSV Eindhoven", stars: [{ name: "Romário", quality: 96 }, { name: "Eric Gerets", quality: 88 }, { name: "Gerald Vanenburg", quality: 88 }, { name: "Ronald Koeman", quality: 90 }, { name: "Hans Gillhaus", quality: 87 }], teamStrength: 89, goalie: { name: "Hans van Breukelen" } },
  { name: "2019 Flamengo", stars: [{ name: "Gabigol", quality: 89 }, { name: "Bruno Henrique", quality: 88 }, { name: "Gerson", quality: 86 }, { name: "Arrascaeta", quality: 88 }, { name: "Rafinha", quality: 86 }], teamStrength: 88, goalie: { name: "Diego Alves" } },
  { name: "2012 Corinthians", stars: [{ name: "Paulinho", quality: 86 }, { name: "Cássio", quality: 88 }, { name: "Emerson", quality: 85 }, { name: "Danilo", quality: 85 }, { name: "Ralf", quality: 85 }], teamStrength: 86, goalie: { name: "Cássio" } },
  { name: "1992 São Paulo", stars: [{ name: "Raí", quality: 90 }, { name: "Cafu", quality: 90 }, { name: "Toninho Cerezo", quality: 88 }, { name: "Müller", quality: 87 }, { name: "Leonardo", quality: 86 }], teamStrength: 89, goalie: { name: "Zetti" } },
  { name: "1986 Steaua București", stars: [{ name: "Gheorghe Hagi", quality: 92 }, { name: "Helmuth Duckadam", quality: 88 }, { name: "Lăcătuș", quality: 88 }, { name: "Marius Lăcătuș", quality: 88 }, { name: "Victor Pițurcă", quality: 87 }], teamStrength: 87, goalie: { name: "Helmuth Duckadam" } },
  { name: "1991 Red Star Belgrade", stars: [{ name: "Dejan Savićević", quality: 90 }, { name: "Robert Prosinečki", quality: 90 }, { name: "Darko Pančev", quality: 90 }, { name: "Vladimir Jugović", quality: 88 }, { name: "Miodrag Belodedici", quality: 88 }], teamStrength: 88, goalie: { name: "Stevan Stojanović" } },
  { name: "1966 Peñarol", stars: [{ name: "Alberto Spencer", quality: 92 }, { name: "Pedro Rocha", quality: 90 }, { name: "Ladislao Mazurkiewicz", quality: 90 }, { name: "Luis Cubilla", quality: 88 }, { name: "Roque Máspoli", quality: 87 }], teamStrength: 88, goalie: { name: "Ladislao Mazurkiewicz" } },
  { name: "1973 Independiente", stars: [{ name: "Ricardo Bochini", quality: 90 }, { name: "Daniel Bertoni", quality: 88 }, { name: "Miguel Santoro", quality: 86 }, { name: "Jorge Burruchaga", quality: 88 }, { name: "Ricardo Pavoni", quality: 87 }], teamStrength: 90, goalie: { name: "Miguel Santoro" } },
  { name: "1968 Estudiantes", stars: [{ name: "Juan Ramón Verón", quality: 88 }, { name: "Carlos Bilardo", quality: 86 }, { name: "Oscar Malbernat", quality: 85 }, { name: "Raúl Madero", quality: 85 }, { name: "Juan Echecopar", quality: 84 }], teamStrength: 87, goalie: { name: "Alberto Poletti" } },
  { name: "2018 River Plate", stars: [{ name: "Pity Martínez", quality: 86 }, { name: "Juanfer Quintero", quality: 87 }, { name: "Franco Armani", quality: 86 }, { name: "Gonzalo Martínez", quality: 86 }, { name: "Lucas Pratto", quality: 86 }], teamStrength: 88, goalie: { name: "Franco Armani" } },
  { name: "2003 Boca Juniors", stars: [{ name: "Juan Román Riquelme", quality: 93 }, { name: "Carlos Tevez", quality: 90 }, { name: "Roberto Abbondanzieri", quality: 87 }, { name: "Martín Palermo", quality: 89 }, { name: "Clemente Rodríguez", quality: 86 }], teamStrength: 90, goalie: { name: "Roberto Abbondanzieri" } },
  { name: "1991 Sampdoria", stars: [{ name: "Gianluca Vialli", quality: 90 }, { name: "Roberto Mancini", quality: 90 }, { name: "Attilio Lombardo", quality: 88 }, { name: "Pietro Vierchowod", quality: 88 }, { name: "Toninho Cerezo", quality: 88 }], teamStrength: 85, goalie: { name: "Gianluca Pagliuca" } },
  { name: "1971 Celtic", stars: [{ name: "Jimmy Johnstone", quality: 89 }, { name: "Billy McNeill", quality: 88 }, { name: "Bobby Lennox", quality: 88 }, { name: "Tommy Gemmell", quality: 88 }, { name: "Bertie Auld", quality: 87 }], teamStrength: 86, goalie: { name: "Evan Williams" } },
  { name: "1972 Derby County", stars: [{ name: "Kevin Hector", quality: 85 }, { name: "Roy McFarland", quality: 86 }, { name: "Colin Todd", quality: 86 }, { name: "Alan Hinton", quality: 85 }, { name: "Archie Gemmill", quality: 86 }], teamStrength: 84, goalie: { name: "Colin Boulton" } },
  { name: "1978 Club Brugge", stars: [{ name: "Jan Ceulemans", quality: 88 }, { name: "Birger Jensen", quality: 86 }, { name: "Robbie Rensenbrink", quality: 88 }, { name: "Raoul Lambert", quality: 86 }, { name: "Franky Van der Elst", quality: 86 }], teamStrength: 85, goalie: { name: "Birger Jensen" } },
  { name: "1995 Ajax", stars: [{ name: "Patrick Kluivert", quality: 90 }, { name: "Clarence Seedorf", quality: 90 }, { name: "Edgar Davids", quality: 89 }, { name: "Marc Overmars", quality: 89 }, { name: "Frank de Boer", quality: 89 }], teamStrength: 92, goalie: { name: "Edwin van der Sar" } },
  { name: "1999 Manchester United", stars: [{ name: "Ryan Giggs", quality: 90 }, { name: "Paul Scholes", quality: 90 }, { name: "David Beckham", quality: 90 }, { name: "Roy Keane", quality: 91 }, { name: "Jaap Stam", quality: 90 }], teamStrength: 92, goalie: { name: "Peter Schmeichel" } },
  { name: "1994 AC Milan", stars: [{ name: "George Weah", quality: 92 }, { name: "Dejan Savićević", quality: 90 }, { name: "Paolo Maldini", quality: 93 }, { name: "Franco Baresi", quality: 94 }, { name: "Roberto Donadoni", quality: 88 }], teamStrength: 94, goalie: { name: "Sebastiano Rossi" } },
  { name: "1993 Marseille", stars: [{ name: "Didier Deschamps", quality: 89 }, { name: "Marcel Desailly", quality: 90 }, { name: "Abedi Pelé", quality: 90 }, { name: "Rudi Völler", quality: 89 }, { name: "Fabien Barthez", quality: 90 }], teamStrength: 90, goalie: { name: "Fabien Barthez" } }
];

const saveLocal = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const loadLocal = (k, fb) => { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fb; } catch { return fb; } };
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const normal = (mu = 0, sigma = 1) => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); return z * sigma + mu; };
const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
const poisson = (lambda, cap = 7) => { const probs = Array.from({ length: cap + 1 }, (_, k) => Math.exp(-lambda) * (lambda ** k) / fact(k)); const tot = probs.reduce((a, b) => a + b, 0); let r = Math.random(), c = 0; for (let k = 0; k <= cap; k++) { c += probs[k] / tot; if (r <= c) return k; } return cap; };

function simulateScore(a, b, goalEnv, homeAdv) { if (!a || !b) return [0, 0]; const sA = a.teamStrength, sB = b.teamStrength; const lamA = Math.max(0.2, goalEnv * ((sA / (sA + sB)) * 2 + homeAdv)); const lamB = Math.max(0.2, goalEnv * ((sB / (sA + sB)) * 2)); return [poisson(lamA), poisson(lamB)]; }
function starLine(team, goals) { const star = team.stars[Math.floor(Math.random() * team.stars.length)]; const q = star.quality; const expGoals = goals * (0.40 + (q - 85) / 220); let g = Math.max(0, Math.round(normal(expGoals, 0.8))); g = Math.min(g, goals); let a = Math.max(0, Math.round(normal(g * 0.6, 0.8))); const base = 6.2 + (q - 85) / 10; const rating = clamp(normal(base + 0.5 * g + 0.3 * a, 0.6), 5.5, 10); return { who: star.name, goals: g, assists: a, rating: +rating.toFixed(2) }; }
function keeperSaves(goalsAgainst) { const shots = goalsAgainst + Math.max(0, Math.round(normal(5, 2))); const saves = Math.max(0, shots - goalsAgainst); return saves; }
function makeSummary(a, b, gA, gB, leg, keys) { const tone = gA === gB ? "couldn’t be split" : Math.abs(gA - gB) === 1 ? "edged it" : gA > gB ? "overpowered" : "dominated"; const leader = gA > gB ? a.name : gB > gA ? b.name : "Both sides"; const legTxt = leg ? ` (Leg ${leg})` : ""; const spice = gA + gB >= 5 ? " A five-goal barnburner lit up the round." : gA + gB <= 1 ? " A cagey tactical duel decided by inches." : ""; const keyStr = keys && keys.length ? ` Key performers: ${keys.join(", ")}.` : ""; const color = Math.random() < 0.5 ? `${leader} pressed high and disrupted build-up.` : `${leader} won the midfield with crisp triangles.`; return `${a.name} vs ${b.name}${legTxt} finished ${gA}-${gB}. ${leader} ${tone} as moments swung the tie. ${color}${spice}${keyStr}`; }
function groupSchedule(ts) { if (!ts || ts.length < 4) return []; const [A, B, C, D] = ts; return [ [{ home: A, away: B }, { home: C, away: D }], [{ home: A, away: C }, { home: B, away: D }], [{ home: A, away: D }, { home: B, away: C }] ]; }

export default function App() {
  const [tab, setTab] = useState('groups');
  const [teams, setTeams] = useState(loadLocal('teams', DEFAULT_TEAMS));
  const [favorites, setFavorites] = useState(loadLocal('favorites', []));
  const [seed, setSeed] = useState(loadLocal('seed', '42'));
  const [goalEnv, setGoalEnv] = useState(1.2);
  const [homeAdv, setHomeAdv] = useState(0.1);
  const [soundOn, setSoundOn] = useState(true);
  const [groups, setGroups] = useState({});
  const [matches, setMatches] = useState([]);
  const [teamOfRound, setTeamOfRound] = useState({});
  const [playerOfWeek, setPlayerOfWeek] = useState({});
  const [bracket, setBracket] = useState({ r16: [], qf: [], sf: [], final: [] });
  const [leaders, setLeaders] = useState([]);
  const [manualHome, setManualHome] = useState('2015 Barcelona');
  const [manualAway, setManualAway] = useState('2017 Real Madrid');
  const [manualResult, setManualResult] = useState(null);
  const [uiMode, setUiMode] = useState('tabs');

  useEffect(() => {
    const handleKeys = e => {
      if (e.key.toLowerCase() === 'r') { randomizeGroups(); runTournament(); }
      if (e.key.toLowerCase() === 's') runTournament();
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [groups, goalEnv, homeAdv, randomizeGroups, runTournament]);

  const teamMap = useMemo(() => Object.fromEntries(teams.map(t => [t.name, t])), [teams]);

  function downloadCSV(text, filename) { const blob = new Blob([text], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); }
  function exportMatchesCSV() { const rows = matches.map(m => `${m.round},${m.leg || ''},${m.week},${m.home},${m.homeGoals},${m.awayGoals},${m.away},"${m.summary.replaceAll('"','""')}"`); downloadCSV(`round,leg,week,home,homeGoals,awayGoals,away,summary\n${rows.join('\n')}`, 'matches.csv'); }
  function exportLeadersCSV() { const rows = leaders.map(l => `${l.Player},${l.Team},${l.Matches},${l.Goals},${l.Assists},${l.Saves},${l.Avg}`); downloadCSV(`Player,Team,Matches,Goals,Assists,Saves,Avg\n${rows.join('\n')}`, 'leaders.csv'); }

  function randomizeGroups() {
    const favs = new Set(favorites);
    const favTeams = teams.filter(t => favs.has(t.name));
    const others = teams.filter(t => !favs.has(t.name));
    const shuffled = others.slice();
    for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    const selected = favTeams.concat(shuffled).slice(0, 32);
    while (selected.length < 32) { selected.push(shuffled[Math.floor(Math.random() * shuffled.length)] || teams[Math.floor(Math.random() * teams.length)]); }
    const out = {};
    for (let i = 0; i < 8; i++) out[String.fromCharCode(65 + i)] = selected.slice(i * 4, (i + 1) * 4).map(t => t.name);
    setGroups(out); setMatches([]); setTeamOfRound({}); setPlayerOfWeek({}); setBracket({ r16: [], qf: [], sf: [], final: [] });
  }

  function runTournament() {
    if (Object.keys(groups).length !== 8) return;
    for (const g of Object.keys(groups)) { if ((groups[g] || []).length !== 4) return; }

    const all = [];
    let week = 1;
    const standings = {};
    const gkSaves = {};

    const teamOfRoundLocal = {};
    const playerOfWeekLocal = {};

    for (const g of Object.keys(groups)) {
      const gt = groups[g];
      const sched = groupSchedule(gt);
      standings[g] = Object.fromEntries(gt.map(t => [t, { pts: 0, gf: 0, ga: 0, gd: 0 }]));

      for (let w = 0; w < sched.length; w++) {
        const roundTag = `Group ${g} — Week ${w + 1}`;
        const roundRatings = [];
        let best = null;

        for (const p of sched[w]) {
          const A = teamMap[p.home], B = teamMap[p.away]; if (!A || !B) continue;
          const [gA, gB] = simulateScore(A, B, goalEnv, homeAdv);
          const sA = starLine(A, gA), sB = starLine(B, gB);
          const savA = keeperSaves(gB), savB = keeperSaves(gA);
          gkSaves[A.goalie.name] = (gkSaves[A.goalie.name] || 0) + savA;
          gkSaves[B.goalie.name] = (gkSaves[B.goalie.name] || 0) + savB;

          const recA = standings[g][A.name], recB = standings[g][B.name];
          recA.gf += gA; recA.ga += gB; recA.gd = recA.gf - recA.ga;
          recB.gf += gB; recB.ga += gA; recB.gd = recB.gf - recB.ga;
          if (gA > gB) recA.pts += 3; else if (gB > gA) recB.pts += 3; else { recA.pts++; recB.pts++; }

          const summary = makeSummary(A, B, gA, gB, undefined, [`${sA.who} ${sA.goals}G/${sA.assists}A`, `${sB.who} ${sB.goals}G/${sB.assists}A`]);

          all.push({
            id: `G-${g}-${w}-${A.name}-${B.name}`,
            round: `Group ${g}`,
            week,
            home: A.name, away: B.name, homeGoals: gA, awayGoals: gB,
            summary,
            starInvolvement: {
              [sA.who]: { goals: sA.goals, assists: sA.assists, rating: sA.rating, team: A.name },
              [sB.who]: { goals: sB.goals, assists: sB.assists, rating: sB.rating, team: B.name }
            }
          });

          for (const pr of [{ player: sA.who, rating: sA.rating, team: A.name }, { player: sB.who, rating: sB.rating, team: B.name }]) {
            if (!best || pr.rating > best.rating) best = pr;
          }
          roundRatings.push({ player: sA.who, rating: sA.rating, team: A.name });
          roundRatings.push({ player: sB.who, rating: sB.rating, team: B.name });

          week++;
        }

        roundRatings.sort((x, y) => y.rating - x.rating);
        teamOfRoundLocal[roundTag] = roundRatings.slice(0, 11);
        if (best) { const wkIdx = week - 1; playerOfWeekLocal[wkIdx] = best; }
      }
    }

    function rankGroup(g) {
      const arr = Object.entries(standings[g]);
      arr.sort((a, b) =>
        b[1].pts - a[1].pts ||
        b[1].gd - a[1].gd ||
        b[1].gf - a[1].gf ||
        (Math.random() < 0.5 ? -1 : 1)
      );
      return arr.map(x => x[0]);
    }

    const order = Object.keys(groups).sort();
    const ranks = {};
    for (const g of order) ranks[g] = rankGroup(g);

    const r16Pairs = [];
    for (let i = 0; i < 8; i += 2) {
      const g1 = order[i], g2 = order[i + 1];
      r16Pairs.push([ranks[g1][0], ranks[g2][1]], [ranks[g2][0], ranks[g1][1]]);
    }

    const r16Ties = [];
    const winnersR16 = r16Pairs.map(([a, b]) => {
      const t = twoLeg(all, teamMap[a], teamMap[b], 'Round of 16');
      r16Ties.push({ a, b, aggA: t.aggA, aggB: t.aggB, winner: t.winner });
      return t.winner;
    });

    const qfPool = shuffle(winnersR16);
    const qfPairs = [];
    for (let i = 0; i < 8; i += 2) qfPairs.push([qfPool[i], qfPool[i + 1]]);

    const qfTies = [];
    const winnersQF = qfPairs.map(([a, b]) => {
      const t = twoLeg(all, teamMap[a], teamMap[b], 'Quarterfinals');
      qfTies.push({ a, b, aggA: t.aggA, aggB: t.aggB, winner: t.winner });
      return t.winner;
    });

    const sfPool = shuffle(winnersQF);
    const sfPairs = [[sfPool[0], sfPool[1]], [sfPool[2], sfPool[3]]];
    const sfTies = [];
    const winnersSF = sfPairs.map(([a, b]) => {
      const t = twoLeg(all, teamMap[a], teamMap[b], 'Semifinals');
      sfTies.push({ a, b, aggA: t.aggA, aggB: t.aggB, winner: t.winner });
      return t.winner;
    });

    const [fa, fb] = winnersSF;
    const A = teamMap[fa], B = teamMap[fb];
    const [gA, gB] = simulateScore(A, B, goalEnv, 0);
    const sA = starLine(A, gA), sB = starLine(B, gB);
    const savA = keeperSaves(gB), savB = keeperSaves(gA);
    const finalSummary = makeSummary(A, B, gA, gB, undefined, [
      `${sA.who} ${sA.goals}G/${sA.assists}A`,
      `${sB.who} ${sB.goals}G/${sB.assists}A`
    ]);
    const finalTie = { a: A.name, b: B.name, aggA: gA, aggB: gB, winner: gA === gB ? (Math.random() < 0.5 ? A.name : B.name) : (gA > gB ? A.name : B.name) };

    all.push({
      id: `Final-${A.name}-${B.name}`,
      round: 'Final',
      week,
      home: A.name, away: B.name, homeGoals: gA, awayGoals: gB,
      summary: finalSummary,
      starInvolvement: {
        [sA.who]: { goals: sA.goals, assists: sA.assists, rating: sA.rating, team: A.name },
        [sB.who]: { goals: sB.goals, assists: sB.assists, rating: sB.rating, team: B.name }
      }
    });

    setMatches(all);
    setBracket({ r16: r16Ties, qf: qfTies, sf: sfTies, final: [finalTie] });
    setTeamOfRound(teamOfRoundLocal);
    setPlayerOfWeek(playerOfWeekLocal);

    const stats = {};
    for (const m of all) {
      for (const [p, s] of Object.entries(m.starInvolvement)) {
        if (!stats[p]) stats[p] = { team: s.team, matches: 0, goals: 0, assists: 0, ratingSum: 0, Saves: 0 };
        const t = stats[p];
        t.team = s.team;
        t.matches++;
        t.goals += s.goals;
        t.assists += s.assists;
        t.ratingSum += s.rating;
      }
    }
    const leadersList = Object.entries(stats).map(([Player, v]) => ({
      Player, Team: v.team, Matches: v.matches, Goals: v.goals, Assists: v.assists, Avg: +(v.ratingSum / v.matches).toFixed(2), Saves: v.Saves
    }));
    leadersList.sort((a, b) => b.Avg - a.Avg || b.Goals - a.Goals);
    setLeaders(leadersList);
  }

  function twoLeg(all, A, B, roundName) {
    const [l1A, l1B] = simulateScore(A, B, goalEnv, homeAdv);
    const s1A = starLine(A, l1A), s1B = starLine(B, l1B);
    const sum1 = makeSummary(A, B, l1A, l1B, 1, [`${s1A.who} ${s1A.goals}G/${s1A.assists}A`, `${s1B.who} ${s1B.goals}G/${s1B.assists}A`]);
    all.push({ id: `${roundName}-${A.name}-${B.name}-L1`, round: roundName, leg: 1, week: 0, home: A.name, away: B.name, homeGoals: l1A, awayGoals: l1B, summary: sum1, starInvolvement: { [s1A.who]: { goals: s1A.goals, assists: s1A.assists, rating: s1A.rating, team: A.name }, [s1B.who]: { goals: s1B.goals, assists: s1B.assists, rating: s1B.rating, team: B.name } } });

    const [l2A, l2B] = simulateScore(B, A, goalEnv, homeAdv);
    const s2A = starLine(B, l2A), s2B = starLine(A, l2B);
    const sum2 = makeSummary(B, A, l2A, l2B, 2, [`${s2A.who} ${s2A.goals}G/${s2A.assists}A`, `${s2B.who} ${s2B.goals}G/${s2B.assists}A`]);
    all.push({ id: `${roundName}-${A.name}-${B.name}-L2`, round: roundName, leg: 2, week: 0, home: B.name, away: A.name, homeGoals: l2A, awayGoals: l2B, summary: sum2, starInvolvement: { [s2A.who]: { goals: s2A.goals, assists: s2A.assists, rating: s2A.rating, team: B.name }, [s2B.who]: { goals: s2B.goals, assists: s2B.assists, rating: s2B.rating, team: A.name } } });

    const aggA = l1A + l2B, aggB = l1B + l2A;
    const winner = aggA === aggB ? (Math.random() < 0.5 ? A.name : B.name) : (aggA > aggB ? A.name : B.name);
    return { winner, aggA, aggB };
  }

  function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function simulateManual() { const A = teamMap[manualHome], B = teamMap[manualAway]; if (!A || !B) return; const [gA, gB] = simulateScore(A, B, goalEnv, homeAdv); const sum = makeSummary(A, B, gA, gB, undefined, [`${A.stars[0].name}`, `${B.stars[0].name}`]); setManualResult({ score: `${A.name} ${gA}-${gB} ${B.name}`, summary: sum }); }

  function exportSave() { saveLocal('saveData', { teams, favorites, seed, goalEnv, homeAdv }); alert('Save exported to localStorage.'); }
  function importSave() { const s = loadLocal('saveData', null); if (!s) return alert('No saved data.'); setTeams(s.teams || teams); setFavorites(s.favorites || []); setSeed(s.seed || '42'); if (typeof s.goalEnv === 'number') setGoalEnv(s.goalEnv); if (typeof s.homeAdv === 'number') setHomeAdv(s.homeAdv); alert('Save imported.'); }

  function BracketView({ data }) { const col = (title, ties) => (<div style={{ flex: 1, minWidth: 240 }}><div style={{ fontWeight: 800, marginBottom: 8, color: THEME.accent2 }}>{title}</div><div style={{ display: 'grid', gap: 8 }}>{ties.map((t, i) => (<div key={title + i} style={{ border: `1px solid ${THEME.accent}33`, borderRadius: 10, padding: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div style={{ fontWeight: 700 }}>{t.a}</div><div style={badge()}>{t.aggA}</div></div><div style={{ display: 'flex', justifyContent: 'space-between' }}><div style={{ fontWeight: 700 }}>{t.b}</div><div style={badge()}>{t.aggB}</div></div><div style={{ marginTop: 6, fontSize: 12, color: THEME.sub }}>Winner: <span style={{ fontWeight: 800, color: THEME.accent }}>{t.winner}</span></div></div>))}</div></div>); return (<div style={{ ...card }}><div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>{col('Round of 16', data.r16)}{col('Quarterfinals', data.qf)}{col('Semifinals', data.sf)}{col('Final', data.final)}</div></div>); }

  const grouped = useMemo(() => { const m = {}; for (const x of matches) { (m[x.round] ||= []).push(x); } for (const k of Object.keys(m)) m[k].sort((a, b) => a.week - b.week || (a.leg || 0) - (b.leg || 0)); return m; }, [matches]);

  return (
    <div style={appStyles}>
      <header style={{ textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: THEME.accent }}>ALL-TIME CLUB SIMULATOR</div>
        <div style={{ fontSize: 12, color: THEME.sub }}>R to re-roll • S to sim • Randomized by design</div>
      </header>

      <section style={{ ...card, marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10, alignItems: 'end' }}>
          <div>
            <div style={{ fontSize: 12, color: THEME.sub }}>Seed</div>
            <input value={seed} onChange={e=>setSeed(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: THEME.sub }}>Goal Environment: {goalEnv.toFixed(2)}</div>
            <input type="range" min={0.8} max={2} step={0.1} value={goalEnv} onChange={e=>setGoalEnv(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: THEME.sub }}>Home Advantage: {homeAdv.toFixed(2)}</div>
            <input type="range" min={0} max={0.3} step={0.05} value={homeAdv} onChange={e=>setHomeAdv(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <button onClick={() => { randomizeGroups(); runTournament(); }} style={btnGhost}>Quick Re-Sim</button>
            <button onClick={randomizeGroups} style={btn}>🎲 Randomize Groups</button>
            <button onClick={runTournament} style={{ ...btn, background: THEME.accent3, borderColor: THEME.accent3, color: '#fff' }}>▶️ Run Tournament</button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={exportMatchesCSV} style={btnGhost}>⬇️ Matches CSV</button>
            <button onClick={exportLeadersCSV} style={btnGhost}>⬇️ Leaders CSV</button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setSoundOn(!soundOn)} style={btnGhost}>{soundOn ? '🔊 Sound On' : '🔇 Sound Off'}</button>
            <button onClick={exportSave} style={btnGhost}>💾 Export Save</button>
            <button onClick={importSave} style={btnGhost}>📂 Import Save</button>
          </div>
        </div>
      </section>

      <nav style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {['groups','matches','awards','dashboard','manual','bracket'].map(k => (
          <button key={k} onClick={()=>setTab(k)} style={{ ...(tab===k?btn:btnGhost), padding: '8px 12px' }}>{k.toUpperCase()}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={()=>setUiMode(uiMode==='tabs'?'bracket':'tabs')} style={btnGhost}>{uiMode==='tabs'?'🧭 Classic Tabs':'🧩 Bracket Focus'}</button>
        </div>
      </nav>

      {tab === 'groups' && (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12 }}>
          {Object.keys(groups).length ? (
            Object.keys(groups).sort().map(g => (
              <div key={g} style={card}>
                <div style={{ fontWeight: 800, marginBottom: 8, color: THEME.accent2 }}>Group {g}</div>
                <ol style={{ margin: 0, paddingLeft: 18 }}>
                  {groups[g].map(t => (
                    <li key={t} style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{t}</span>
                      <button onClick={()=>setFavorites(p=> p.includes(t)? p.filter(x=>x!==t): [...p,t])} style={{ ...btnGhost, fontSize: 12 }}>{favorites.includes(t)?'★':'☆'}</button>
                    </li>
                  ))}
                </ol>
              </div>
            ))
          ) : (
            <div style={{ ...card, textAlign: 'center' }}>Click <strong>Randomize Groups</strong> to generate eight historic groups.</div>
          )}
        </section>
      )}

      {tab === 'matches' && (
        <section style={{ display: uiMode==='bracket'?'none':'grid', gap: 12 }}>
          {!matches.length ? (<div style={card}>No matches yet — run the tournament.</div>) : (
            Object.keys(grouped).map(round => (
              <div key={round} style={card}>
                <div style={{ fontWeight: 800, marginBottom: 8, color: THEME.accent2 }}>{round}</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {grouped[round].map(m => (
                    <div key={m.id} style={{ border: `1px solid ${THEME.accent}33`, borderRadius: 10, padding: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                        <div style={{ fontWeight: 700 }}>{m.home} {m.homeGoals}–{m.awayGoals} {m.away}</div>
                        {m.leg && <span style={badge(THEME.accent2)}>Leg {m.leg}</span>}
                      </div>
                      <div style={{ color: THEME.sub, fontSize: 14, marginTop: 4 }}>{m.summary}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 6, marginTop: 6 }}>
                        {Object.entries(m.starInvolvement).map(([player, s]) => (
                          <div key={player} style={{ background: "#0f0f13", border: `1px solid ${THEME.accent}22`, borderRadius: 8, padding: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div><strong>{player}</strong> — {s.team}</div>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <span style={badge()}>{s.goals}G</span>
                              <span style={badge(THEME.accent2)}>{s.assists}A</span>
                              <span style={badge(THEME.accent3)}>{s.rating.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {tab === 'awards' && (
        <section style={{ display: 'grid', gap: 12 }}>
          <div style={card}>
            <div style={{ fontWeight: 800, marginBottom: 8, color: THEME.accent2 }}>Team of Each Round</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 10 }}>
              {Object.keys(teamOfRound).map(k => (
                <div key={k} style={{ border: `1px solid ${THEME.accent}33`, borderRadius: 10, padding: 10 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{k}</div>
                  <ol style={{ margin: 0, paddingLeft: 18 }}>
                    {teamOfRound[k].map((p,i)=>(<li key={i} style={{ marginBottom: 4 }}><strong>{p.player}</strong> — {p.team} <span style={{ ...badge(THEME.accent2), marginLeft: 6 }}>{p.rating.toFixed(2)}</span></li>))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontWeight: 800, marginBottom: 8, color: THEME.accent2 }}>Player of the Matchweek</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 10 }}>
              {Object.keys(playerOfWeek).map(wk => {
                const p = playerOfWeek[wk];
                return (
                  <div key={wk} style={{ border: `1px solid ${THEME.accent}33`, borderRadius: 10, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 12, color: THEME.sub }}>Matchweek {wk}</div>
                      <div style={{ fontWeight: 700 }}>{p.player} — {p.team}</div>
                    </div>
                    <span style={badge(THEME.accent3)}>{p.rating.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {tab === 'dashboard' && (
        <section style={card}>
          <div style={{ fontWeight: 800, marginBottom: 8, color: THEME.accent2 }}>Performance Dashboard</div>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={leaders.slice(0,15)} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2e" />
              <XAxis dataKey="Player" stroke={THEME.accent} />
              <YAxis stroke={THEME.accent} />
              <Tooltip wrapperStyle={{ backgroundColor: '#1a1a1f', border: `1px solid ${THEME.accent}66`, color: THEME.text }} />
              <Legend />
              <Bar dataKey="Goals" name="Goals" fill={THEME.accent} />
              <Bar dataKey="Assists" name="Assists" fill={THEME.accent2} />
              <Bar dataKey="Avg" name="Avg Rating" fill={THEME.accent3} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      {tab === 'manual' && (
        <section style={card}>
          <div style={{ fontWeight: 800, marginBottom: 8, color: THEME.accent2 }}>Manual Match Simulator</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <select value={manualHome} onChange={e=>setManualHome(e.target.value)} style={selectStyle}>{teams.map(t=>(<option key={t.name}>{t.name}</option>))}</select>
            <span style={{ color: THEME.accent }}>vs</span>
            <select value={manualAway} onChange={e=>setManualAway(e.target.value)} style={selectStyle}>{teams.map(t=>(<option key={t.name}>{t.name}</option>))}</select>
            <button onClick={simulateManual} style={btn}>Simulate</button>
          </div>
          {manualResult && (
            <div style={{ border: `1px solid ${THEME.accent}44`, borderRadius: 10, padding: 10 }}>
              <div style={{ fontWeight: 700 }}>{manualResult.score}</div>
              <div style={{ color: THEME.sub, fontSize: 14, marginTop: 4 }}>{manualResult.summary}</div>
            </div>
          )}
        </section>
      )}

      {tab === 'bracket' && (<BracketView data={bracket} />)}

      <footer style={{ textAlign: 'center', color: THEME.sub, marginTop: 24 }}>© Retro Football Sim — full tournament • bracket & tabs • CSV • sliders • manual sim</footer>
    </div>
  );
}
