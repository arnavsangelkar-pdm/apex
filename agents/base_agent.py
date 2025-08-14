"""Base RAG Agent with ChromaDB"""

from typing import Dict, Any, List, Tuple
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import StateGraph, MessagesState, START, END
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Check for API key
if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY not found in environment variables. Please check your .env file.")

class BaseRAGAgent:
    """Base class for RAG agents"""
    
    def __init__(self, name: str, system_prompt: str):
        self.name = name
        self.system_prompt = system_prompt
        self.llm = ChatOpenAI(
            model="gpt-4o-mini", 
            temperature=0.7,
            api_key=os.getenv("OPENAI_API_KEY"),
            request_timeout=60  # Increase timeout to 60 seconds to prevent timeouts
        )
        self.embeddings = OpenAIEmbeddings(
            api_key=os.getenv("OPENAI_API_KEY")
        )
        self.vector_store = None
        self.documents = []
        self.doc_metadata = []  # Store metadata for references
        self._vector_store_initialized = False  # Cache flag
        
    def add_documents(self, documents: List[str]):
        """Add documents to the vector store with metadata"""
        self.documents = documents  # Replace instead of extend to ensure fresh data
        
        # Create metadata for each document
        metadatas = []
        for i, doc in enumerate(documents):
            # Extract a title from the first part of the document
            title = doc.split('-')[0].strip() if '-' in doc else f"Document {i+1}"
            metadatas.append({
                "source": f"{self.name}_doc_{i+1}",
                "title": title,
                "index": i
            })
        
        self.doc_metadata = metadatas
        # Mark that we need to initialize the vector store (lazy loading)
        self._vector_store_initialized = False
    
    def _ensure_vector_store(self):
        """Lazy initialization of vector store for performance"""
        if self._vector_store_initialized or not self.documents:
            return
            
        try:
            # Use in-memory store for better performance
            self.vector_store = Chroma.from_texts(
                texts=self.documents,
                embedding=self.embeddings,
                collection_name=f"{self.name}_collection",
                metadatas=self.doc_metadata
            )
            self._vector_store_initialized = True
        except Exception as e:
            print(f"Error initializing vector store for {self.name}: {e}")
            # Continue without vector store
            self.vector_store = None
    
    def retrieve_context_with_sources(self, query: str, k: int = 3) -> Tuple[str, List[Dict]]:
        """Retrieve relevant context with source references"""
        # Ensure vector store is initialized
        self._ensure_vector_store()
        
        if self.vector_store is None:
            return "", []
        
        # Get documents with metadata
        docs_with_scores = self.vector_store.similarity_search_with_relevance_scores(query, k=k)
        
        context_parts = []
        sources = []
        
        for doc, score in docs_with_scores:
            context_parts.append(doc.page_content)
            
            # Create source reference
            source = {
                "content": doc.page_content[:100] + "..." if len(doc.page_content) > 100 else doc.page_content,
                "metadata": doc.metadata,
                "relevance_score": score
            }
            sources.append(source)
        
        context = "\n\n".join(context_parts)
        return context, sources
    
    def retrieve_context(self, query: str, k: int = 3) -> str:
        """Retrieve relevant context from vector store (backward compatibility)"""
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
    
    def process_message(self, state: MessagesState) -> Dict[str, Any]:
        """Process incoming message with RAG and source citations"""
        messages = state["messages"]
        last_message = messages[-1]
        
        # Retrieve relevant context with sources
        context, sources = self.retrieve_context_with_sources(last_message.content)
        
        # Create prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("system", f"Use the following context to answer questions. When using information from the context, mention which source it comes from:\n{context}"),
            ("human", "{input}")
        ])
        
        # Generate response
        chain = prompt | self.llm
        response = chain.invoke({
            "input": last_message.content
        })
        
        # Add source citations to the response
        response_content = response.content
        if sources:
            response_content += self.format_sources(sources)
        
        return {"messages": [AIMessage(content=response_content)]}
    
    def build_graph(self) -> StateGraph:
        """Build the LangGraph workflow"""
        workflow = StateGraph(MessagesState)
        
        # Add the main processing node
        workflow.add_node("process", self.process_message)
        
        # Add edges
        workflow.add_edge(START, "process")
        workflow.add_edge("process", END)
        
        # Compile
        return workflow.compile() 