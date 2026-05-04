import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

// ── Types ─────────────────────────────────────────────────────────────────────
interface RegistrationForm {
  name: string;
  email: string;
  phone: string;
  institution: string;
  presentationType: "attendee" | "oral" | "poster";
  theme?: string;
  presentationTitle?: string;
  abstract?: string;
}

const API_BASE = "/api";

// ── Theme data ────────────────────────────────────────────────────────────────
const THEMES = [
  {
    id: "1", title: "Exploration of Critical Resources and Green Energy",
    icon: "⚡", accent: "#1E3A8A", bg: "#EFF6FF",
    faculty: "D. Upadhyay, K. L. Pruseth, P. N. Sinha Roy, D. K. Singha, S. Mukherjee, P. Ganguly",
    summary: "A forum to advance sustainable exploration of critical minerals and metals underpinning green technologies - covering mineral exploration, renewable energy, energy storage, and pathways to a carbon-neutral future.",
    longDescription: `The Conference on Exploration of Critical Resources and Green Energy aims to provide a distinguished forum for scientists, scholars, industry leaders, and policymakers to deliberate on the sustainable exploration and utilization of critical resources that underpin emerging green technologies. With a focus on advancing research, fostering interdisciplinary dialogue, and addressing the global imperatives of energy transition, this event will examine cutting-edge developments in mineral exploration, renewable energy generation, energy storage, and policy frameworks. The conference will explore the fundamental processes governing the origin, distribution, and formation of critical metals essential for advanced technologies and sustainable energy solutions. This event will highlight recent advances in mineralogical, geochemical, and petrological studies, providing insights into the mechanisms that control the genesis of rare and strategic resources. The conference aspires to enhance collaboration between academia, industry, and governance, thereby contributing to innovative strategies for resource security, technological advancement, and the realization of a sustainable, carbon-neutral future.`,
  },
  {
    id: "2", title: "Safe and Sustainable Water in a Changing World",
    icon: "💧", accent: "#0369A1", bg: "#E0F2FE",
    faculty: "A. Mukherjee, S. P. Sharma",
    summary: "Addressing chronic groundwater depletion, contamination, and climate-driven threats to freshwater. Cross-disciplinary approaches from geosciences, policy, and technology to secure water sustainability globally.",
    longDescription: `Globally, an urgent need exists for a more in-depth, integrated understanding of groundwater systems and the development and implementation of strategies to address ongoing and worsening challenges, including chronic depletion, widespread contamination, extreme climate effects, and threats to food and water security. Of these, groundwater is regarded as the largest source of fresh water across the globe. This theme emphasizes collaboration and cross-disciplinary approaches, including geosciences, policy, economics, technology and education, to achieve water resources sustainability and the human right to clean water. As the world's population expands, so will the demand for water (specifically groundwater), which is the primary source of water for drinking, sanitation, farming, and energy production, among other things. At the same time, human activities and climate change are disturbing natural water cycles, putting freshwater ecosystems at risk. Pollution, infrastructure development, and resource extraction present further challenges that form a nexus of water sustainability and safety.`,
  },
  {
    id: "3", title: "Climate Change Predictions from Rock Record and Climate Modelling",
    icon: "🌡️", accent: "#B91C1C", bg: "#FEF2F2",
    faculty: "A. K. Gupta, M. K. Bera, S. Dey",
    summary: "Bridging deep-time rock archives — microfossils, ice cores, speleothems — with modern climate models to understand past climate shifts and project future changes driven by human activity.",
    longDescription: `Earth's climate has undergone major shifts throughout its evolution, including periods of warming and cooling, influenced by factors such as volcanic activity, gas-hydrate dissociation, permafrost degradation, variations in solar energy, changes in Earth's orbit, opening and closing of the seaways, latitudinal distribution of continents, changes in continental areas, and weathering intensity. These natural shifts can be seen in both long-term (like the repeated late Mesozoic warming and cooling, late Paleocene warming, the Cenozoic cooling, early Pliocene warmth and cold intervals of the middle Miocene polar cooling) and short-term paleo records (like the Last Glacial Maximum and Little Ice Age). The recent extreme events since the mid-20th century are driven by human activities, particularly fuel burning, which increases heat-trapping greenhouse gas levels in Earth's atmosphere, raising Earth's average surface temperature. The greenhouse gases trap heat, raising global temperatures and leading to marked changes such as rising ocean acidification, melting ice, sea level rise, and increased extreme weather events. Natural processes, which have been overwhelmed by human activities, can also contribute to short-term climate change, including internal variability (e.g., El Niño, La Niña and the Pacific Decadal Oscillation). While climate modelers use model runs and reanalysis to understand interannual climate variability both present and past, geologists use marine and continental proxies (microfossils, speleothems, tree rings, ocean lake/terrestrial sediments, ice cores, etc.) to understand long-term changes in the earth's climate on decadal to centennial and millennial to million-year time scales. The faculty members at Department of Geology and Geophysics are actively involved in understanding the key processes and products of these major shifts in regional and global climates including the Mesozoic and early Cenozoic warming, Indian monsoon system during the Quaternary and Holocene and their impact on the South Asian human societies.`,
  },
  {
    id: "4", title: "Deep & Surface Earth Processes, Natural Hazards",
    icon: "🏔️", accent: "#065F46", bg: "#ECFDF5",
    faculty: "S. Gupta, S. K. Bhowmik, R. Vadlamani, S. P. Sharma, M. A. Mamtani, A. Basu, P. Sengupta, W. K. Mohanty, D. Upadhyay + 11 more",
    summary: "Investigating lithospheric evolution, erosion, and mass transport alongside the mechanics of earthquakes and landslides — combining geodynamics, petrology, and hazard assessment for risk-informed planning.",
    longDescription: `Deep Earth processes, unique among the differentiated inner solar system planets, is dynamic and maintains a present-day lithospheric plate tectonic system. However, its evolutionary history, and attendant compositional differences between the differentiated mantle and crust formation processes has been modelled as a transition from stagnant-to-squishy-lid to a mobile-lid geodynamic regime. In this session several approaches to resolve and reconstruct the temporal and chemical lithospheric evolution will utilize geodynamics, petrology, isotope geochemistry, geochronology and modelling of the preserved high-temperature rock record both from cratons and orogenic belts. We aim to focus on critical gaps in understanding petrological, structural and chemical features from the preserved rock record.

Earth Surface Processes vary across spatial and temporal scales. In this session, we focus on quantification of erosion and mass transport over annual to million-year timescales. Multi-proxy approach to understand the landscape evolution is the soul of this session. In the age of Anthropocene, understanding the feedback of anthropogenic activities on Earth Surface Processes is crucial. Studies on assessment and forecasting of human-induced natural hazards will be deeply valued.

Natural hazards such as earthquakes and landslides pose significant threats to life, infrastructure, and socioeconomic stability, particularly in tectonically active and mountainous regions. Earthquakes result from the sudden release of accumulated strain along geological faults, often triggering widespread ground shaking and secondary hazards. Landslides commonly occur due to slope instability driven by seismic activity, intense rainfall, or anthropogenic disturbances. The interaction between earthquakes and landslides amplifies disaster impacts by cascading failures across natural and built environments. Understanding their mechanisms is essential for effective hazard assessment, mitigation, and risk-informed planning.`,
  },
  {
    id: "5", title: "Evolution of Life over Deep Time",
    icon: "🧬", accent: "#6B21A8", bg: "#F5F3FF",
    faculty: "A. K. Gupta, S. Ray, S. Paul, N. Vats",
    summary: "Tracing life's 3.8-billion-year journey from single-celled organisms to complex ecosystems, through fossil records, mass extinction events, and the interplay of tectonics, ocean chemistry, and biology.",
    longDescription: `Life on Earth experienced numerous evolutionary transitions from simple and complex molecules to the first single-celled organisms, to the origin of multicellularity, to the great radiation events leading to the diversification of organisms across different ecological niches. These long-term paleobiogeological and paleoecological trends are depicted through fossil forms and were significantly altered through mass extinction events and the subsequent resetting of the course of evolution. All these trends and perturbations throughout the last 3.8-3.7 billion years have been facilitated by the continual feedback from the external set of forcing factors, including lithospheric tectonics and magmatism, leading to changes in the chemistry of the oceans and the atmosphere. This session aims to elevate our present understanding of these evolutionary transitions, long-term trends, and the interplay of biotic and abiotic worlds.`,
  },
  {
    id: "6", title: "Planetary Geology",
    icon: "🪐", accent: "#B45309", bg: "#FFFBEB",
    faculty: "S. Gupta, D. Upadhyay, S. K. Ghosh, R. Sarkar",
    summary: "Integrating geology, physics, and space science to study planetary formation, impact metamorphism, and surface processes — advancing India's space missions (Chandrayaan, Mangalyaan) and Solar System research.",
    longDescription: `Planetary science integrates geology, physics, chemistry, and space science to understand the origin, evolution, and sustainability of planetary bodies, including Earth. It combines laboratory experiments, high-pressure studies, advanced analytical techniques, and numerical modelling to investigate the formation and transformation of planetary materials across time. The discipline addresses fundamental questions related to early Solar System processes, differentiation of planets and asteroids, impact and shock metamorphism, surface alteration, space weathering, and the geological and geochemical records preserved in meteorites and returned samples. By promoting collaboration between academia and space research organizations, and aligning with India's ambitious space missions e.g., Chandrayaan, Mangalyaan, and coming sample-return program, planetary science plays a crucial role in advancing scientific knowledge, training the next generation of researchers, and strengthening India's contributions to global Solar System research.`,
  },
];

// ── Schedule data (official brochure) ─────────────────────────────────────────
const SCHEDULE = [
  {
    day: "Day 1", date: "Friday, 13 November 2026",
    events: [
      { time: "09:00–10:00",   title: "Inauguration Ceremony",                                    badge: "Ceremony" },
      { time: "10:00–10:15",   title: "Morning Tea Break (at Conference Venue)",                  badge: "Break"    },
      { time: "10:15–10:45",   title: "Keynote Speech 1 / Invited Talk 1",                        badge: "Keynote"  },
      { time: "10:45–11:15",   title: "Invited Talk 2",                                           badge: "Keynote"  },
      { time: "11:15–13:15",   title: "Selected Talks on Theme 1 — Critical Resources (×6)",      badge: "Talk"     },
      { time: "13:15–14:30",   title: "Lunch at Conference Venue",                                badge: "Break"    },
      { time: "14:30–16:30",   title: "Selected Talks on Theme 2 — Water Resources (×6)",         badge: "Talk"     },
      { time: "16:30–17:00",   title: "Evening Snacks & Tea (at Poster Venue)",                   badge: "Break"    },
      { time: "17:00 onwards", title: "Poster Session — Themes 1 & 2",                            badge: "Poster"   },
    ],
  },
  {
    day: "Day 2", date: "Saturday, 14 November 2026",
    events: [
      { time: "09:00–09:30",   title: "Invited Talk 3 / Keynote Speech 2",                        badge: "Keynote"  },
      { time: "09:30–10:00",   title: "Invited Talk 4",                                           badge: "Keynote"  },
      { time: "10:00–10:30",   title: "Morning Tea Break (at Conference Venue)",                  badge: "Break"    },
      { time: "10:30–12:30",   title: "Selected Talks on Theme 3 — Climate Change (×8)",          badge: "Talk"     },
      { time: "12:30–14:00",   title: "Lunch at Conference Venue",                                badge: "Break"    },
      { time: "14:00–17:20",   title: "Selected Talks on Theme 4 — Earth Processes (×10)",        badge: "Talk"     },
      { time: "17:20 onwards", title: "Poster Session — Themes 3 & 4 + Evening Tea",              badge: "Poster"   },
    ],
  },
  {
    day: "Day 3", date: "Sunday, 15 November 2026",
    events: [
      { time: "09:00–09:30",   title: "Invited Talk 5 / Keynote Speech 3",                        badge: "Keynote"  },
      { time: "09:30–10:00",   title: "Invited Talk 6",                                           badge: "Keynote"  },
      { time: "10:00–10:30",   title: "Morning Tea Break (at Conference Venue)",                  badge: "Break"    },
      { time: "10:30–12:30",   title: "Selected Talks on Theme 6 — Planetary Geology (×6)",       badge: "Talk"     },
      { time: "12:30–13:30",   title: "Lunch at Conference Venue",                                badge: "Break"    },
      { time: "13:30–16:50",   title: "Selected Talks on Theme 5 — Evolution of Life (×10)",      badge: "Talk"     },
      { time: "16:50–17:30",   title: "Poster Session — Themes 5 & 6 + Evening Tea",              badge: "Poster"   },
      { time: "17:30–18:00",   title: "Conclusion & Valedictory Session",                         badge: "Ceremony" },
    ],
  },
];

const BADGE: Record<string, string> = {
  Keynote:  "bg-blue-100 text-blue-800 border border-blue-200",
  Talk:     "bg-indigo-100 text-indigo-800 border border-indigo-200",
  Poster:   "bg-purple-100 text-purple-800 border border-purple-200",
  Ceremony: "bg-amber-100 text-amber-800 border border-amber-200",
  Break:    "bg-gray-100 text-gray-500 border border-gray-200",
};

const DEADLINES = [
  { label: "Abstract Submission &\nEarly-bird Registration Opens", date: "01 May 2026",  accent: "#1E3A8A", bg: "#EFF6FF" },
  { label: "Abstract Submission\nCloses",                          date: "31 Aug 2026",  accent: "#065F46", bg: "#ECFDF5" },
  { label: "Abstract Acceptance\nNotification",                    date: "10 Sep 2026",  accent: "#0369A1", bg: "#E0F2FE" },
  { label: "Early-bird Registration\nCloses",                      date: "20 Sep 2026",  accent: "#B91C1C", bg: "#FEF2F2" },
  { label: "Accommodation Request\nCloses",                        date: "15 Oct 2026",  accent: "#B45309", bg: "#FFFBEB" },
];

const MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3692.416508903573!2d87.30320547499818!3d22.31659974217856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1d440148e93ec3%3A0x2f0028c36ee89394!2sIndian%20Institute%20of%20Technology%20Kharagpur!5e0!3m2!1sen!2sin!4v1714000000000!5m2!1sen!2sin";

const HERO_IMG =
  "https://kedld.ndl.gov.in/wp-content/uploads/2025/06/IIT_Kharagpur.jpg";

// ── Utilities ─────────────────────────────────────────────────────────────────
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const reveal = (v: boolean) =>
  `transition-all duration-700 ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`;

// ── SECTION WRAPPER ───────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <p className="section-label mb-3">{text}</p>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar({ onAdmin }: { onAdmin: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "About",    id: "about"    },
    { label: "Themes",   id: "themes"   },
    { label: "Schedule", id: "schedule" },
    { label: "Brochure", id: "brochure" },
    { label: "Venue",    id: "venue"    },
    { label: "Contact",  id: "contact"  },
  ];

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/97 backdrop-blur-xl shadow-card border-b border-[#E5D9C8] py-3"
        : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
          <div className="h-13 w-13 rounded-xl bg-white shadow-md p-1.5 border border-[#E5D9C8] flex items-center justify-center">
            <img src="/assets/logo.png" alt="GG Dept IIT KGP Logo" className="h-10 w-10 object-contain drop-shadow-md" />
          </div>
          <div className="hidden sm:block leading-tight text-left">
            <p className={`font-serif font-bold text-lg leading-none ${scrolled ? "text-[#1E3A8A]" : "text-white"}`}>SSE 2026</p>
            <p className={`text-[10px] tracking-widest uppercase font-semibold ${scrolled ? "text-[#C4A484]" : "text-[#C4A484]"}`}>IIT Kharagpur</p>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-6">
          {links.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)}
              className={`text-sm font-semibold transition-colors tracking-wide ${
                scrolled ? "text-[#374151] hover:text-[#1E3A8A]" : "text-white/90 hover:text-white"
              }`}>
              {l.label}
            </button>
          ))}
          <button onClick={() => scrollTo("register")}
            className="px-5 py-2.5 rounded-xl btn-primary text-white text-sm font-bold shadow-royal">
            Register
          </button>
        </div>

        <button className={`lg:hidden p-2 ${scrolled ? "text-[#1E3A8A]" : "text-white"}`} onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-[#E5D9C8] shadow-card-md px-6 pt-4 pb-6 flex flex-col gap-1">
          {links.map(l => (
            <button key={l.id} onClick={() => { scrollTo(l.id); setOpen(false); }}
              className="text-left py-3 text-base font-semibold text-[#374151] hover:text-[#1E3A8A] border-b border-[#F4EDE2] transition-colors">
              {l.label}
            </button>
          ))}
          <button onClick={() => { scrollTo("register"); setOpen(false); }}
            className="mt-4 py-3.5 rounded-xl btn-primary text-white font-bold text-sm">
            Register Now
          </button>
          <button onClick={() => { onAdmin(); setOpen(false); }}
            className="py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors text-center mt-1">
            Admin Portal
          </button>
        </div>
      )}
    </nav>
  );
}

// ── ADMIN ─────────────────────────────────────────────────────────────────────
function AdminPage({ onBack }: { onBack: () => void }) {
  const [password, setPassword]   = useState("");
  const [adminKey, setAdminKey]   = useState("");
  const [regs, setRegs]           = useState<any[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [adminTab, setAdminTab]   = useState<"registrations" | "abstracts">("registrations");

  const login = async () => {
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API_BASE}/admin/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      setAdminKey(d.adminKey);
      await fetchRegs(d.adminKey);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const fetchRegs = async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/registrations?adminKey=${key}`);
      const d   = await res.json();
      if (!res.ok) throw new Error(d.message);
      setRegs(d.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const abstracts = regs.filter(r => r.presentationType !== "attendee" && (r.abstract || r.presentationTitle));

  const inputCls = "w-full px-4 py-3 rounded-xl border border-[#E5D9C8] bg-[#FAF7F2] text-[#1A202C] text-sm focus:bg-white transition-all";

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-[#1E3A8A] hover:text-[#1E40AF] font-semibold text-sm transition-colors">
          ← Back to site
        </button>
        <div className="flex items-center gap-4 mb-8">
          <img src="/assets/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1E3A8A]">Admin Dashboard</h1>
            <p className="text-[#6B7280] text-sm">SSE 2026 — Conference Management</p>
          </div>
        </div>

        {!adminKey ? (
          <div className="card max-w-sm mx-auto p-8">
            <h2 className="text-xl font-bold text-[#1E3A8A] mb-1">Admin Login</h2>
            <p className="text-[#6B7280] text-sm mb-6">
              Default: <code className="text-[#1E3A8A] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">iitkgp_professor_admin</code>
            </p>
            {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              placeholder="Enter admin password" className={inputCls + " mb-4"} />
            <button onClick={login} disabled={loading}
              className="w-full py-3 rounded-xl btn-primary text-white font-bold disabled:opacity-50">
              {loading ? "Logging in…" : "Login"}
            </button>
          </div>
        ) : (
          <div>
            {/* Tab switcher */}
            <div className="flex gap-2 mb-6 border-b border-[#E5D9C8] pb-0">
              {(["registrations", "abstracts"] as const).map(t => (
                <button key={t} onClick={() => setAdminTab(t)}
                  className={`px-5 py-3 text-sm font-bold rounded-t-xl border-b-2 transition-all capitalize ${
                    adminTab === t
                      ? "border-[#1E3A8A] text-[#1E3A8A] bg-white"
                      : "border-transparent text-[#6B7280] hover:text-[#374151]"
                  }`}>
                  {t === "registrations" ? `All Registrations (${regs.length})` : `Submitted Abstracts (${abstracts.length})`}
                </button>
              ))}
              <button onClick={() => fetchRegs(adminKey)}
                className="ml-auto text-sm px-4 py-2 rounded-lg border border-[#E5D9C8] text-[#6B7280] hover:bg-[#F4EDE2] transition-colors self-center">
                Refresh
              </button>
            </div>

            {/* All Registrations */}
            {adminTab === "registrations" && (
              regs.length === 0
                ? <div className="card p-12 text-center text-[#6B7280]">No registrations yet.</div>
                : (
                  <div className="card overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#E5D9C8] text-left text-xs text-[#6B7280] tracking-widest uppercase bg-[#FAF7F2]">
                          {["#","Name","Email","Phone","Institution","Type","Date"].map(h => (
                            <th key={h} className="px-5 py-4 font-bold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F4EDE2]">
                        {regs.map((r, i) => (
                          <tr key={r.id} className="hover:bg-[#FAF7F2] transition-colors">
                            <td className="px-5 py-4 text-[#9CA3AF]">{i + 1}</td>
                            <td className="px-5 py-4 font-bold text-[#1A202C]">{r.name}</td>
                            <td className="px-5 py-4 text-[#1E3A8A]">{r.email}</td>
                            <td className="px-5 py-4 text-[#374151]">{r.phone}</td>
                            <td className="px-5 py-4 text-[#374151]">{r.institution}</td>
                            <td className="px-5 py-4">
                              <span className="px-2.5 py-1 rounded-lg text-xs bg-blue-100 text-blue-800 border border-blue-200 font-semibold capitalize">{r.presentationType}</span>
                            </td>
                            <td className="px-5 py-4 text-[#9CA3AF]">{new Date(r.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
            )}

            {/* Submitted Abstracts */}
            {adminTab === "abstracts" && (
              abstracts.length === 0
                ? <div className="card p-12 text-center text-[#6B7280]">No abstract submissions yet.</div>
                : (
                  <div className="space-y-4">
                    {abstracts.map((r, i) => (
                      <div key={r.id} className="card p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-[#1E3A8A]">{r.name}</h3>
                            <p className="text-[#6B7280] text-sm">{r.email} &middot; {r.institution}</p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 capitalize">{r.presentationType}</span>
                            {r.theme && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F4EDE2] text-[#9C7B4A] border border-[#E5D9C8]">{r.theme}</span>}
                          </div>
                        </div>
                        {r.presentationTitle && (
                          <p className="font-bold text-[#1A202C] mb-3 text-base">{r.presentationTitle}</p>
                        )}
                        {r.abstract ? (
                          <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E5D9C8]">
                            <p className="text-xs font-bold text-[#C4A484] uppercase tracking-wider mb-2">Abstract</p>
                            <p className="text-[#374151] text-sm leading-relaxed">{r.abstract}</p>
                          </div>
                        ) : (
                          <p className="text-[#9CA3AF] text-sm italic">No abstract text provided.</p>
                        )}
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── DEADLINE BANNER ───────────────────────────────────────────────────────────
function DeadlineBanner() {
  return (
    <section className="bg-white border-y border-[#E5D9C8] py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionLabel text="⏰ Mark Your Calendar" />
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1E3A8A]">Important Deadlines</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {DEADLINES.map((d, i) => (
            <div key={i} className="rounded-2xl p-6 border-t-4 shadow-card hover:-translate-y-1 transition-all duration-200 flex flex-col gap-2"
              style={{ background: d.bg, borderTopColor: d.accent, borderLeft: "1px solid #E5D9C8", borderRight: "1px solid #E5D9C8", borderBottom: "1px solid #E5D9C8" }}>
              <p className="text-sm font-semibold leading-snug whitespace-pre-line" style={{ color: d.accent }}>{d.label}</p>
              <p className="font-bold text-2xl mt-auto pt-2" style={{ color: d.accent }}>{d.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PAYMENT MODAL ─────────────────────────────────────────────────────────────
function PaymentModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-card-lg p-8 max-w-sm w-full relative border border-[#E5D9C8]"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#374151] text-xl font-bold transition-colors leading-none">✕</button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-3xl mx-auto mb-4 border border-[#DBEAFE]">💳</div>
          <h3 className="text-xl font-serif font-bold text-[#1E3A8A] mb-1">Scan to Pay Registration Fee</h3>
          <p className="text-[#6B7280] text-sm">Please scan the QR code and complete the payment.</p>
        </div>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-card border-2 border-[#E5D9C8]">
            <img src="/assets/payment-qr.png" alt="Payment QR Code" className="w-48 h-48 object-contain" />
          </div>
          <div className="w-full bg-[#EFF6FF] rounded-2xl px-5 py-3 text-center border border-[#DBEAFE]">
            <p className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wide mb-0.5">Registration Fee</p>
            <p className="text-3xl font-serif font-extrabold text-[#1E3A8A]">₹500</p>
          </div>
        </div>

        <ol className="space-y-2 mb-6 text-sm text-[#374151]">
          {["Open any UPI app (GPay, PhonePe, Paytm, etc.)", "Scan the QR code above", "Pay ₹500 and save your transaction ID", "Close this window and fill the confirmation form below"].map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>

        <button onClick={onClose}
          className="w-full py-3.5 rounded-xl btn-primary text-white font-bold text-sm">
          I've Paid — Go to Confirmation Form ↓
        </button>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]                     = useState<"home" | "admin">("home");
  const [activeTheme, setActiveTheme]       = useState<any | null>(null);
  const [activeDay, setActiveDay]           = useState(0);
  const [venueTab, setVenueTab]             = useState<"venue" | "location" | "city">("venue");
  const [pdfVisible, setPdfVisible]         = useState(false);
  const [formStatus, setFormStatus]         = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMessage, setFormMessage]       = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [confirmStatus, setConfirmStatus]   = useState<"idle" | "loading" | "success">("idle");

  const aboutReveal    = useReveal();
  const themesReveal   = useReveal();
  const scheduleReveal = useReveal();
  const qrReveal       = useReveal();
  const brochureReveal = useReveal();
  const venueReveal    = useReveal();
  const paymentReveal  = useReveal();
  const confirmReveal  = useReveal();
  const registerReveal = useReveal();
  const contactReveal  = useReveal();

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<RegistrationForm>({
    defaultValues: { presentationType: "attendee" },
  });
  const presentationType = watch("presentationType");

  const onSubmit = async (data: RegistrationForm) => {
    setFormStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (parseErr) {
        console.error("API Response:", text);
        throw new Error("Server returned invalid response. Please check if API server is running.");
      }
      
      if (!res.ok) throw new Error(json.message || "Registration failed.");
      setFormStatus("success");
      setFormMessage("Your registration was successful! We look forward to seeing you at SSE 2026.");
      reset();
    } catch (e: any) {
      setFormStatus("error");
      setFormMessage(e.message || "An error occurred. Please try again.");
      console.error("Registration error:", e);
    }
  };

  if (page === "admin") return <AdminPage onBack={() => setPage("home")} />;

  const openThemeModal = (t: any) => setActiveTheme(t);
  const closeThemeModal = () => setActiveTheme(null);

  const inputCls = "w-full px-4 py-3.5 rounded-xl border border-[#E5D9C8] bg-[#FAF7F2] text-[#1A202C] text-base focus:bg-white transition-all placeholder-[#9CA3AF]";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#374151] overflow-x-hidden">
      {showPaymentModal && <PaymentModal onClose={() => { setShowPaymentModal(false); scrollTo("confirm-payment"); }} />}
      <Navbar onAdmin={() => setPage("admin")} />

      {activeTheme && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] overflow-auto flex items-center justify-center p-4">
          <div className="max-w-5xl w-full bg-white rounded-2xl border-2 border-[#E5D9C8] shadow-lg p-8 md:p-12">
            <button onClick={closeThemeModal} className="absolute top-6 right-6 bg-[#1E3A8A] text-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-[#162456] transition-colors">✕</button>
            <div className="mt-6">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1E3A8A] mb-4">{activeTheme.title}</h2>
              <p className="text-[#374151] text-lg leading-relaxed whitespace-pre-line">{activeTheme.longDescription ?? activeTheme.summary}</p>
            </div>
          </div>
        </div>
      )}

      {pdfVisible && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] overflow-auto flex flex-col justify-start items-center p-4 pt-8">
          <div className="max-w-6xl w-full bg-white rounded-2xl border-2 border-[#E5D9C8] shadow-lg p-8 md:p-12">
            <button onClick={() => setPdfVisible(false)} className="absolute top-6 right-6 bg-[#1E3A8A] text-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-[#162456] transition-colors">✕</button>
            <div className="mt-6">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1E3A8A] mb-2 text-center">Full Conference Schedule</h2>
              <p className="text-center text-[#6B7280] mb-10 text-lg">13–15 November 2026</p>
              
              <div className="space-y-12">
                {SCHEDULE.map((dayData, dayIdx) => (
                  <div key={dayIdx} className="border-2 border-[#C5D5F0] rounded-2xl overflow-hidden">
                    <div className="px-8 py-6 border-b-2 border-[#E8EEF8] bg-gradient-to-r from-[#1E3A8A] to-[#2d52b2]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">📅</div>
                        <div>
                          <h3 className="font-serif font-bold text-white text-2xl">{dayData.day}</h3>
                          <p className="text-blue-200 text-base font-semibold">{dayData.date}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-[#F0F4FF]">
                      {dayData.events.map((ev, evIdx) => (
                        <div key={evIdx} className={`flex items-start gap-5 px-8 py-5 transition-colors ${
                          ev.badge === "Break" ? "bg-[#FAFAFA] opacity-70" : "hover:bg-[#F5F8FF] bg-white"
                        }`}>
                          <div className="min-w-[140px] shrink-0">
                            <p className="text-[#1E3A8A] text-base font-bold font-mono">{ev.time}</p>
                          </div>
                          <div className="shrink-0 w-4 h-4 rounded-full border-2 border-[#C5D5F0] bg-white mt-1" />
                          <div className="flex-1">
                            <p className={`text-lg font-medium leading-relaxed ${
                              ev.badge === "Break" ? "text-[#9CA3AF] italic" : "text-[#1a2a4a]"
                            }`}>{ev.title}</p>
                          </div>
                          <span className={`shrink-0 text-sm px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap ${BADGE[ev.badge] ?? ""}`}>{ev.badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${HERO_IMG}')` }} />
        {/* Strong dark overlay — dims image while keeping it visible */}
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2060]/80 via-[#0F2060]/30 to-[#1E3A8A]/50" />
        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[700, 520, 340].map((r, i) => (
            <div key={i} className="absolute rounded-full border border-white/8" style={{ width: r, height: r }} />
          ))}
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#C4A484]/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Department badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C4A484] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C4A484]" />
            </span>
            Dept. of Geology &amp; Geophysics · IIT Kharagpur
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-extrabold leading-tight mb-6 text-white text-shadow-strong" style={{ lineHeight: 1.15 }}>
            Science for the<br />
            <span className="text-shadow-strong" style={{ color: "#E8C99A" }}>
              Sustainable Earth
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-white font-bold tracking-wide mb-5 text-shadow-md">
            Platinum Jubilee Celebration of IIT Kharagpur
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 flex-wrap">
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-5 py-3.5 text-white font-bold text-base hover:bg-white/20 transition-all cursor-default shadow-lg text-shadow-sm">
              <span className="text-2xl">📅</span>
              <span>3-Day International Conference</span>
            </div>
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-5 py-3.5 text-white font-bold text-base hover:bg-white/20 transition-all cursor-default shadow-lg text-shadow-sm">
              <span className="text-2xl">🗓️</span>
              <span>13 – 15 November, 2026</span>
            </div>
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-5 py-3.5 text-white font-bold text-base hover:bg-white/20 transition-all cursor-default shadow-lg text-shadow-sm">
              <span className="text-2xl">📍</span>
              <span>Kalidas Auditorium, IIT Kharagpur</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => scrollTo("payment")}
              className="px-10 py-4 rounded-xl bg-[#C4A484] hover:bg-[#B08B69] text-white font-extrabold text-lg shadow-royal transition-all hover:-translate-y-1 text-shadow-sm border-2 border-[#E8C99A]/30">
              Register Now →
            </button>
            <button onClick={() => scrollTo("brochure")}
              className="px-10 py-4 rounded-xl bg-white text-[#1E3A8A] font-extrabold text-lg shadow-lg transition-all hover:-translate-y-1 hover:bg-[#EFF6FF] border-2 border-white">
              Download Brochure
            </button>
          </div>

          <div className="mt-20 grid grid-cols-3 gap-5 max-w-2xl mx-auto">
            {[
              {v: "380+", l: "Participants", icon: "👥", color: "from-blue-500/30 to-blue-500/10", clickable: false},
              {v: "6", l: "Themes", icon: "🎯", color: "from-emerald-500/30 to-emerald-500/10", clickable: true},
              {v: "24+", l: "Invited Talks", icon: "🎤", color: "from-amber-500/30 to-amber-500/10", clickable: false}
            ].map((item) => (
              <button key={item.l} 
                onClick={() => item.clickable && scrollTo("themes")}
                disabled={!item.clickable}
                className={`${item.clickable ? 'cursor-pointer' : 'cursor-default'} bg-gradient-to-br ${item.color} backdrop-blur-xl border border-white/30 rounded-3xl p-8 text-center hover:border-white/50 transition-all duration-300 group relative overflow-hidden`}
                style={{ 
                  background: `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)`,
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
                }}>
                {item.clickable && (
                  <div className="absolute top-2 right-2 bg-white/20 rounded-full px-2 py-1 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Click
                  </div>
                )}
                <div className={`text-5xl mb-3 ${item.clickable ? 'group-hover:scale-110 group-hover:rotate-12' : 'group-hover:scale-110'} transition-transform duration-300`}>{item.icon}</div>
                <p className="text-4xl md:text-5xl font-serif font-extrabold text-white mb-2 drop-shadow-lg">{item.v}</p>
                <p className={`text-white/80 text-sm font-semibold tracking-wide uppercase ${item.clickable ? 'group-hover:text-white transition-colors' : ''}`}>{item.l}</p>
                {item.clickable && <p className="text-xs text-white/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">→ View all themes</p>}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" style={{background: "radial-gradient(circle at top right, #fff, transparent)"}} />
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/40">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── DEADLINES ────────────────────────────────────────────────────── */}
      <DeadlineBanner />

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-[#FAF7F2]">
        <div ref={aboutReveal.ref} className={`max-w-7xl mx-auto px-6 ${reveal(aboutReveal.visible)}`}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel text="About the Conference" />
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1E3A8A] mb-6 leading-tight">
                Pioneering Solutions<br />for Our Planet
              </h2>
              <p className="text-[#374151] text-xl leading-relaxed mb-5">
                Organised by the <span className="text-[#1E3A8A] font-bold">Department of Geology and Geophysics, IIT Kharagpur</span> as part of its <span className="text-[#9C7B4A] font-bold">Platinum Jubilee</span> celebrations, SSE 2026 unites leading earth scientists, researchers, and policymakers from around the world.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-10 text-lg">
                Six interdisciplinary themes covering critical resources, water, climate, Earth processes, evolution of life, and planetary geology — fostering dialogue that bridges academia, industry, and governance.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[["380–400","Expected Participants"],["6","Scientific Themes"],["33","Faculty Members"]].map(([v, l]) => (
                  <div key={l} className="card p-5 text-center">
                    <p className="text-3xl font-serif font-bold text-royal-gradient">{v}</p>
                    <p className="text-sm text-[#6B7280] mt-1.5 leading-snug">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-[#C4A484]/15 rounded-3xl -z-10 blur-2xl" />
              <img
                src="/assets/kalidas.jpg"
                alt="Kalidas Auditorium, IIT Kharagpur"
                className="rounded-2xl shadow-card-lg border border-[#E5D9C8] w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-4 -right-4 bg-[#1E3A8A] text-white rounded-2xl px-5 py-3 shadow-royal text-sm font-bold">
                Kalidas Auditorium &amp; Vikramshila Foyer
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THEMES ───────────────────────────────────────────────────────── */}
      <section id="themes" className="py-24 bg-white border-y border-[#E5D9C8]">
        <div ref={themesReveal.ref} className={`max-w-7xl mx-auto px-6 ${reveal(themesReveal.visible)}`}>
          <div className="text-center mb-14">
            <SectionLabel text="Research Tracks" />
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1E3A8A] mb-4">Conference Themes</h2>
            <p className="text-[#6B7280] text-xl max-w-2xl mx-auto">Six interdisciplinary tracks spanning the full spectrum of Earth and planetary sciences.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {THEMES.map((t) => (
              <button key={t.id}
                type="button"
                onClick={() => openThemeModal(t)}
                className="rounded-2xl p-7 border-2 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer text-left group relative overflow-hidden"
                style={{ background: t.bg, borderColor: t.accent + "40" }}>
                {/* Top accent bar always visible */}
                <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${t.accent}, ${t.accent}66)` }} />
                {/* Hover accent line stronger */}
                <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" style={{ background: t.accent }} />

                <div className="flex items-start gap-4 mb-4 mt-2">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-md border-2 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: t.accent + "15", borderColor: t.accent + "30" }}>
                    {t.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ color: t.accent, background: t.accent + "15" }}>Theme {t.id}</span>
                    <h3 className="text-lg font-bold mt-2 leading-snug group-hover:translate-x-1 transition-transform" style={{ color: t.accent }}>{t.title}</h3>
                  </div>
                </div>
                <p className="text-[#374151] text-sm leading-relaxed mb-4">{t.summary}</p>
                <div className="flex items-center gap-1 text-xs font-bold tracking-wide" style={{ color: t.accent }}>
                  <span>Learn more</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCHEDULE ─────────────────────────────────────────────────────── */}
      <section id="schedule" className="py-24 bg-gradient-to-b from-[#F0F4FF] to-[#FAF7F2]">
        <div ref={scheduleReveal.ref} className={`max-w-5xl mx-auto px-6 ${reveal(scheduleReveal.visible)}`}>
          <div className="text-center mb-14">
            <SectionLabel text="Programme" />
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1E3A8A] mb-4">Event Schedule</h2>
            <p className="text-[#6B7280] text-xl">Three days of science — 13–15 November 2026, IIT Kharagpur.</p>
          </div>

          {/* Day selector tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {SCHEDULE.map((d, i) => (
              <button key={i} onClick={() => setActiveDay(i)}
                className={`px-7 py-3.5 rounded-2xl text-base font-bold tracking-wide border-2 transition-all duration-200 shadow-sm ${
                  activeDay === i
                    ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-lg scale-105"
                    : "bg-white border-[#C5D5F0] text-[#374151] hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:bg-[#EFF6FF]"
                }`}>
                <span className="block text-xs font-semibold uppercase tracking-widest mb-0.5 opacity-70">{d.date.split(",")[0]}</span>
                <span>{d.day.replace("Day 1 - ", "").replace("Day 2 - ", "").replace("Day 3 - ", "")}</span>
              </button>
            ))}
            <button onClick={() => setPdfVisible(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border-2 border-[#E5D9C8] text-[#374151] font-bold text-base hover:border-[#C4A484] hover:text-[#9C7B4A] transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Full Schedule
            </button>
          </div>

          {/* Schedule card */}
          <div className="rounded-3xl overflow-hidden border-2 border-[#C5D5F0] shadow-2xl bg-white">
            {/* Card header */}
            <div className="px-8 py-6 border-b-2 border-[#E8EEF8] bg-gradient-to-r from-[#1E3A8A] to-[#2d52b2] flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">📅</div>
              <div>
                <h3 className="font-serif font-bold text-white text-2xl">{SCHEDULE[activeDay].day}</h3>
                <p className="text-blue-200 text-base font-semibold">{SCHEDULE[activeDay].date}</p>
              </div>
              <div className="ml-auto flex gap-2 flex-wrap justify-end">
                {["Keynote","Talk","Poster"].map(b => (
                  <span key={b} className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${BADGE[b]}`}>{b}</span>
                ))}
              </div>
            </div>

            {/* Events list */}
            <div className="divide-y divide-[#F0F4FF]">
              {SCHEDULE[activeDay].events.map((ev, i) => (
                <div key={i}
                  className={`flex items-center gap-5 px-8 py-4 transition-colors ${
                    ev.badge === "Break" ? "bg-[#FAFAFA] opacity-70" : "hover:bg-[#F5F8FF]"
                  }`}>
                  {/* Time */}
                  <div className="min-w-[120px] shrink-0">
                    <p className="text-[#1E3A8A] text-sm font-bold font-mono">{ev.time}</p>
                  </div>
                  {/* Dot connector */}
                  <div className="shrink-0 w-3 h-3 rounded-full border-2 border-[#C5D5F0] bg-white" />
                  {/* Title */}
                  <p className={`flex-1 text-base font-medium ${ev.badge === "Break" ? "text-[#9CA3AF] italic" : "text-[#1a2a4a]"}`}>{ev.title}</p>
                  {/* Badge */}
                  <span className={`shrink-0 text-xs px-3 py-1 rounded-xl font-semibold ${BADGE[ev.badge] ?? ""}`}>{ev.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VENUE / LOCATION / HOST CITY ─────────────────────────────────── */}
      <section id="venue" className="py-24 bg-white border-y border-[#E5D9C8]">
        <div ref={venueReveal.ref} className={`max-w-4xl mx-auto px-6 ${reveal(venueReveal.visible)}`}>
          <div className="text-center mb-12">
            <SectionLabel text="Getting There" />
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1E3A8A] mb-4">Venue &amp; Location</h2>
            <p className="text-[#6B7280] text-xl">Everything you need to plan your visit to IIT Kharagpur.</p>
          </div>

          <div className="flex gap-1 justify-center mb-8 bg-[#F4EDE2] border border-[#E5D9C8] rounded-2xl p-1.5 max-w-sm mx-auto">
            {([
              { key: "venue",    label: "Venue"     },
              { key: "location", label: "Location"  },
              { key: "city",     label: "Host City" },
            ] as const).map(t => (
              <button key={t.key} onClick={() => setVenueTab(t.key)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-base font-bold transition-all duration-200 ${
                  venueTab === t.key
                    ? "bg-[#1E3A8A] text-white shadow-md"
                    : "text-[#6B7280] hover:text-[#374151]"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="card overflow-hidden">

            {/* VENUE TAB */}
            {venueTab === "venue" && (
              <div className="p-8 grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#1E3A8A] mb-1">IIT Kharagpur Campus</h3>
                  <p className="text-[#C4A484] font-semibold text-base mb-5">Dept. of Geology &amp; Geophysics</p>
                  <p className="text-[#374151] leading-relaxed mb-5 text-base">
                    IIT Kharagpur is India's first and oldest IIT, founded in 1951. Spanning over 2,100 acres, the campus is a self-contained township with world-class academic infrastructure, auditoriums, and all modern amenities.
                  </p>
                  <p className="text-[#374151] leading-relaxed mb-6 text-base">
                    SSE 2026 will be hosted at the <strong>Kalidas Auditorium and Vikramshila Foyer</strong> — equipped with high-capacity seminar halls, poster display areas, and networking spaces.
                  </p>
                  <div className="space-y-3 text-base">
                    {[
                      { icon: "📍", text: "IIT Kharagpur, Kharagpur – 721302, West Bengal" },
                      { icon: "📞", text: "+91-3222-283380" },
                      { icon: "✉️", text: "scienceforthesustainableearth@gmail.com" },
                      { icon: "🌐", text: "iitkgp.ac.in/department/GG" },
                    ].map(({ icon, text }) => (
                      <div key={text} className="flex items-center gap-3 text-[#374151]">
                        <span>{icon}</span><span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: "🏛️", title: "World-Class Facilities",  desc: "State-of-the-art seminar halls, projection systems, and dedicated poster display areas." },
                    { icon: "🏨", title: "On-Campus Accommodation", desc: "Guest houses and hostels available for outstation participants at subsidised rates." },
                    { icon: "🔬", title: "Research Labs",           desc: "Optional visits to GG department laboratories during the conference." },
                  ].map(c => (
                    <div key={c.title} className="flex gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5D9C8] hover:border-[#C4A484] transition-colors">
                      <span className="text-2xl mt-0.5">{c.icon}</span>
                      <div>
                        <h4 className="font-bold text-[#1E3A8A] text-sm mb-1">{c.title}</h4>
                        <p className="text-[#6B7280] text-sm leading-relaxed">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOCATION TAB */}
            {venueTab === "location" && (
              <div>
                <div className="p-6 border-b border-[#E5D9C8] bg-[#FAF7F2]">
                  <h3 className="font-serif font-bold text-[#1E3A8A] text-2xl">IIT Kharagpur — Campus Map</h3>
                  <p className="text-[#6B7280] text-base mt-1">22°18′59.8″N 87°18′7.0″E · Kharagpur, West Bengal, India</p>
                </div>
                <iframe src={MAPS_EMBED} width="100%" height="400" style={{ border: 0, display: "block" }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="IIT Kharagpur Google Map" />
                <div className="p-6 grid sm:grid-cols-3 gap-4 border-t border-[#E5D9C8] bg-[#FAF7F2]">
                  {[
                    { icon: "✈️", title: "Nearest Airport", desc: "Kolkata (CCU) — 130 km, approx. 2.5 hrs by road or direct train" },
                    { icon: "🚂", title: "By Train",         desc: "Kharagpur Junction — major hub with direct trains from all metros" },
                    { icon: "🚌", title: "By Road",          desc: "NH-16 (Kolkata–Chennai highway) passes through Kharagpur" },
                  ].map(c => (
                    <div key={c.title} className="p-4 rounded-2xl bg-white border border-[#E5D9C8] text-center shadow-card">
                      <span className="text-2xl block mb-2">{c.icon}</span>
                      <h4 className="font-bold text-[#1E3A8A] text-base mb-1">{c.title}</h4>
                      <p className="text-[#6B7280] text-sm leading-relaxed">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HOST CITY TAB */}
            {venueTab === "city" && (
              <div className="p-8">
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#1E3A8A] flex items-center justify-center text-3xl shrink-0">🏙️</div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[#1E3A8A] mb-1">Kharagpur, West Bengal</h3>
                    <p className="text-[#374151] text-lg leading-relaxed">
                      A calm, student-friendly town known globally as the home of IIT Kharagpur — India's first and largest IIT with over 22,000 students on campus.
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: "🎓", title: "Academic Hub",           desc: "Home to IIT Kharagpur (est. 1951) — one of Asia's premier research universities." },
                    { icon: "🌿", title: "Peaceful Environment",   desc: "A green, pollution-free campus township ideal for academic gatherings and focused scientific discourse." },
                    { icon: "🔗", title: "Excellent Connectivity", desc: "Kharagpur Junction is one of India's busiest railway stations with direct trains to Kolkata, Mumbai, and Delhi." },
                    { icon: "🌡️", title: "Climate in November",    desc: "Post-monsoon season — pleasant weather, 18°C–29°C, ideal for outdoor networking and campus walks." },
                    { icon: "🏨", title: "Accommodation",          desc: "Campus guest houses and nearby hotels available. The secretariat will assist with booking." },
                    { icon: "🍛", title: "Food & Culture",         desc: "Diverse campus dining, local Bengali cuisine, and a vibrant student culture make Kharagpur welcoming." },
                  ].map(c => (
                    <div key={c.title} className="p-5 rounded-2xl border border-[#E5D9C8] bg-[#FAF7F2] hover:border-[#C4A484] transition-colors">
                      <span className="text-xl mb-2 block">{c.icon}</span>
                      <h4 className="font-bold text-[#1E3A8A] text-base mb-1">{c.title}</h4>
                      <p className="text-[#6B7280] text-base leading-relaxed">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── BROCHURE ─────────────────────────────────────────────────────── */}
      <section id="brochure" className="py-24 bg-[#FAF7F2]">
        <div ref={brochureReveal.ref} className={`max-w-4xl mx-auto px-6 ${reveal(brochureReveal.visible)}`}>
          <div className="text-center mb-12">
            <SectionLabel text="Conference Brochure" />
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1E3A8A] mb-4">Download the Brochure</h2>
            <p className="text-[#6B7280] text-xl max-w-xl mx-auto">
              Official conference brochure with themes, speakers, schedule, and registration details.
            </p>
          </div>

          <div className="card overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 p-6 border-b border-[#E5D9C8] bg-[#FAF7F2]">
              <button onClick={() => setPdfVisible(!pdfVisible)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl btn-primary text-white font-bold text-base shadow-royal">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {pdfVisible ? "Hide Brochure" : "View Brochure"}
              </button>
              <a href="/assets/brochure.pdf" download
                className="flex items-center gap-2 px-6 py-3 rounded-xl btn-outline font-bold text-base">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </a>
              <a href="/assets/brochure.pdf" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4EDE2] border border-[#E5D9C8] text-[#9C7B4A] font-bold text-base hover:bg-[#DEC9AE] transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in New Tab
              </a>
            </div>
            <div className="p-6">
              {pdfVisible ? (
                <iframe src="/assets/brochure.pdf" className="w-full rounded-xl border border-[#E5D9C8]"
                  style={{ height: 640 }} title="Conference Brochure PDF" />
              ) : (
                <div className="h-44 flex flex-col items-center justify-center gap-3 text-[#9CA3AF] border-2 border-dashed border-[#E5D9C8] rounded-xl bg-[#FAF7F2]">
                  <svg className="w-10 h-10 text-[#E5D9C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-base font-medium">Click "View Brochure" to preview the PDF inline</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── REGISTRATION ─────────────────────────────────────────────────── */}
      <section id="register" className="py-24 bg-[#FAF7F2]">
        <div ref={registerReveal.ref} className={`max-w-3xl mx-auto px-6 ${reveal(registerReveal.visible)}`}>
          <div className="text-center mb-12">
            <SectionLabel text="Join Us" />
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1E3A8A] mb-4">Register for SSE 2026</h2>
            <p className="text-[#6B7280] text-xl">Secure your place. Abstract submission for Oral &amp; Poster presenters.</p>
          </div>

          <div className="card p-8 md:p-10">
            {formStatus === "success" ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 rounded-full bg-[#1E3A8A] flex items-center justify-center text-3xl mx-auto mb-6 text-white shadow-royal">✓</div>
                <h3 className="text-2xl font-bold text-[#1E3A8A] mb-3">Registration Successful!</h3>
                <p className="text-[#6B7280] text-lg mb-8">{formMessage}</p>
                <button onClick={() => setFormStatus("idle")}
                  className="px-6 py-3 rounded-xl btn-outline font-semibold text-base">
                  Register Another Person
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-base font-bold text-[#374151] mb-2">Full Name *</label>
                    <input {...register("name", { required: "Name is required", minLength: { value: 2, message: "Too short" } })}
                      placeholder="Dr. Jane Doe" className={inputCls} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-bold text-[#374151] mb-2">Email Address *</label>
                    <input {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })}
                      type="email" placeholder="jane@university.edu" className={inputCls} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-bold text-[#374151] mb-2">Phone Number *</label>
                    <input {...register("phone", { required: "Phone is required" })}
                      placeholder="+91 98765 43210" className={inputCls} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-bold text-[#374151] mb-2">Institution / Organization *</label>
                    <input {...register("institution", { required: "Institution is required" })}
                      placeholder="IIT Kharagpur" className={inputCls} />
                    {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution.message}</p>}
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-[#E5D9C8] bg-[#FAF7F2]">
                  <label className="block text-base font-bold text-[#374151] mb-4">Participation Type *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["attendee","oral","poster"] as const).map(t => (
                      <label key={t}
                        className={`flex items-center justify-center py-3.5 rounded-xl border cursor-pointer text-sm font-bold capitalize transition-all ${
                          presentationType === t
                            ? "bg-[#1E3A8A] text-white border-transparent shadow-royal"
                            : "bg-white border-[#E5D9C8] text-[#374151] hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
                        }`}>
                        <input type="radio" value={t} {...register("presentationType")} className="hidden" />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-base font-bold text-[#374151] mb-2">Presentation Title</label>
                    <input {...register("presentationTitle")}
                      placeholder="Enter the title of your paper / presentation" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-[#374151] mb-2">Related Theme</label>
                    <select {...register("theme")} className={inputCls + " cursor-pointer"}>
                      {THEMES.map(t => (
                        <option key={t.id} value={t.title}>{t.id}. {t.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {formStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                    ⚠ {formMessage}
                  </div>
                )}

                <button type="submit"
                  disabled={formStatus === "loading"}
                  className="w-full py-4 rounded-xl btn-primary text-white font-bold text-lg shadow-royal disabled:opacity-40 disabled:cursor-not-allowed">
                  {formStatus === "loading" ? "Submitting…" : "Submit Registration"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── PAYMENT ──────────────────────────────────────────────────────── */}
      <section id="payment" className="py-24 bg-[#FAF7F2]">
        <div ref={paymentReveal.ref} className={`max-w-3xl mx-auto px-6 ${reveal(paymentReveal.visible)}`}>
          <div className="text-center mb-10">
            <SectionLabel text="Step 1 of 2 — Payment" />
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1E3A8A] mb-4">Payment</h2>
            <p className="text-[#6B7280] text-xl max-w-xl mx-auto">
              Complete the registration fee payment using the QR code. Scan with any UPI app to pay.
            </p>
          </div>

          <div className="card p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* QR Card */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="bg-white rounded-2xl p-5 shadow-card border-2 border-[#E5D9C8]">
                  <img src="/assets/payment-qr.png" alt="Payment QR Code" className="w-44 h-44 object-contain" />
                </div>
                <div className="bg-[#EFF6FF] rounded-2xl px-6 py-3 text-center border border-[#DBEAFE] w-full">
                  <p className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wide mb-0.5">Registration Fee</p>
                  <p className="text-3xl font-serif font-extrabold text-[#1E3A8A]">₹500</p>
                </div>
              </div>
              {/* Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-serif font-bold text-[#1E3A8A] mb-3">How to Pay</h3>
                <ol className="space-y-3 mb-6">
                  {["Scan the QR code using any UPI app (GPay, PhonePe, Paytm, etc.)", "Pay the registration fee of ₹500", "Note down your Transaction ID from the payment receipt", "Fill the Payment Confirmation form below to unlock abstract submission"].map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#374151] text-base">
                      <span className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
                <button onClick={() => { setShowPaymentModal(true); }}
                  className="flex items-center gap-2.5 px-7 py-4 rounded-xl btn-primary text-white font-bold text-base shadow-royal">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAYMENT CONFIRMATION ─────────────────────────────────────────── */}
      <section id="confirm-payment" className="py-16 bg-white border-y border-[#E5D9C8]">
        <div ref={confirmReveal.ref} className={`max-w-2xl mx-auto px-6 ${reveal(confirmReveal.visible)}`}>
          <div className="text-center mb-10">
            <SectionLabel text="Step 2 of 2 — Confirmation" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1E3A8A] mb-3">Confirm Your Payment</h2>
            <p className="text-[#6B7280] text-lg">Scan the QR code below to confirm your payment.</p>
          </div>

          {isPaymentConfirmed ? (
            <div className="card p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-700 mb-2">Payment Confirmed!</h3>
              <p className="text-[#374151] mb-6">Payment received. You can now submit your abstract in the form below.</p>
              <button onClick={() => scrollTo("register")}
                className="px-8 py-3 rounded-xl btn-primary text-white font-bold text-sm shadow-royal">
                Go to Abstract Submission ↓
              </button>
            </div>
          ) : (
            <div className="card p-8 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center gap-4 p-6 bg-[#FAF7F2] rounded-2xl border border-[#E5D9C8]">
                <img src="/assets/confirmation-qr.png" alt="Confirmation QR" className="w-36 h-36 object-contain rounded-xl border-2 border-[#E5D9C8] bg-white p-3 shadow-card" />
                <p className="text-sm text-[#6B7280] text-center">Reference QR for confirmation</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── QR / ABSTRACT SUBMISSION ─────────────────────────────────────── */}
      <section id="abstract" className="py-24 bg-white border-y border-[#E5D9C8]">
        <div ref={qrReveal.ref} className={`max-w-4xl mx-auto px-6 ${reveal(qrReveal.visible)}`}>
          <div className="text-center mb-12">
            <SectionLabel text="Abstract Submission" />
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1E3A8A] mb-4">Scan and Fill Details</h2>
            <p className="text-[#6B7280] text-xl max-w-xl mx-auto">Scan the QR code below and submit your details in a proper manner.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            {/* QR Code */}
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-card-md border-2 border-[#E5D9C8]">
                <img
                  src="/assets/qr.png"
                  alt="QR Code for Abstract Submission"
                  className="w-56 h-56 object-contain"
                />
              </div>
              <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-[#1E3A8A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <p className="text-base font-semibold text-[#1E3A8A]">Scan and submit details in a proper manner</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="max-w-sm">
              <h3 className="text-2xl font-serif font-bold text-[#1E3A8A] mb-4">How to Submit</h3>
              <div className="space-y-4">
                {[
                  { n: "1", text: "Scan the QR code using your smartphone camera" },
                  { n: "2", text: "Fill in your personal and institutional details accurately" },
                  { n: "3", text: "Provide your abstract title and full abstract text" },
                  { n: "4", text: "Select the relevant conference theme (1–6)" },
                  { n: "5", text: "Submit before the deadline: 31 August 2026" },
                ].map(s => (
                  <div key={s.n} className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full bg-[#1E3A8A] text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">{s.n}</span>
                    <p className="text-[#374151] text-lg">{s.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-[#F4EDE2] border border-[#E5D9C8]">
                <p className="text-sm text-[#9C7B4A] font-bold uppercase tracking-wide mb-1">Submission Deadline</p>
                <p className="text-[#1E3A8A] font-bold text-2xl">31 August 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-[#1E3A8A]">
        <div ref={contactReveal.ref} className={`max-w-4xl mx-auto px-6 ${reveal(contactReveal.visible)}`}>
          <div className="text-center mb-14">
            <p className="section-label text-[#C4A484] mb-3">Get In Touch</p>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">Contact Us</h2>
            <p className="text-blue-200 text-xl">For queries, sponsorships, and correspondence.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-1">Dept. of Geology &amp; Geophysics</h3>
              <p className="text-[#C4A484] text-sm font-semibold mb-6">IIT Kharagpur</p>
              <div className="space-y-4 text-sm">
                {[
                  { icon: "📍", text: "IIT Kharagpur, Kharagpur – 721302, West Bengal, India" },
                  { icon: "✉️", text: "scienceforthesustainableearth@gmail.com" },
                  { icon: "📞", text: "+91-3222-283380" },
                  { icon: "🌐", text: "iitkgp.ac.in/department/GG" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3 text-blue-100">
                    <span className="mt-0.5">{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-6">Conference Details</h3>
              <div className="space-y-4 text-sm mb-6">
                {[
                  { icon: "✉️", text: "scienceforthesustainableearth@gmail.com" },
                  { icon: "📅", text: "13 – 15 November 2026" },
                  { icon: "🏛️", text: "Kalidas Auditorium, IIT Kharagpur" },
                  { icon: "👥", text: "380–400 expected participants" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-blue-100">
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
              <div className="pt-5 border-t border-white/20">
                <p className="text-xs text-blue-300 font-bold mb-3">Related Links</p>
                <a href="https://www.iitkgp.ac.in/department/GG" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-[#C4A484] hover:text-[#DEC9AE] flex items-center gap-1 transition-colors">
                  GG Department, IIT Kharagpur ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-[#0F2060] border-t border-white/10 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/assets/logo.png" alt="GG Dept Logo" className="h-12 w-12 object-contain" />
                <div>
                  <p className="font-serif font-bold text-white text-xl">SSE 2026</p>
                  <p className="text-xs text-[#C4A484] tracking-widest uppercase mt-0.5">Science for the Sustainable Earth</p>
                </div>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed max-w-sm">
                Platinum Jubilee International Conference of the Dept. of Geology &amp; Geophysics, IIT Kharagpur. 13–15 November 2026.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide mb-5">Contact</h4>
              <ul className="space-y-3 text-blue-200 text-sm">
                <li>scienceforthesustainableearth@gmail.com</li>
                <li>+91-3222-283380</li>
                <li>IIT Kharagpur – 721302</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide mb-5">Navigate</h4>
              <ul className="space-y-3">
                {["About","Themes","Schedule","Brochure","Venue","Contact"].map(l => (
                  <li key={l}>
                    <button onClick={() => scrollTo(l.toLowerCase())}
                      className="text-blue-200 hover:text-[#C4A484] text-sm transition-colors">{l}
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={() => setPage("admin")}
                    className="text-blue-400 hover:text-blue-200 text-sm transition-colors">Admin Portal</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs text-blue-400 pt-8 border-t border-white/8">
            © 2026 Department of Geology &amp; Geophysics, IIT Kharagpur · All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
