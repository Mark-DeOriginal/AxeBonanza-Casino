'use client';

import { createContext, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import Image from 'next/image';
import { allGames, categories, filters, gameImage, promotions, siteAsset } from '@/data/casino';
import { ColorIcon, Icon } from './icon';

type Panel = 'search' | 'providers' | 'languages' | 'notifications' | 'support' | null;
type Action = Panel | 'login' | 'signup' | 'menu';
type UIState = { open: (panel: Panel, category?: string) => void; toggleMenu: () => void };
const UI = createContext<UIState | null>(null);
const accountUrl = 'https://axecasmedia.com/a3zplx4yn';
function useUI() {
  const value = useContext(UI);
  if (!value) throw new Error('Casino controls require CasinoUI');
  return value;
}

export function ActionButton({ action, category, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { action: Action; category?: string }) {
  const ui = useUI();
  if (action === 'login' || action === 'signup') {
    return <a href={accountUrl} rel="noreferrer" className={props.className} aria-label={props['aria-label']} tabIndex={props.tabIndex} title={props.title}>{children}</a>;
  }
  return <button {...props} type="button" onClick={() => {
    if (action === 'menu') ui.toggleMenu();
    else ui.open(action, category);
  }}>{children}</button>;
}

export function CasinoUI({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menu, setMenu] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  function close() { setPanel(null); }
  function open(next: Panel, category = 'all') {
    previousFocus.current = document.activeElement as HTMLElement;
    setMenu(false);
    setSelectedCategory(category);
    setPanel(next);
  }
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (panel) {
      element.showModal();
      const before = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { element.close(); document.body.style.overflow = before; previousFocus.current?.focus(); };
    }
  }, [panel]);
  useEffect(() => {
    if (!menu) return;
    const focused = document.activeElement as HTMLElement | null;
    const sidebar = document.querySelector<HTMLElement>('.sidebar');
    const background = [...document.querySelectorAll<HTMLElement>('.site-header, .main-content, .mobile-navigation, .support-launcher')];
    background.forEach(element => { element.inert = true; });
    sidebar?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false);
      if (event.key !== 'Tab' || !sidebar) return;
      const targets = [...sidebar.querySelectorAll<HTMLElement>('a, button, summary')].filter(element => element.getClientRects().length > 0);
      const first = targets[0];
      const last = targets.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = before; background.forEach(element => { element.inert = false; }); focused?.focus(); };
  }, [menu]);
  const toggleMenu = () => {
    if (window.matchMedia('(min-width: 834px)').matches) setCollapsed(value => !value);
    else setMenu(value => !value);
  };
  const titles: Record<NonNullable<Panel>, string> = { search: 'Search', providers: 'Search', languages: 'Languages', notifications: 'Notifications', support: 'Live Support' };
  return <UI.Provider value={{ open, toggleMenu }}>
    <div className={`casino-app${menu ? ' menu-open' : ''}${collapsed ? ' sidebar-collapsed' : ''}`}>
      {menu && <button className="menu-scrim" aria-label="Close menu" onClick={() => setMenu(false)} />}
      {children}
      <CookieNotice />
      <button className="support-launcher" aria-label="Open messaging window" onClick={() => open('support')}><Image src="/reference/chat.svg" alt="" width={24} height={24} /></button>
      <dialog ref={dialog} className={`site-dialog ${panel === 'support' ? 'support-dialog' : ''} ${panel === 'notifications' ? 'notification-dialog' : ''}`} aria-label={panel ? titles[panel] : 'Dialog'} onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }}>
        {panel && <div className="dialog-surface">
          <button className="dialog-close" aria-label="Close dialog" onClick={close}><Icon name="close" /></button>
          <h2>{titles[panel]}</h2>
          {(panel === 'search' || panel === 'providers') && <Search initialTab={panel === 'providers' ? 'providers' : 'games'} category={selectedCategory} />}
          {panel === 'languages' && <Languages />}
          {panel === 'notifications' && <a className="notification-card" href="https://www.axecasino.com/promotions" target="_blank" rel="noreferrer"><Image src={siteAsset('cms/promotion-cms/welcome_first_notification.webp')} alt="First Deposit bonus" width={608} height={180} unoptimized /><span><small>FIRST DEPOSIT BONUS</small><strong>100% UP TO 1000 EUR<br />+ 50 FS</strong></span></a>}
          {panel === 'support' && <div className="support-body"><small>Support Team</small><p className="support-message">Hi there! Let us know how we can assist you today ✨</p><DemoForm label="How may we assist?" button="Send" /></div>}
        </div>}
      </dialog>
    </div>
  </UI.Provider>;
}

function CookieNotice() {
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      try { setDismissed(localStorage.getItem('axebonanza-cookie-notice') === 'accepted'); } catch { /* Storage is optional. */ }
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  if (!ready || dismissed) return null;
  return <aside className="cookie-notice" aria-label="Cookie notice"><p>AxeBonanza Casino uses cookies to improve your experience. By using our website you are accepting our <a href="https://www.axecasino.com/cookie-policy" target="_blank" rel="noreferrer">Cookie policy.</a></p><button className="button primary small" onClick={() => { setDismissed(true); try { localStorage.setItem('axebonanza-cookie-notice', 'accepted'); } catch { /* Dismiss remains effective for this visit. */ } }}>Accept</button></aside>;
}

export function Hero() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setSlide(value => (value + 1) % promotions.length), 7000);
    return () => clearInterval(timer);
  }, [paused]);
  const choose = (index: number) => { setSlide((index + promotions.length) % promotions.length); setPaused(true); };
  return <section className="hero-carousel" aria-roledescription="carousel" aria-label="Promotions" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)}>
    <div className="hero-stage">
      {promotions.map((promo, index) => <div className={`hero-slide${index === slide ? ' active' : ''}`} aria-hidden={index !== slide} key={promo.image}>
        <picture>
          <source media="(max-width:559px)" srcSet={siteAsset(`cms/promo/main-banner-${promo.image}-mob.webp`)} />
          <img src={siteAsset(`cms/promo/main-banner-${promo.image}.webp`)} alt={promo.label} width={1520} height={736} loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} />
        </picture>
        <div className="hero-shade" />
        <div className="hero-copy"><span className="eyebrow">{promo.label}</span><h1 className={index !== slide ? 'inactive-heading' : ''}>{promo.title}</h1></div>
        <ActionButton action="signup" className="button green hero-cta" tabIndex={index === slide ? 0 : -1}>Sign Up</ActionButton>
      </div>)}
    </div>
    <button className="hero-arrow previous" aria-label="Previous promotion" onClick={() => choose(slide - 1)}><Icon name="arrowLeft" /></button>
    <button className="hero-arrow next" aria-label="Next promotion" onClick={() => choose(slide + 1)}><Icon name="arrowRight" /></button>
    <div className="hero-dots">{promotions.map((promo, index) => <button key={promo.image} className={index === slide ? 'active' : ''} aria-label={`Show ${promo.label}`} aria-pressed={index === slide} onClick={() => choose(index)} />)}</div>
    <div className="hero-progress"><span style={{ transform: `translateX(${slide * 100}%)` }} /></div>
  </section>;
}

export function Rail({ title, count, icon, category, children, tournament = false }: { title: string; count?: number; icon: string; category?: string; children: ReactNode; tournament?: boolean }) {
  const rail = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  function move(direction: number) {
    const element = rail.current;
    if (!element) return;
    const card = element.firstElementChild as HTMLElement | null;
    const distance = card ? card.offsetWidth + parseFloat(getComputedStyle(element).gap || '10') : 210;
    const end = element.scrollWidth - element.clientWidth;
    const next = element.scrollLeft + direction * distance;
    element.scrollTo({ left: next > end + 2 ? 0 : next < -2 ? end : next, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <section className={`game-section${tournament ? ' tournament-section' : ''}`} id={category || 'tournaments'}>
    <div className="section-heading"><h2><Icon name={icon} className="green-icon" />{title}{count !== undefined && <span>{count}</span>}</h2><div className="section-controls"><ActionButton action="search" category={category} className="button secondary small show-all">Show all</ActionButton>{!tournament && <div className="rail-arrows"><button className="button secondary square small" aria-label={`Previous ${title} games`} onClick={() => move(-1)}><Icon name="arrowLeft" /></button><button className="button secondary square small" aria-label={`Next ${title} games`} onClick={() => move(1)}><Icon name="arrowRight" /></button></div>}</div></div>
    <div className="rail-window"><div ref={rail} className={`card-rail${tournament ? ' tournament-rail' : ''}`} onScroll={() => { const element = rail.current; if (element) setProgress(element.scrollLeft / Math.max(1, element.scrollWidth - element.clientWidth)); }}>{children}</div></div>
    <div className="rail-progress"><span style={{ left: `${progress * 96}%` }} /></div>
  </section>;
}

export function WinnerList() {
  const winners = [
    { name: 'Shaun', amount: '8.84 CAD', game: 'Chicken Road 2.0', image: 'inout/ChickenRoad2' },
    { name: 'Benjamin', amount: '109.4 EUR', game: 'Big Bass Bonanza 1000', image: 'pragmaticexternal/BigBassBonanza1000' },
    { name: 'Julie', amount: '111 AUD', game: 'Good Girl Bad Girl 2', image: 'bsg/GoodGirlBadGirl2' },
    { name: 'Player', amount: '22.4 AUD', game: "Mummy’s Jewels 100", image: 'pragmaticexternal/MummysJewels100' },
  ];
  return <aside className="winners"><h2><Icon name="trophy" className="green-icon" />Latest Winners</h2><div className="winner-list">{winners.map(winner => <ActionButton className="winner-card" action="login" key={winner.image}><Image src={`/reference/cdn/axecasino/i/s3/${winner.image}.webp`} alt="" width={72} height={72} unoptimized /><span><span className="winner-name">{winner.name}</span><strong>{winner.amount}</strong><span className="winner-game">in <b>{winner.game}</b></span></span></ActionButton>)}</div><div className="rail-progress"><span /></div></aside>;
}

function Search({ initialTab, category }: { initialTab: string; category: string }) {
  const [tab, setTab] = useState(initialTab);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(category);
  const source = activeCategory === 'all' ? allGames : categories.find(item => item.id === activeCategory)?.games ?? allGames;
  const games = source.filter(item => `${item.name} ${item.provider}`.toLowerCase().includes(query.toLowerCase()));
  const providers = [...new Set(allGames.map(game => game.provider))].filter(name => name.toLowerCase().includes(query.toLowerCase()));
  const matchingCategories = filters.filter(([, name]) => name.toLowerCase().includes(query.toLowerCase()));
  return <div className="search-content">
    <label className="search-input"><Icon name="search" /><input type="search" aria-label="Find your game" placeholder="Find your game" value={query} onChange={event => setQuery(event.target.value)} /></label>
    <div className="search-tabs" role="tablist" aria-label="Search types">{[['games', 'Games', query ? games.length : 16429], ['categories', 'Categories', query ? matchingCategories.length : 22], ['providers', 'Providers', query ? providers.length : 123]].map(([id, name, count]) => <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(String(id))}>{name}<span>{count}</span></button>)}</div>
    <div className="search-results" role="tabpanel" aria-label={tab}>
      {tab === 'games' && <><h3>{query ? 'Results' : category === 'all' ? 'Trending' : categories.find(item => item.id === category)?.title ?? 'Games'}</h3>{games.length ? games.map(game => <a className="search-game" href={accountUrl} rel="noreferrer" key={game.id}><Image src={gameImage(game)} alt="" width={60} height={60} unoptimized /><span><strong>{game.name}</strong><small>{game.provider}</small></span></a>) : <p className="empty-results">No games found. Try another search.</p>}</>}
      {tab === 'categories' && <div className="result-grid">{matchingCategories.map(([id, name, icon]) => <button key={id} onClick={() => { setActiveCategory(id); setQuery(''); setTab('games'); }}><ColorIcon name={icon} />{name}</button>)}</div>}
      {tab === 'providers' && <div className="result-grid">{providers.map(name => <button key={name} onClick={() => { setActiveCategory('all'); setQuery(name); setTab('games'); }}>{name}<small>{allGames.filter(game => game.provider === name).length}</small></button>)}</div>}
    </div>
  </div>;
}

function DemoForm({ label, button }: { label: string; button: string }) {
  const [submitted, setSubmitted] = useState(false);
  return <form className="demo-form" onSubmit={event => { event.preventDefault(); event.currentTarget.reset(); setSubmitted(true); }}><label className="field">{label}<input required type={label === 'Email' ? 'email' : 'text'} autoComplete="off" /></label><button className="button primary" type="submit">{button}</button>{submitted && <p className="form-message" role="status">This is a local educational demo. Your message has not been sent.</p>}</form>;
}

function Languages() {
  const [selected, setSelected] = useState('English');
  return <div className="language-list">{['English', 'German', 'English - Australia', 'English - Canada', 'English - New Zealand', 'French - Canada', 'Norwegian', 'Italian - Switzerland'].map(language => <button key={language} className={selected === language ? 'selected' : ''} onClick={() => setSelected(language)}>{language === 'English' && <Image src="/reference/cdn/i/flags/square/en.svg" alt="" width={28} height={28} unoptimized />}{language}</button>)}<p className="language-note">This homepage recreation is available in English.</p></div>;
}
