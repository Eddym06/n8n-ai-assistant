<div align="center">

# 🤖 n8n AI Assistant

### *Your Intelligent Companion for n8n Workflow Automation*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://github.com/Eddym06/n8n-ai-assistant)
[![Firefox Compatible](https://img.shields.io/badge/Firefox-Compatible-orange.svg)](https://github.com/Eddym06/n8n-ai-assistant)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61dafb.svg)](https://reactjs.org/)
[![Powered by AI](https://img.shields.io/badge/Powered%20by-AI-purple.svg)](https://github.com/Eddym06/n8n-ai-assistant)

*Transform natural language into powerful n8n workflows with AI-powered intelligence*

[Features](#-features) • [Installation](#-quick-start) • [Usage](#-usage) • [Architecture](#️-architecture) • [Contributing](#-contributing)

</div>

---

## 🎯 What is n8n AI Assistant?

**n8n AI Assistant** is a revolutionary browser extension that brings the power of artificial intelligence directly into your n8n workflow editor. Simply describe what you want in natural language, and watch as the AI creates, validates, and optimizes complete workflows for you.

### 💡 Why Use n8n AI Assistant?

- **🚀 10x Faster Development**: Create complex workflows in seconds, not hours
- **🧠 AI-Powered Intelligence**: Leverages multiple LLMs (OpenAI, Gemini, Grok) for best results
- **✨ Zero Learning Curve**: No need to know n8n syntax - just describe what you need
- **🔧 Auto-Validation**: Workflows are validated and corrected before application
- **📐 Professional Layouts**: Automatic node positioning for maximum readability
- **🔄 Error Recovery**: Intelligent error detection and auto-fixing capabilities

### 🎬 Quick Demo

```
You: "Create a workflow that monitors my Gmail, extracts invoice PDFs, 
      and saves them to Google Drive organized by month"

AI Assistant: ✅ Generated complete workflow with:
              - Gmail Trigger (polling for attachments)
              - Filter (PDF files only)
              - Extract Data (invoice details)
              - Google Drive (organized folder structure)
              - Error handling & notifications
```

---

## ✨ Features

### 🎨 Core Capabilities

| Feature | Description |
|---------|-------------|
| **Natural Language Processing** | Describe workflows in plain English/Spanish - the AI understands your intent |
| **Multi-LLM Support** | Seamlessly switches between OpenAI, Google Gemini, and xAI Grok for optimal results |
| **Intelligent Validation** | Hybrid validation system (local + AI) ensures 100% compatible workflows |
| **Smart Positioning** | Advanced algorithms create professional, readable node layouts |
| **Error Detection** | Automatically detects and fixes common n8n workflow issues |
| **Memory System** | Maintains context across sessions for improved workflow generation |

### 🤖 Specialized AI Agents

Our system employs multiple specialized agents working together:

- **🎯 Prompt Enhancement Agent**: Analyzes and optimizes your requests
- **🔧 JSON Repair Agent**: Automatically fixes malformed workflow structures
- **📐 Positioning Agent**: Calculates optimal node placement
- **🧠 Semantic Memory Agent**: Maintains contextual awareness
- **🔍 Workflow Search Agent**: Finds similar workflows for reference
- **✅ Validation Agent**: Ensures n8n compatibility

### 🎛️ User Interface

- **💬 Floating Chat Panel**: Non-intrusive interface integrated into n8n
- **⚡ Quick Actions**: One-click activation, configuration, and workflow import
- **🎨 Modern Design**: Built with React, Tailwind CSS, and Framer Motion
- **🌙 Theme Adaptive**: Matches your n8n theme automatically
- **📱 Responsive**: Works on all screen sizes

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Browser**: Chrome, Firefox, or Edge in Developer Mode
- **API Keys**: At least one LLM provider (OpenAI, Gemini, or Grok)
- **n8n Instance**: Cloud or self-hosted

### Installation

#### 1️⃣ Clone & Build

```bash
# Clone the repository
git clone https://github.com/Eddym06/n8n-ai-assistant.git
cd n8n-ai-assistant

# Install dependencies
npm install

# Build the extension
npm run build
```

The compiled extension will be in the `dist/` folder.

> **💡 Tip**: If the build fails, try removing `node_modules` and `dist` folders, then run `npm install` again.

#### 2️⃣ Load in Browser

<details>
<summary><b>Chrome / Edge</b></summary>

1. Navigate to `chrome://extensions/`
2. Enable **Developer Mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `dist/` folder
5. ✅ Extension installed!

</details>

<details>
<summary><b>Firefox</b></summary>

1. Navigate to `about:debugging`
2. Click **This Firefox**
3. Click **Load Temporary Add-on**
4. Select `dist/manifest.json`
5. ✅ Extension installed!

</details>

#### 3️⃣ Configure API Keys

1. Click the extension icon in your toolbar
2. Select **⚙️ Configuration**
3. Choose your LLM provider (OpenAI, Gemini, or Grok)
4. Enter your API key
5. Save and you're ready to go!

---

## 🎮 Usage

### Getting Started

1. **Open n8n**: Navigate to your n8n instance (cloud or self-hosted)
2. **Activate Extension**: Click the extension icon → **"Activate Here"**
3. **Chat Interface**: A floating panel appears in the bottom corner
4. **Start Creating**: Type your workflow request in natural language!

### Example Commands

```plaintext
💬 "Create an e-commerce order processing workflow with Stripe and email notifications"

💬 "Build a data pipeline that reads from PostgreSQL and writes to BigQuery"

💬 "Make a Telegram bot that responds using OpenAI and saves conversations"

💬 "Set up automated Instagram posting from Google Sheets with image processing"

💬 "Create a workflow to backup all GitHub repositories to AWS S3 daily"
```

### Advanced Usage

- **Modify Existing**: "Add error handling to this workflow"
- **Optimize**: "Make this workflow more efficient"
- **Debug**: "Fix the connection issues in this flow"
- **Enhance**: "Add logging and monitoring to all nodes"

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Extension                        │
├─────────────────────────────────────────────────────────────┤
│  Content Script  │  Background  │  Popup  │  Options Page  │
└─────────────┬───────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────┐
│                    AI Agent System                          │
├─────────────────────────────────────────────────────────────┤
│  Prompt          JSON          Flow         Positioning     │
│  Enhancement  →  Repair    →   Coherence →  Agent          │
│  Agent           Agent         Agent                        │
└─────────────┬───────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────┐
│                   LLM Integration Layer                     │
├─────────────────────────────────────────────────────────────┤
│  OpenAI GPT-4  │  Google Gemini  │  xAI Grok  │  Fallback  │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Tailwind CSS, Framer Motion |
| **Build System** | Vite 5, PostCSS, Autoprefixer |
| **Validation** | AJV (JSON Schema Validator) |
| **AI Integration** | OpenAI API, Google Generative AI, Custom Router |
| **Browser APIs** | Chrome Extensions API, Storage API, Scripting API |

### Project Structure

```
n8n-ai-assistant/
├── 📂 src/
│   ├── content/              # Injected scripts (chat UI)
│   ├── popup/                # Extension popup interface
│   ├── options/              # Configuration page
│   ├── background.js         # Service worker (API communication)
│   └── pageBridge.js         # n8n store integration
│
├── 📂 dist/                  # Compiled extension (output)
│
├── 🤖 AI Agents/
│   ├── extension-server-final-fix.js           # Main orchestrator
│   ├── prompt-enhancement-agent-ultra.js       # Prompt optimization
│   ├── intelligent-workflow-validator-ultra.js # Validation system
│   ├── flow-coherence-agent-ultra.js          # Logic verification
│   ├── intelligent-positioning-agent-ultra.js  # Layout engine
│   └── gemini-model-router.js                 # LLM routing
│
├── 📂 workflows/             # Example templates
├── 📂 Oficial/               # Official production-ready agents
├── 📄 manifest.json          # Extension configuration
├── 📄 vite.config.js         # Build configuration
└── 📄 package.json           # Dependencies
```

---

## 🔧 Development

### Running Locally

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start proxy server (optional)
npm run server
```

### Configuration Storage

API keys are securely stored in the browser's storage (not in `.env` files):

- Configure via the **Options Page** after installing the extension
- Keys are stored using `chrome.storage.local` API
- For the optional proxy server (`server.js`), create a `.env` file with:
  ```env
  OPENAI_API_KEY=your_openai_key_here
  GEMINI_API_KEY=your_gemini_key_here
  GROK_API_KEY=your_grok_key_here
  ```

### Debugging

- **Extension Console**: Right-click extension icon → Inspect popup
- **Content Script**: Open n8n → F12 → Console tab
- **Background Script**: Go to `chrome://extensions/` → Details → Inspect views

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| Initial Load Time | < 1 second |
| Average Workflow Generation | 2-10 seconds |
| Local Validation | < 100ms |
| AI Validation | 1-3 seconds |
| Memory Footprint | ~50MB |

---

## 🛣️ Roadmap

### ✅ Completed

- [x] Core extension architecture
- [x] Multi-LLM integration
- [x] Specialized AI agent system
- [x] Automatic workflow validation
- [x] Modern React UI
- [x] Chrome & Firefox support

### 🔄 In Progress

- [ ] Performance optimizations
- [ ] Extended workflow templates library
- [ ] n8n Cloud API integration
- [ ] Plugin system for custom agents

### 🎯 Future Plans

- [ ] Safari & Edge official support
- [ ] Offline mode with local LLMs
- [ ] AI-generated workflow marketplace
- [ ] VS Code integration
- [ ] Collaborative workflow editing
- [ ] Voice command support

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs**: [Open an issue](https://github.com/Eddym06/n8n-ai-assistant/issues)
- 💡 **Suggest Features**: Share your ideas in discussions
- 📝 **Improve Documentation**: Help us make guides clearer
- 🎨 **UI/UX Enhancements**: Make the interface even better
- 🧪 **Add Tests**: Improve code quality and coverage

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Use ESLint configuration provided
- Follow React best practices
- Write clear commit messages
- Add comments for complex logic

---

## 📄 License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.

---

## 🔗 Resources

- **📚 Documentation**: [n8n Official Docs](https://docs.n8n.io/)
- **🌐 n8n Community**: [Community Forum](https://community.n8n.io/)
- **🐛 Report Issues**: [GitHub Issues](https://github.com/Eddym06/n8n-ai-assistant/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/Eddym06/n8n-ai-assistant/discussions)
- **🎓 Chrome Extensions**: [Developer Guide](https://developer.chrome.com/docs/extensions/)

---

## 🙏 Acknowledgments

- **n8n Team**: For creating an amazing automation platform
- **Open Source Community**: For the incredible tools and libraries
- **Contributors**: Everyone who has helped improve this project

---

## 📞 Support

Need help? Have questions?

- 📧 **Email**: Open an issue with the `question` label
- 💬 **Discussions**: Use GitHub Discussions for general questions
- 🐛 **Bug Reports**: Use GitHub Issues with detailed reproduction steps

---

<div align="center">

**Made with ❤️ by the n8n AI Assistant Team**

⭐ **Star this repo** if you find it useful!

[⬆ Back to Top](#-n8n-ai-assistant)

</div>
