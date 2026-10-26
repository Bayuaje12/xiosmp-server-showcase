# XioSMP Server Showcase

Buatkan sebuah website landing page dan portofolio modern untuk server Minecraft bernama "XioSMP" (Economy SMP).



### 1. Desain & Tema Visual (Dark Neumorphism):

- Gunakan gaya desain **Dark Neumorphism (Soft UI)** dengan latar belakang warna gelap keunguan / abu-abu arang yang elegan (#0c0a10 / #131018).

- Palet warna utama menggunakan aksen **Ungu Magis / Ender Purple** yang menyala lembut (menyesuaikan tema logo kastil Ender yang bernuansa ungu).

- Semua elemen seperti kartu (cards), tombol, dan kotak informasi harus memiliki efek bayangan lembut (neumorphic box-shadow) serta efek *inset* atau tombol tenggelam saat di-hover atau diklik.



### 2. Branding & Logo:

- Tampilkan logo server XioSMP (nuansa kastil dan teks 3D ungu bermahkota) di bagian Navbar sebagai ikon/logo utama website.



### 3. Struktur Halaman Website:

- **Navbar:** Logo XioSMP, menu navigasi (Home, Koneksi, Newbie Perks, Staff, Peraturan, Sosial Media), dan tombol "Join Discord" dengan gaya neumorphic.

- **Hero Section:** 

  • Judul besar "WELCOME TO XIOSMP OFFICIAL" dengan subteks "Server Minecraft Economy SMP Terbaru, Seru, & Paling OP!".

  • Widget **Live Status & Player Online (Real-time)** menggunakan API Minecraft publik untuk mengecek IP `play.xiosmp.my.id` (menampilkan status Online/Offline, total player online saat ini, dan **daftar nama pemain yang sedang online** beserta avatar kepala mereka).

  • Tombol interaktif **"Copy IP Java"** dan **"Copy IP Bedrock"** dengan fitur 1-Click Copy yang memunculkan *toast notification* kecil ("IP berhasil disalin!").

- **Informasi Koneksi (Crossplatform):**

  • Kartu Neumorphic Java Edition: IP `play.xiosmp.my.id` | Versi `26.3 - 1.21.11`

  • Kartu Neumorphic Bedrock / MCPE / HP / Console: IP `play.xiosmp.my.id` | Port `2005` | Versi `Latest`

- **Bonus Spesial Pemain Baru (Newbie Perks):**

  • Menampilkan grid card neumorphic berisi: Starter Kit, OP Tools & Potion Pack, Modal Awal Rp 100.000 In-Game Money, dan Claim Land Blocks.

- **Structure Management (Staff Team):**

  • Menampilkan daftar staff dengan kartu neumorphic: Owner (@Raka - Head Manager), Admin (@Bayu - Technical & Community Support), dan Admin (@rasya - Bansos & Security).

- **Peraturan Server & Grup (Rules):**

  • Ditampilkan dalam format accordion / daftar rapi bergaya neumorphic (Larangan toxic/SARA/18+, Anti Cheat/X-Ray/Bug Abuse dengan sanksi Permanent Ban, Saling menghormati, dan catatan bahwa Owner adalah Solo Developer).

- **Sosial Media & Footer:**

  • Tombol akses cepat berdesain neumorphic untuk **Discord** (`discord.gg/5zTzZTJwU`), **TikTok** (`@xiosmp`), **Grup WhatsApp**, dan website utama (`xiosmp.vercel.app`).

  • Teks hak cipta dan catatan penutup khas XioSMP.



Desain harus sepenuhnya responsif (nyaman dibuka lewat HP maupun PC) dengan

 animasi transisi yang halus.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://xiosmp-server-showcase.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b03dcaf7-d6be-45ed-a1e5-48cb41185e42).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
