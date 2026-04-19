# VeriNews AI - AI-Powered Fake News Detector

Welcome to the VeriNews AI Repo! VeriNews AI is an AI-powered full-stack web application that uses a fine-tuned **RoBERTA** transformer model to analyze news articles and predict whether they are real or fake with **92%** accuracy. Users are able to submit articles and have the model predict the authenticity of these articles with human-readable explanations. Additionally, users can also provide feedback on the models predictions and track their analysis and feedback history. The UI is supposed to evoke an old-school newspaper style.

![VeriNews Landing Page](VeriNews_LandingPage.gif)

---

## Features
- **Article Analysis**: Users can paste any news article (minimum 250 words) and receive a real/fake prediction with a confidence score on a scale of 0-100
- **Optional AI-Explainability**: Users have the option to get a human readable explanation along with the top indicating words for why the model made its prediction
- **User Authentication**: Authenticaion includes a secure registration with email verification, JWT-based authentication with refresh tokens
- **Feedback System**: Upon analysis completion, users have the option to rate the model's prediction as correct or incorrect and leave comments so that the model can be improved
- **Analysis History**: Users can view all their past analyes performed
- **Feedback History**: Users can view all feedback they have submitted across their analyses

---

##

Tech Stack

**Frontend**
- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material UI (MUI)](https://mui.com/) 
- [Axios](https://axios-http.com/)
- [React Router](https://reactrouter.com/)

**Backend**
- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://www.jwt.io/) (used for access and refresh tokens)
- [Nodemailer](https://nodemailer.com/) (used for email verification)
- [bcrypt](https://www.npmjs.com/package/bcrypt) (used for password hashing)

**ML Microservice**
- [Python](https://www.python.org/) + [FastAPI](https://fastapi.tiangolo.com/)
- [PyTorch](https://pytorch.org/)
- [RoBERTa-base](https://huggingface.co/FacebookAI/roberta-base)
- [Hugging Face Transformers](https://huggingface.co/docs/transformers/index)
- [LIME](https://github.com/marcotcr/lime)

**Datasets used for Training**
- [LIAR](https://www.kaggle.com/datasets/doanquanvietnamca/liar-dataset?select=README)
- [WELFake](https://huggingface.co/datasets/davanstrien/WELFake)

---

```
fake-news-detector/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── api/             # Axios Instance
│   │   ├── components/      # React Components
│   │   ├── context/         # Authentication Context
│   │   └── App.jsx
│   └── package.json
│
├── server/                  # Node.js Backend
│   ├── src/
│   │   ├── controllers/     # Route Handlers
│   │   ├── middleware/      # Authentication Middleware
│   │   ├── models/          # Mongoose Schemas
│   │   ├── routes/          # Express Routes
│   │   ├── utils/           # JWT, E-Mail helpers
│   │   └── config/          # Database Config
│   ├── services/
│   │   └── mlService.js     # ML Service Client
│   └── server.js
│
└── mlService/               # Python ML Microservice
    ├── app/
    │   ├── main.py          # FastAPI App
    │   ├── modelLoader.py   # Load model from Hugging Face
    │   ├── explainAI.py     # LIME Explainability
    │   └── schemas.py       # Request/response Schemas
    ├── scripts/
    │   └── cleanData.py     # Data Preprocessing Script
    └── requirements.txt
```

---

## Local Setup Instructions

### Prerequisites:
- Node.js version 16+
- Python version 3.9+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with App Password (needed for email verification)

### 1. Clone the Repo

```bash
git clone https://github.com/mohammadikhan/fake-news-detector.git
cd fake-news-detector
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Initialize Server (Backend)

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
USER_EMAIL=your_gmail@gmail.com
PASS_EMAIL=your_gmail_app_password
ML_SERVICE_URL=http://127.0.0.1:8000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```
### 4. Initalize Client (Frontend)

```bash
cd client
npm install

```
Create a `.env` file in the `client/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Set up ML service

```bash
cd mlService
pip install -r requirements.txt
```

### 6. Run the application

From the root directory, run the client and server together:

```bash
npm run dev
```

In a separate terminal, start the ML service:

```bash
cd mlService
uvicorn app.main:app --reload
```

The app will be up and running at `http://localhost:5173`

---
## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `MONGO_URI` | server/.env | MongoDB connection string |
| `JWT_SECRET` | server/.env | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | server/.env | Secret for signing refresh tokens |
| `JWT_EXPIRE` | server/.env | Access token expiry (e.g. `15m`) |
| `JWT_REFRESH_EXPIRE` | server/.env | Refresh token expiry (e.g. `7d`) |
| `USER_EMAIL` | server/.env | Gmail address for sending verification emails |
| `PASS_EMAIL` | server/.env | Gmail App Password |
| `ML_SERVICE_URL` | server/.env | URL of the Python ML service |
| `CORS_ORIGIN` | server/.env | Allowed frontend origin for CORS |
| `NODE_ENV` | server/.env | `development` or `production` |
| `VITE_API_URL` | client/.env | Backend API base URL |

---

## Model

The model used in VeriNews AI is a fine tuned **RoBERTa-base** transformer trained on a combined dataset of **~72,000** samples from the **LIAR** and **WELFake** datasets. The model is publicly hosted on Hugging Face, which you can access [here](https://huggingface.co/mohammadikhan/fake-news-detector)

