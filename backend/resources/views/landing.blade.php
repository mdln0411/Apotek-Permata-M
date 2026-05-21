<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Apotek Permata - Solusi Kesehatan Terpercaya</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --green:#2E8B57;--green-light:#4CAF50;--green-bg:#E8F5E9;
  --navy:#0d1b2a;--navy2:#0a2744;--navy3:#1a3a5c;
  --gold:#FFD700;--blue:#1976D2;
  --gray:#7f8c8d;--border:#e0e6ed;--white:#fff;
  --bg:#f4f7fa;--dark-text:#1a2332;
}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--dark-text);overflow-x:clip}
section[id]{scroll-margin-top:70px}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:1000;background:var(--navy);transition:all .3s;border-bottom:1px solid rgba(255,255,255,.05)}
nav.scrolled{background:rgba(13,27,42,.97);backdrop-filter:blur(12px);box-shadow:0 4px 30px rgba(0,0,0,.3)}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 40px;height:70px;display:flex;align-items:center;justify-content:space-between}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
.nav-logo-icon{width:38px;height:38px;background:var(--green);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:900}
.nav-logo-text{color:#fff;font-weight:800;font-size:20px;letter-spacing:.5px}
.nav-links{display:flex;align-items:center;gap:32px}
.nav-links a{color:rgba(255,255,255,.8);text-decoration:none;font-size:14px;font-weight:500;transition:.2s;position:relative}
.nav-links a::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:2px;background:var(--green);transform:scaleX(0);transition:.3s}
.nav-links a:hover{color:#fff}
.nav-links a:hover::after{transform:scaleX(1)}
.nav-btn{background:var(--green);color:#fff;padding:10px 24px;border-radius:25px;font-weight:700;font-size:14px;text-decoration:none;transition:.2s;border:2px solid transparent}
.nav-btn::after{display:none !important}
.nav-btn:hover{background:transparent;border-color:var(--green);color:var(--green)}

/* HERO */
.hero{min-height:100vh;background:linear-gradient(135deg,var(--navy) 0%,var(--navy2) 60%,#0e3060 100%);display:flex;align-items:center;padding-top:70px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;pointer-events:none;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232E8B57' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
.hero-inner{max-width:1200px;margin:0 auto;padding:60px 40px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;width:100%;position:relative;z-index:1}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(46,139,87,.15);border:1px solid rgba(46,139,87,.3);color:#4ade80;padding:8px 16px;border-radius:30px;font-size:12px;font-weight:600;margin-bottom:24px;animation:fadeInDown .6s ease}
.hero h1{font-size:58px;font-weight:900;color:#fff;line-height:1.1;margin-bottom:20px;animation:fadeInUp .7s ease}
.hero h1 .gold{color:var(--gold)}
.hero-desc{color:rgba(255,255,255,.7);font-size:16px;line-height:1.8;margin-bottom:32px;max-width:480px;animation:fadeInUp .8s ease}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap;animation:fadeInUp .9s ease}
.btn-green{background:var(--green);color:#fff;padding:14px 30px;border-radius:30px;font-weight:700;font-size:15px;text-decoration:none;transition:.3s;display:inline-flex;align-items:center;gap:8px;box-shadow:0 8px 25px rgba(46,139,87,.4)}
.btn-green:hover{background:#267a49;transform:translateY(-3px);box-shadow:0 12px 30px rgba(46,139,87,.5)}
.btn-ghost{border:2px solid rgba(255,255,255,.3);color:#fff;padding:14px 30px;border-radius:30px;font-weight:600;font-size:15px;text-decoration:none;transition:.3s;display:inline-flex;align-items:center;gap:8px}
.btn-ghost:hover{border-color:#fff;background:rgba(255,255,255,.08)}
.hero-tentang{margin-top:24px;animation:fadeInUp 1s ease}
.hero-tentang a{color:var(--gold);font-weight:700;font-size:15px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:.2s}
.hero-tentang a:hover{gap:14px}
.hero-img{position:relative;animation:fadeInRight .8s ease}
.hero-img img{width:100%;max-width:520px;border-radius:24px;object-fit:cover;height:500px;box-shadow:0 30px 80px rgba(0,0,0,.5)}
.hero-float-card{position:absolute;background:#fff;border-radius:16px;padding:14px 18px;box-shadow:0 10px 40px rgba(0,0,0,.2);display:flex;align-items:center;gap:12px;animation:float 3s ease-in-out infinite}
.hero-float-card.card1{bottom:60px;left:-30px}
.hero-float-card.card2{top:50px;right:-20px;animation-delay:1.5s}
.float-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px}
.float-num{font-weight:900;font-size:18px;color:var(--dark-text)}
.float-label{font-size:11px;color:var(--gray)}

@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes fadeInDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes countUp{from{opacity:0}to{opacity:1}}

/* TENTANG */
.tentang{background:linear-gradient(135deg,var(--navy) 0%,var(--navy2) 100%);padding:90px 40px;position:relative;overflow:hidden}
.tentang::after{content:'';position:absolute;right:-100px;top:-100px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(46,139,87,.15),transparent);pointer-events:none}
.tentang-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;position:relative;z-index:1}
.tentang h2{font-size:44px;font-weight:900;color:#fff;margin-bottom:16px;line-height:1.2}
.tentang-desc{color:rgba(255,255,255,.8);font-size:15px;line-height:1.8;margin-bottom:40px}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.stat-box{text-align:center;padding:20px 10px}
.stat-box:not(:last-child){border-right:1px solid rgba(255,255,255,.15)}
.stat-icon{font-size:28px;margin-bottom:8px;display:block}
.stat-num{font-size:38px;font-weight:900;color:#fff;display:block;line-height:1}
.stat-label{font-size:12px;color:rgba(255,255,255,.6);margin-top:6px;display:block}
.tentang-btns{display:flex;gap:12px;margin-top:32px;flex-wrap:wrap}
.btn-gold{border:2px solid var(--gold);color:var(--gold);padding:12px 24px;border-radius:25px;font-weight:700;font-size:14px;text-decoration:none;transition:.3s;background:transparent}
.btn-gold:hover{background:var(--gold);color:var(--navy)}
.poster-wrapper {
  position: relative;
  width: 100%;
  max-width: 480px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0,0,0,0.4);
  margin: 0 auto;
  border: 4px solid rgba(255,255,255,0.1);
  transform: translateY(0);
  transition: transform 0.5s ease;
}
.poster-wrapper:hover {
  transform: translateY(-10px);
  box-shadow: 0 40px 100px rgba(46,139,87,0.4);
}
.poster-img {
  width: 100%;
  height: auto;
  display: block;
}

/* TABS */
.tabs-section{background:var(--navy);padding:0 40px}
.tabs-inner{max-width:1200px;margin:0 auto;display:flex;gap:0;border-top:1px solid rgba(255,255,255,.08)}
.tab-btn{padding:18px 32px;color:rgba(255,255,255,.6);font-weight:600;font-size:14px;cursor:pointer;border:none;background:none;transition:.3s;border-bottom:3px solid transparent;position:relative}
.tab-btn:hover{color:#fff}
.tab-btn.active{color:#fff;border-bottom-color:var(--gold)}

/* CONTENT SECTIONS */
.content-section{background:#fff;padding:0}
.tab-content{display:none;padding:80px 40px}
.tab-content.active{display:block}
.tab-content-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.content-label{font-size:12px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px}
.content-h2{font-size:36px;font-weight:800;color:var(--dark-text);line-height:1.25;margin-bottom:16px}
.content-h2 em{color:var(--green);font-style:italic}
.content-desc{color:var(--gray);font-size:15px;line-height:1.8;margin-bottom:28px}
.features-list{display:grid;grid-template-columns:1fr 1fr;gap:10px 30px;margin-bottom:32px}
.feat-item{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--dark-text);font-weight:500}
.feat-check{width:22px;height:22px;background:var(--green);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;flex-shrink:0}
.btn-blue{background:var(--blue);color:#fff;padding:14px 28px;border-radius:30px;font-weight:700;font-size:15px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:.3s;box-shadow:0 8px 25px rgba(25,118,210,.3)}
.btn-blue:hover{background:#1565c0;transform:translateY(-2px)}
.baca-link{display:inline-flex;align-items:center;gap:8px;color:var(--gray);font-size:14px;font-weight:500;cursor:pointer;margin-top:14px;text-decoration:none;transition:.3s}
.baca-link:hover{color:var(--green)}

/* ILLUSTRATION CARD */
.illus-card{background:linear-gradient(135deg,#FFF9C4,#FFE082);border-radius:24px;padding:36px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;min-height:300px;position:relative;overflow:hidden}
.illus-card::before{content:'';position:absolute;top:-40px;right:-40px;width:120px;height:120px;background:rgba(25,118,210,.15);border-radius:50%}
.illus-card::after{content:'';position:absolute;bottom:-30px;left:-30px;width:100px;height:100px;background:rgba(46,139,87,.15);border-radius:30% 70% 70% 30%/30% 30% 70% 70%}
.illus-icon{font-size:60px;margin-bottom:16px;z-index:1;position:relative}
.illus-title{font-size:20px;font-weight:800;color:var(--dark-text);margin-bottom:8px;z-index:1;position:relative;line-height:1.3}
.illus-sub{font-size:13px;color:rgba(0,0,0,.5);margin-bottom:20px;z-index:1;position:relative}

/* EXPAND SECTION */
.expand-section{max-width:1200px;margin:0 auto;padding:0 40px 60px;overflow:hidden;max-height:0;transition:max-height .6s ease}
.expand-section.open{max-height:600px}
.expand-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding-top:40px}
.expand-card{background:#fff;border:1px solid var(--border);border-radius:20px;padding:28px;transition:.3s;cursor:default}
.expand-card:hover{transform:translateY(-5px);box-shadow:0 15px 40px rgba(0,0,0,.1);border-color:var(--green)}
.expand-card-icon{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:16px}
.expand-card h3{font-size:16px;font-weight:700;color:var(--dark-text);margin-bottom:8px}
.expand-card p{font-size:13px;color:var(--gray);line-height:1.6}

/* DOWNLOAD */
.download-section{background:linear-gradient(135deg,var(--navy) 0%,var(--navy2) 50%,#0e3060 100%);padding:100px 40px;text-align:center;position:relative;overflow:hidden}
.download-section::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232E8B57' fill-opacity='0.04'%3E%3Cpath d='M0 0h40v40H0zm40 40h40v40H40z'/%3E%3C/g%3E%3C/svg%3E")}
.download-inner{max-width:900px;margin:0 auto;position:relative}
.dl-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,215,0,.1);border:1px solid rgba(255,215,0,.3);color:var(--gold);padding:8px 18px;border-radius:30px;font-size:12px;font-weight:700;margin-bottom:24px}
.download-section h2{font-size:48px;font-weight:900;color:#fff;margin-bottom:16px;line-height:1.2}
.download-section h2 span{color:var(--gold)}
.download-desc{color:rgba(255,255,255,.7);font-size:16px;max-width:520px;margin:0 auto 50px;line-height:1.7}
.dl-app-feats{display:flex;justify-content:center;gap:30px;flex-wrap:wrap;margin-bottom:60px}
.dl-feat{display:flex;flex-direction:column;align-items:center;gap:10px}
.dl-feat-icon{width:56px;height:56px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:24px;transition:.3s}
.dl-feat-icon:hover{background:rgba(46,139,87,.2);border-color:rgba(46,139,87,.4);transform:translateY(-4px)}
.dl-feat-label{font-size:12px;color:rgba(255,255,255,.7);font-weight:500}
.dl-cards{display:flex;justify-content:center;align-items:flex-start;gap:50px;flex-wrap:wrap}
.qr-card{background:#fff;border-radius:24px;padding:32px;text-align:center;min-width:260px;box-shadow:0 20px 60px rgba(0,0,0,.3)}
.qr-card img{width:160px;height:160px;border-radius:12px;margin-bottom:16px;border:4px solid var(--green-bg)}
.qr-title{font-size:16px;font-weight:800;color:var(--dark-text);margin-bottom:4px}
.qr-sub{font-size:12px;color:var(--gray)}
.store-links{display:flex;flex-direction:column;justify-content:center;gap:16px}
.store-btn{display:flex;align-items:center;gap:16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);color:#fff;padding:16px 28px;border-radius:16px;text-decoration:none;transition:.3s;min-width:220px}
.store-btn:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.3);transform:translateX(4px)}
.store-btn-icon{font-size:34px}
.store-btn-text .sub{font-size:10px;opacity:.6;display:block;text-transform:uppercase;letter-spacing:1px}
.store-btn-text .name{font-size:20px;font-weight:800;display:block}
.store-rating{display:flex;align-items:center;gap:6px;margin-top:8px}
.stars{color:var(--gold);font-size:12px}
.rating-text{font-size:11px;color:rgba(255,255,255,.5)}

/* FOOTER */
footer{background:#060f1a;padding:40px;text-align:center;border-top:1px solid rgba(255,255,255,.05)}
footer p{color:rgba(255,255,255,.35);font-size:13px;line-height:2}
footer a{color:var(--green);text-decoration:none}
footer a:hover{text-decoration:underline}

/* SCROLL ANIMATION */
.reveal{opacity:0;transform:translateY(40px);transition:all .7s ease}
.reveal.visible{opacity:1;transform:translateY(0)}

/* RESPONSIVE */
@media(max-width:768px){
  .hero-inner,.tentang-inner,.tab-content-inner{grid-template-columns:1fr}
  .hero h1{font-size:36px}
  .tentang h2{font-size:30px}
  .hero-img{display:none}
  .phone-mockup{display:none}
  .nav-links{display:none}
  .expand-grid{grid-template-columns:1fr}
  .dl-cards{flex-direction:column;align-items:center}
}
</style>
</head>
<body>

<!-- NAVBAR -->
<nav id="navbar">
  <div class="nav-inner">
    <a href="#" class="nav-logo">
      <div class="nav-logo-icon">+</div>
      <span class="nav-logo-text">Apotek Permata</span>
    </a>
    <div class="nav-links">
      <a href="#tentang">Tentang Kami</a>
      <a href="#layanan">Layanan</a>
      <a href="#download">Unduh App</a>
      <a href="/login" class="nav-btn">Masuk Staff</a>
    </div>
  </div>
</nav>

<!-- HERO -->
<section class="hero" id="beranda">
  <div class="hero-inner">
    <div>
      <div class="hero-badge"><i class="fas fa-shield-alt"></i> Apotek Terpercaya & Berlisensi</div>
      <h1>Platform Apotek<br><span class="gold">Terjangkau</span> <i class="fas fa-map-marker-alt" style="font-size:44px;color:#e74c3c"></i></h1>
      <p class="hero-desc">Apotek Permata adalah solusi terlengkap untuk kebutuhan kesehatan harian Anda. Dapatkan semua kebutuhan kesehatan dengan mudah melalui ekosistem kami. Kami menyediakan 500+ produk dan layanan kesehatan terbaik untuk Anda.</p>
      <div class="hero-btns">
        <a href="#tentang" class="btn-green"><i class="fas fa-info-circle"></i> Tentang Kami &nbsp;&rarr;</a>
        <a href="#download" class="btn-ghost"><i class="fab fa-google-play"></i> Unduh Aplikasi</a>
      </div>
    </div>
    <div class="hero-img" style="position:relative">
      <img src="https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=700&auto=format&fit=crop" alt="Apoteker Permata" />
      <div class="hero-float-card card1">
        <div class="float-icon" style="background:#E8F5E9;font-size:22px">🏪</div>
        <div>
          <div class="float-num">500+</div>
          <div class="float-label">Produk Tersedia</div>
        </div>
      </div>
      <div class="hero-float-card card2">
        <div class="float-icon" style="background:#E3F2FD;font-size:22px">💊</div>
        <div>
          <div class="float-num">100+</div>
          <div class="float-label">Jenis Obat</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TENTANG -->
<section class="tentang" id="tentang">
  <div class="tentang-inner">
    <div class="reveal">
      <h2>Tentang Apotek Permata</h2>
      <p class="tentang-desc">Apotek Permata adalah solusi terlengkap untuk kebutuhan kesehatan harian Anda. Dapatkan semua kebutuhan kesehatan Anda dengan mudah melalui ekosistem kami. Kami menyediakan 500+ produk dan menjangkau seluruh pelanggan kami.</p>
      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-icon">🏪</span>
          <span class="stat-num" data-count="500">0</span><span style="font-size:28px;font-weight:900;color:#fff">+</span>
          <span class="stat-label">Produk Tersedia</span>
        </div>
        <div class="stat-box">
          <span class="stat-icon">💊</span>
          <span class="stat-num" data-count="100">0</span><span style="font-size:28px;font-weight:900;color:#fff">+</span>
          <span class="stat-label">Jenis Obat</span>
        </div>
        <div class="stat-box">
          <span class="stat-icon">📍</span>
          <span class="stat-num" data-count="24">0</span><span style="font-size:28px;font-weight:900;color:#fff">/7</span>
          <span class="stat-label">Layanan Chat</span>
        </div>
      </div>
      <div class="tentang-btns">
        <a href="#layanan" class="btn-gold">Belanja Produk</a>
        <a href="#download" class="btn-gold">Unduh Aplikasi</a>
      </div>
    </div>
    <div class="reveal">
      <div class="poster-wrapper">
        <img src="{{ asset('images/apotek_poster.png') }}" alt="Apotek Permata Poster" class="poster-img" />
      </div>
    </div>
  </div>
</section>

<!-- TABS -->
<div class="tabs-section" id="layanan">
  <div class="tabs-inner">
    <button class="tab-btn active" data-tab="belanja">Belanja Produk</button>
    <button class="tab-btn" data-tab="konsultasi">Konsultasi Apoteker</button>
    <button class="tab-btn" data-tab="resep">Upload Resep</button>
  </div>
</div>

<!-- TAB CONTENTS -->
<div class="content-section">

  <!-- BELANJA -->
  <div class="tab-content active" id="tab-belanja">
    <div class="tab-content-inner">
      <div class="reveal">
        <div class="content-label">Belanja Produk</div>
        <h2 class="content-h2"><em>Marketplace</em> Khusus Untuk Produk Kesehatan</h2>
        <p class="content-desc">Unduh aplikasi Apotek Permata dan temukan kemudahan akses ke lebih dari 500 produk kesehatan, mulai dari obat-obatan, vitamin, suplemen, hingga peralatan medis. Nikmati fitur-fitur unggulan seperti konsultasi online dengan apoteker, konsultasi dengan dokter, dan layanan antar cepat langsung ke rumah Anda.</p>
        <div class="features-list">
          <div class="feat-item"><div class="feat-check">✓</div> Pilihan produk yang lengkap</div>
          <div class="feat-item"><div class="feat-check">✓</div> Harga terjangkau</div>
          <div class="feat-item"><div class="feat-check">✓</div> Bisa pilih apotek favorit</div>
          <div class="feat-item"><div class="feat-check">✓</div> Beragam pilihan pembayaran dan pengiriman</div>
          <div class="feat-item"><div class="feat-check">✓</div> Bisa tebus obat resep</div>
          <div class="feat-item"><div class="feat-check">✓</div> Konsultasi dengan apoteker profesional</div>
        </div>
        <a href="#download" class="btn-blue"><i class="fas fa-download"></i> Unduh Aplikasi Apotek Permata</a>
        <br>
        <a href="#" class="baca-link" id="baca-belanja" onclick="toggleExpand('expand-belanja','baca-belanja');return false;">Baca Lebih Lengkap <i class="fas fa-chevron-down"></i></a>
      </div>
      <div class="reveal">
        <div class="illus-card">
          <div class="illus-icon">🏥</div>
          <div class="illus-title">Apotek Jauh?<br>Butuh Obat Cepat?<br>Beli Online Tapi Takut Obat Palsu?</div>
          <div class="illus-sub">Tenang! Apotek Permata menjamin keaslian setiap produk yang kami jual.</div>
          <a href="#download" class="btn-blue" style="margin-top:8px;font-size:13px;padding:12px 22px"><i class="fab fa-google-play"></i> Unduh Aplikasi Apotek Permata</a>
        </div>
      </div>
    </div>
    <div class="expand-section" id="expand-belanja">
      <div class="expand-grid">
        <div class="expand-card reveal">
          <div class="expand-card-icon" style="background:#E8F5E9">🛒</div>
          <h3>Belanja Mudah & Aman</h3>
          <p>Temukan ribuan produk kesehatan original dengan harga kompetitif. Pembayaran 100% aman dengan berbagai metode.</p>
        </div>
        <div class="expand-card reveal">
          <div class="expand-card-icon" style="background:#E3F2FD">🚚</div>
          <h3>Pengiriman Cepat</h3>
          <p>Pesanan Anda dikirim langsung dari apotek terdekat. Estimasi pengiriman hanya 15-30 menit ke rumah Anda.</p>
        </div>
        <div class="expand-card reveal">
          <div class="expand-card-icon" style="background:#FFF3E0">⭐</div>
          <h3>Produk Terjamin Asli</h3>
          <p>Semua produk kami bersumber langsung dari distributor resmi dan telah mendapatkan izin edar dari BPOM.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- KONSULTASI -->
  <div class="tab-content" id="tab-konsultasi">
    <div class="tab-content-inner">
      <div class="reveal">
        <div class="content-label">Konsultasi Apoteker</div>
        <h2 class="content-h2">Chat Langsung dengan <em>Apoteker</em> Berpengalaman</h2>
        <p class="content-desc">Tanya jawab seputar obat, dosis, efek samping, dan interaksi obat langsung dengan apoteker profesional kami. Layanan tersedia 24 jam sehari, 7 hari seminggu tanpa biaya tambahan.</p>
        <div class="features-list">
          <div class="feat-item"><div class="feat-check">✓</div> Chat real-time dengan apoteker</div>
          <div class="feat-item"><div class="feat-check">✓</div> Gratis tanpa biaya konsultasi</div>
          <div class="feat-item"><div class="feat-check">✓</div> Apoteker bersertifikasi resmi</div>
          <div class="feat-item"><div class="feat-check">✓</div> Riwayat chat tersimpan</div>
          <div class="feat-item"><div class="feat-check">✓</div> Privasi terjaga sepenuhnya</div>
          <div class="feat-item"><div class="feat-check">✓</div> Rekomendasi obat yang tepat</div>
        </div>
        <a href="#download" class="btn-blue"><i class="fas fa-comment-medical"></i> Mulai Konsultasi Sekarang</a>
        <br>
        <a href="#" class="baca-link" id="baca-konsultasi" onclick="toggleExpand('expand-konsultasi','baca-konsultasi');return false;">Baca Lebih Lengkap <i class="fas fa-chevron-down"></i></a>
      </div>
      <div class="reveal">
        <div class="illus-card">
          <div class="illus-icon">💬</div>
          <div class="illus-title">Punya Pertanyaan<br>Seputar Obat?</div>
          <div class="illus-sub">Apoteker kami siap membantu Anda 24/7 melalui fitur chat di aplikasi.</div>
          <a href="#download" class="btn-blue" style="margin-top:8px;font-size:13px;padding:12px 22px"><i class="fab fa-google-play"></i> Unduh & Chat Sekarang</a>
        </div>
      </div>
    </div>
    <div class="expand-section" id="expand-konsultasi">
      <div class="expand-grid">
        <div class="expand-card reveal">
          <div class="expand-card-icon" style="background:#E8F5E9">🩺</div>
          <h3>Konsultasi Interaksi Obat</h3>
          <p>Tanyakan kemungkinan interaksi antara obat-obatan yang sedang Anda konsumsi untuk keamanan optimal.</p>
        </div>
        <div class="expand-card reveal">
          <div class="expand-card-icon" style="background:#E3F2FD">📋</div>
          <h3>Panduan Penggunaan Obat</h3>
          <p>Dapatkan panduan lengkap cara penggunaan, dosis yang tepat, dan waktu terbaik untuk minum obat.</p>
        </div>
        <div class="expand-card reveal">
          <div class="expand-card-icon" style="background:#FCE4EC">❤️</div>
          <h3>Pemantauan Kesehatan</h3>
          <p>Apoteker kami membantu memantau perkembangan kesehatan Anda dan memberikan rekomendasi terkini.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- RESEP -->
  <div class="tab-content" id="tab-resep">
    <div class="tab-content-inner">
      <div class="reveal">
        <div class="content-label">Upload Resep</div>
        <h2 class="content-h2">Tebus <em>Resep Dokter</em> Online dengan Mudah</h2>
        <p class="content-desc">Tidak perlu repot antri di apotek. Cukup foto resep dokter Anda, upload melalui aplikasi, dan tim apoteker kami akan memproses serta mengirimkan obat langsung ke alamat Anda.</p>
        <div class="features-list">
          <div class="feat-item"><div class="feat-check">✓</div> Upload foto resep kapan saja</div>
          <div class="feat-item"><div class="feat-check">✓</div> Verifikasi oleh apoteker resmi</div>
          <div class="feat-item"><div class="feat-check">✓</div> Proses cepat dalam 30 menit</div>
          <div class="feat-item"><div class="feat-check">✓</div> Dikirim ke alamat Anda</div>
          <div class="feat-item"><div class="feat-check">✓</div> Riwayat resep tersimpan</div>
          <div class="feat-item"><div class="feat-check">✓</div> Harga sesuai resep dokter</div>
        </div>
        <a href="#download" class="btn-blue"><i class="fas fa-camera"></i> Upload Resep Sekarang</a>
        <br>
        <a href="#" class="baca-link" id="baca-resep" onclick="toggleExpand('expand-resep','baca-resep');return false;">Baca Lebih Lengkap <i class="fas fa-chevron-down"></i></a>
      </div>
      <div class="reveal">
        <div class="illus-card">
          <div class="illus-icon">📄</div>
          <div class="illus-title">Punya Resep Dokter?<br>Tebus di Sini!</div>
          <div class="illus-sub">Foto dan upload resep Anda, kami proses dalam hitungan menit.</div>
          <a href="#download" class="btn-blue" style="margin-top:8px;font-size:13px;padding:12px 22px"><i class="fas fa-upload"></i> Upload Resep via App</a>
        </div>
      </div>
    </div>
    <div class="expand-section" id="expand-resep">
      <div class="expand-grid">
        <div class="expand-card reveal">
          <div class="expand-card-icon" style="background:#E8F5E9">📸</div>
          <h3>Foto Resep Mudah</h3>
          <p>Cukup ambil foto resep dokter Anda menggunakan kamera smartphone, resolusi rendah pun tetap terbaca.</p>
        </div>
        <div class="expand-card reveal">
          <div class="expand-card-icon" style="background:#FFF3E0">🔒</div>
          <h3>Data Resep Aman</h3>
          <p>Informasi resep dan data kesehatan Anda dienkripsi dan hanya dapat diakses oleh apoteker berwenang.</p>
        </div>
        <div class="expand-card reveal">
          <div class="expand-card-icon" style="background:#F3E5F5">📦</div>
          <h3>Pengiriman Terjamin</h3>
          <p>Obat dikemas dengan standar farmasi dan dikirim dalam kondisi terbaik hingga ke tangan Anda.</p>
        </div>
      </div>
    </div>
  </div>

</div>

<!-- DOWNLOAD -->
<section class="download-section" id="download">
  <div class="download-inner">
    <div class="dl-badge"><i class="fas fa-mobile-alt"></i> Aplikasi Mobile Tersedia</div>
    <h2>Unduh Aplikasi <span>Apotek Permata</span><br>Sekarang Juga!</h2>
    <p class="download-desc">Nikmati kemudahan belanja obat, konsultasi apoteker, pengingat minum obat, dan banyak fitur menarik lainnya langsung dari smartphone Anda.</p>
    <div class="dl-app-feats">
      <div class="dl-feat"><div class="dl-feat-icon">🛒</div><div class="dl-feat-label">Belanja Mudah</div></div>
      <div class="dl-feat"><div class="dl-feat-icon">💬</div><div class="dl-feat-label">Chat Apoteker</div></div>
      <div class="dl-feat"><div class="dl-feat-icon">⏰</div><div class="dl-feat-label">Pengingat Obat</div></div>
      <div class="dl-feat"><div class="dl-feat-icon">📋</div><div class="dl-feat-label">Upload Resep</div></div>
      <div class="dl-feat"><div class="dl-feat-icon">🔔</div><div class="dl-feat-label">Notifikasi</div></div>
      <div class="dl-feat"><div class="dl-feat-icon">💊</div><div class="dl-feat-label">Cek Alergi</div></div>
    </div>
    <div class="dl-cards">
      <div class="qr-card">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://play.google.com/ApotekPermata&bgcolor=ffffff&color=2E8B57&qzone=1" alt="QR Code Download Apotek Permata" />
        <div class="qr-title">Scan QR Code</div>
        <div class="qr-sub">Arahkan kamera untuk mengunduh</div>
      </div>
      <div class="store-links">
        <a href="#" class="store-btn">
          <span class="store-btn-icon">▶</span>
          <div class="store-btn-text">
            <span class="sub">GET IT ON</span>
            <span class="name">Google Play</span>
          </div>
        </a>
        <div class="store-rating">
          <span class="stars">★★★★★</span>
          <span class="rating-text">4.9 · 10K+ Ulasan</span>
        </div>
        <a href="#" class="store-btn" style="margin-top:8px">
          <span class="store-btn-icon"></span>
          <div class="store-btn-text">
            <span class="sub">DOWNLOAD ON THE</span>
            <span class="name">App Store</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</section>

<footer>
  <p>© 2026 <strong style="color:rgba(255,255,255,.6)">Apotek Permata</strong>. Solusi Sehat Keluarga Indonesia.</p>
  <p>Khusus Staff Apotek? <a href="/login">Klik di sini untuk Login Dashboard</a></p>
</footer>

<script>
// NAV SCROLL
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>50);
});

// TABS
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
    triggerReveal();
  });
});

// EXPAND (Baca Selengkapnya)
function toggleExpand(sectionId, linkId){
  const sec = document.getElementById(sectionId);
  const lnk = document.getElementById(linkId);
  const isOpen = sec.classList.contains('open');
  sec.classList.toggle('open',!isOpen);
  const icon = lnk.querySelector('i');
  if(!isOpen){ icon.className='fas fa-chevron-up'; lnk.childNodes[0].textContent='Tutup '; }
  else { icon.className='fas fa-chevron-down'; lnk.childNodes[0].textContent='Baca Lebih Lengkap '; }
}

// SCROLL REVEAL
function triggerReveal(){
  document.querySelectorAll('.reveal').forEach(el=>{
    const rect=el.getBoundingClientRect();
    if(rect.top<window.innerHeight-60) el.classList.add('visible');
  });
}
window.addEventListener('scroll',triggerReveal);
window.addEventListener('load',triggerReveal);

// COUNTER ANIMATION
function animateCounters(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target=+el.dataset.count;
    let count=0;
    const step=Math.ceil(target/60);
    const interval=setInterval(()=>{
      count=Math.min(count+step,target);
      el.textContent=count;
      if(count>=target) clearInterval(interval);
    },20);
  });
}
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ animateCounters(); obs.disconnect(); }});
},{threshold:.3});
const statSection=document.querySelector('.tentang');
if(statSection) obs.observe(statSection);

// SMOOTH SCROLL untuk semua anchor link
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener('click',function(e){
    const target=document.querySelector(this.getAttribute('href'));
    if(target){
      e.preventDefault();
      const navH=document.getElementById('navbar')?.offsetHeight||70;
      const top=target.getBoundingClientRect().top+window.scrollY-navH;
      window.scrollTo({top,behavior:'smooth'});
    }
  });
});
</script>
</body>
</html>
