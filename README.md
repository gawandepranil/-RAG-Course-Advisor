# 🎓 HuskyPath – RAG Course Advisor

An AI-powered academic planning assistant built using Retrieval-Augmented Generation (RAG) to provide **catalog-grounded, explainable, and policy-aware course guidance** for University of Washington pathways.

---
rag-course-advisor/
│
├── app/                      # FastAPI backend
│   ├── api.py
│   └── main.py
│
├── src/                      # Core RAG pipeline
│   ├── ingestion.py
│   ├── retriever.py
│   ├── generator.py
│   ├── pipeline.py
│   ├── vector_store.py
│   ├── prompt.py
│   └── embeddings.py
│
├── data/
│   ├── courses/
│   ├── policies/
│   ├── programs/
│   └── documents.json
│
├── models/
│   └── faiss_index/          # (ignored in git)
│
├── frontend/                 # Next.js app
│
├── evaluation_results.md     # REQUIRED
├── README.md                 # VERY IMPORTANT
├── requirements.txt
├── .gitignore
└── .env

## 🚀 Key Features

* 📚 **Catalog-Grounded Answers**

  * Uses official UW course catalog data
  * No hallucinations — strictly grounded responses

* 🎯 **Eligibility Reasoning**

  * Checks prerequisites before answering
  * Handles:

    * Required courses
    * Minimum grade rules
    * Missing student information

* 🛑 **Safe Abstention**

  * If data is missing → asks clarifying questions
  * If course not found → explicitly says so

* 📊 **Explainable Output**

  * Structured response format:

    * Answer / Plan
    * Why
    * Citations
    * Clarifying Questions
    * Assumptions

* 🧠 **Policy Awareness**

  * Supports academic rules like:

    * Credit limits
    * Grade requirements
    * Retake policies

---

## 🎓 Academic Context

This system is built specifically for **University of Washington (UW)** catalog logic.

### 📈 Grading System

* UW uses a **4.0 GPA scale**
* Typical prerequisite requirement:

  * **Minimum grade: 2.0**
* The system explicitly checks and includes this in reasoning.

---

## 🧠 Architecture

```text
User Query
   ↓
Retriever (FAISS + Embeddings)
   ↓
Relevant Documents (courses/policies)
   ↓
Prompt Builder
   ↓
Groq LLM (LLaMA / Mixtral)
   ↓
Structured Response
```

---

## ⚙️ Tech Stack

### Backend

* FastAPI
* FAISS
* HuggingFace Embeddings
* LangChain
* Groq LLM

### Frontend

* Next.js (App Router)
* Tailwind CSS
* Framer Motion
* React Three Fiber (3D UI)

---

## 🛠️ Setup Instructions

### 1. Clone repo

```bash
git clone https://github.com/your-username/rag-course-advisor.git
cd rag-course-advisor
```

### 2. Backend setup

```bash
pip install -r requirements.txt
```

### 3. Add API key

Create `.env`:

```env
GROQ_API_KEY=your_key_here
```

### 4. Build vector store

```bash
python run.py
```

### 5. Run backend

```bash
uvicorn app.api:app --reload
```

---

### 6. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 📊 Evaluation

The system was tested on **25 structured queries** including:

* Prerequisite extraction
* Eligibility reasoning
* Missing information handling
* Policy queries
* Multi-step planning

See:

```text
evaluation_results.md
```

---

## 📌 Example Query

**Q:**
Can I take CSE 446?

**Output:**

```text
Answer / Plan:
Need more info

Why:
CSE 446 requires CSE 312 and CSE 332 with minimum grade 2.0

Clarifying questions:
- Have you completed CSE 312?
- Have you completed CSE 332?
- What grades did you receive?
```

---

## 🎯 Project Highlights

* Real-world academic advisor simulation
* Strong grounding (no hallucination)
* Structured reasoning
* Production-level UI

---

## 🚀 Future Improvements

* Streaming responses
* Multi-university support
* Degree planning automation
* User profile memory

---

## 👨‍💻 Author

Built as part of an AI Engineering assessment project.

---
