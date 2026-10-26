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

type Status = { online: boolean; players?: { online: number; max: number; list?: { name: string }[] } };

function LiveStatus() {
  const [s, setS] = useState<Status | null>(null);
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch(`https://api.mcsrvstat.us/3/${IP}`).then((r) => r.json()).then((d) => alive && setS(d)).catch(() => alive && setS({ online: false }));
    load();
    const t = setInterval(load, 30000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  const list = s?.players?.list ?? [];
  return (
    <div className="nm w-full max-w-md p-6 fade-up" style={{ animationDelay: ".2s" }}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Live Status</span>
        <span className="nm-inset flex items-center gap-2 px-3 py-1 text-xs font-semibold">
          <span className={`h-2.5 w-2.5 rounded-full ${s === null ? "bg-muted-foreground animate-pulse" : s.online ? "bg-success animate-pulse" : "bg-destructive"}`} />
          {s === null ? "Mengecek..." : s.online ? "Online" : "Offline"}
        </span>
      </div>
      <div className="mt-4 flex items-end gap-2">
        <Users className="mb-1 h-6 w-6 text-primary-glow" />
        <span className="font-display text-5xl text-glow">{s?.players?.online ?? 0}</span>
        <span className="mb-1 text-muted-foreground">/ {s?.players?.max ?? "–"} player</span>
      </div>
      <div className="nm-inset mt-4 max-h-44 overflow-y-auto p-3">
        {list.length ? (
          <ul className="grid grid-cols-2 gap-2">
            {list.map((p) => (
              <li key={p.name} className="flex min-w-0 items-center gap-2 text-sm">
                <img src={`https://mc-heads.net/avatar/${p.name}/28`} alt="" className="h-7 w-7 shrink-0 rounded-md" loading="lazy" />
                <span className="truncate">{p.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-sm text-muted-foreground">{s?.online ? "Daftar pemain tidak tersedia / belum ada pemain." : "Tidak ada pemain online."}</p>
        )}
      </div>
    </div>
  );
}

function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <h2 className="text-center font-display text-4xl tracking-wide md:text-5xl">{title}</h2>
      {sub && <p className="mt-3 text-center text-muted-foreground">{sub}</p>}
      <div className="mt-12">{children}</div>
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
    <div className="min-h-screen overflow-x-hidden">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav className="nm mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 backdrop-blur">
          <a href="#home" className="flex min-w-0 items-center gap-3">
            <img src={logo.url} alt="Logo XioSMP" className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-[var(--glow)]" />
            <span className="truncate font-display text-2xl text-glow">XioSMP</span>
          </a>
          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map(([l, id]) => (
              <li key={id}><a href={`#${id}`} className="rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-primary-glow">{l}</a></li>
            ))}
          </ul>
          <div className="flex shrink-0 items-center gap-2">
            <a href={DISCORD} target="_blank" rel="noreferrer" className="nm-btn-primary hidden px-5 py-2.5 text-sm font-semibold sm:inline-block">Join Discord</a>
            <button aria-label="Menu" onClick={() => setOpen(!open)} className="nm-btn p-2.5 lg:hidden">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
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

      <section id="home" className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 px-5 pb-16 pt-32 lg:flex-row lg:pt-40">
        <div className="flex-1 text-center lg:text-left">
          <img src={logo.url} alt="XioSMP" className="nm fade-up mx-auto mb-8 h-36 w-36 object-cover p-1.5 lg:hidden" />
          <p className="fade-up text-sm font-semibold uppercase tracking-[.3em] text-primary-glow">Economy SMP</p>
          <h1 className="fade-up mt-3 font-display text-5xl leading-[1.05] md:text-7xl">
            WELCOME TO <span className="text-glow">XIOSMP</span> OFFICIAL
          </h1>
          <p className="fade-up mt-5 text-lg text-muted-foreground">Server Minecraft Economy SMP Terbaru, Seru, &amp; Paling OP!</p>
          <div className="fade-up mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <button onClick={() => copy(IP)} className="nm-btn-primary flex items-center gap-2 px-6 py-3.5 font-semibold"><Copy className="h-4 w-4" /> Copy IP Java</button>
            <button onClick={() => copy(`${IP}:2005`)} className="nm-btn flex items-center gap-2 px-6 py-3.5 font-semibold"><Copy className="h-4 w-4" /> Copy IP Bedrock</button>
          </div>
        </div>
        <LiveStatus />
      </section>

      <Section id="koneksi" title="Informasi Koneksi" sub="Crossplatform — main bareng dari PC, HP, maupun Console.">
        <div className="grid gap-8 md:grid-cols-2">
          {[
            { icon: Gamepad2, t: "Java Edition", rows: [["IP", IP], ["Versi", "26.3 - 1.21.11"]], c: IP },
            { icon: Smartphone, t: "Bedrock / MCPE / HP / Console", rows: [["IP", IP], ["Port", "2005"], ["Versi", "Latest"]], c: IP },
          ].map((k) => (
            <div key={k.t} className="nm-card p-7">
              <div className="flex items-center gap-4">
                <div className="nm-inset grid h-14 w-14 shrink-0 place-items-center"><k.icon className="h-7 w-7 text-primary-glow" /></div>
                <h3 className="font-display text-2xl">{k.t}</h3>
              </div>
              <dl className="mt-6 space-y-3">
                {k.rows.map(([a, b]) => (
                  <div key={a} className="nm-inset flex items-center justify-between gap-3 px-4 py-3">
                    <dt className="text-sm text-muted-foreground">{a}</dt>
                    <dd className="truncate font-semibold">{b}</dd>
                  </div>
                ))}
              </dl>
              <button onClick={() => copy(k.c)} className="nm-btn mt-6 flex w-full items-center justify-center gap-2 py-3 font-semibold"><Copy className="h-4 w-4" /> Salin IP</button>
            </div>
          ))}
        </div>
      </Section>

      <Section id="perks" title="Newbie Perks" sub="Bonus spesial untuk setiap pemain baru XioSMP.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.t} className="nm-card p-6 text-center">
              <div className="nm-inset mx-auto grid h-16 w-16 place-items-center rounded-2xl"><p.icon className="h-8 w-8 text-primary-glow" /></div>
              <h3 className="mt-5 font-display text-xl">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="staff" title="Structure Management" sub="Tim yang menjaga XioSMP tetap seru & aman.">
        <div className="grid gap-6 md:grid-cols-3">
          {staff.map((s) => (
            <div key={s.name} className="nm-card p-7 text-center">
              <img src={`https://mc-heads.net/avatar/${s.name.slice(1)}/80`} alt={s.name} className="nm mx-auto h-20 w-20 rounded-2xl p-1.5" />
              <span className="nm-inset mt-5 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-primary-glow"><s.icon className="h-3.5 w-3.5" /> {s.role}</span>
              <h3 className="mt-3 font-display text-2xl">{s.name}</h3>
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
                <span className="font-display text-2xl text-glow">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 font-semibold">{t}</span>
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
            <a key={s.t} href={s.href} target="_blank" rel="noreferrer" className="nm-card flex items-center gap-4 p-5">
              <div className="nm-inset grid h-12 w-12 shrink-0 place-items-center"><s.icon className="h-6 w-6 text-primary-glow" /></div>
              <div className="min-w-0"><p className="font-semibold">{s.t}</p><p className="truncate text-sm text-muted-foreground">{s.d}</p></div>
            </a>
          ))}
        </div>
      </Section>

      <footer className="px-5 pb-10 pt-6">
        <div className="nm mx-auto flex max-w-6xl flex-col items-center gap-3 p-8 text-center">
          <img src={logo.url} alt="" className="h-14 w-14 rounded-xl object-cover" />
          <p className="font-display text-2xl text-glow">XioSMP</p>
          <p className="text-sm text-muted-foreground">Terima kasih sudah bermain di XioSMP — sampai jumpa di dalam game! ⚔️</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} XioSMP Official. Not affiliated with Mojang or Microsoft.</p>
        </div>
      </footer>
    </div>
  );
}
