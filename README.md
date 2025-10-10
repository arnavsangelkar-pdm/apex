# 🚀 Apex AI - AI-Powered Nutrition Platform

A comprehensive AI-powered nutrition and supplements platform demonstrating advanced RAG (Retrieval-Augmented Generation) capabilities with LangGraph agents, modern React frontend, and professional business intelligence tools.

![Apex AI Platform](https://img.shields.io/badge/AI-Powered-blue) ![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black) ![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green) ![LangGraph](https://img.shields.io/badge/LangGraph-AI-purple)

## 🌟 Features

### 🛍️ **Customer-Facing Frontend**
- **Intelligent Search**: AI-powered product recommendations ("Find me a stack to preserve muscle mass but burn fat")
- **Voice Agent**: Real Web Speech API integration for hands-free interaction
- **Rachel - AI Nutrition Coach**: Personalized meal planning and nutrition guidance
- **Ramy - AI Lifestyle Coach**: Style and lifestyle recommendations
- **Customer Service**: Order tracking (#1439221), returns, and support
- **Modern Ecommerce**: Shopping cart, product catalog, reviews, responsive design

### 🔧 **Admin Dashboard**
- **Review Synthesis Engine**: Analyze 8,000+ customer reviews instantly
- **Financial Report Generator**: "How did Q2 compare to Q1?" with interactive charts
- **Landing Page Generator**: Dynamic marketing page creation with live preview
- **Product Analytics**: Performance insights and market analysis
- **Customer Experience**: Advanced analytics and optimization
- **Sales Optimizer**: Revenue optimization and pricing strategies

### 🤖 **AI Technology Stack**
- **10 Specialized Agents**: 4 frontend + 6 backend agents
- **LangGraph Integration**: Advanced AI workflow management
- **RAG Implementation**: Vector-based knowledge retrieval
- **OpenAI GPT Integration**: Natural language processing
- **Real-time Analytics**: Live business intelligence

## 🏗️ Architecture

```
┌─ Frontend (Next.js 14)
│  ├─ Customer Interface (/)
│  │  ├─ Product Search & Cart
│  │  ├─ AI Voice Agent
│  │  └─ Conversational Agents
│  └─ Admin Dashboard (/admin)
│     ├─ Business Intelligence
│     ├─ Chart Generation
│     └─ Landing Page Builder
│
├─ API Server (FastAPI)
│  ├─ Frontend Agents Endpoint
│  ├─ Backend Agents Endpoint
│  └─ Health & Docs
│
└─ AI Agents (LangGraph)
   ├─ Frontend: intelligent_search, customer_service, rachel_nutrition, ramy_lifestyle
   └─ Backend: review_synthesis, financial_reports, landing_page_generator, etc.
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18.17.0+
- OpenAI API Key

### 1. Clone & Setup
```bash
git clone https://github.com/arnavsangelkar-pdm/apex.git
cd apex

# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Environment Configuration
```bash
# Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

### 3. Start Development Servers
```bash
# Terminal 1 - API Server
python3 api_server.py

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 4. Access the Platform
- **Customer Site**: http://localhost:3001
- **Admin Dashboard**: http://localhost:3001/admin
- **API Documentation**: http://localhost:8000/docs

## 🌐 Deployment on Render

### Backend Deployment
1. **Create Web Service**:
   - Repository: Connect your GitHub repo
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python3 api_server.py`
   - Environment: Add `OPENAI_API_KEY`

### Frontend Deployment  
1. **Create Static Site**:
   - Repository: Same GitHub repo
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/out`
   - Environment: Set `NEXT_PUBLIC_API_URL` to your backend URL

## 🎯 Demo Scenarios

### Customer Experience
1. **Voice Search**: "Hey, find me supplements for muscle building"
2. **Intelligent Search**: "A stack to preserve muscle mass but burn fat"
3. **Rachel Chat**: "What should I make for dinner for muscle building?"
4. **Customer Service**: "Track order #1439221"

### Admin Intelligence  
1. **Financial Analysis**: "How did Q2 compare to Q1 for subscriptions?"
2. **Review Insights**: "Summarize customer feedback trends"
3. **Landing Pages**: "Build landing page for collagen powder for women over 40"
4. **Product Analytics**: "Show me top performing products with charts"

## 📊 API Endpoints

### Frontend Agents
- `POST /query/frontend` - Customer-facing AI agents
- `GET /agents/frontend` - List available frontend agents

### Backend Agents  
- `POST /query/backend` - Admin/business intelligence agents
- `GET /agents/backend` - List available backend agents

### System
- `GET /health` - Health check and status
- `GET /docs` - Interactive API documentation

## 🔧 Technical Details

### Frontend Stack
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Markdown** for AI response rendering
- **Lucide Icons** for UI elements

### Backend Stack
- **FastAPI** for high-performance API
- **LangGraph** for AI agent orchestration
- **OpenAI GPT** for language processing
- **FAISS** for vector similarity search
- **Pydantic** for data validation

### AI Agents Architecture
- **Base Agent Class** with RAG capabilities
- **Vector Store Management** with temporary directories
- **Context Retrieval** with relevance scoring
- **Graph-based Workflows** for complex interactions

## 📝 Development Notes

### Adding New Agents
1. Create agent file in `/agents/`
2. Implement base agent interface
3. Add to `__init__.py` exports
4. Register in `api_server.py`

### Customizing Frontend
- Modify `/frontend/app/page.tsx` for customer interface
- Update `/frontend/app/admin/page.tsx` for admin features
- Styling in Tailwind classes

### Environment Variables
- `OPENAI_API_KEY`: Required for AI functionality
- `NEXT_PUBLIC_API_URL`: Frontend API base URL (production)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for AI-powered business intelligence and customer experience** 