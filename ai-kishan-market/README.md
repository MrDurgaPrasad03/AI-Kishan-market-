# 🌾 AI Kishan Market

**A Digital Marketplace Connecting Farmers Directly with Customers**

AI Kishan Market is a web-based agricultural marketplace that enables farmers to register, list their crops, manage their listings, and connect with customers. It helps simplify agricultural trading through a user-friendly digital platform.

## 🚀 Features

### Farmer Module
- Farmer registration and login.
- Secure authentication.
- Add new crop listings.
- Edit crop details, prices, and quantities.
- Delete crop listings.
- View and manage personal crop listings.
- Instant UI updates without refreshing the page.

### Customer Module
- Browse available crops.
- View crop prices and quantities.
- View farmer and location information.
- Add products to cart.
- Update cart quantities.
- Remove products from cart.

### Marketplace
- Responsive user interface.
- Dynamic crop listings.
- Real-time frontend state updates after successful operations.
- Farmer and customer functionality.

## 🛠️ Technologies Used

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML5, CSS3 |
| Backend | Java, Spring Boot |
| Database | MySQL |
| API | RESTful APIs |
| Authentication | JWT |
| Build Tools | Maven, npm |
| Version Control | Git, GitHub |

## 📂 Project Structure

```text
AI-Kishan-market/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   └── pom.xml
│
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Java 21
- Maven
- Node.js and npm
- MySQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/MrDurgaPrasad03/AI-Kishan-market-.git
cd AI-Kishan-market-
```

### 2. Start the Backend

Open a terminal:

```bash
cd backend
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

Configure your MySQL database credentials in the backend application configuration before starting the server.

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## 🔗 API Functionality

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/crops` | Get available crops |
| GET | `/api/crops/my` | Get farmer's crops |
| POST | `/api/crops` | Add a crop |
| PUT | `/api/crops/{id}` | Update a crop |
| DELETE | `/api/crops/{id}` | Delete a crop |
| GET | `/api/cart` | Get customer cart |
| POST | `/api/cart/items` | Add cart item |
| PUT | `/api/cart/items/{itemId}` | Update cart item |
| DELETE | `/api/cart/items/{itemId}` | Delete cart item |

## 🎯 Key Implementation Highlights

- Implemented REST API integration between React and Spring Boot.
- Used JWT-based authentication for protected farmer operations.
- Implemented CRUD operations for crop management.
- Updated React state after successful API operations to display changes immediately.
- Integrated customer cart management functionality.
- Organized frontend and backend into separate modules.

## 🔮 Future Enhancements

- AI-based crop price prediction.
- Crop recommendation system.
- Weather-based agricultural insights.
- Online payment integration.
- Order tracking and management.
- Admin dashboard and analytics.
- Multilingual support for farmers.

## 👨‍💻 Developer

**Durga Prasad Bobbara**

GitHub: https://github.com/MrDurgaPrasad03

Project Repository: https://github.com/MrDurgaPrasad03/AI-Kishan-market-

---

*AI Kishan Market – Empowering Farmers Through Technology.* 🌱