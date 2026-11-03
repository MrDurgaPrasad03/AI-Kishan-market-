# 🌾 AI Kishan Market

### Smart Agricultural Marketplace Connecting Farmers and Customers

AI Kishan Market is a full-stack agricultural marketplace designed to connect farmers directly with customers. The platform helps farmers list their agricultural products, enables customers to browse and purchase crops, and provides administrators with tools to manage marketplace operations.

## 🚀 Key Features

### 👨‍🌾 Farmer Module
- Farmer registration and login.
- Farmer profile management.
- Add, update, and manage crop listings.
- Manage crop quantities and prices.
- View and manage customer orders.

### 🛒 Customer Module
- Customer registration and login.
- Browse available agricultural products.
- View crop details and prices.
- Add products to cart.
- Place and track orders.
- View customer profile and order history.

### 🛡️ Admin Dashboard
- Secure admin authentication using JWT.
- Dashboard statistics for farmers, customers, crops, and orders.
- Dashboard analytics and revenue summaries.
- Farmer management.
- Customer management.
- Order management and status updates.
- Crop management.
- Order search, filtering, and CSV export.

### 🤖 AI Mandi Price Advisor
- Crop selection.
- Quantity-based revenue calculation.
- Market price input.
- Transportation cost calculation.
- Estimated gross revenue.
- Estimated net earnings.
- Break-even price calculation.

**Note:** The current Price Advisor is a calculation-based tool using user-entered values. Live mandi price integration and machine-learning predictions are future enhancements.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML5, CSS3 |
| Build Tool | Vite |
| Backend | Java, Spring Boot |
| Security | Spring Security, JWT |
| Database | MySQL |
| API | RESTful APIs |
| Build Management | Maven, npm |
| Version Control | Git, GitHub |

## 📂 Project Structure

```text
ai-kishan-market/
│
├── backend/
│   └── src/
│       └── main/
│           └── java/
│               └── com/kishanmarket/
│                   ├── admin/
│                   ├── auth/
│                   ├── config/
│                   └── customer/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
│
├── docs/
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following tools:

- Java JDK
- Apache Maven
- Node.js and npm
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/MrDurgaPrasad03/AI-Kishan-market-.git
```

```bash
cd AI-Kishan-market-/ai-kishan-market
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Configure your database connection and application secrets in your local Spring Boot configuration.

Start the backend:

```bash
mvn spring-boot:run
```

The backend is configured to run on:

```text
http://localhost:8080
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Open the local URL displayed by Vite, typically:

```text
http://localhost:5173
```

## 🔐 Security

- JWT-based authentication.
- Spring Security integration.
- Protected administrative APIs.
- Environment-based configuration recommended for sensitive credentials.
- Passwords, API keys, and database secrets should never be committed to GitHub.

## 🔮 Future Enhancements

- Live agricultural market price integration.
- Machine-learning-based crop price prediction.
- AI-powered crop recommendations.
- Weather-based agricultural insights.
- Online payment gateway integration.
- Cloud deployment and monitoring.

## 👨‍💻 Project Information

**Project Name:** AI Kishan Market

**Category:** Full-Stack Web Application

**Domain:** Agriculture Technology (AgriTech)

**Repository:** [GitHub – AI Kishan Market](https://github.com/MrDurgaPrasad03/AI-Kishan-market-)

## 📌 Project Status

Active Development.

---

**AI Kishan Market – Empowering Farmers Through Technology.** 🌱
