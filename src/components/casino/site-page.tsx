import Image from 'next/image';
import Link from 'next/link';
import { ActionButton, CasinoUI } from './interactive';
import { Filters, Footer, Header, MobileNavigation, Sidebar } from './content';
import { allGames, categories, gameImage, siteAsset, type Game } from '@/data/casino';
import { infoPages, pageTitles } from '@/data/pages';

const pretty = (value: string) => decodeURIComponent(value).replace(/([a-z])([A-Z])/g,'$1 $2').replaceAll('_', ' ').replaceAll('-', ' ').replace(/\b\w/g, letter => letter.toUpperCase());

function Shell({ children }: { children: React.ReactNode }) {
  return <CasinoUI><Header/><Sidebar/><main id="main-content" className="main-content inner-main">{children}<Footer/></main><MobileNavigation/></CasinoUI>;
}

function PageHero({ title, eyebrow, image, children }: { title: string; eyebrow?: string; image?: string; children?: React.ReactNode }) {
  return <section className="inner-hero">{image&&<Image src={image} alt="" fill priority unoptimized sizes="(max-width: 833px) 100vw, 80vw"/>}<div className="inner-hero-shade"/><div className="inner-hero-copy">{eyebrow&&<span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{children}</div></section>;
}

function GridCard({ game }: { game: Game }) {
  return <article className="library-card"><Link href={`/game/${game.id}`}><Image src={gameImage(game)} alt={game.name} width={220} height={293} unoptimized/><span className="library-card-copy"><strong>{game.name}</strong><small>{game.provider}</small></span></Link><div className="library-card-action"><ActionButton action="login" className="button green">Play Now</ActionButton></div></article>;
}

function GameLibrary({ title, games = allGames }: { title: string; games?: Game[] }) {
  return <><PageHero title={title} eyebrow="AxeBonanza Casino" image={siteAsset('cms/promo/main-banner-live.webp')}><p>Explore the latest titles and discover a new favourite.</p></PageHero><div className="inner-content"><Filters/><div className="library-heading"><h2>{title}</h2><span>{games.length} featured games</span></div><div className="game-library">{games.map(game=><GridCard key={game.id} game={game}/>)}</div></div></>;
}

function PromotionsPage() {
  const cards=[{title:'Welcome Package',text:'Up to 3,750 EUR + 200 free spins',image:'cms/promo/main-banner-welcome.webp'},{title:'Daily Bonus',text:'Come back every day for more rewards',image:'cms/promo/main-banner-wins.webp'}];
  return <><PageHero title="Promotions" eyebrow="Rewards" image={siteAsset('cms/promo/main-banner-welcome.webp')}><p>Discover current AxeBonanza Casino offers.</p></PageHero><div className="inner-content promo-grid">{cards.map(card=><article className="promo-card" key={card.title}><Image src={siteAsset(card.image)} alt="" fill unoptimized sizes="(max-width: 767px) 100vw, 50vw"/><div><span className="eyebrow">Promotion</span><h2>{card.title}</h2><p>{card.text}</p><ActionButton action="signup" className="button green">Claim Offer</ActionButton></div></article>)}</div></>;
}

function MissionsPage() {
  const features=['Start your first quest','Play mini games','Fresh tasks every day','Visit the in-game store','Climb faster with missions','Reach higher ranks'];
  return <><PageHero title="Start your great journey in the world of games" eyebrow="Missions" image={siteAsset('cms/promo/main-banner-bgaming.webp')}><ActionButton action="signup" className="button green">Start your first quest</ActionButton></PageHero><div className="inner-content"><section className="mission-intro"><h2>Why do you need this?</h2><p>Complete quests, collect experience, unlock levels, and discover rewards through the AxeBonanza Casino missions experience.</p></section><div className="feature-grid">{features.map((title,index)=><article key={title}><span>{String(index+1).padStart(2,'0')}</span><h3>{title}</h3><p>Keep playing, complete the objective, and track progress from your missions dashboard.</p></article>)}</div><section className="split-callout"><div><span className="eyebrow">Mission categories</span><h2>Fresh ways to progress</h2><p>Daily activities and longer journeys make it easy to choose your next objective.</p></div><div><span className="eyebrow">In-game store</span><h2>Free spins and cash bonuses</h2><p>Use earned rewards to unlock new benefits as your level increases.</p></div></section></div></>;
}

function TournamentPage() {
  const items=[{title:'Drops & Wins',prize:'12,000,000 EUR',image:'cms/tournaments/lady.webp'},{title:'Weekly BGaming Tournament',prize:'875 EUR + 800 FS',image:'cms/tournaments/tournament_bgaming.webp'},{title:'Daily Free Spins Tournament',prize:'1210 FS',image:'cms/tournaments/tournament_daily.webp'}];
  return <><PageHero title="Tournaments" eyebrow="Compete for big wins" image={siteAsset('cms/tournaments/lady.webp')}/><div className="inner-content tournament-list">{items.map(item=><article key={item.title}><Image src={siteAsset(item.image)} alt="" fill unoptimized sizes="(max-width: 767px) 100vw, 33vw"/><div><span className="eyebrow">Tournament</span><h2>{item.title}</h2><small>Prize pool</small><strong>{item.prize}</strong><ActionButton action="signup" className="button green">Join Now</ActionButton></div></article>)}</div></>;
}

function VipPage() {
  const levels=['Bronze','Silver','Gold','Platinum','Diamond'];
  return <><PageHero title="Welcome to AxeBonanza Casino VIP" eyebrow="VIP" image={siteAsset('cms/promo/main-banner-vip.webp')}><p>Unlock personal rewards and better benefits as you move through the levels.</p><ActionButton action="signup" className="button green">Become a VIP</ActionButton></PageHero><div className="inner-content"><h2 className="content-title">VIP levels</h2><div className="vip-levels">{levels.map((level,index)=><article key={level}><span>{index+1}</span><h3>{level}</h3><p>Level rewards</p><strong>{index*5+5}%</strong></article>)}</div><section className="article-panel"><h2>All VIP benefits</h2><p>Dedicated offers, weekly rewards, personal support, faster progress, and level-based bonuses are presented in one simple loyalty experience.</p><ActionButton action="support" className="button primary">Any questions?</ActionButton></section></div></>;
}

function PaymentsPage() {
  const methods=['visa','mastercard','maestro','bankTransfer','interac','bitcoin','ethereumCpp','litecoin','xrpCpp','usdcCpp','dogecoin'];
  return <><PageHero title="Payments" eyebrow="Cashier"><p>Browse payment methods and processing information.</p></PageHero><div className="inner-content payment-grid">{methods.map(name=><article key={name}><Image src={siteAsset(`cms/payments/icons/${name}.svg`)} width={88} height={48} alt="" unoptimized/><h2>{pretty(name.replace('Cpp',''))}</h2><dl><div><dt>Deposit</dt><dd>Instant</dd></div><div><dt>Withdrawal</dt><dd>Up to 24h</dd></div><div><dt>Fee</dt><dd>0%</dd></div></dl><ActionButton action="login" className="button secondary">Continue</ActionButton></article>)}</div></>;
}

function SupportPage() {
  return <><PageHero title="How can we help?" eyebrow="Support"><p>Find answers or open the local support demo.</p></PageHero><div className="inner-content support-layout"><section className="article-panel"><h2>Contact form</h2><p>Our support interface is ready around the clock. This educational version keeps every message on your device and does not transmit it.</p><ActionButton action="support" className="button primary">Open Live Support</ActionButton></section><section className="article-panel"><h2>Popular topics</h2><div className="support-links"><Link href="/faq">Frequently asked questions</Link><Link href="/payments">Payments</Link><Link href="/responsible-gambling">Responsible gambling</Link><Link href="/complaints">Complaints</Link></div></section></div></>;
}

function InfoPage({ slug }: { slug: string }) {
  const title=pageTitles[slug]??pretty(slug);
  const sections=infoPages[slug]??[{title:'Information',body:'This AxeBonanza Casino page is available as part of the educational frontend recreation.'}];
  return <><PageHero title={title} eyebrow="AxeBonanza Casino" image={slug==='about-us'?siteAsset('cms/promo/main-banner-live.webp'):undefined}/><article className="inner-content legal-content">{sections.map(section=><section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}</article></>;
}

function GameDetail({ parts }: { parts: string[] }) {
  const id=parts.slice(1).join('/');
  const game=allGames.find(item=>item.id.toLowerCase()===id.toLowerCase())??allGames[0];
  const requested=pretty(parts.at(-1)??game.name);
  return <div className="game-detail"><div className="game-preview"><Image src={gameImage(game)} alt="" fill priority unoptimized sizes="420px"/><div><span className="eyebrow">{game.provider}</span><h1>{requested}</h1><p>Continue to the account page to play this game.</p><ActionButton action="login" className="button green">Play Now</ActionButton><ActionButton action="login" className="button secondary">Demo</ActionButton></div></div><section className="inner-content"><div className="library-heading"><h2>You may also like</h2></div><div className="game-library compact-library">{allGames.slice(0,6).map(item=><GridCard key={item.id} game={item}/>)}</div></section></div>;
}

export function SitePage({ parts }: { parts: string[] }) {
  const clean=parts.filter(Boolean);
  const locale=['de','en-AU','en-CA','en-NZ','fr-CA','no','it-CH','es'].includes(clean[0])?clean.slice(1):clean;
  const first=locale[0]??'all';
  let content:React.ReactNode;
  if(first==='game') content=<GameDetail parts={locale}/>;
  else if(first==='games'||first==='live') {
    const category=categories.find(item=>item.id===locale[1]);
    const provider=first==='games'&&locale[1]==='all'&&locale[2]?locale[2]:undefined;
    const providerGames=provider?allGames.filter(item=>item.provider.toLowerCase().replaceAll(' ','')===provider.toLowerCase().replaceAll('and','').replaceAll('+','')):undefined;
    content=<GameLibrary title={first==='live'?'Live Casino':provider?`${pretty(provider)} Games`:category?.title??pretty(locale[1]??'All Games')} games={providerGames?.length?providerGames:category?.games??allGames}/>;
  } else if(first==='promotions') content=<PromotionsPage/>;
  else if(first==='missions') content=<MissionsPage/>;
  else if(first==='tournaments') content=<TournamentPage/>;
  else if(first==='vip') content=<VipPage/>;
  else if(first==='payments') content=<PaymentsPage/>;
  else if(first==='support') content=<SupportPage/>;
  else content=<InfoPage slug={first}/>;
  return <Shell>{content}</Shell>;
}

export function titleForRoute(parts: string[]) {
  const clean=['de','en-AU','en-CA','en-NZ','fr-CA','no','it-CH','es'].includes(parts[0])?parts.slice(1):parts;
  if(clean[0]==='game') return pretty(clean.at(-1)??'Game');
  if(clean[0]==='games') return clean[2]?`${pretty(clean[2])} Games`:pretty(clean[1]??'All Games');
  if(clean[0]==='live') return 'Live Casino';
  return pageTitles[clean[0]]??pretty(clean[0]??'Casino');
}
