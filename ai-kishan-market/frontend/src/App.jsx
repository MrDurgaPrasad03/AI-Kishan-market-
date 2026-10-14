import { useEffect, useState } from 'react';
import { Sprout, Search, MapPin, TrendingUp, ShoppingBasket, ArrowUpRight, Leaf, ShieldCheck } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const fallbackCrops = [
  { id: 1, name: 'Tomatoes', variety: 'Fresh harvest', pricePerQuintal: 1800, quantityQuintals: 24, location: 'Kakinada, Andhra Pradesh', emoji: '🍅', tag: 'Popular' },
  { id: 2, name: 'Paddy', variety: 'Grade A', pricePerQuintal: 2320, quantityQuintals: 80, location: 'Rajahmundry, Andhra Pradesh', emoji: '🌾', tag: 'High demand' },
  { id: 3, name: 'Chilli', variety: 'Red chilli', pricePerQuintal: 9400, quantityQuintals: 12, location: 'Guntur, Andhra Pradesh', emoji: '🌶️', tag: 'New listing' },
  { id: 4, name: 'Bananas', variety: 'Fresh bunches', pricePerQuintal: 1600, quantityQuintals: 35, location: 'Amalapuram, Andhra Pradesh', emoji: '🍌', tag: 'Fresh today' }
];

export default function App() {
  const [crops, setCrops] = useState(fallbackCrops);
  const [search, setSearch] = useState('');
  const [apiStatus, setApiStatus] = useState('sample');

  useEffect(() => {
    fetch(`${API}/api/crops`)
      .then(r => { if (!r.ok) throw new Error('API unavailable'); return r.json(); })
      .then(data => { if (Array.isArray(data) && data.length) setCrops(data); setApiStatus('connected'); })
      .catch(() => setApiStatus('sample'));
  }, []);

  const filtered = crops.filter(c => `${c.name} ${c.location} ${c.variety || ''}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-icon"><Sprout size={23}/></span><span>Kishan<span className="brand-accent">Market</span><small>GROW TOGETHER</small></span></a>
        <nav><a className="active" href="#market">Marketplace</a><a href="#advisor">AI Price Advisor</a><a href="#how">How it works</a></nav>
        <button className="outline-button" onClick={() => alert('Farmer registration will be added in the next milestone.')}>Join as farmer</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Leaf size={15}/> FARM FRESH. FAIR PRICES.</div>
            <h1>From your field<br/>to the <em>right buyer.</em></h1>
            <p>A simpler way for farmers to reach buyers, compare offers and make more informed selling decisions.</p>
            <div className="hero-actions"><a className="primary-button" href="#market">Explore crops <ArrowUpRight size={17}/></a><a className="text-link" href="#how">How it works <span>→</span></a></div>
            <div className="trust-row"><span><ShieldCheck size={16}/> Transparent listings</span><span><Sprout size={16}/> Farmer-first</span></div>
          </div>
          <div className="hero-art" aria-label="Illustration of farm fields">
            <div className="sun"></div><div className="hill hill-back"></div><div className="hill hill-front"></div>
            <div className="farm-label"><span className="live-dot"></span> Connecting local farms</div>
            <div className="floating-note"><span>🌱</span><div><strong>Harvest to market</strong><small>One listing at a time</small></div></div>
          </div>
        </section>

        <section className="stats" aria-label="Platform highlights">
          <div><span className="stat-icon"><ShoppingBasket size={20}/></span><strong>Direct marketplace</strong><small>Farmer-to-buyer listings</small></div>
          <div><span className="stat-icon"><TrendingUp size={20}/></span><strong>Price insights</strong><small>Compare selling options</small></div>
          <div><span className="stat-icon"><ShieldCheck size={20}/></span><strong>Clear offers</strong><small>Track bids and orders</small></div>
        </section>

        <section className="market-section" id="market">
          <div className="section-heading"><div><div className="eyebrow">THE MARKETPLACE</div><h2>Fresh from the farm</h2><p>Explore crop listings and find produce for your next purchase.</p></div><div className="search-box"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crops or location..." aria-label="Search crops or location"/></div></div>
          <div className="connection-note">{apiStatus === 'connected' ? 'Connected to Spring Boot API' : 'Preview mode · showing sample listings until the API is connected'}</div>
          <div className="crop-grid">{filtered.map(c => <article className="crop-card" key={c.id}><div className={`crop-picture crop-${c.id % 4}`}><span className="crop-emoji">{c.emoji || '🌱'}</span><span className="crop-tag">{c.tag || 'Available'}</span></div><div className="crop-content"><div className="crop-title"><div><h3>{c.name}</h3><p>{c.variety || 'Fresh produce'}</p></div><span className="arrow-circle"><ArrowUpRight size={17}/></span></div><div className="crop-location"><MapPin size={14}/>{c.location || 'Location not specified'}</div><div className="crop-bottom"><div><strong>₹{Number(c.pricePerQuintal || 0).toLocaleString('en-IN')}</strong><small>per quintal · sample price</small></div><button onClick={() => alert('Offer submission will be available after buyer accounts and bidding APIs are implemented.')}>View details</button></div></div></article>)}</div>
          {filtered.length === 0 && <div className="empty-state">No matching crops. Try another crop name or location.</div>}
        </section>

        <section className="advisor" id="advisor"><div className="advisor-symbol">✳</div><div><div className="eyebrow">COMING IN THE NEXT PHASE</div><h2>Sell with more insight.</h2><p>Our planned AI Mandi Price Advisor will compare market observations, estimate transport costs and help you review potential net proceeds.</p></div><div className="advisor-pill">AI PRICE ADVISOR <ArrowUpRight size={16}/></div></section>

        <section className="how-section" id="how"><div className="eyebrow">SIMPLE BY DESIGN</div><h2>A better way to trade crops.</h2><div className="steps"><div><span>01</span><h3>Farmers list</h3><p>Add crop details, quantity, location and an asking price.</p></div><div><span>02</span><h3>Buyers compare</h3><p>Review available produce and submit offers.</p></div><div><span>03</span><h3>Agree and track</h3><p>Accept an offer and follow the order status.</p></div></div></section>
      </main>
      <footer><a className="brand footer-brand" href="#"><span className="brand-icon"><Sprout size={20}/></span><span>Kishan<span className="brand-accent">Market</span></span></a><span>Built for a fairer farm-to-market journey.</span><span className="footer-status"><span className="live-dot"></span> Development preview</span></footer>
    </div>
  );
}
