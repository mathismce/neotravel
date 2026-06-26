"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Users, 
  Zap, 
  Clock, 
  Euro, 
  Server, 
  MessageSquare, 
  Activity, 
  Bot, 
  ShieldCheck, 
  LineChart,
  LayoutDashboard,
  Settings,
  LogOut
} from "lucide-react";

type TrendType = "positive" | "negative" | "neutral";
type LeadStatus = "À traiter" | "À rappeler" | "Réservé" | "Relance en cours" | "À relancer";

type KpiItem = {
  category: string;
  indicator: string;
  value: string;
  delta: string;
  trend: TrendType;
  period: string;
  note: string;
  icon: React.ElementType;
};

type LeadRdv = {
  date: string;
  canal: string;
  statut: string;
};

type LeadItem = {
  id: string;
  name: string;
  phone: string;
  email: string;
  route: string;
  departureDate: string;
  passengers: number | string;
  createdAt: string;
  budget: string;
  status: LeadStatus;
  priority: "Haute" | "Moyenne" | "Basse";
  rdv: LeadRdv | null;
};

const commercialKpis: KpiItem[] = [
  {
    category: "Pipeline",
    indicator: "Leads entrants / jour",
    value: "128",
    delta: "+18% vs hier",
    trend: "positive",
    period: "Dernières 24 h",
    note: "Flux simulé sur une journée active.",
    icon: Activity,
  },
  {
    category: "Pipeline",
    indicator: "Taux de qualification auto",
    value: "74%",
    delta: "+6 pts",
    trend: "positive",
    period: "Cette semaine",
    note: "Les leads chauds dominent le volume.",
    icon: Bot,
  },
  {
    category: "Humain",
    indicator: "Taux d'escalade",
    value: "19%",
    delta: "-4 pts",
    trend: "positive",
    period: "Moyenne mensuelle",
    note: "Moins de dossiers transférés à l’équipe.",
    icon: Users,
  },
  {
    category: "Humain",
    indicator: "Délai de reprise",
    value: "18 min",
    delta: "-7 min",
    trend: "positive",
    period: "Depuis 7 jours",
    note: "Réactivité en nette amélioration.",
    icon: Clock,
  },
  {
    category: "Conversion",
    indicator: "Devis → Réservation",
    value: "31%",
    delta: "+3 pts",
    trend: "positive",
    period: "Pipeline du mois",
    note: "Les offres simples convertissent mieux.",
    icon: Zap,
  },
  {
    category: "Conversion",
    indicator: "Délai devis → résa",
    value: "2,4 j",
    delta: "+0,2 j",
    trend: "negative",
    period: "Moyenne 30 jours",
    note: "Cycle de décision légèrement rallongé.",
    icon: Clock,
  },
  {
    category: "Relance",
    indicator: "Réponse J+1 / J+3",
    value: "54% / 41%",
    delta: "-2 pts",
    trend: "negative",
    period: "Campagnes en cours",
    note: "Légère baisse de réactivité sur J+1.",
    icon: MessageSquare,
  },
  {
    category: "Revenus",
    indicator: "Ticket moyen",
    value: "1 840 €",
    delta: "+120 €",
    trend: "positive",
    period: "Réservations signées",
    note: "Panier moyen supérieur à l'objectif.",
    icon: Euro,
  },
];

const solutionKpis: KpiItem[] = [
  {
    category: "Agent IA",
    indicator: "Erreur de qualification",
    value: "2,1%",
    delta: "-0,6 pt",
    trend: "positive",
    period: "7 derniers jours",
    note: "Le routage est plus stable.",
    icon: ShieldCheck,
  },
  {
    category: "Pricing",
    indicator: "Erreur calculer_devis()",
    value: "0,8%",
    delta: "0 pt",
    trend: "neutral",
    period: "Dernière release",
    note: "Les écarts restent marginaux.",
    icon: LineChart,
  },
  {
    category: "Infrastructure",
    indicator: "Succès des workflows n8n",
    value: "98,7%",
    delta: "+1,1 pt",
    trend: "positive",
    period: "Ce mois-ci",
    note: "Scénarios exécutés sans incident.",
    icon: Server,
  },
  {
    category: "Feedback",
    indicator: "Satisfaction prospect",
    value: "4,7 / 5",
    delta: "+0,2",
    trend: "positive",
    period: "Derniers retours",
    note: "Le ressenti prospect est excellent.",
    icon: MessageSquare,
  },
];

const leadStatuses: LeadStatus[] = ["À traiter", "À rappeler", "Réservé", "Relance en cours", "À relancer"];
const leadStatusRank: Record<LeadStatus, number> = {
  "À traiter": 0,
  "À rappeler": 1,
  "Relance en cours": 2,
  "À relancer": 3,
  Réservé: 4,
};

function TrendBadge({ trend, delta }: { trend: TrendType; delta: string }) {
  const baseClasses = "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold";
  
  if (trend === "positive") {
    return (
      <span className={`${baseClasses} bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}>
        <TrendingUp className="h-3 w-3" /> {delta}
      </span>
    );
  }
  if (trend === "negative") {
    return (
      <span className={`${baseClasses} bg-rose-500/10 text-rose-400 border border-rose-500/20`}>
        <TrendingDown className="h-3 w-3" /> {delta}
      </span>
    );
  }
  return (
    <span className={`${baseClasses} bg-gray-500/10 text-gray-400 border border-gray-500/20`}>
      <Minus className="h-3 w-3" /> {delta}
    </span>
  );
}

function DashboardKpiCard({ item, tone }: { item: KpiItem; tone: "commercial" | "solution" }) {
  const accentGradient = tone === "commercial" 
    ? "from-lime-500/10 to-transparent border-lime-500/20" 
    : "from-cyan-500/10 to-transparent border-cyan-500/20";
    
  const Icon = item.icon;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a]/80 p-5 shadow-lg backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${accentGradient}`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white/5 p-2 text-white/70 shadow-inner">
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">{item.category}</p>
          </div>
          <TrendBadge trend={item.trend} delta={item.delta} />
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-white/80">{item.indicator}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-3xl font-black tracking-tight text-white">{item.value}</p>
            <p className="text-xs font-medium uppercase tracking-wider text-white/30">{item.period}</p>
          </div>
        </div>

        <div className="mt-4 border-t border-white/5 pt-4">
          <p className="text-xs leading-5 text-white/50">{item.note}</p>
        </div>
      </div>
    </article>
  );
}

export default function DashboardView() {
  const [activeView, setActiveView] = useState<"commercial" | "solution">("commercial");
  const [menuView, setMenuView] = useState<"dashboard" | "leads">("dashboard");
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLeadsLoading, setIsLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadLeads = async () => {
      try {
        setIsLeadsLoading(true);
        setLeadsError(null);

        const response = await fetch("/api/leads", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Impossible de charger les leads (${response.status})`);
        }

        const payload = (await response.json()) as { leads?: LeadItem[] };

        if (isMounted) {
          setLeads(payload.leads ?? []);
        }
      } catch (error) {
        if (isMounted) {
          setLeadsError(error instanceof Error ? error.message : "Une erreur est survenue");
          setLeads([]);
        }
      } finally {
        if (isMounted) {
          setIsLeadsLoading(false);
        }
      }
    };

    void loadLeads();

    return () => {
      isMounted = false;
    };
  }, []);
  
  const sortedLeads = [...leads].sort(
    (firstLead, secondLead) => leadStatusRank[firstLead.status] - leadStatusRank[secondLead.status] || firstLead.name.localeCompare(secondLead.name)
  );

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    setLeads((currentLeads) => currentLeads.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)));

    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: leadId, status }),
      });
    } catch {
      setLeadsError("Le statut n’a pas pu être enregistré.");
    }
  };

  const renderedLeads = isLeadsLoading ? [] : sortedLeads;

  return (
    <div className="flex min-h-screen bg-[#020617] text-white selection:bg-lime-500/30">
      
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-[#090e1a] p-6 lg:flex">
        <div className="flex items-center gap-3 text-xl font-black tracking-tighter">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400 text-black">NT</div>
          NeoTravel
        </div>
        
        <nav className="mt-10 flex flex-col gap-2">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">Menu principal</p>
          <button
            type="button"
            onClick={() => setMenuView("dashboard")}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              menuView === "dashboard" ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" /> Vue globale
          </button>
          <button
            type="button"
            onClick={() => setMenuView("leads")}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              menuView === "leads" ? "bg-lime-500/10 text-lime-300" : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" /> Leads à traiter
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white">
            <Settings className="h-4 w-4" /> Paramètres
          </button>
          <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-400/80 transition-colors hover:bg-rose-500/10 hover:text-rose-400">
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="relative flex-1 overflow-y-auto overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(132,204,22,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />

        <div className="mx-auto max-w-6xl">
          
          <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Live Analytics</p>
              </div>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Tableau de bord</h1>
              <p className="mt-2 text-sm text-white/60">Suivez les performances de votre entonnoir de vente et de l&apos;infrastructure IA.</p>
            </div>

            <div className="inline-flex rounded-xl border border-white/10 bg-[#090e1a] p-1 shadow-xl">
              <button
                onClick={() => setActiveView("commercial")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  activeView === "commercial" ? "bg-white/10 text-lime-400 shadow-sm" : "text-white/50 hover:text-white"
                }`}
              >
                <LineChart className="h-4 w-4" /> Commercial
              </button>
              <button
                onClick={() => setActiveView("solution")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  activeView === "solution" ? "bg-white/10 text-cyan-400 shadow-sm" : "text-white/50 hover:text-white"
                }`}
              >
                <Server className="h-4 w-4" /> Performance
              </button>
            </div>
          </header>

          <div className="mt-10">
            {menuView === "dashboard" ? (
              activeView === "commercial" ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Vue Commerciale </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {commercialKpis.map((item) => (
                    <DashboardKpiCard key={item.indicator} item={item} tone="commercial" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Vue Performance</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {solutionKpis.map((item) => (
                    <DashboardKpiCard key={item.indicator} item={item} tone="solution" />
                  ))}
                </div>
              </div>
            )
            ) : (
              <section className="rounded-3xl border border-white/10 bg-[#090e1a]/90 p-6 shadow-xl backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-3 lg:flex-row  lg:justify-between">
                  <div>
                    <h2 className="mb-2 text-3xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                      Leads à traiter
                    </h2>
                    <p className="mt-1 text-sm text-white/60"></p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 min-h-[88px] flex flex-col justify-center">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">Total</p>
                      <p className="mt-2 text-2xl font-black text-white">{leads.length}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 min-h-[88px] flex flex-col justify-center">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">À traiter</p>
                      <p className="mt-2 text-2xl font-black text-lime-300">
                        {leads.filter((lead) => lead.status === "À traiter").length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 min-h-[88px] flex flex-col justify-center">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">À rappeler</p>
                      <p className="mt-2 text-2xl font-black text-amber-300">
                        {leads.filter((lead) => lead.status === "À rappeler").length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 min-h-[88px] flex flex-col justify-center">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">À relancer</p>
                      <p className="mt-2 text-2xl font-black text-emerald-300">
                        {leads.filter((lead) => lead.status === "À relancer").length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                      <thead className="bg-white/5">
                        <tr className="text-left text-xs uppercase tracking-[0.18em] text-white/45">
                          <th className="px-4 py-3 font-semibold">Contact</th>
                          <th className="px-4 py-3 font-semibold">Téléphone</th>
                          <th className="px-4 py-3 font-semibold">Trajet</th>
                          <th className="px-4 py-3 font-semibold">Date départ</th>
                          <th className="px-4 py-3 font-semibold">Passagers</th>
                          <th className="px-4 py-3 font-semibold">Montant</th>
                          <th className="px-4 py-3 font-semibold">Arrivée</th>
                          <th className="px-4 py-3 font-semibold">Rendez-vous</th>
                          <th className="px-4 py-3 font-semibold">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-[#0b1020]">
                        {leadsError ? (
                          <tr>
                            <td className="px-4 py-6 text-sm text-rose-300" colSpan={9}>
                              {leadsError}
                            </td>
                          </tr>
                        ) : isLeadsLoading ? (
                          <tr>
                            <td className="px-4 py-6 text-sm text-white/50" colSpan={9}>
                              Chargement des leads depuis Supabase…
                            </td>
                          </tr>
                        ) : renderedLeads.length === 0 ? (
                          <tr>
                            <td className="px-4 py-6 text-sm text-white/50" colSpan={9}>
                              Aucun lead trouvé dans la table demandes.
                            </td>
                          </tr>
                        ) : renderedLeads.map((lead) => (
                          <tr key={lead.id} className="transition-colors hover:bg-white/[0.03]">
                            <td className="px-4 py-4 align-top">
                              <p className="font-semibold text-white">{lead.name}</p>
                              <p className="mt-1 text-sm text-white/50"><a className="text-white/70 underline" href={`mailto:${lead.email}`}>{lead.email}</a></p>
                            </td>
                            <td className="px-4 py-4 align-top text-sm text-white/75">{lead.phone}</td>
                            <td className="px-4 py-4 align-top text-sm text-white/75">{lead.route}</td>
                            <td className="px-4 py-4 align-top text-sm text-white/75">{lead.departureDate}</td>
                            <td className="px-4 py-4 align-top text-sm text-white/75">{lead.passengers}</td>
                            <td className="px-4 py-4 align-top text-sm font-semibold text-white">{lead.budget}</td>
                            <td className="px-4 py-4 align-top text-sm text-white/60">{lead.createdAt}</td>
                            <td className="px-4 py-4 align-top">
                              {lead.rdv ? (
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-semibold text-white">{lead.rdv.date}</span>
                                  <span className="inline-flex w-fit items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-xs font-medium capitalize text-cyan-300">
                                    {lead.rdv.canal}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-white/30">—</span>
                              )}
                            </td>
                            <td className="px-4 py-4 align-top">
                              <div className="flex flex-col gap-2">
                                <select
                                  value={lead.status}
                                  onChange={(event) => updateLeadStatus(lead.id, event.target.value as LeadStatus)}
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-lime-400/50 focus:bg-white/10"
                                >
                                  {leadStatuses.map((status) => (
                                    <option key={status} value={status} className="bg-[#0b1020] text-white">
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}