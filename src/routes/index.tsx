import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Copy, Gamepad2, Smartphone, Package, Swords, Coins, MapPinned, Crown, Shield, ShieldCheck,
  ChevronDown, Menu, X, MessageCircle, Music2, Globe, Users,
} from "lucide-react";
import logo from "@/assets/xiosmp-logo.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XioSMP Official — Economy SMP Minecraft" },
      { name: "description", content: "Server Minecraft Economy SMP terbaru, seru & paling OP. Java & Bedrock: play.xiosmp.my.id" },
      { property: "og:title", content: "XioSMP Official — Economy SMP Minecraft" },
      { property: "og:description", content: "Gabung XioSMP: crossplatform Java & Bedrock, newbie perks, dan komunitas aktif." },
    ],
  }),
  component: Index,
});

const IP = "play.xiosmp.my.id";
const DISCORD = "https://discord.gg/5zTzZTJwU";
const nav = [
  ["Home", "home"], ["Koneksi", "koneksi"], ["Newbie Perks", "perks"],
  ["Staff", "staff"], ["Peraturan", "rules"], ["Sosial Media", "sosial"],
] as const;

function copy(text: string) {
  navigator.clipboard.writeText(text).then(() => toast.success("IP berhasil disalin!", { description: text }));
}

type Player = { name: string };
type Status = { online: boolean; count: number; max: number | null; players: Player[]; hidden: boolean };

// Real Java names are max 16 chars [A-Za-z0-9_]; Geyser/Bedrock names often start with "." or "*".
const VALID = /^[.*]?[A-Za-z0-9_ ]{1,20}$/;
const clean = (n: string) => n.replace(/\u00a7./g, "").trim();

async function fetchStatus(): Promise<Status> {
  const out: Status = { online: false, count: 0, max: null, players: [], hidden: false };
  const seen = new Map<string, Player>();
  const add = (raw?: string) => {
    if (!raw) return;
    const n = clean(raw);
    if (VALID.test(n) && !n.includes(" ")) seen.set(n.toLowerCase(), { name: n });
  };
  const [a, b, c] = await Promise.allSettled([
    fetch(`https://api.mcstatus.io/v2/status/java/${IP}`).then((r) => r.json()),
    fetch(`https://api.mcsrvstat.us/3/${IP}`).then((r) => r.json()),
    fetch(`https://api.mcsrvstat.us/bedrock/3/${IP}:2005`).then((r) => r.json()),
  ]);
  if (a.status === "fulfilled" && a.value?.online) {
    out.online = true;
    out.count = Math.max(out.count, a.value.players?.online ?? 0);
    out.max = a.value.players?.max ?? out.max;
    (a.value.players?.list ?? []).forEach((p: { name_clean?: string; name_raw?: string }) => add(p.name_clean ?? p.name_raw));
  }
  for (const r of [b, c]) {
    if (r.status === "fulfilled" && r.value?.online) {
      out.online = true;
      out.count = Math.max(out.count, r.value.players?.online ?? 0);
      out.max = out.max ?? r.value.players?.max ?? null;
      const pl = r.value.players ?? {};
      [...(pl.list ?? []), ...(pl.sample ?? [])].forEach((p: string | { name?: string }) => add(typeof p === "string" ? p : p.name));
    }
  }
  out.players = [...seen.values()];
  out.hidden = out.count > 0 && out.players.length === 0;
  return out;
}

function Head({ name }: { name: string }) {
  const [err, setErr] = useState(false);
  const n = name.replace(/^[.*]/, "");
  if (err) return <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">{n[0]?.toUpperCase()}</span>;
  return <img src={`https://mc-heads.net/avatar/${n}/32`} alt="" onError={() => setErr(true)} className="h-7 w-7 shrink-0 rounded-md" loading="lazy" />;
}

function LiveStatus() {
  const [s, setS] = useState<Status | null>(null);
  useEffect(() => {
    let alive = true;
    const load = () => fetchStatus().then((d) => alive && setS(d));
    load();
    const t = setInterval(load, 30000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  const list = s?.players ?? [];
  return (
    <div className="nm glow-ring w-full max-w-sm p-5 fade-up" style={{ animationDelay: ".3s" }}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Live Status</span>
        <span className="nm-inset flex items-center gap-2 px-3 py-1 text-xs font-semibold">
          <span className={`h-2 w-2 rounded-full ${s === null ? "bg-muted-foreground animate-pulse" : s.online ? "bg-success animate-pulse" : "bg-destructive"}`} />
          {s === null ? "Mengecek..." : s.online ? "Online" : "Offline"}
        </span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <Users className="mb-1 h-4 w-4 text-primary-glow" />
        <span className="font-display text-3xl leading-none text-glow">{s?.count ?? 0}</span>
        <span className="text-sm text-muted-foreground">/ {s?.max ?? "–"} player online</span>
      </div>
      <div className="nm-inset mt-4 max-h-40 overflow-y-auto p-3">
        {list.length ? (
          <ul className="grid grid-cols-2 gap-2">
            {list.map((p, i) => (
              <li key={p.name} className="fade-up flex min-w-0 items-center gap-2 text-sm" style={{ animationDelay: `${i * 60}ms` }}>
                <Head name={p.name} />
                <span className="truncate">{p.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-xs text-muted-foreground">
            {s === null ? "Memuat..." : s.hidden ? `${s.count} pemain sedang bermain — nama disembunyikan oleh server.` : s.online ? "Belum ada pemain online." : "Server sedang offline."}
          </p>
        )}
      </div>
    </div>
  );
}

function Particles() {
  const [ps, setPs] = useState<{ l: number; s: number; d: number; dl: number }[]>([]);
  useEffect(() => {
    setPs(Array.from({ length: 28 }, () => ({ l: Math.random() * 100, s: 3 + Math.random() * 6, d: 10 + Math.random() * 14, dl: -Math.random() * 20 })));
  }, []);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="blob left-[-10%] top-[10%]" />
      <div className="blob right-[-15%] top-[55%]" style={{ animationDelay: "-8s" }} />
      {ps.map((p, i) => (
        <span key={i} className="particle" style={{ left: `${p.l}%`, width: p.s, height: p.s, animationDuration: `${p.d}s`, animationDelay: `${p.dl}s` }} />
      ))}
    </div>
  );
}

function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 md:py-20">
      <h2 className="text-center font-display text-2xl tracking-wide md:text-4xl">{title}</h2>
      {sub && <p className="mt-2 text-center text-sm text-muted-foreground md:text-base">{sub}</p>}
      <div className="mt-8 md:mt-12">{children}</div>
    </section>
  );
}

const perks = [
  { icon: Package, t: "Starter Kit", d: "Perlengkapan awal lengkap untuk memulai petualanganmu." },
  { icon: Swords, t: "OP Tools & Potion Pack", d: "Tools enchanted dan paket potion siap tempur." },
  { icon: Coins, t: "Modal Awal Rp 100.000", d: "In-game money untuk langsung mulai berbisnis." },
  { icon: MapPinned, t: "Claim Land Blocks", d: "Amankan wilayah dan bangunanmu dari griefer." },
];
const staff = [
  { icon: Crown, role: "Owner", name: "@Raka", job: "Head Manager" },
  { icon: Shield, role: "Admin", name: "@Bayu", job: "Technical & Community Support" },
  { icon: ShieldCheck, role: "Admin", name: "@rasya", job: "Bansos & Security" },
];
const rules = [
  ["Dilarang Toxic, SARA & 18+", "Jaga chat tetap bersih. Ujaran kebencian, SARA, dan konten dewasa dilarang keras di server maupun grup."],
  ["Anti Cheat / X-Ray / Bug Abuse", "Segala bentuk cheat, client X-Ray, dupe, dan bug abuse akan dikenakan sanksi PERMANENT BAN tanpa toleransi."],
  ["Saling Menghormati", "Hormati sesama pemain dan staff. Selesaikan masalah dengan baik, laporkan pelanggaran ke staff."],
  ["Owner adalah Solo Developer", "Server dikembangkan oleh satu orang. Mohon bersabar untuk update & perbaikan, dukungan kalian sangat berarti!"],
];
const socials = [
  { icon: MessageCircle, t: "Discord", d: "discord.gg/5zTzZTJwU", href: DISCORD },
  { icon: Music2, t: "TikTok", d: "@xiosmp", href: "https://www.tiktok.com/@xiosmp" },
  { icon: Users, t: "Grup WhatsApp", d: "Gabung komunitas", href: "https://xiosmp.vercel.app" },
  { icon: Globe, t: "Website", d: "xiosmp.vercel.app", href: "https://xiosmp.vercel.app" },
];

function Index() {
  const [open, setOpen] = useState(false);
  const [rule, setRule] = useState<number | null>(0);
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Particles />
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav className="nm mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 backdrop-blur">
          <a href="#home" className="flex min-w-0 items-center gap-3">
            <img src={logo.url} alt="Logo XioSMP" className="h-9 w-9 shrink-0 rounded-xl object-cover shadow-[var(--glow)]" />
            <span className="truncate font-display text-xl text-glow">XioSMP</span>
          </a>
          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map(([l, id]) => (
              <li key={id}><a href={`#${id}`} className="rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-primary-glow">{l}</a></li>
            ))}
          </ul>
          <div className="flex shrink-0 items-center gap-2">
            <a href={DISCORD} target="_blank" rel="noreferrer" className="nm-btn-primary hidden px-4 py-2 text-sm font-semibold sm:inline-block">Join Discord</a>
            <button aria-label="Menu" onClick={() => setOpen(!open)} className="nm-btn p-2 lg:hidden">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </nav>
        {open && (
          <div className="nm fade-up mx-auto mt-3 max-w-6xl p-3 lg:hidden">
            {nav.map(([l, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 hover:text-primary-glow">{l}</a>
            ))}
            <a href={DISCORD} target="_blank" rel="noreferrer" className="nm-btn-primary mt-2 block px-5 py-3 text-center font-semibold">Join Discord</a>
          </div>
        )}
      </header>

      <section id="home" className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 px-5 pb-16 pt-24 lg:flex-row lg:gap-16 lg:pt-36">
        <div className="flex-1 text-center lg:text-left">
          <img src={logo.url} alt="XioSMP" className="nm fade-up float mx-auto mb-6 h-24 w-24 object-cover p-1.5 lg:hidden" />
          <p className="fade-up text-xs font-semibold uppercase tracking-[.3em] text-primary-glow">Economy SMP</p>
          <h1 className="fade-up mt-2 font-display text-3xl leading-tight sm:text-4xl lg:text-6xl" style={{ animationDelay: ".1s" }}>
            WELCOME TO <span className="text-glow">XIOSMP</span> OFFICIAL
          </h1>
          <p className="fade-up mt-3 text-sm text-muted-foreground md:text-base" style={{ animationDelay: ".2s" }}>Server Minecraft Economy SMP Terbaru, Seru, &amp; Paling OP!</p>
          <div className="fade-up mt-6 flex flex-wrap justify-center gap-3" style={{ animationDelay: ".3s" }} lg:justify-start">
            <button onClick={() => copy(IP)} className="nm-btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"><Copy className="h-4 w-4" /> Copy IP Java</button>
            <button onClick={() => copy(`${IP}:2005`)} className="nm-btn flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"><Copy className="h-4 w-4" /> Copy IP Bedrock</button>
          </div>
        </div>
        <LiveStatus />
      </section>

      <Section id="koneksi" title="Informasi Koneksi" sub="Crossplatform — main bareng dari PC, HP, maupun Console.">
        <div className="grid gap-5 md:grid-cols-2 md:gap-8">
          {[
            { icon: Gamepad2, t: "Java Edition", rows: [["IP", IP], ["Versi", "26.3 - 1.21.11"]], c: IP },
            { icon: Smartphone, t: "Bedrock / MCPE / HP / Console", rows: [["IP", IP], ["Port", "2005"], ["Versi", "Latest"]], c: IP },
          ].map((k) => (
            <div key={k.t} className="nm-card reveal p-5 md:p-7">
              <div className="flex items-center gap-4">
                <div className="nm-inset grid h-12 w-12 shrink-0 place-items-center"><k.icon className="h-6 w-6 text-primary-glow" /></div>
                <h3 className="font-display text-lg md:text-xl">{k.t}</h3>
              </div>
              <dl className="mt-5 space-y-2.5">
                {k.rows.map(([a, b]) => (
                  <div key={a} className="nm-inset flex items-center justify-between gap-3 px-4 py-3">
                    <dt className="text-sm text-muted-foreground">{a}</dt>
                    <dd className="truncate font-semibold">{b}</dd>
                  </div>
                ))}
              </dl>
              <button onClick={() => copy(k.c)} className="nm-btn mt-5 flex w-full items-center justify-center gap-2 py-2.5 text-sm font-semibold"><Copy className="h-4 w-4" /> Salin IP</button>
            </div>
          ))}
        </div>
      </Section>

      <Section id="perks" title="Newbie Perks" sub="Bonus spesial untuk setiap pemain baru XioSMP.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.t} className="nm-card reveal p-5 text-center">
              <div className="nm-inset mx-auto grid h-14 w-14 place-items-center rounded-2xl"><p.icon className="h-7 w-7 text-primary-glow" /></div>
              <h3 className="mt-4 font-display text-lg">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="staff" title="Structure Management" sub="Tim yang menjaga XioSMP tetap seru & aman.">
        <div className="grid gap-6 md:grid-cols-3">
          {staff.map((s) => (
            <div key={s.name} className="nm-card reveal p-5 md:p-7 text-center">
              <img src={`https://mc-heads.net/avatar/${s.name.slice(1)}/80`} alt={s.name} className="nm mx-auto h-16 w-16 rounded-2xl p-1.5" />
              <span className="nm-inset mt-5 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-primary-glow"><s.icon className="h-3.5 w-3.5" /> {s.role}</span>
              <h3 className="mt-3 font-display text-xl">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.job}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="rules" title="Peraturan Server" sub="Berlaku untuk server dan seluruh grup komunitas.">
        <div className="mx-auto max-w-3xl space-y-4">
          {rules.map(([t, d], i) => (
            <div key={t} className={`${rule === i ? "nm-inset" : "nm"} transition-all duration-300`}>
              <button onClick={() => setRule(rule === i ? null : i)} className="flex w-full items-center gap-4 px-5 py-4 text-left">
                <span className="font-display text-lg text-glow">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-sm font-semibold md:text-base">{t}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${rule === i ? "rotate-180 text-primary-glow" : ""}`} />
              </button>
              <div className={`grid transition-all duration-300 ${rule === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <p className="overflow-hidden px-5 text-sm text-muted-foreground"><span className="block pb-5 pl-12">{d}</span></p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="sosial" title="Sosial Media" sub="Ikuti dan gabung komunitas XioSMP.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {socials.map((s) => (
            <a key={s.t} href={s.href} target="_blank" rel="noreferrer" className="nm-card reveal flex items-center gap-4 p-4">
              <div className="nm-inset grid h-12 w-12 shrink-0 place-items-center"><s.icon className="h-6 w-6 text-primary-glow" /></div>
              <div className="min-w-0"><p className="font-semibold">{s.t}</p><p className="truncate text-sm text-muted-foreground">{s.d}</p></div>
            </a>
          ))}
        </div>
      </Section>

      <footer className="px-5 pb-10 pt-6">
        <div className="nm mx-auto flex max-w-6xl flex-col items-center gap-3 p-8 text-center">
          <img src={logo.url} alt="" className="h-14 w-14 rounded-xl object-cover" />
          <p className="font-display text-xl text-glow">XioSMP</p>
          <p className="text-sm text-muted-foreground">Terima kasih sudah bermain di XioSMP — sampai jumpa di dalam game! ⚔️</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} XioSMP Official. Not affiliated with Mojang or Microsoft.</p>
        </div>
      </footer>
    </div>
  );
}
