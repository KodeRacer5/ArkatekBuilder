# Canvas Templates

Architecture templates for the Peptide Journal canvas feature.
Each JSON file defines nodes and connections that load into the React Flow canvas
at `/canvas/[templateId]` when a clinician clicks "Analyze Protocol" from an article.

## Template Format

Each file follows this schema:
- `name` — display name
- `description` — what the template represents
- `components[]` — nodes with id, type, name, position, properties
- `connections[]` — edges between node ids with labels

## Current Templates

| File | Name | Use Case | Nodes |
|------|------|----------|-------|
| `architecture.json` | Basic Architecture | General system diagram — user, UI, server, 2 services, DB | 6 |
| `action_architecture.json` | Web Application Stack | Full stack — React frontend, CDN, load balancer, Node API, Redis, PostgreSQL | 7 |

## Planned Templates (grab from architech-dev.tech)

| File | Source Name | Why |
|------|-------------|-----|
| `llm_app.json` | LLM App | AI inference layer — LangChain, Pinecone, OpenAI/Gemini. Needed when wiring "Analyze Protocol" to an LLM. |
| `aiml_pipeline.json` | AI/ML Data Pipeline | Biomarker correlation engine — ingestion, processing, model training, serving. |

## Peptide Protocol Templates (to be built)

These don't exist yet — build when canvas route is ready.

| File | Protocol | Notes |
|------|----------|-------|
| `bpc157_protocol.json` | BPC-157 Tissue Repair | Dosing schedule, receptor targets, lab markers, contraindications |
| `tb500_protocol.json` | TB-500 | Systemic repair, angiogenesis nodes |
| `semax_protocol.json` | Semax | Cognitive enhancement, BDNF pathway nodes |
| `ghk_cu_protocol.json` | GHK-Cu | Wound healing, collagen synthesis nodes |

## Wiring to an Issue

Set `canvasTemplate` on the issue object in `data/issues.json`:
```json
{ "canvasTemplate": "bpc157_protocol" }
```

The canvas route at `/canvas/[templateId]` loads `/templates/[templateId].json` and renders it.
TL;DR – The Big Picture in One SentenceA resilient, scalable factory that grabs raw data from everywhere, stores it safely, transforms it into reusable features, trains and version‑controls models, serves predictions in real time, and exposes a clean API—all while keeping audit trails, versioning, and horizontal scalability front‑and‑center. Here are theatencyGeneration calls (LLM → API) dominate response time. Consider: <br>• Using streaming responses to start showing tokens early. <br>• Keeping a warm pool of LLM instances; avoid cold starts.Cost ManagementExternal LLM calls can be pricey. Strategies: <br>• Cache frequent Q&A pairs. <br>• Fallback to smaller/open‑source models for high‑volume low‑risk queries.Embedding Model VersioningThe embedding model (often separate from the LLM) should be versioned. If you upgrade to a newer encoder, you’ll need to re‑index the vector store.Index Size & ShardingPinecone/Qdrant can become expensive as vectors grow. Plan for sharding or partition key strategies early.Security of SecretsAPI‑gateway must enforce authentication for the LLM provider’s keys. Use short‑lived tokens or a secret manager (AWS Secrets Manager, Vault).Rate‑Limiting & ThrottlingThe gateway should protect downstream services from overload spikes (e.g., massive file uploads).Data PrivacyIf you ingest proprietary documents, ensure that vector embeddings are stored in a compliant environment (e.g., encrypted S3, access‑controlled).Observability StackCorrelate logs across services (request‑ID propagation) to trace a single query from UI → gateway → LLM → API response → analytics.Scale‑out PathHow will you handle bursty traffic? Typical plan: autoscale the inference API and embedding workers, use a queue to buffer uploads, and leverage a CDN in front of the frontend.Testing & CI/CDMock the LLM provider in unit tests. Spinning up a temporary Pinecone or Qdrant instance for integration tests helps keep pipelines reliable.
🎉 Wrap‑Up (in a Conversational Tone)
Imagine you’re building a chat‑style assistant that can not only answer generic questions but also draw on your own collection of documents—think of it as a super‑smart internal knowledge base that you can query in real time.
The skeleton shown above gives you that capability while keeping every piece tidy and replaceable:
* Frontend is a slick React UI that feels like a conversation.
* Gateway is the smart traffic cop that decides where each request should go.
* Inference API is the brain that asks: “Do I have anything relevant already stored?” (vector search) and then “Ask the big LLM for the final answer.”
* Embedding workers quietly churn through new files, turning them into searchable vectors behind the scenes.
* Vector DB + file storage hold the knowledge you feed the system.
* Logging & analytics keep tabs on how users behave and where things might be slowing down.
All of this is packaged in a way that you could, for example, replace OpenAI with Claude tomorrow, or swap Pinecone for Qdrant, without rebuilding the whole system. It’s a modular, production‑ready scaffold—perfect for startups that need a fast MVP but also plan to grow into a full‑featured SaaS product.
If you ever want to dive deeper—say, into how LangChain stitches the LLM calls together, or how to tune Pinecone queries—just let me know! I’m happy to walk through any piece of the puzzle. 🚀