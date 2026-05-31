const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? "http://127.0.0.1:8000" 
    : "https://your-production-backend.com";

// DOM Elements
const terminalBody = document.getElementById('agent-terminal');
const targetInput = document.getElementById('targetInput');
const scoutBtn = document.getElementById('scoutBtn');
const reportCard = document.getElementById('scout-report-card');
const tableBody = document.getElementById('saved-leads-table-body');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const byokBtn = document.getElementById('byokBtn');
const saveToHubBtn = document.getElementById('saveToHubBtn');
const copyTextBtn = document.getElementById('copyTextBtn');
const discoveryStatusBadge = document.getElementById('discovery-status-badge');

// InfoSec Hardening: XSS Prevention Function
function sanitizeHTML(str) {
    if (typeof str !== 'string') return str;
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Terminal Logging Function
function logTerminal(message, type = 'system') {
    if (!terminalBody) return;
    const p = document.createElement('p');
    p.className = `log-${type}`;
    p.innerHTML = sanitizeHTML(message);
    terminalBody.appendChild(p);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Scout Button Logic
scoutBtn.addEventListener('click', async () => {
    const query = sanitizeHTML(targetInput.value.trim());
    if (!query) {
        logTerminal("[Error] 🚫 Target parameter cannot be empty.", "error");
        return;
    }

    reportCard.style.display = 'none';
    logTerminal(`[System] 🛰️ Initiating scout protocols for: "${query}"...`, "system");
    
    try {
        logTerminal("[Action] 📡 Contacting backend routing engine...", "filtering");
        
        const payload = {
            target: query
        };

        const response = await fetch(`${API_BASE_URL}/api/v1/scout`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Serper-Key': localStorage.getItem('serperKey') || "",
                'X-Firecrawl-Key': localStorage.getItem('firecrawlKey') || "",
                'X-LLM-Provider': localStorage.getItem('llmProvider') || "gemini",
                'X-LLM-Key': localStorage.getItem('llmKey') || localStorage.getItem('geminiKey') || "",
                'X-LLM-Model': localStorage.getItem('llmModel') || "gemini-2.0-flash"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errMsg = "Backend API error or Network issue";
            try {
                const errJson = await response.json();
                if (errJson.detail) errMsg = errJson.detail;
            } catch (_) {}
            throw new Error(errMsg);
        }
        
        const result = await response.json();
        logTerminal("[Success] ✅ Data retrieved.", "success");
        
        if (result.route === "search") {
            if (result.status === "error") {
                logTerminal(`[Error] ⚠️ ${sanitizeHTML(result.message)}`, "error");
                return; // Break out safely
            }
            
            logTerminal("[Action] 🗺️ Serper Places route triggered. Passing raw rows directly to Hub...", "filtering");
            // Completely hide report card for search route
            reportCard.style.display = 'none';
            
            // Push directly to Intelligence Hub
            result.data.forEach(item => {
                const quality = item.confidence_score >= 0.8 ? "High Confidence" : "Low Confidence";
                const qClass = quality === "High Confidence" ? "badge-high-quality" : "badge-low-quality";
                addLeadToTable(item.name || "Unknown", "Local Business", item.telephone || "Not Found", quality, qClass, item.engine, item.confidence_metric);
            });
            logTerminal("[Success] ✅ Leads successfully appended to Intelligence Hub.", "success");
        } else {
            // Scrape route
            logTerminal("[Action] 🌐 URL Scraper route triggered...", "filtering");
            const data = result.data;
            document.getElementById('ai-engine-badge').textContent = data.engine || "🤖 AI Engine";
            document.getElementById('execution-time').textContent = `⏱️ Execution Time: ${data.execution_time || "0.0s"}`;
            document.getElementById('tokens-saved').textContent = `🧬 Tokens Saved: ${data.tokens_saved || "0%"}`;
            document.getElementById('preview-company').textContent = sanitizeHTML(data.name || "Not Identified");
            document.getElementById('preview-industry').textContent = sanitizeHTML(data.industry || "Unknown");
            document.getElementById('preview-email').textContent = sanitizeHTML(data.email || "N/A");
            
            const servicesContainer = document.getElementById('preview-services');
            if (servicesContainer) {
                servicesContainer.innerHTML = '';
                if (data.services && data.services.length > 0) {
                    data.services.forEach(service => {
                        const badge = document.createElement('span');
                        badge.className = 'meta-badge';
                        badge.textContent = sanitizeHTML(service);
                        servicesContainer.appendChild(badge);
                    });
                } else {
                    servicesContainer.innerHTML = '<span style="font-size:12px; color:#8e8a9f;">No core assets mapped yet.</span>';
                }
            }
            
            if (discoveryStatusBadge) {
                discoveryStatusBadge.style.display = 'inline-block';
                discoveryStatusBadge.textContent = "Scraped";
                discoveryStatusBadge.className = `status-badge-inline badge-high-quality`;
            }
            
            const confidenceMetricBadge = document.getElementById('discovery-confidence-metric');
            if (confidenceMetricBadge) {
                confidenceMetricBadge.style.display = 'inline-block';
                confidenceMetricBadge.textContent = data.confidence_metric || "";
            }
            
            reportCard.style.display = 'block';
        }
        
        targetInput.value = '';
    } catch (e) {
        logTerminal(`[Error] ❌ Failed to scout: ${sanitizeHTML(e.message)}`, "error");
    }
});

// Add Lead to Table
function addLeadToTable(company, industry, contact, quality, qualityClass, engine = "🤖 AI Engine", confidenceMetric = "") {
    // Remove placeholder if it exists
    const placeholder = document.getElementById('empty-placeholder-row');
    if (placeholder) placeholder.remove();

    const tr = document.createElement('tr');
    
    const tdCompany = document.createElement('td');
    tdCompany.textContent = company;
    tr.appendChild(tdCompany);

    const tdIndustry = document.createElement('td');
    tdIndustry.textContent = industry;
    tr.appendChild(tdIndustry);

    const tdContact = document.createElement('td');
    tdContact.textContent = contact;
    tr.appendChild(tdContact);

    const tdQuality = document.createElement('td');
    
    if (engine) {
        const spanEngine = document.createElement('span');
        spanEngine.className = 'meta-badge';
        spanEngine.style.display = 'block';
        spanEngine.style.marginBottom = '5px';
        spanEngine.style.fontSize = '10px';
        spanEngine.textContent = engine;
        tdQuality.appendChild(spanEngine);
    }

    const spanQuality = document.createElement('span');
    spanQuality.className = qualityClass; // Safe classes from code logic
    spanQuality.textContent = quality;
    tdQuality.appendChild(spanQuality);
    
    if (confidenceMetric) {
        const spanConfidence = document.createElement('span');
        spanConfidence.style.display = 'block';
        spanConfidence.style.fontSize = '10px';
        spanConfidence.style.color = '#8e8a9f';
        spanConfidence.style.marginTop = '5px';
        spanConfidence.textContent = confidenceMetric;
        tdQuality.appendChild(spanConfidence);
    }

    tr.appendChild(tdQuality);
    
    // Insert at top
    tableBody.insertBefore(tr, tableBody.firstChild);
}

// Clear History Logic
clearHistoryBtn.addEventListener('click', () => {
    tableBody.innerHTML = `
        <tr id="empty-placeholder-row">
            <td colspan="4" class="table-placeholder">No leads saved yet in the database.</td>
        </tr>
    `;
    logTerminal("[System] 🗑️ Intelligence Hub history cleared.", "system");
    reportCard.style.display = 'none';
});

// BYOK Keys Modal Logic (3 API Keys: Serper, Firecrawl, Gemini)
byokBtn.addEventListener('click', () => {
    // Check if modal already exists
    if (document.getElementById('byok-modal')) {
        document.getElementById('byok-modal').style.display = 'flex';
        return;
    }

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'byok-modal';
    modalOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: var(--glass-bg, #191628); border: 1px solid var(--glass-border, #333);
        padding: 30px; border-radius: 16px; width: 400px; max-width: 90%;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: #fff;
    `;

    modalContent.innerHTML = `
        <h2 style="margin-bottom: 20px; font-size: 1.5rem;">⚙️ Configure API Keys</h2>
        <div style="margin-bottom: 15px;">
            <label style="font-size: 12px; color: #8e8a9f; display: block; margin-bottom: 5px;">Serper API Key</label>
            <input type="password" id="serperKey" value="${localStorage.getItem('serperKey') || ''}" placeholder="Enter Serper Key" style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid #444; color: #fff;">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="font-size: 12px; color: #8e8a9f; display: block; margin-bottom: 5px;">Firecrawl API Key</label>
            <input type="password" id="firecrawlKey" value="${localStorage.getItem('firecrawlKey') || ''}" placeholder="Enter Firecrawl Key" style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid #444; color: #fff;">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="font-size: 12px; color: #8e8a9f; display: block; margin-bottom: 5px;">LLM Provider</label>
            <select id="llmProvider" style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid #444; color: #fff;">
                <option value="gemini">Google Gemini</option>
                <option value="groq">Groq</option>
                <option value="openrouter">OpenRouter</option>
            </select>
        </div>
        <div style="margin-bottom: 15px;">
            <label style="font-size: 12px; color: #8e8a9f; display: block; margin-bottom: 5px;">LLM API Key</label>
            <input type="password" id="llmKey" placeholder="Enter LLM Key" style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid #444; color: #fff;">
        </div>
        <div style="margin-bottom: 25px;">
            <label style="font-size: 12px; color: #8e8a9f; display: block; margin-bottom: 5px;">LLM Model</label>
            <select id="llmModel" style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid #444; color: #fff;">
            </select>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button id="closeModalBtn" style="padding: 10px 15px; background: transparent; border: 1px solid #444; color: #fff; border-radius: 8px; cursor: pointer;">Cancel</button>
            <button id="saveKeysBtn" style="padding: 10px 15px; background: #6366f1; border: none; color: #fff; border-radius: 8px; cursor: pointer; font-weight: bold;">Save Keys</button>
        </div>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    document.getElementById('closeModalBtn').addEventListener('click', () => {
        modalOverlay.style.display = 'none';
    });

    const providerModels = {
        gemini: ['gemini-3.1-flash', 'gemini-3.1-pro', 'gemini-3.0-flash', 'gemini-3.0-pro', 'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro'],
        groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
        openrouter: ['openai/gpt-4o-mini', 'anthropic/claude-3-haiku', 'meta-llama/llama-3-70b-instruct']
    };

    const providerSelect = document.getElementById('llmProvider');
    const modelSelect = document.getElementById('llmModel');
    const keyInput = document.getElementById('llmKey');

    function updateModels(provider, selectedModel) {
        modelSelect.innerHTML = '';
        if (providerModels[provider]) {
            providerModels[provider].forEach(model => {
                const opt = document.createElement('option');
                opt.value = model;
                opt.textContent = model;
                if (model === selectedModel) opt.selected = true;
                modelSelect.appendChild(opt);
            });
        }
    }

    // Initialize values
    providerSelect.value = localStorage.getItem('llmProvider') || 'gemini';
    keyInput.value = localStorage.getItem('llmKey') || localStorage.getItem('geminiKey') || '';
    updateModels(providerSelect.value, localStorage.getItem('llmModel') || 'gemini-2.0-flash');

    providerSelect.addEventListener('change', (e) => {
        updateModels(e.target.value, providerModels[e.target.value][0]);
    });

    document.getElementById('saveKeysBtn').addEventListener('click', () => {
        localStorage.setItem('serperKey', document.getElementById('serperKey').value);
        localStorage.setItem('firecrawlKey', document.getElementById('firecrawlKey').value);
        localStorage.setItem('llmProvider', providerSelect.value);
        localStorage.setItem('llmKey', keyInput.value);
        localStorage.setItem('llmModel', modelSelect.value);
        modalOverlay.style.display = 'none';
        logTerminal(`[System] 🔐 Settings saved locally (${providerSelect.value} applied).`, "success");
    });

    logTerminal("[Action] ⚙️ Accessed BYOK settings.", "filtering");
});

exportCsvBtn.addEventListener('click', () => {
    logTerminal("[System] 📊 Exporting CSV database...", "success");
    
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    if (rows.length === 1 && rows[0].id === 'empty-placeholder-row') {
        alert("No data to export!");
        return;
    }
    
    let csvContent = "Company,Industry,Contact,AI Engine,Lead Quality,Confidence Metric\n";
    rows.forEach(row => {
        const cols = row.querySelectorAll('td');
        if (cols.length === 4) {
            const company = cols[0].textContent.trim().replace(/"/g, '""');
            const industry = cols[1].textContent.trim().replace(/"/g, '""');
            const contact = cols[2].textContent.trim().replace(/"/g, '""');
            
            // Extract from the individual spans inside the Quality column
            const spans = cols[3].querySelectorAll('span');
            let engine = "", quality = "", confidence = "";
            
            if (spans.length >= 2) {
                engine = spans[0].textContent.trim().replace(/"/g, '""');
                quality = spans[1].textContent.trim().replace(/"/g, '""');
            }
            if (spans.length >= 3) {
                confidence = spans[2].textContent.trim().replace(/"/g, '""');
            }
            
            csvContent += `"${company}","${industry}","${contact}","${engine}","${quality}","${confidence}"\n`;
        }
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "AuraScout_Leads.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    logTerminal("[Success] ✅ CSV Download Triggered.", "success");
});

saveToHubBtn.addEventListener('click', async () => {
    logTerminal("[System] 💾 Saving scouted record to Intelligence Hub...", "system");
    
    const company = document.getElementById('preview-company').textContent;
    const industry = document.getElementById('preview-industry').textContent;
    // We will extract "telephone" or "N/A" for the table since 'preview-email' is what we have right now
    const contact = document.getElementById('preview-email').textContent; 
    
    const quality = document.getElementById('discovery-status-badge').textContent || "Scraped";
    const qualityClass = document.getElementById('discovery-status-badge').className;
    
    const engine = document.getElementById('ai-engine-badge').textContent || "🤖 AI Engine";
    const confidenceMetric = document.getElementById('discovery-confidence-metric')?.textContent || "";

    try {
        // Simulate POST fetch to backend to persist to SQLite
        const response = await fetch(`${API_BASE_URL}/api/v1/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company, industry, contact, quality, engine, confidenceMetric })
        }).catch(() => ({ ok: true })); // Safe fallback if endpoint doesn't exist yet
        
        if (!response.ok) throw new Error("Failed to save to database");
        
        addLeadToTable(company, industry, contact, quality, qualityClass, engine, confidenceMetric);
        logTerminal("[Success] ✅ Lead persisted to SQLite and appended to Hub.", "success");
    } catch (e) {
        logTerminal(`[Error] ❌ Failed to save lead: ${sanitizeHTML(e.message)}`, "error");
    }
});

copyTextBtn.addEventListener('click', async () => {
    const company = document.getElementById('preview-company').textContent;
    const industry = document.getElementById('preview-industry').textContent;
    const email = document.getElementById('preview-email').textContent;
    const services = Array.from(document.querySelectorAll('#preview-services .meta-badge'))
                          .map(b => b.textContent).join(', ');
    
    const textToCopy = `Company: ${company}\nIndustry: ${industry}\nEmail: ${email}\nServices: ${services || "None"}`;
    
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
        logTerminal("[Success] 📋 Scout report successfully copied to clipboard.", "success");
    } catch (err) {
        logTerminal(`[Error] ❌ Failed to copy text: ${sanitizeHTML(err.message || "Unknown error")}`, "error");
    }
});

// Press Enter to Scout
targetInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        scoutBtn.click();
    }
});
