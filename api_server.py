#!/usr/bin/env python3
"""NutraFuel AI API Server with Frontend and Backend Agent Separation"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import uvicorn
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import Frontend Agents (Customer-facing)
from agents.intelligent_search import agent as intelligent_search_agent
from agents.customer_service import agent as customer_service_agent
from agents.rachel_nutrition import agent as rachel_nutrition_agent
from agents.ramy_lifestyle import agent as ramy_lifestyle_agent

# Import Backend Agents (Admin/Internal)
from agents.client_acquisition import agent as customer_experience_agent
from agents.marketing_analytics import agent as product_analytics_agent
from agents.campaign_optimizer import agent as sales_optimizer_agent
from agents.review_synthesis import agent as review_synthesis_agent
from agents.financial_reports import agent as financial_reports_agent
from agents.landing_page_generator import agent as landing_page_generator_agent

# Create FastAPI app
app = FastAPI(title="NutraFuel AI API", version="2.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Frontend Agents (Customer-facing)
frontend_agents = {
    "intelligent_search": intelligent_search_agent,
    "customer_service": customer_service_agent,
    "rachel_nutrition": rachel_nutrition_agent,
    "ramy_lifestyle": ramy_lifestyle_agent
}

# Backend Agents (Admin/Internal)
backend_agents = {
    "customer_experience": customer_experience_agent,
    "product_analytics": product_analytics_agent,
    "sales_optimizer": sales_optimizer_agent,
    "review_synthesis": review_synthesis_agent,
    "financial_reports": financial_reports_agent,
    "landing_page_generator": landing_page_generator_agent
}

# Request/Response models
class QueryRequest(BaseModel):
    query: str
    agent: str
    k: int = 3

class QueryResponse(BaseModel):
    response: str
    agent: str
    sources: Optional[List[Dict]] = None

@app.get("/")
async def root():
    return {
        "message": "NutraFuel AI API v2.0", 
        "frontend_agents": list(frontend_agents.keys()),
        "backend_agents": list(backend_agents.keys()),
        "docs": "/docs"
    }

@app.get("/agents/frontend")
async def list_frontend_agents():
    return {
        "agents": [
            {
                "id": "intelligent_search",
                "name": "Intelligent Search",
                "description": "AI-powered product search and recommendations"
            },
            {
                "id": "customer_service",
                "name": "Customer Service",
                "description": "Order tracking, returns, and customer support"
            },
            {
                "id": "rachel_nutrition",
                "name": "Rachel - Nutrition Coach",
                "description": "Meal planning and nutrition guidance"
            },
            {
                "id": "ramy_lifestyle",
                "name": "Ramy - Lifestyle Coach", 
                "description": "Style and lifestyle advice"
            }
        ]
    }

@app.get("/agents/backend")
async def list_backend_agents():
    return {
        "agents": [
            {
                "id": "customer_experience",
                "name": "Customer Experience Agent",
                "description": "Advanced customer analytics and optimization"
            },
            {
                "id": "product_analytics",
                "name": "Product Analytics Agent",
                "description": "Deep product performance and market insights"
            },
            {
                "id": "sales_optimizer",
                "name": "Sales Optimizer Agent",
                "description": "Revenue optimization and pricing strategies"
            },
            {
                "id": "review_synthesis",
                "name": "Review Synthesis Engine",
                "description": "Customer review analysis and insights"
            },
            {
                "id": "financial_reports",
                "name": "Financial Report Generator",
                "description": "Financial analysis and reporting"
            },
            {
                "id": "landing_page_generator",
                "name": "Landing Page Generator",
                "description": "Dynamic marketing page creation"
            }
        ]
    }

@app.post("/query/frontend", response_model=QueryResponse)
async def query_frontend_agent(request: QueryRequest):
    """Query a frontend (customer-facing) agent"""
    if request.agent not in frontend_agents:
        raise HTTPException(status_code=404, detail=f"Frontend agent '{request.agent}' not found")
    
    return await process_agent_query(frontend_agents[request.agent], request)

@app.post("/query/backend", response_model=QueryResponse)
async def query_backend_agent(request: QueryRequest):
    """Query a backend (admin/internal) agent"""
    if request.agent not in backend_agents:
        raise HTTPException(status_code=404, detail=f"Backend agent '{request.agent}' not found")
    
    return await process_agent_query(backend_agents[request.agent], request)

@app.post("/query", response_model=QueryResponse)
async def query_agent_legacy(request: QueryRequest):
    """Legacy endpoint - tries frontend first, then backend"""
    # Try frontend agents first
    if request.agent in frontend_agents:
        return await process_agent_query(frontend_agents[request.agent], request)
    
    # Try backend agents
    if request.agent in backend_agents:
        return await process_agent_query(backend_agents[request.agent], request)
    
    raise HTTPException(status_code=404, detail=f"Agent '{request.agent}' not found")

async def process_agent_query(agent, request: QueryRequest):
    """Process query for any agent"""
    try:
        # Get context and sources
        context, sources = agent.retrieve_context_with_sources(request.query, k=request.k)
        
        # Generate response
        graph = agent.build_graph()
        result = graph.invoke({"messages": [{"role": "user", "content": request.query}]})
        
        # Extract response
        response_text = result["messages"][-1].content if result["messages"] else "No response generated"
        
        return QueryResponse(
            response=response_text,
            agent=request.agent,
            sources=sources
        )
    except Exception as e:
        print(f"Error in agent {request.agent}: {e}")
        # Simple fallback message
        fallback_message = f"I'm temporarily experiencing high demand. As your {request.agent} assistant, I'm here to help! Please try your question again in a moment, and I'll provide you with a detailed response."
        
        return QueryResponse(
            response=fallback_message,
            agent=request.agent,
            sources=[]
        )

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "api_key_set": bool(os.getenv("OPENAI_API_KEY")),
        "frontend_agents": len(frontend_agents),
        "backend_agents": len(backend_agents)
    }

@app.get("/warmup")
async def warmup():
    """Warmup endpoint to prevent cold starts"""
    return {"status": "warmed", "message": "Server is ready"}

if __name__ == "__main__":
    print("💪 Starting NutraFuel AI API Server...")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🎯 API Base: http://localhost:8000")
    print("🛍️  Frontend Agents: http://localhost:8000/agents/frontend") 
    print("🔧 Backend Agents: http://localhost:8000/agents/backend")
    # Use PORT environment variable for Render deployment
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 