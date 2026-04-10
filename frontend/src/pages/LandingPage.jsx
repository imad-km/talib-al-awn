import React, { useEffect, useRef } from 'react';
import { Twitter, Linkedin, Facebook } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './LandingPage.css';

const LandingPage = () => {
  const { lang, t } = useLanguage();
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups = [];

    // ── Scroll navbar shadow ──
    const onScroll = () => {
      const nb = root.querySelector('#nb');
      if (nb) nb.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(16,32,45,.08)' : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    // ── Reveal observer ──
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(x => { if (x.isIntersecting) { x.target.classList.add('visible'); ro.unobserve(x.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    root.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    root.querySelectorAll('.pay-card-img').forEach(el => ro.observe(el));
    cleanups.push(() => ro.disconnect());

    // ── Carousel ──
    const carouselRoot = root.querySelector('#auto-play');
    if (carouselRoot) {
      const body = carouselRoot.querySelector('.carousel-body');
      const slides = carouselRoot.querySelectorAll('.carousel-slide');
      const prev = carouselRoot.querySelector('.carousel-prev');
      const next = carouselRoot.querySelector('.carousel-next');
      if (body && slides.length) {
        let cfg = {};
        try { cfg = JSON.parse(carouselRoot.getAttribute('data-carousel') || '{}'); } catch {}
        let idx = 0;
        const count = slides.length;
        body.style.setProperty('--carousel-count', String(count));
        const render = () => { body.style.setProperty('--carousel-index', String(idx)); body.classList.remove('opacity-0'); };
        const go = (d) => { idx = (idx + d + count) % count; render(); };
        prev?.addEventListener('click', () => go(-1));
        next?.addEventListener('click', () => go(1));
        render();
        if (cfg.isAutoPlay === true) {
          const speed = Math.max(2000, Number(cfg.speed || 4000));
          let t = setInterval(() => go(1), speed);
          carouselRoot.addEventListener('mouseenter', () => { clearInterval(t); t = 0; });
          carouselRoot.addEventListener('mouseleave', () => { if (!t) t = setInterval(() => go(1), speed); });
          cleanups.push(() => clearInterval(t));
        }
      }
    }

    // ── Problem/Solution row reveal ──
    const psRows = root.querySelectorAll('#psRowList .ps-row');
    if (psRows.length) {
      const psObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const row = e.target;
            const idx = Array.prototype.indexOf.call(psRows, row);
            setTimeout(() => {
              row.classList.add('ps-visible');
              row.addEventListener('animationend', () => row.classList.add('ps-done'), { once: true });
            }, idx * 150);
            psObs.unobserve(row);
          }
        });
      }, { threshold: 0.1 });
      psRows.forEach(r => psObs.observe(r));
      cleanups.push(() => psObs.disconnect());
    }

    // ── Miro Flow ──
    const howSection = root.querySelector('#how');
    const mfn1 = root.querySelector('#mfn1'), mfn2 = root.querySelector('#mfn2'), mfn3 = root.querySelector('#mfn3');
    const mfp1 = root.querySelector('#mfp1'), mfp2 = root.querySelector('#mfp2');
    const wf = root.querySelector('#mfWalletFill');
    if (howSection && mfn1) {
      let triggered = false;
      const mfObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && !triggered) {
            triggered = true;
            setTimeout(() => mfn1.classList.add('mf-visible'), 0);
            setTimeout(() => { if (mfp1) mfp1.style.strokeDashoffset = '0'; }, 400);
            setTimeout(() => mfn2.classList.add('mf-visible'), 700);
            setTimeout(() => { if (mfp2) mfp2.style.strokeDashoffset = '0'; }, 1100);
            setTimeout(() => mfn3.classList.add('mf-visible'), 1400);
            setTimeout(() => { if (wf) wf.style.width = '74%'; }, 1700);
            mfObs.disconnect();
          }
        });
      }, { threshold: 0.25 });
      mfObs.observe(howSection);
      cleanups.push(() => mfObs.disconnect());
    }

    // ── FAQ ──
    root.querySelectorAll('.faq-q').forEach(btn => {
      const handler = () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        root.querySelectorAll('.faq-q').forEach(b => { b.setAttribute('aria-expanded', 'false'); b.nextElementSibling.classList.remove('open'); });
        if (!expanded) { btn.setAttribute('aria-expanded', 'true'); btn.nextElementSibling.classList.add('open'); }
      };
      btn.addEventListener('click', handler);
      cleanups.push(() => btn.removeEventListener('click', handler));
    });

    // ── 3D Logo ──
    const video = root.querySelector('#logo3d-video');
    if (video) {
      const BP = 900;
      const TARGETS = [['hero',0.30,0.50,1.20],['offer',0.90,0.20,0.60],['problem',0.90,0.50,0.65],['how',0.90,0.50,0.65],['app',1.30,0.50,0.00],['trust',0.20,0.20,0.65],['payment',0.10,0.50,0.65],['faq',0.95,0.50,0.65],['cta',0.50,0.42,1.80]];
      const secEls = TARGETS.map(t => root.querySelector('#' + t[0]));
      const cur = { x: 0.30, y: 0.50, sz: 1 };
      const LERP = 0.055;
      const lerp = (a, b, t) => a + (b - a) * t;
      const getBlended = () => {
        const vh = window.innerHeight;
        let bestIdx = 0, bestVis = -1;
        for (let i = 0; i < secEls.length; i++) {
          if (!secEls[i]) continue;
          const r = secEls[i].getBoundingClientRect();
          const vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
          if (vis > bestVis) { bestVis = vis; bestIdx = i; }
        }
        const a = TARGETS[bestIdx];
        const mirror = (x) => lang === 'ar' ? x : 1 - x;
        const ni = bestIdx + 1;
        if (ni >= TARGETS.length || !secEls[ni]) return { nx: mirror(a[1]), ny: a[2], sz: a[3] };
        const b = TARGETS[ni];
        const rA = secEls[bestIdx].getBoundingClientRect();
        const t = Math.max(0, Math.min(1, (vh * 0.45 - rA.bottom) / (vh * 0.45)));
        const mix = (x, y) => x + (y - x) * t;
        return { nx: mirror(mix(a[1], b[1])), ny: mix(a[2], b[2]), sz: mix(a[3], b[3]) };
      };
      let rafId;
      const tick = () => {
        rafId = requestAnimationFrame(tick);
        const W = window.innerWidth, H = window.innerHeight;
        video.style.display = W < BP ? 'none' : 'block';
        if (W < BP) return;
        const tgt = getBlended();
        cur.x = lerp(cur.x, tgt.nx, LERP); cur.y = lerp(cur.y, tgt.ny, LERP); cur.sz = lerp(cur.sz, tgt.sz, LERP);
        video.style.left = (cur.x * W) + 'px'; video.style.top = (cur.y * H) + 'px'; video.style.width = (cur.sz * H) + 'px';
      };
      tick();
      cleanups.push(() => cancelAnimationFrame(rafId));
    }

    // ── Hero Particles ──
    const container = root.querySelector('#heroParticles');
    const hero = root.querySelector('#hero');
    if (container && hero) {
      const animAmbient = (p) => {
        const sx = Math.random() * 100, sy = Math.random() * 100;
        const dur = Math.random() * 12 + 10, delay = Math.random() * 8;
        p.style.transition = 'none';
        p.style.left = sx + '%'; p.style.top = sy + '%'; p.style.opacity = '0';
        setTimeout(() => {
          p.style.transition = 'all ' + dur + 's linear';
          p.style.opacity = (Math.random() * 0.25 + 0.05).toFixed(3);
          p.style.left = (sx + (Math.random() * 16 - 8)) + '%';
          p.style.top = (sy - Math.random() * 26) + '%';
          setTimeout(() => animAmbient(p), dur * 1000);
        }, delay * 1000);
      };
      for (let i = 0; i < 72; i++) {
        const p = document.createElement('div'); p.className = 'hero-particle';
        const sz = Math.random() * 2.4 + 0.8; p.style.width = sz + 'px'; p.style.height = sz + 'px';
        container.appendChild(p); animAmbient(p);
      }
      const onMouseMove = (e) => {
        const rect = hero.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width * 100, my = (e.clientY - rect.top) / rect.height * 100;
        const p = document.createElement('div'); p.className = 'hero-particle';
        const sz = Math.random() * 3 + 1.5; p.style.width = sz + 'px'; p.style.height = sz + 'px';
        p.style.left = mx + '%'; p.style.top = my + '%'; p.style.opacity = '.5';
        container.appendChild(p);
        setTimeout(() => { p.style.transition = 'all 1.8s ease-out'; p.style.left = (mx + (Math.random() * 10 - 5)) + '%'; p.style.top = (my + (Math.random() * 10 - 5)) + '%'; p.style.opacity = '0'; setTimeout(() => p.remove(), 1800); }, 10);
        const dx = (e.clientX / window.innerWidth - 0.5) * 5, dy = (e.clientY / window.innerHeight - 0.5) * 5;
        root.querySelectorAll('.hero-sphere').forEach(s => { s.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; });
      };
      hero.addEventListener('mousemove', onMouseMove);
      cleanups.push(() => hero.removeEventListener('mousemove', onMouseMove));
    }

    return () => cleanups.forEach(fn => fn());
  }, [lang]);

  return (
    <div className="landing-root" dir={lang === 'ar' ? 'rtl' : 'ltr'} ref={rootRef}>
      <nav id="nb">
        <div className="nav-brand">
          <span className="nav-sep"></span>
          <span className="nav-name">{t('landing.footer.footerTitle1')}<span> {t('landing.footer.footerTitle2')}</span></span>
          <img src="/assets/logo-07.svg" className="nav-logo-box" alt="Talib-Awn" />
        </div>
        <div className="nav-links">
          <a href="#offer">{t('landing.nav.features')}</a>
          <a href="#how">{t('landing.nav.howItWorks')}</a>
          <a href="#app">{t('landing.nav.theApp')}</a>
          <a href="#trust">{t('landing.nav.whyUs')}</a>
          <a href="#faq">{t('landing.nav.faq')}</a>
        </div>
        <div className="nav-acts">
          <a href="/login" className="btn-login hide-m">{t('landing.nav.login')}</a>
          <a href="/register" className="btn-signup">{t('landing.nav.startNow')}</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-bg">
          <div className="hero-sphere hero-sphere-1"></div>
          <div className="hero-sphere hero-sphere-2"></div>
          <div className="hero-sphere hero-sphere-3"></div>
          <div className="hero-glow"></div>
          <div className="hero-grid"></div>
          <div className="hero-noise"></div>
          <div className="hero-particles" id="heroParticles"></div>
        </div>
        <div className="hero-pill">{t('landing.hero.pill')}</div>
        <h1>{t('landing.hero.title1')}<br /><em>{t('landing.hero.title2')}</em></h1>
        <p className="hero-sub">{t('landing.hero.sub')}</p>
        <div className="hero-cta">
          <a href="/register?role=student" className="btn-hp">{t('landing.hero.needJob')}</a>
          <a href="/register?role=employer" className="btn-ho">{t('landing.hero.needEmployees')}</a>
        </div>
      </section>

      {/* FEATURES */}
      <section id="offer" className="offer-bg features-hero">
        <div className="si features-hero-inner">
          <div className="reveal">
            <div className="stag">{t('landing.features.stag')}</div>
            <h2 className="features-h">{t('landing.features.title')}</h2>
            <p className="features-p">{t('landing.features.desc')}</p>
          </div>
          <div id="auto-play" data-carousel='{"isAutoPlay":true,"speed":4000}'>
            <div className="carousel">
              <div className="carousel-body opacity-0">
                <div class="carousel-slide"><div><img src="/assets/img_1.webp" alt="Feature 1" /></div></div>
                <div class="carousel-slide"><div><img src="/assets/img_2.webp" alt="Feature 2" /></div></div>
                <div class="carousel-slide"><div><img src="/assets/img_3.webp" alt="Feature 3" /></div></div>
                <div class="carousel-slide"><div><img src="/assets/img_4.webp" alt="Feature 4" /></div></div>
              </div>
            </div>
            <button type="button" className="carousel-prev">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              <span className="sr-only">{t('landing.nav.prev')}</span>
            </button>
            <button type="button" className="carousel-next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              <span className="sr-only">{t('landing.nav.next')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* PROBLEM → SOLUTION */}
      <section id="problem" className="ps-sec">
        <div className="si">
          <p className="ps-intro">{t('landing.ps.intro')}</p>
          <div className="ps-row-list" id="psRowList">
            {[1, 2, 3, 4].map((n) => (
              <div className="ps-row" key={n}>
                <div className="ps-half ps-half--problem">
                  <span className="ps-badge ps-badge--problem">{t('landing.ps.problem')}</span>
                  <div className="ps-half-body"><span className="ps-dot ps-dot--red"></span><p>{t(`landing.ps.p${n}`)}</p></div>
                </div>
                <div className="ps-arrow-col"><div className="ps-arrow-circle">{lang === 'ar' ? '←' : '→'}</div></div>
                <div className="ps-half ps-half--solution">
                  <span className="ps-badge ps-badge--solution">{t('landing.ps.solution')}</span>
                  <div className="ps-half-body"><span className="ps-dot ps-dot--green"></span><p>{t(`landing.ps.s${n}`)}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mflow-section">
        <div className="mflow-inner">
          <div className="mflow-hdr">
            <div className="ps-bridge reveal"><div className="ps-bridge-line"></div><span className="ps-bridge-label">{t('landing.how.bridge')}</span><div className="ps-bridge-line"></div></div>
            <h2 className="sh2 mflow-h2">{t('landing.how.title')}</h2>
            <p className="mflow-sub">{t('landing.how.sub')}</p>
          </div>
          <div className="mflow-canvas-wrap">
            <div className="mflow-canvas" id="mflowCanvas">
              <svg className="mflow-svg" viewBox="0 0 860 420" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <marker id="mfarrow1" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto"><path d="M0,0 L0,7 L8,3.5 Z" fill="#7C6FF7" /></marker>
                  <marker id="mfarrow2" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto"><path d="M0,0 L0,7 L8,3.5 Z" fill="#7C6FF7" /></marker>
                </defs>
                <path id="mfp1" d="M 225 155 C 268 155, 290 120, 329 120" fill="none" stroke="#7C6FF7" strokeWidth="2" strokeLinecap="round" strokeDasharray="220" strokeDashoffset="220" markerEnd="url(#mfarrow1)" />
                <path id="mfp2" d="M 515 130 C 558 130, 580 165, 621 165" fill="none" stroke="#7C6FF7" strokeWidth="2" strokeLinecap="round" strokeDasharray="220" strokeDashoffset="220" markerEnd="url(#mfarrow2)" />
              </svg>
              <div className="mf-node mf-node--1" id="mfn1">
                <div className="mf-sticky mf-sticky--green"><div className="mf-sticky-label">{t('landing.how.step1Label')}</div><h3>{t('landing.how.step1Title')}</h3><p>{t('landing.how.step1Desc')}</p></div>
                <div className="mf-mockup mf-mockup--jobs"><div className="mf-mockup-bar"><span className="mf-dot mf-dot--r"></span><span className="mf-dot mf-dot--y"></span><span className="mf-dot mf-dot--g"></span><span className="mf-mock-title">{t('landing.how.listingsTitle')}</span></div><div className="mf-mock-row mf-mock-row--a"></div><div className="mf-mock-row mf-mock-row--b"></div><div className="mf-mock-row mf-mock-row--a" style={{width:'70%'}}></div></div>
                <div className="mf-badge mf-badge--1"><span>{t('landing.how.student')}</span></div>
              </div>
              <div className="mf-node mf-node--2" id="mfn2">
                <div className="mf-sticky mf-sticky--yellow"><div className="mf-sticky-label">{t('landing.how.step2Label')}</div><h3>{t('landing.how.step2Title')}</h3><p>{t('landing.how.step2Desc')}</p></div>
                <div className="mf-mockup mf-mockup--chat"><div className="mf-chat-bubble mf-chat-bubble--in">{t('landing.how.chatBubble1')}</div><div className="mf-chat-bubble mf-chat-bubble--out">{t('landing.how.chatBubble2')}</div><div className="mf-chat-bubble mf-chat-bubble--in">{t('landing.how.chatBubble3')}</div></div>
                <div className="mf-badge mf-badge--2"><span>{t('landing.how.employer')}</span></div>
              </div>
              <div className="mf-node mf-node--3" id="mfn3">
                <div className="mf-sticky mf-sticky--orange"><div className="mf-sticky-label">{t('landing.how.step3Label')}</div><h3>{t('landing.how.step3Title')}</h3><p>{t('landing.how.step3Desc')}</p></div>
                <div className="mf-mockup mf-mockup--wallet"><div className="mf-wallet-label">{t('landing.how.balanceLabel')}</div><div className="mf-wallet-amount">12,500 <span>DZD</span></div><div className="mf-wallet-bar"><div className="mf-wallet-fill" id="mfWalletFill"></div></div><div className="mf-wallet-chips"><span className="mf-chip mf-chip--g">Edahabia</span><span className="mf-chip mf-chip--v">Chargily</span></div></div>
              </div>
              <div className="mf-label mf-label--1">{t('landing.how.browse')}</div>
              <div className="mf-label mf-label--2">{t('landing.how.chatWork')}</div>
              <div className="mf-label mf-label--3">{t('landing.how.withdraw')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* APP */}
      <section id="app" className="app-bg">
        <div className="ai">
          <div>
            <div className="abadge">{t('landing.app.badge')}</div>
            <h2 className="ah2">{t('landing.app.title1')}<br /><em>{t('landing.app.title2')}</em></h2>
            <p className="adesc">{t('landing.app.desc')}</p>
            <div className="afs">
              <div className="af"><div className="afi"><img src="https://img.icons8.com/?size=100&id=7E1LwVS6HB4t&format=png&color=000000" alt="" style={{width:20,height:20,filter:'brightness(0) invert(1)'}} /></div><div><div className="aft">{t('landing.app.f1Title')}</div><div className="afs2">{t('landing.app.f1Desc')}</div></div></div>
              <div className="af"><div className="afi"><img src="https://img.icons8.com/?size=100&id=9xjQNFjDCyFj&format=png&color=000000" alt="" style={{width:20,height:20,filter:'brightness(0) invert(1)'}} /></div><div><div className="aft">{t('landing.app.f2Title')}</div><div className="afs2">{t('landing.app.f2Desc')}</div></div></div>
              <div className="af"><div className="afi"><img src="https://img.icons8.com/?size=100&id=qEK2pqenBa22&format=png&color=000000" alt="" style={{width:20,height:20,filter:'brightness(0) invert(1)'}} /></div><div><div className="aft">{t('landing.app.f3Title')}</div><div className="afs2">{t('landing.app.f3Desc')}</div></div></div>
            </div>
            <div className="sbs">
              <div className="sb-store"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" height="40" style={{display:'block'}} /><div className="sb-coming">{t('landing.app.comingSoon')}</div></div>
              <div className="sb-store"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" height="40" style={{display:'block'}} /><div className="sb-coming">{t('landing.app.comingSoon')}</div></div>
            </div>
          </div>
          <div className="pc">
            <div className="pf">
              <div className="pg"></div>
              <div className="pbadge"><div className="bdot"></div><div className="btxt"><strong>{t('landing.app.newOffer')}</strong><span>{t('landing.app.cashier')} · 90 {t('landing.app.perDay')}</span></div></div>
              <div className="pframe"><div className="pn"></div><div className="pscr"><img src="/assets/logo-07.svg" alt="Talib-Awn" style={{background:'transparent',boxShadow:'none',width:80,height:80}} /><div className="pname">{t('landing.footer.footerTitle1')}-{t('landing.footer.footerTitle2')}</div><div className="psub">{t('landing.footer.footerSub')}</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section id="trust" className="trust-bg">
        <div className="si">
          <div className="stag">{t('landing.trust.stag')}</div>
          <h2 className="sh2">{t('landing.trust.title1')}<br />{t('landing.trust.title2')}</h2>
          <div className="tg">
            <div className="tc reveal"><img src="https://img.icons8.com/?size=100&id=eoxMN35Z6JKg&format=png&color=000000" className="ti-img" alt="AI Verification" /><div className="tt">{t('landing.trust.f1Title')}</div><p className="td">{t('landing.trust.f1Desc')}</p></div>
            <div className="tc reveal rd1"><img src="https://img.icons8.com/?size=100&id=68930&format=png&color=000000" className="ti-img" alt="Secure Payments" /><div className="tt">{t('landing.trust.f2Title')}</div><p className="td">{t('landing.trust.f2Desc')}</p></div>
            <div className="tc reveal rd2"><img src="https://img.icons8.com/?size=100&id=wmiQxNp3EVI7&format=png&color=000000" className="ti-img" alt="Honest Reviews" /><div className="tt">{t('landing.trust.f3Title')}</div><p className="td">{t('landing.trust.f3Desc')}</p></div>
          </div>
        </div>
      </section>

      {/* PAYMENT */}
      <section id="payment" className="payment-sec">
        <div className="si">
          <div className="pay-layout">
            <div className="pay-text reveal">
              <div className="pay-badge">{t('landing.pay.badge')}</div>
              <h2 className="pay-title">{t('landing.pay.title')}</h2>
              <p className="pay-desc">{t('landing.pay.desc')}</p>
            </div>
            <div class="pay-card-wrap reveal rd2"><div class="pay-card-glow"></div><img class="pay-card-img" src="/assets/edahabia.webp" alt="Edahabia payment card" /></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="faq-sec">
        <div className="si">
          <div className="stag">{t('landing.faq.stag')}</div>
          <h2 className="sh2">{t('landing.faq.title1')}<br />{t('landing.faq.title2')}</h2>
          <div className="faq-list">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div className="faq-item" key={n}>
                <button className="faq-q" aria-expanded="false">
                  <span>{t(`landing.faq.q${n}`)}</span>
                  <svg className="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                <div className="faq-a"><p>{t(`landing.faq.a${n}`)}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="cta-sec">
        <div className="ctaw">{t('landing.footer.footerTitle1')}-{t('landing.footer.footerTitle2')}</div>
        <div className="si" style={{textAlign:'center',position:'relative',zIndex:3}}>
          <h2 className="ctah">{t('landing.cta.title1')}<br /><em>{t('landing.cta.title2')}</em></h2>
          <p className="ctad">{t('landing.cta.desc')}</p>
          <div className="ctabs">
            <a href="/register?role=student" className="btn-hp">{t('landing.cta.studentBtn')}</a>
            <a href="/register?role=employer" className="btn-ho">{t('landing.cta.employerBtn')}</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer">
        <div className="fi">
          <div className="fg">
            <div className="fb">
              <div className="nav-brand"><span className="nav-sep"></span><span className="nav-name">{t('landing.footer.footerTitle1')}<span> {t('landing.footer.footerTitle2')}</span></span><img src="/assets/logo-07.svg" className="nav-logo-box" alt="Talib-Awn" style={{background:'transparent',boxShadow:'none'}} /></div>
              <p>{t('landing.footer.about')}</p>
              <div className="fsoc">
                <a href="#" className="fsb"><Twitter size={18} /></a>
                <a href="#" className="fsb"><Linkedin size={18} /></a>
                <a href="#" className="fsb"><Facebook size={18} /></a>
              </div>
            </div>
            <div className="fc"><h5>{t('landing.footer.platform')}</h5><a href="#">{t('landing.footer.browse')}</a><a href="#">{t('landing.footer.post')}</a><a href="#">{t('landing.footer.pricing')}</a></div>
            <div className="fc"><h5>{t('landing.footer.company')}</h5><a href="#">{t('landing.footer.aboutUs')}</a><a href="#how">{t('landing.nav.howItWorks')}</a><a href="#">{t('landing.footer.blog')}</a><a href="#">{t('landing.footer.contact')}</a></div>
            <div className="fc"><h5>{t('landing.footer.legal')}</h5><a href="#">{t('landing.footer.terms')}</a><a href="#">{t('landing.footer.privacy')}</a><a href="#">{t('landing.footer.community')}</a></div>
          </div>
        </div>
      </footer>

      {/* 3D LOGO OVERLAY */}
      <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:2,isolation:'isolate'}}>
        <video id="logo3d-video" src="/assets/logo.webm" autoPlay loop muted playsInline style={{position:'absolute',pointerEvents:'none',opacity:0.9,mixBlendMode:'screen',width:'20vw',transform:'translate(-50%,-50%)'}} />
      </div>
    </div>
  );
};

export default LandingPage;
