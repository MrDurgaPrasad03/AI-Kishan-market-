
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
 // Admin account state (new functionality)
const [showAdminLogin, setShowAdminLogin] = useState(false);
const [adminToken, setAdminToken] = useState(
  localStorage.getItem('adminToken') || ''
);
const [adminError, setAdminError] = useState('');
const [adminUser, setAdminUser] = useState(null);
// Admin dashboard statistics - new functionality
const [adminStats, setAdminStats] = useState({
  totalFarmers: 0,
  totalCustomers: 0,
  totalCrops: 0,
  totalOrders: 0,
  completedOrders: 0,
  pendingOrders: 0,
  completedRevenue: 0,
});
const [showCustomerAccount, setShowCustomerAccount] = useState(false);
const [adminStatsLoading, setAdminStatsLoading] = useState(false);
const [adminStatsError, setAdminStatsError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [editingCrop, setEditingCrop] = useState(null);
  const [editError, setEditError] = useState('');
  const [showFarmerAccount, setShowFarmerAccount] = useState(false);
 
  const [customerProfile, setCustomerProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [customerToken, setCustomerToken] = useState('');
  const [customerAuthError, setCustomerAuthError] = useState('');
  const [customerAuthMode, setCustomerAuthMode] = useState('login');
  const [customerTab, setCustomerTab] = useState('profile');
  const [cartItems, setCartItems] = useState([]);
const [cartLoading, setCartLoading] = useState(false);
const [cartError, setCartError] = useState('');
   
const [customerOrders, setCustomerOrders] = useState([]);
const [ordersLoading, setOrdersLoading] = useState(false);
const [ordersError, setOrdersError] = useState('');

const [checkoutLoading, setCheckoutLoading] = useState(false);
const [checkoutMessage, setCheckoutMessage] = useState('');
const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
const [selectedRole, setSelectedRole] = useState(null);

  const loadCustomerProfile = async () => {
    const token = localStorage.getItem("customerToken");

    if (!token) {
      setProfileError("Please log in as a customer.");
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError("");

      const response = await fetch(
        "http://localhost:8080/api/customer/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load customer profile.");
      }

      const data = await response.json();
      setCustomerProfile(data);
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setProfileLoading(false);
    }
  };
  const addToCustomerCart = async (crop) => {
  const token = localStorage.getItem('customerToken');

  if (!token) {
    alert('Please log in as a customer to add crops to cart.');
    return;
  }

  try {
    const response = await fetch(`${API}/api/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cropId: crop.id,
        quantity: 1,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Unable to add crop to cart.');
    }

    alert(`${crop.name} added to your cart successfully!`);

    await loadCustomerCart();
  } catch (error) {
    alert(error.message);
  }
};

  const loadCustomerCart = async () => {
  const token = localStorage.getItem('customerToken');

  if (!token) {
    setCartError('Please log in as a customer.');
    return;
  }

  try {
    setCartLoading(true);
    setCartError('');

    const response = await fetch(`${API}/api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Unable to load cart.');
    }

    const data = await response.json();
    setCartItems(data);
  } catch (error) {
    setCartError(error.message);
  } finally {
    setCartLoading(false);
  }
};

const loadCustomerOrders = async () => {
  const token = localStorage.getItem('customerToken');

  if (!token) {
    setOrdersError('Please log in as a customer.');
    return;
  }

  try {
    setOrdersLoading(true);
    setOrdersError('');

    const response = await fetch(`${API}/api/orders/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Unable to load your orders.');
    }

    const data = await response.json();
    setCustomerOrders(data);

  } catch (error) {
    setOrdersError(error.message);
  } finally {
    setOrdersLoading(false);
  }
};

const updateCartQuantity = async (item, newQuantity) => {
  if (newQuantity < 1) {
    return;
  }

  if (newQuantity > Number(item.availableQuantity)) {
    alert(`Only ${item.availableQuantity} units are available.`);
    return;
  }

  const token = localStorage.getItem('customerToken');

  try {
    const response = await fetch(
      `${API}/api/cart/items/${item.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || 'Unable to update quantity.'
      );
    }

    await loadCustomerCart();
  } catch (error) {
    alert(error.message);
  }
};


const handleCheckout = async () => {
  const token = localStorage.getItem('customerToken');

  if (!token) {
    alert('Please log in as a customer.');
    return;
  }

  if (cartItems.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  if (!window.confirm('Are you sure you want to place this order?')) {
    return;
  }

  try {
    setCheckoutLoading(true);
    setCheckoutMessage('');

    const response = await fetch(`${API}/api/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentMethod: paymentMethod,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
        result.error ||
        'Checkout failed.'
      );
    }

    setCheckoutMessage(
      `Order #${result.id} placed successfully!`
    );

    await loadCustomerCart();
    await loadCustomerOrders();

    setCustomerTab('orders');

  } catch (error) {
    alert(error.message);
  } finally {
    setCheckoutLoading(false);
  }
};


const removeCartItem = async (itemId) => {
  const token = localStorage.getItem('customerToken');

  if (!token) {
    alert('Please log in as a customer.');
    return;
  }

  if (!window.confirm('Are you sure you want to remove this crop?')) {
    return;
  }

  try {
    const response = await fetch(
      `${API}/api/cart/items/${itemId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Unable to remove item from cart.');
    }

    await loadCustomerCart();
  } catch (error) {
    alert(error.message);
  }
};

async function handleCustomerAuth(event, mode) {
  event.preventDefault();
  setCustomerAuthError('');

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
    const response = await fetch(
      `${API}/api/customer/auth/${mode}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Customer authentication failed.');
    }

   if (mode === 'login') {
  setCustomerToken(result.token);
  localStorage.setItem('customerToken', result.token);
  setCustomerAuthError('');

  await loadCustomerProfile();

  form.reset();
} else {
      setCustomerAuthError('Registration successful. Please log in.');
      setCustomerAuthMode('login');
      form.reset();
    }
  } catch (error) {
    setCustomerAuthError(error.message);
  }
}
  // Keep all your remaining existing functions here
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
      localStorage.setItem('farmerToken', result.token);
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
// Admin login (new functionality)
async function handleAdminLogin(event) {
  event.preventDefault();
  setAdminError('');

  const form = event.currentTarget;
  const data = new FormData(form);

  const payload = {
    email: String(data.get('email') || '').trim(),
    password: String(data.get('password') || ''),
  };

  try {
    const response = await fetch(`${API}/api/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Admin login failed.');
    }

    if (!result.token) {
      throw new Error('Admin login response did not contain a token.');
    }

    localStorage.setItem('adminToken', result.token);
    setAdminToken(result.token);
    setAdminUser({ email: payload.email });
    setAdminError('');
    form.reset();
  } catch (error) {
    setAdminError(error.message || 'Unable to connect to the server.');
  }
}
// Load Admin Dashboard Statistics - new functionality
async function loadAdminStats() {
  if (!adminToken) return;

  setAdminStatsLoading(true);
  setAdminStatsError('');

  try {
    const headers = {
      Authorization: `Bearer ${adminToken}`,
      Accept: 'application/json',
    };

    // Fetch dashboard counts and orders
    const [statsResponse, ordersResponse] = await Promise.all([
      fetch(`${API}/api/admin/dashboard/stats`, { headers }),
      fetch(`${API}/api/admin/orders`, { headers }),
    ]);

    const stats = await statsResponse.json();
    const orders = await ordersResponse.json();

    if (!statsResponse.ok) {
      throw new Error(
        stats.message || 'Unable to load dashboard statistics.'
      );
    }

    if (!ordersResponse.ok) {
      throw new Error(
        orders.message || 'Unable to load admin orders.'
      );
    }

    if (!Array.isArray(orders)) {
      throw new Error('Unexpected response from Admin Orders API.');
    }

    const completedOrders = orders.filter(
      (order) => order.status === 'COMPLETED'
    );

    const pendingOrders = orders.filter(
      (order) =>
        ['PENDING', 'PLACED', 'PROCESSING'].includes(order.status)
    );

    const completedRevenue = completedOrders.reduce(
      (total, order) => total + Number(order.totalAmount || 0),
      0
    );

    setAdminStats({
      totalFarmers: stats.totalFarmers ?? 0,
      totalCustomers: stats.totalCustomers ?? 0,
      totalCrops: stats.totalCrops ?? 0,
      totalOrders: stats.totalOrders ?? 0,
      completedOrders: completedOrders.length,
      pendingOrders: pendingOrders.length,
      completedRevenue,
    });
  } catch (error) {
    setAdminStatsError(
      error.message || 'Unable to load dashboard statistics.'
    );
  } finally {
    setAdminStatsLoading(false);
  }
}// Automatically load statistics after Admin Login
useEffect(() => {
  if (adminToken) {
    loadAdminStats();
  }
}, [adminToken]);
const loadFarmerOrders = async () => {
  const token = localStorage.getItem('farmerToken');

  if (!token) {
    console.error('Farmer token not found. Please log in.');
    return;
  }

  try {
    const response = await fetch(`${API}/api/farmer/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    console.log('Farmer Orders API Status:', response.status);
    console.log('Farmer Orders API Response:', data);
  } catch (error) {
    console.error('Farmer Orders API Error:', error);
  }
};


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
          <button
  className="outline-button"
  onClick={() => {
  setShowCustomerAccount(true);

  setTimeout(() => {
    document.getElementById('customer-account')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, 100);
}}
>
  Customer Login
</button>
       
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
<button
  type="button"
  className="outline-button"
 onClick={() => {
  window.location.href = '/admin-login-test.html';
    setTimeout(() => {
      document.getElementById('admin-login')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }}
>
  <ShieldCheck size={16} /> Admin Login
</button>
</nav>
      </header>

      <main id="top">
        {/* ROLE SELECTION SCREEN */}

        

{/* FARMER ACCOUNT */}
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
        <input name="password" type="password" required minLength={8} maxLength={72} />
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
{/* ADMIN LOGIN - new section only */}
{showAdminLogin && !adminToken && (
  <section className="auth-panel" id="admin-login">
    <h2>Admin Login</h2>
    <p>Log in to manage the Kishan Market platform.</p>

    <form onSubmit={handleAdminLogin}>
      <label>
        Admin Email
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </label>

      {adminError && (
        <p role="alert">{adminError}</p>
      )}

      <button type="submit">Login as Admin</button>

      <button
        type="button"
        className="outline-button"
        onClick={() => {
          setShowAdminLogin(false);
          setAdminError('');
        }}
      >
        Close
      </button>
    </form>
  </section>
)}

{/* ADMIN DASHBOARD - new section only */}
{adminToken && (
  <section className="auth-panel" id="admin-dashboard">
    <h2>Welcome to Admin Dashboard</h2>

    <p>
      Logged in as <strong>{adminUser?.email || 'Administrator'}</strong>
    </p>

    <p>Admin access is active.</p>
    {/* ADMIN DASHBOARD STATISTICS - new functionality */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '16px',
  margin: '24px 0'
}}>

  {[
    { label: 'Total Farmers', value: adminStats.totalFarmers, icon: '👨‍🌾' },
    { label: 'Total Customers', value: adminStats.totalCustomers, icon: '👥' },
    { label: 'Total Crops', value: adminStats.totalCrops, icon: '🌾' },
    { label: 'Total Orders', value: adminStats.totalOrders, icon: '📦' },
    { label: 'Completed Orders', value: adminStats.completedOrders, icon: '✅' },
    { label: 'Pending Orders', value: adminStats.pendingOrders, icon: '⏳' },
    {
      label: 'Completed Order Revenue',
      value: `₹${adminStats.completedRevenue.toLocaleString('en-IN')}`,
      icon: '💰'
    },
  ].map((stat) => (
    <div
      key={stat.label}
      style={{
        padding: '20px',
        background: '#f0f7f1',
        border: '1px solid #dceadd',
        borderRadius: '12px',
      }}
    >
      <div style={{ fontSize: '25px' }}>{stat.icon}</div>
      <p style={{ margin: '10px 0', color: '#555' }}>
        {stat.label}
      </p>
      <h2 style={{ margin: 0, color: '#176b3a' }}>
        {adminStatsLoading ? 'Loading...' : stat.value}
      </h2>
    </div>
  ))}

</div>

{adminStatsError && (
  <p role="alert" style={{ color: 'red' }}>
    {adminStatsError}
  </p>
)}

<button
  type="button"
  onClick={loadAdminStats}
  disabled={adminStatsLoading}
>
  {adminStatsLoading ? 'Refreshing...' : 'Refresh Statistics'}
</button>
    <button
      type="button"
      onClick={() => {
        localStorage.removeItem('adminToken');
        setAdminToken('');
        setAdminUser(null);
        setAdminError('');
        setShowAdminLogin(false);
      }}
    >
      Admin Logout
    </button>
  </section>
)}
{/* CUSTOMER ACCOUNT */}
{showCustomerAccount && !customerToken && (
  <section className="auth-panel" id="customer-account">
    <h2>Customer Account</h2>
    <p>Register or log in to purchase crops.</p>

    <form onSubmit={(event) => handleCustomerAuth(event, 'register')}>
      <h3>Customer Registration</h3>
      <label>
        Full Name
        <input name="fullName" required maxLength={100} />
      </label>
      <label>
        Email
        <input name="email" type="email" required maxLength={150} />
      </label>
      <label>
        Password
        <input name="password" type="password" required minLength={8} maxLength={72} />
      </label>
      <button type="submit">Register as Customer</button>
    </form>

    <form onSubmit={(event) => handleCustomerAuth(event, 'login')}>
      <h3>Customer Login</h3>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" required />
      </label>
      <button type="submit">Login as Customer</button>
    </form>

    {customerAuthError && <p role="alert">{customerAuthError}</p>}
  </section>
)}
{/* CUSTOMER DASHBOARD */}
{customerToken && (
  <section className="auth-panel" id="customer-dashboard">
    <h2>Welcome to Customer Dashboard</h2>

    <nav className="customer-navigation">
      <button onClick={() => setCustomerTab('profile')}>
        My Profile
      </button>

      <button onClick={() => setCustomerTab('cart')}>
        My Cart
      </button>

      <button onClick={() => setCustomerTab('orders')}>
        My Orders
      </button>
    </nav>

    {customerTab === 'profile' && (
      <div>
        <h3>My Profile</h3>

        {profileLoading && <p>Loading profile...</p>}
        {profileError && <p role="alert">{profileError}</p>}

        {customerProfile && (
          <>
            <p>Name: {customerProfile.fullName}</p>
            <p>Email: {customerProfile.email}</p>
            <p>Customer ID: {customerProfile.id}</p>
            <p>Role: {customerProfile.role}</p>
          </>
        )}
      </div>
    )}

   
{customerTab === 'cart' && (
  <div className="customer-cart">
    <h3>My Shopping Cart</h3>

    <button type="button" onClick={loadCustomerCart}>
      Refresh Cart
    </button>

    {cartLoading && <p>Loading cart...</p>}
    {cartError && <p role="alert">{cartError}</p>}

    {!cartLoading && cartItems.length === 0 && (
      <p>Your cart is empty.</p>
    )}

    {cartItems.map((item) => (
      <div className="cart-item" key={item.id}>
        <h4>{item.cropName}</h4>

        <p>Farmer: {item.farmerName || 'Not provided'}</p>
        <p>Location: {item.location}</p>
        <p>Price: ₹{Number(item.price).toLocaleString('en-IN')}</p>

        <div className="cart-quantity">
          <button
            type="button"
            disabled={Number(item.quantity) <= 1}
            onClick={() =>
              updateCartQuantity(item, Number(item.quantity) - 1)
            }
          >
            -
          </button>

          <strong>{item.quantity}</strong>

          <button
            type="button"
            disabled={
              Number(item.quantity) >= Number(item.availableQuantity)
            }
            onClick={() =>
              updateCartQuantity(item, Number(item.quantity) + 1)
            }
          >
            +
          </button>
        </div>

        <p>Available: {item.availableQuantity}</p>

        <p>
          Subtotal: ₹
          {(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
        </p>

        <button
          type="button"
          className="remove-cart-button"
          onClick={() => removeCartItem(item.id)}
        >
          Remove
        </button>
      </div>
    ))}

    {!cartLoading && cartItems.length > 0 && (
      <div className="cart-total">
        <h3>
          Total Amount: ₹
          {cartItems.reduce(
            (total, item) =>
              total + Number(item.price) * Number(item.quantity),
            0
          ).toLocaleString('en-IN')}
        </h3>
      </div>
    )}
  </div>
)}

{cartItems.length > 0 && (
  <div className="checkout-section">
    <h3>Checkout</h3>

    <label htmlFor="paymentMethod">
      Select Payment Method
    </label>

    <select
      id="paymentMethod"
      value={paymentMethod}
      onChange={(event) => setPaymentMethod(event.target.value)}
    >
      <option value="CASH_ON_DELIVERY">
        Cash on Delivery
      </option>

      <option value="DIRECT_TO_FARMER">
        Direct to Farmer
      </option>
    </select>

    <button
      type="button"
      onClick={handleCheckout}
      disabled={checkoutLoading || cartLoading}
    >
      {checkoutLoading ? 'Placing Order...' : 'Place Order'}
    </button>

    {checkoutMessage && (
      <p role="status">{checkoutMessage}</p>
    )}
  </div>
)}


{customerTab === 'orders' && (
  <div className="customer-orders">
    <h3>My Orders</h3>

    <button
      type="button"
      onClick={loadCustomerOrders}
      disabled={ordersLoading}
    >
      Refresh Orders
    </button>

    {ordersLoading && <p>Loading orders...</p>}

    {ordersError && (
      <p role="alert">{ordersError}</p>
    )}

    {!ordersLoading &&
      customerOrders.length === 0 && (
        <p>You haven't placed any orders yet.</p>
      )}

    {customerOrders.map((order) => (
      <div className="order-card" key={order.id}>
        <h4>Order #{order.id}</h4>

        <p>
          Date: {new Date(order.createdAt).toLocaleString('en-IN')}
        </p>

        <p>
          Total: ₹
          {Number(order.totalAmount).toLocaleString('en-IN')}
        </p>

        <p>
          Payment: {order.paymentMethod?.replaceAll('_', ' ')}
        </p>

        <p>
          Payment Status: {order.paymentStatus}
        </p>

        <p>
          Order Status: {order.status}
        </p>
      </div>
    ))}
  </div>
)}

    <button
      type="button"
      onClick={() => {
        localStorage.removeItem('customerToken');
        setCustomerToken('');
        setCustomerProfile(null);
        setProfileError('');
        setCustomerTab('profile');
      }}
    >
      Logout
    </button>
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
   <button type="button" onClick={loadFarmerOrders}>
  Test Farmer Orders
</button>
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
   {customerToken && (
    <button
      type="button"
      onClick={() => addToCustomerCart(crop)}
    >
      Add to Cart
    </button>
  )}
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
  <div className="eyebrow">SMART FARMING ASSISTANT</div>
  <h2>🌾 AI Mandi Price Advisor</h2>
  <p>
    Estimate your crop revenue and potential earnings before selling.
  </p>

  <div className="advisor-calculator">
    <label>
      Select Crop
      <select id="advisorCrop">
        <option value="Rice">Rice</option>
        <option value="Paddy">Paddy</option>
        <option value="Tomato">Tomato</option>
        <option value="Onion">Onion</option>
        <option value="Potato">Potato</option>
        <option value="Chilli">Chilli</option>
        <option value="Maize">Maize</option>
      </select>
    </label>

    <label>
      Quantity (KG)
      <input id="advisorQuantity" type="number" min="1" placeholder="Enter quantity" />
    </label>

    <label>
      Market Price (₹ per KG)
      <input id="advisorPrice" type="number" min="0" step="0.01" placeholder="Enter price" />
    </label>

    <label>
      Transportation Cost (₹)
      <input id="advisorTransport" type="number" min="0" placeholder="Enter transport cost" />
    </label>

    <button type="button" onClick={() => {
      const crop = document.getElementById('advisorCrop').value;
      const quantity = Number(document.getElementById('advisorQuantity').value);
      const price = Number(document.getElementById('advisorPrice').value);
      const transport = Number(document.getElementById('advisorTransport').value);

      if (!Number.isFinite(quantity) || quantity <= 0 ||
          !Number.isFinite(price) || price <= 0 ||
          !Number.isFinite(transport) || transport < 0) {
        alert('Please enter valid quantity, market price and transportation cost.');
        return;
      }

      const gross = quantity * price;
      const net = gross - transport;

      document.getElementById('advisorResult').innerHTML = `
        <h3>Price Estimation Result</h3>
        <p>Crop: ${crop}</p>
        <p>Quantity: ${quantity.toLocaleString('en-IN')} KG</p>
        <p>Gross Revenue: ₹${gross.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
        <p>Transportation: ₹${transport.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
        <h3>Estimated Net Earnings: ₹${net.toLocaleString('en-IN', {maximumFractionDigits: 2})}</h3>
        <p>Estimated break-even price: ₹${(transport / quantity + price).toFixed(2)} per KG</p>
      `;
    }}>
      Calculate Crop Price
    </button>

    <div id="advisorResult" aria-live="polite"></div>
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
