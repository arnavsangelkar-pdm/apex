"""Base RAG Agent with Mock Implementation for Demo"""

from typing import Dict, Any, List, Tuple
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class BaseRAGAgent:
    """Base class for RAG agents with mock implementation"""
    
    def __init__(self, name: str, system_prompt: str):
        self.name = name
        self.system_prompt = system_prompt
        self.documents = []
        self.doc_metadata = []  # Store metadata for references
        
    def add_documents(self, documents: List[str]):
        """Add documents to the agent's knowledge base"""
        self.documents = documents  # Replace instead of extend to ensure fresh data
        
        # Create metadata for each document
        metadatas = []
        for i, doc in enumerate(documents):
            # Extract a title from the first part of the document
            title = doc.split(':')[0].strip() if ':' in doc else f"Document {i+1}"
            metadatas.append({
                "source": f"{self.name}_doc_{i+1}",
                "title": title,
                "index": i
            })
        
        self.doc_metadata = metadatas
    
    def retrieve_context_with_sources(self, query: str, k: int = 3) -> Tuple[str, List[Dict]]:
        """Retrieve relevant context with source references using mock similarity"""
        if not self.documents:
            return "", []
        
        # Simple mock similarity - return first k documents
        selected_docs = self.documents[:min(k, len(self.documents))]
        
        context_parts = []
        sources = []
        
        for i, doc in enumerate(selected_docs):
            context_parts.append(doc)
            
            # Create source reference
            source = {
                "content": doc[:100] + "..." if len(doc) > 100 else doc,
                "metadata": self.doc_metadata[i] if i < len(self.doc_metadata) else {
                    "source": f"{self.name}_doc_{i+1}",
                    "title": f"Document {i+1}",
                    "index": i
                },
                "relevance_score": 0.95 - (i * 0.1)  # Mock decreasing relevance
            }
            sources.append(source)
        
        context = "\n\n".join(context_parts)
        return context, sources
    
    def retrieve_context(self, query: str, k: int = 3) -> str:
        """Retrieve relevant context from knowledge base (backward compatibility)"""
        context, _ = self.retrieve_context_with_sources(query, k)
        return context
    
    def format_sources(self, sources: List[Dict]) -> str:
        """Format source references for display"""
        if not sources:
            return ""
        
        formatted = "\n\n📚 **Sources:**\n"
        for i, source in enumerate(sources, 1):
            title = source['metadata'].get('title', 'Unknown')
            doc_id = source['metadata'].get('source', '')
            score = source['relevance_score']
            
            # Create a clickable reference format
            formatted += f"{i}. [{title}](#{doc_id}) (relevance: {score:.2f})\n"
        
        return formatted
    
    def process_message(self, state: Dict) -> Dict[str, Any]:
        """Process incoming message with mock response"""
        messages = state.get("messages", [])
        if not messages:
            return {"messages": [{"role": "assistant", "content": "Hello! How can I help you today?"}]}
        
        last_message = messages[-1]
        query = last_message.get("content", "") if isinstance(last_message, dict) else str(last_message)
        
        # Mock response based on agent type and query
        if "nutrition" in self.name.lower():
            response_content = "Hi! I'm Rachel, your nutrition coach! I'd be happy to help you with meal planning and nutrition guidance. What are your specific goals?"
        elif "search" in self.name.lower():
            response_content = "I'm here to help you find the perfect supplements for your fitness goals! What are you looking for?"
        elif "customer" in self.name.lower():
            response_content = "Welcome to NutraFuel customer service! How can I help you today?"
        else:
            response_content = f"Hello! I'm your {self.name.replace('_', ' ').title()} assistant. How can I help you?"
        
        return {"messages": [{"role": "assistant", "content": response_content}]}
    
    def build_graph(self):
        """Build a mock graph that returns the agent instance"""
        return MockGraph(self)

class MockGraph:
    """Mock graph implementation for demo purposes"""
    
    def __init__(self, agent):
        self.agent = agent
    
    def invoke(self, input_data: Dict) -> Dict:
        """Mock invoke that returns a simple response"""
        messages = input_data.get("messages", [])
        if not messages:
            return {"messages": [{"role": "assistant", "content": "Hello! How can I help you?"}]}
        
        # Return the same mock response as process_message
        return self.agent.process_message(input_data) 