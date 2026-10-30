
import { useEffect, useState } from 'react';
import {
  Sprout,
  Search,
  MapPin,
  TrendingUp,
  ShoppingBasket,
  ArrowUpRight,
  Leaf,
  ShieldCheck,
  X,
  Plus,
  LoaderCircle,
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
function getAuthHeaders(authToken) {
  return {
    Authorization: `Bearer ${authToken}`,
  };
}
const fallbackCrops = [
  {
    id: 1,
    name: 'Tomatoes',
    variety: 'Fresh harvest',
    pricePerQuintal: 1800,
    quantityQuintals: 24,
    location: 'Kakinada, Andhra Pradesh',
    emoji: '🍅',
    tag: 'Popular',
  },
  {
    id: 2,
    name: 'Paddy',
    variety: 'Grade A',
    pricePerQuintal: 2320,
    quantityQuintals: 80,
    location: 'Rajahmundry, Andhra Pradesh',
    emoji: '🌾',
    tag: 'High demand',
  },
  {
    id: 3,
    name: 'Chilli',
    variety: 'Red chilli',
    pricePerQuintal: 9400,
    quantityQuintals: 12,
    location: 'Guntur, Andhra Pradesh',
    emoji: '🌶️',
    tag: 'New listing',
  },
  {
    id: 4,
    name: 'Bananas',
    variety: 'Fresh bunches',
    pricePerQuintal: 1600,
    quantityQuintals: 35,
    location: 'Amalapuram, Andhra Pradesh',
    emoji: '🍌',
    tag: 'Fresh today',
  },
];

const initialForm = {
  name: '',
  variety: '',
  price: '',
  quantity: '',
  location: '',
  farmerName: '',
  description: '',
};

function getCropEmoji(cropName) {
  const name = String(cropName || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  return cropEmojis[name] || '🌱';
}
const cropEmojis = {
  // Vegetables
  tomato: '🍅',
  potato: '🥔',
  onion: '🧅',
  carrot: '🥕',
  brinjal: '🍆',
  eggplant: '🍆',
  cabbage: '🥬',
  cauliflower: '🥦',
  broccoli: '🥦',
  spinach: '🥬',
  lettuce: '🥬',
  cucumber: '🥒',
  pumpkin: '🎃',
  bittergourd: '🥒',
  bitter_gourd: '🥒',
  bottle_gourd: '🥒',
  ridge_gourd: '🥒',
  okra: '🌱',
  ladyfinger: '🌱',
  beans: '🫛',
  peas: '🫛',
  green_peas: '🫛',
  capsicum: '🫑',
  bell_pepper: '🫑',
  chilli: '🌶️',
  chili: '🌶️',
  garlic: '🧄',
  ginger: '🫚',
  radish: '🥕',
  beetroot: '🫜',
  sweet_potato: '🍠',
  mushroom: '🍄',
  corn: '🌽',
  maize: '🌽',
  sweetcorn: '🌽',
  yam: '🍠',

  // Fruits
  apple: '🍎',
  green_apple: '🍏',
  banana: '🍌',
  mango: '🥭',
  orange: '🍊',
  grapes: '🍇',
  grape: '🍇',
  watermelon: '🍉',
  muskmelon: '🍈',
  melon: '🍈',
  pineapple: '🍍',
  strawberry: '🍓',
  blueberries: '🫐',
  blueberry: '🫐',
  cherry: '🍒',
  cherries: '🍒',
  peach: '🍑',
  pear: '🍐',
  coconut: '🥥',
  kiwi: '🥝',
  lemon: '🍋',
  lime: '🍋',
  papaya: '🥭',
  guava: '🍐',
  pomegranate: '🍎',
  jackfruit: '🍈',
  dragonfruit: '🐉',
  avocado: '🥑',
  fig: '🍈',
  sapota: '🥔',
  custard_apple: '🍈',
  amla: '🟢',
  dates: '🌴',

  // Grains and field crops
  paddy: '🌾',
  rice: '🌾',
  wheat: '🌾',
  barley: '🌾',
  oats: '🌾',
  ragi: '🌾',
  jowar: '🌾',
  bajra: '🌾',
  millet: '🌾',
  maize: '🌽',
  cotton: '🌱',
  sugarcane: '🎋',
  tobacco: '🌿',
  tea: '🍃',
  coffee: '☕',
  turmeric: '🟠',
  groundnut: '🥜',
  peanut: '🥜',
  soybean: '🫘',
  soyabean: '🫘',
  chickpea: '🫘',
  bengal_gram: '🫘',
  black_gram: '🫘',
  green_gram: '🫘',
  lentils: '🫘',
  pulses: '🫘',
  mustard: '🌼',
  sunflower: '🌻',
  sesame: '🌱',
  coriander: '🌿',
  cumin: '🌿',
  mint: '🌿',
  curry_leaves: '🌿',
  flowers: '🌸',
  marigold: '🌼',
  rose: '🌹',

  // Default
  default: '🌱',
}; 



export default function App() {
  const [crops, setCrops] = useState(fallbackCrops);
  const [myCrops, setMyCrops] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [apiStatus, setApiStatus] = useState('loading');
  
  const [authToken, setAuthToken] = useState('');
  const [authUser, setAuthUser] = useState(null);
  const [authError, setAuthError] = useState('');


  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [editingCrop, setEditingCrop] = useState(null);
  const [editError, setEditError] = useState('');
  const [showFarmerAccount, setShowFarmerAccount] = useState(false);
   

async function handleAuth(event, mode) {
  event.preventDefault();
  setAuthError('');

  const form = event.currentTarget;
  const data = new FormData(form);

  const payload = {
    email: String(data.get('email') || '').trim(),
    password: String(data.get('password') || ''),
  };

  if (mode === 'register') {
    payload.fullName = String(data.get('fullName') || '').trim();
  }

  try {
    const response = await fetch(`${API}/api/auth/${mode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let result = {};

    if (text) {
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(`Invalid server response (HTTP ${response.status}).`);
      }
    }

    if (!response.ok) {
      throw new Error(
        result.message ||
        result.error ||
        `Request failed with HTTP ${response.status}.`
      );
    }

    if (mode === 'login') {
      if (!result.token) {
        throw new Error('Login response did not contain a token.');
      }

      setAuthToken(result.token);
      setAuthUser({ email: payload.email });
      setAuthError('');
    } else {
      setAuthError('Registration successful. Please log in.');
      form.reset();
    }
  } catch (error) {
    setAuthError(error.message || 'Unable to connect to the server.');
  }
}


  async function loadCrops() {
    console.log('loadCrops() called');
    try {
      const response = await fetch(`${API}/api/crops`);

      if (!response.ok) {
        throw new Error(`Could not load crops (${response.status}).`);
      }

      const data = await response.json();
      console.log('Crops received from API:', data.length);
      console.table(data);

      if (!Array.isArray(data)) {
        throw new Error('The crop API returned an unexpected response.');
      }

      setCrops(
  data.map((crop) => ({
    ...crop,
    emoji: getCropEmoji(crop.name),
  }))
);
      setApiStatus('connected');
    } catch (error) {
      setApiStatus('sample');
      setFormError((current) => current || '');
      console.error('Unable to load crops:', error);
    }
  }

 useEffect(() => {
  loadCrops();
}, []);

useEffect(() => {
  if (authToken) {
    loadMyCrops();
  } else {
    setMyCrops([]);
  }
}, [authToken]);

  


async function loadMyCrops() {
  if (!authToken) {
    setMyCrops([]);
    return;
  }

  try {
    const response = await fetch(`${API}/api/crops/my`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
    });

    const text = await response.text();
    let data = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Invalid server response (${response.status}).`
        );
      }
    }

    if (!response.ok) {
      throw new Error(
        data.message || `Could not load your crops (${response.status}).`
      );
    }

    if (!Array.isArray(data)) {
      throw new Error('Unexpected response from My Listings API.');
    }
  console.log('My Listings API response:', data);

setMyCrops(
  data.map((crop) => ({
    ...crop,
    emoji: getCropEmoji(crop.name),
  }))
);
  } catch (error) {
    console.error('Unable to load your crops:', error);
  }
}


const filtered = crops
  .filter((crop) => {
    const matchesSearch = `${crop.name} ${crop.location} ${
      crop.variety || ''
    }`
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesLocation =
      selectedLocation === 'All Locations' ||
      crop.location?.toLowerCase() === selectedLocation.toLowerCase();

    return matchesSearch && matchesLocation;
  })
  .sort((a, b) => {
    if (sortBy === 'price-low') {
      return Number(a.pricePerQuintal ?? a.price ?? 0) -
        Number(b.pricePerQuintal ?? b.price ?? 0);
    }

    if (sortBy === 'price-high') {
      return Number(b.pricePerQuintal ?? b.price ?? 0) -
        Number(a.pricePerQuintal ?? a.price ?? 0);
    }

    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    }

    if (sortBy === 'newest') {
      return new Date(b.createdAt || b.created_at || 0).getTime() -
        new Date(a.createdAt || a.created_at || 0).getTime();
    }

    return 0;
  });
  function openFarmerForm() {
  setForm(initialForm);
  setFormError('');
  setFormSuccess('');
  setFormOpen(true);
}
async function handleDeleteCrop(crop) {
  if (!authToken) {
    alert('Please log in before deleting a crop.');
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete ${crop.name}?`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`${API}/api/crops/${crop.id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(authToken),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        `Delete failed (${response.status}): ${message}`
      );
    }

    setCrops((current) =>
      current.filter((item) => item.id !== crop.id)
    );
    await loadMyCrops();
  } catch (error) {
    alert(error.message || 'Unable to delete this crop.');
  }
}




async function handleSaveEdit(event) {
  event.preventDefault();
  if (!editingCrop) return;

  setEditError('');

  try {
    const response = await fetch(`${API}/api/crops/${editingCrop.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authToken),
      },
      body: JSON.stringify({
        name: editingCrop.name,
        location: editingCrop.location,
        price: Number(editingCrop.pricePerQuintal),
        quantity: Number(editingCrop.quantityQuintals),
        farmerName: editingCrop.farmerName || '',
        description: editingCrop.variety || editingCrop.description || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`Update failed (${response.status})`);
    }

    const updated = await response.json();

    // Keep the updated values consistent in both lists.
    const savedCrop = {
      ...editingCrop,
      ...updated,
      price: Number(editingCrop.pricePerQuintal),
      quantity: Number(editingCrop.quantityQuintals),
      pricePerQuintal: Number(editingCrop.pricePerQuintal),
      quantityQuintals: Number(editingCrop.quantityQuintals),
      emoji: getCropEmoji(editingCrop.name),
    };

    // Update public marketplace immediately.
    setCrops((current) =>
      current.map((item) =>
        String(item.id) === String(editingCrop.id)
          ? { ...item, ...savedCrop }
          : item
      )
    );

    // Update farmer's My Listings immediately.
    setMyCrops((current) =>
      current.map((item) =>
        String(item.id) === String(editingCrop.id)
          ? { ...item, ...savedCrop }
          : item
      )
    );

    setEditingCrop(null);
    setEditError('');

  } catch (error) {
    setEditError(error.message || 'Unable to update this crop.');
  }
}



  function closeFarmerForm() {
    if (submitting) return;
    setFormOpen(false);
    setFormError('');
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFormError('');
    setFormSuccess('');
  }

async function handleSubmit(event) {
  event.preventDefault();
  setFormError('');
  setFormSuccess('');

  const price = Number(form.price);
  const quantity = Number(form.quantity);

  if (!form.name.trim() || !form.location.trim()) {
    setFormError('Please enter the crop name and location.');
    return;
  }

  if (!Number.isFinite(price) || price <= 0) {
    setFormError('Enter a price greater than zero.');
    return;
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    setFormError('Enter a quantity greater than zero.');
    return;
  }

  if (!authToken) {
    setFormError('Please log in as a farmer before adding a crop.');
    return;
  }

  const payload = {
    name: form.name.trim(),
    location: form.location.trim(),
    price,
    quantity,
    farmerName: form.farmerName.trim(),
    description: form.description.trim() || form.variety.trim(),
  };

  setSubmitting(true);

  try {
    const response = await fetch(`${API}/api/crops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authToken),
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let savedCrop = {};

    if (text) {
      try {
        savedCrop = JSON.parse(text);
      } catch {
        throw new Error('Invalid server response.');
      }
    }

    if (!response.ok) {
      throw new Error(
        savedCrop.message ||
        savedCrop.error ||
        `Crop submission failed (${response.status}).`
      );
    }

    const newCrop = {
      ...savedCrop,
      name: savedCrop.name || payload.name,
      location: savedCrop.location || payload.location,
      price: savedCrop.price ?? price,
      quantity: savedCrop.quantity ?? quantity,
      pricePerQuintal:
        savedCrop.pricePerQuintal ?? savedCrop.price ?? price,
      quantityQuintals:
        savedCrop.quantityQuintals ?? savedCrop.quantity ?? quantity,
      farmerName: savedCrop.farmerName || payload.farmerName,
      variety: savedCrop.variety || savedCrop.description || payload.description,
      emoji: getCropEmoji(savedCrop.name || payload.name),
      tag: savedCrop.tag || 'New listing',
    };

    // Immediately update public marketplace.
    setCrops((current) => [newCrop, ...current]);

    // Immediately update farmer's My Listings.
    setMyCrops((current) => [newCrop, ...current]);

    setApiStatus('connected');
    setFormSuccess('Your crop listing was saved successfully.');
    setForm(initialForm);

    await loadCrops();
    await loadMyCrops();

  } catch (error) {
    console.error('Crop submission failed:', error);
    setFormError(error.message || 'Something went wrong.');
  } finally {
    setSubmitting(false);
  }
}


  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Kishan Market home">
          <span className="brand-icon">
            <Sprout size={23} />
          </span>
          <span>
            Kishan<span className="brand-accent">Market</span>
            <small>GROW TOGETHER</small>
          </span>
        </a>

        <nav>
          <a className="active" href="#market">Marketplace</a>
          <a href="#advisor">AI Price Advisor</a>
          <a href="#how">How it works</a>
        </nav>
      <button
  className="outline-button"
  onClick={() => {
    if (!authUser) {
      setShowFarmerAccount(true);
      setTimeout(() => {
        document.getElementById('farmer-account')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } else {
      openFarmerForm();
    }
  }}
>
  <Plus size={16} /> Join as farmer
</button>
      </header>

      <main id="top">
        
{!authUser && showFarmerAccount && (
  <section className="auth-panel" id="farmer-account">
    <h2>Farmer Account</h2>
    <p>Register a new account or log in to manage your listings.</p>

    <form onSubmit={(event) => handleAuth(event, 'register')}>
      <h3>Create Account</h3>

      <label>
        Full name
        <input name="fullName" required maxLength={100} />
      </label>

      <label>
        Email
        <input name="email" type="email" required maxLength={150} />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={72}
        />
      </label>

      <button type="submit">Register</button>
    </form>

    <form onSubmit={(event) => handleAuth(event, 'login')}>
      <h3>Already registered?</h3>

      <label>
        Email
        <input name="email" type="email" required />
      </label>

      <label>
        Password
        <input name="password" type="password" required />
      </label>

      <button type="submit">Log in</button>
    </form>

    {authError && <p role="alert">{authError}</p>}
  </section>
)}

{authUser && (
  <section className="auth-panel">
    <p>Logged in as <strong>{authUser.email}</strong></p>
    <button
      type="button"
      onClick={() => {
        setAuthToken('');
        setAuthUser(null);
        setAuthError('');
      }}
    >
      Log out
    </button>
  </section>
)}
{authUser && (<section className="market-section" id="my-listings">
    <div className="section-heading">
      <div>
        <span className="eyebrow">YOUR FARM</span>
        <h2>My Listings</h2>
        <p>Manage the crops you have listed for buyers.</p>
      </div>
    </div>

    {myCrops.length === 0 ? (
      <p>You haven't listed any crops yet.</p>
    ) : (
      <div className="crop-grid">
        {myCrops.map((crop) => (
          <article className="crop-card" key={crop.id}>
            <div className="crop-card-art">
              <span className="crop-emoji">
                {crop.emoji || getCropEmoji(crop.name)}
              </span>
            </div>

            <div className="crop-card-content">
              <span className="crop-tag">
                {crop.tag || 'Your listing'}
              </span>

              <h3>{crop.name}</h3>
              <p>{crop.variety || crop.description || 'Fresh produce'}</p>

              <p>
                {crop.location}
              </p>

              <h3>
                ₹{crop.pricePerQuintal ?? crop.price}
              </h3>
              <p>
                per quintal · listed price
              </p>

              <p>
                {crop.quantityQuintals ?? crop.quantity ?? '—'} quintals available
              </p>

              <div className="listing-actions">
<button
    type="button"
    onClick={() => {
      setEditError('');
      setEditingCrop({
        ...crop,
        pricePerQuintal: crop.pricePerQuintal ?? crop.price ?? '',
        quantityQuintals:
          crop.quantityQuintals ?? crop.quantity ?? '',
      });
    }}
>
    Edit
  </button>
                <button onClick={() => handleDeleteCrop(crop)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    )}
  </section>
)}

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <Leaf size={15} /> FARM FRESH. FAIR PRICES.
            </div>

            <h1>
              From your field
              <br />
              to the <em>right buyer.</em>
            </h1>

            <p>
              A simpler way for farmers to reach buyers, compare offers and
              make more informed selling decisions.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#market">
                Explore crops <ArrowUpRight size={17} />
              </a>
              <button className="text-link" onClick={openFarmerForm}>
                List your crop <span>→</span>
              </button>
            </div>

            <div className="trust-row">
              <span><ShieldCheck size={16} /> Transparent listings</span>
              <span><Sprout size={16} /> Farmer-first</span>
            </div>
          </div>

          <div className="hero-art" aria-label="Illustration of farm fields">
            <div className="sun" />
            <div className="hill hill-back" />
            <div className="hill hill-front" />
            <div className="farm-label">
              <span className="live-dot" /> Connecting local farms
            </div>
            <div className="floating-note">
              <span>🌱</span>
              <div>
                <strong>Harvest to market</strong>
                <small>One listing at a time</small>
              </div>
            </div>
          </div>
        </section>

        <section className="stats" aria-label="Platform highlights">
          <div>
            <span className="stat-icon"><ShoppingBasket size={20} /></span>
            <strong>Direct marketplace</strong>
            <small>Farmer-to-buyer listings</small>
          </div>
          <div>
            <span className="stat-icon"><TrendingUp size={20} /></span>
            <strong>Price insights</strong>
            <small>Compare selling options</small>
          </div>
          <div>
            <span className="stat-icon"><ShieldCheck size={20} /></span>
            <strong>Clear offers</strong>
            <small>Track bids and orders</small>
          </div>
        </section>

        <section className="market-section" id="market">
          <div className="section-heading">
            <div>
              <div className="eyebrow">THE MARKETPLACE</div>
              <h2>Fresh from the farm</h2>
              <p>Explore crop listings and find produce for your next purchase.</p>
            </div>

           
<div className="search-box">
  <Search size={18} />
  <input
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    placeholder="Search crops or location..."
    aria-label="Search crops or location"
  />
</div>

<div className="location-filter">
  <select
    value={selectedLocation}
    onChange={(event) => setSelectedLocation(event.target.value)}
    aria-label="Filter crops by location"
  >
    <option value="All Locations">All Locations</option>
    {[...new Set(crops.map((crop) => crop.location).filter(Boolean))]
      .sort()
      .map((location) => (
        <option key={location} value={location}>
          {location}
        </option>
      ))}
  </select>
</div>

          </div>

          <div className="connection-note">
            {apiStatus === 'connected'
              ? 'Connected to Spring Boot API · database-backed listings'
              : apiStatus === 'loading'
                ? 'Connecting to the crop API…'
                : 'API unavailable · showing sample listings'}
          </div>

          <div className="crop-grid">
            {filtered.map((crop) => (
              <article className="crop-card" key={crop.id}>
                <div className={`crop-picture crop-${crop.id % 4}`}>
                  <span className="crop-emoji">{crop.emoji || '🌱'}</span>
                  <span className="crop-tag">{crop.tag || 'Available'}</span>
                </div>

                <div className="crop-content">
                  <div className="crop-title">
                    <div>
                      <h3>{crop.name}</h3>
                      <p>{crop.variety || 'Fresh produce'}</p>
                    </div>
                    <span className="arrow-circle">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>

                  <div className="crop-location">
                    <MapPin size={14} /> {crop.location || 'Location not specified'}
                  </div>

                  <div className="crop-bottom">
                    <div>
                      <strong>
                        ₹{Number(crop.pricePerQuintal || 0).toLocaleString('en-IN')}
                      </strong>
                      <small>per quintal · listed price</small>
                      {crop.quantityQuintals != null && (
                        <small>{crop.quantityQuintals} quintals available</small>
                      )}
                    </div>
                   
<div className="crop-actions">
  <button
    type="button"
    onClick={() => {
      setEditError('');
      setEditingCrop({
        ...crop,
        pricePerQuintal: crop.pricePerQuintal ?? crop.price ?? '',
        quantityQuintals: crop.quantityQuintals ?? crop.quantity ?? '',
      });
    }}
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => handleDeleteCrop(crop)}
  >
    Delete
  </button>
</div>

                  </div>
                </div>
              </article>
            ))}
          </div>
              
{editingCrop && (
  <div className="edit-overlay">
    <form className="edit-form" onSubmit={handleSaveEdit}>
      <h2>Edit Crop Listing</h2>

      <label>
        Crop name
        <input
          required
          value={editingCrop.name || ''}
          onChange={(e) =>
            setEditingCrop({ ...editingCrop, name: e.target.value })
          }
        />
      </label>

      <label>
        Location
        <input
          required
          value={editingCrop.location || ''}
          onChange={(e) =>
            setEditingCrop({ ...editingCrop, location: e.target.value })
          }
        />
      </label>

      <label>
        Price per quintal (₹)
        <input
          type="number"
          min="0.01"
          step="0.01"
          required
          value={editingCrop.pricePerQuintal}
          onChange={(e) =>
            setEditingCrop({
              ...editingCrop,
              pricePerQuintal: e.target.value,
            })
          }
        />
      </label>

      <label>
        Quantity (quintals)
        <input
          type="number"
          min="0.01"
          step="0.01"
          required
          value={editingCrop.quantityQuintals}
          onChange={(e) =>
            setEditingCrop({
              ...editingCrop,
              quantityQuintals: e.target.value,
            })
          }
        />
      </label>

      <label>
        Description
        <textarea
          value={editingCrop.variety || editingCrop.description || ''}
          onChange={(e) =>
            setEditingCrop({ ...editingCrop, variety: e.target.value })
          }
        />
      </label>

      {editError && <p role="alert">{editError}</p>}

      <div className="crop-actions">
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => setEditingCrop(null)}>
          Cancel
        </button>
      </div>
    </form>
  </div>
)}


          {filtered.length === 0 && (
            <div className="empty-state">
              No matching crops. Try another crop name or location.
            </div>
          )}
        </section>

        <section className="advisor" id="advisor">
          <div className="advisor-symbol">✳</div>
          <div>
            <div className="eyebrow">COMING IN THE NEXT PHASE</div>
            <h2>Sell with more insight.</h2>
            <p>
              Our planned AI Mandi Price Advisor will compare market
              observations, estimate transport costs and help you review
              potential net proceeds.
            </p>
          </div>
          <div className="advisor-pill">
            AI PRICE ADVISOR <ArrowUpRight size={16} />
          </div>
        </section>

        <section className="how-section" id="how">
          <div className="eyebrow">SIMPLE BY DESIGN</div>
          <h2>A better way to trade crops.</h2>
          <div className="steps">
            <div>
              <span>01</span>
              <h3>Farmers list</h3>
              <p>Add crop details, quantity, location and an asking price.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Buyers compare</h3>
              <p>Review available produce and submit offers.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Agree and track</h3>
              <p>Accept an offer and follow the order status.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-icon"><Sprout size={20} /></span>
          <span>Kishan<span className="brand-accent">Market</span></span>
        </a>
        <span>Built for a fairer farm-to-market journey.</span>
        <span className="footer-status">
          <span className="live-dot" /> Development preview
        </span>
      </footer>

      {formOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeFarmerForm();
          }}
        >
          <section
            className="farmer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="farmer-modal-title"
          >
            <div className="modal-heading">
              <div>
                <div className="eyebrow">FARMER MARKETPLACE</div>
                <h2 id="farmer-modal-title">List your crop</h2>
                <p>Share your harvest details with potential buyers.</p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={closeFarmerForm}
                disabled={submitting}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="farmer-form">
              <label>
                Crop name *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Tomatoes"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Variety / grade
                <input
                  name="variety"
                  value={form.variety}
                  onChange={handleFormChange}
                  placeholder="e.g. Grade A"
                  maxLength={100}
                />
              </label>

              <div className="form-row">
                <label>
                  Price per quintal (₹) *
                  <input
                    name="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={handleFormChange}
                    placeholder="1800"
                    required
                  />
                </label>

                <label>
                  Quantity (quintals) *
                  <input
                    name="quantity"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.quantity}
                    onChange={handleFormChange}
                    placeholder="100"
                    required
                  />
                </label>
              </div>

              <label>
                Farm / market location *
                <input
                  name="location"
                  value={form.location}
                  onChange={handleFormChange}
                  placeholder="e.g. Kakinada, Andhra Pradesh"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Farmer name
                <input
                  name="farmerName"
                  value={form.farmerName}
                  onChange={handleFormChange}
                  placeholder="Your name"
                  maxLength={100}
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Describe the crop quality or harvest..."
                  rows={3}
                  maxLength={2000}
                />
              </label>

              {formError && (
                <p className="form-message form-error" role="alert">
                  {formError}
                </p>
              )}

              {formSuccess && (
                <p className="form-message form-success" role="status">
                  {formSuccess}
                </p>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="outline-button"
                  onClick={closeFarmerForm}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={17} className="spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Publish listing
                    </>
                  )}
                </button>
              </div>

              <small className="form-footnote">
                Required fields are marked with *. The listing is published
                only after the backend confirms it has been saved.
              </small>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
