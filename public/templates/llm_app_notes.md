# LLM App Template — Reference Notes

Source: architech-dev.tech/templates (LLM App, Jun 30 2025)

## Architecture Summary
RAG pipeline — React UI → API Gateway → Inference API (LangChain + LLM) → Vector DB (Pinecone/Qdrant) + File Storage.
Embedding workers process uploaded documents into searchable vectors in the background.
Analytics layer tracks usage and query patterns.

## Key Components
- React frontend (conversation UI)
- API Gateway (auth, rate limiting, secret management)
- Inference API (LangChain orchestration, OpenAI/Gemini/Claude)
- Embedding Workers (async document → vector conversion)
- Vector DB (Pinecone or Qdrant — needs versioning and sharding plan)
- File Storage (S3-compatible, encrypted)
- Logging & Analytics

## Design Warnings (from source)
- LLM API calls dominate latency — use streaming, keep warm instances
- Cache frequent Q&A pairs to cut cost
- Fallback to smaller/open-source models for high-volume low-risk queries
- Version the embedding model — upgrading requires full re-index of vector store
- Plan Pinecone/Qdrant sharding early before index grows expensive
- API gateway must protect LLM provider keys — short-lived tokens or Vault/Secrets Manager
- Rate-limit uploads to protect downstream services
- Proprietary documents need encrypted storage + access controls (HIPAA relevant)
- Propagate request-IDs across all services for end-to-end trace
- Autoscale inference API and embedding workers for bursty traffic; queue uploads

## Relevance to Peptide Journal
When "Analyze Protocol" wires to an AI inference layer:
- Clinician uploads lab panel → embedding worker vectorizes it
- Inference API queries vector DB for relevant protocol matches
- LLM generates personalized recommendation against the peptide protocol template
- Analytics tracks article read → simulation run → prescription written funnel

## JSON Template
Download from architech-dev.tech and save as llm_app.json in this folder.
