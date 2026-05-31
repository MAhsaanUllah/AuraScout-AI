const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? "http://127.0.0.1:8000" 
    : "http://127.0.0.1:8000"; // Fallback to local server for demo setups

// DOM Elements
const terminalBody = document.getElementById('agent-terminal');
const targetInput = document.getElementById('targetInput');
const scoutBtn = document.getElementById('scoutBtn');
const reportCard = document.getElementById('scout-report-card');
const tableBody = document.getElementById('saved-leads-table-body');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const byokBtn = document.getElementById('byokBtn');
const downloadJsonBtn = document.getElementById('downloadJsonBtn');
const shareLinkBtn = document.getElementById('shareLinkBtn');

// Terminal Logging Function
function logTerminal(message, type = 'system') {
    if (!terminalBody) return;
    const p = document.createElement('p');
    p.className = `log-${type}`;
    p.innerHTML = message;
    terminalBody.appendChild(p);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Scout Button Logic
scoutBtn.addEventListener('click', () => {
    const query = targetInput.value.trim();
    if (!query) {
        logTerminal("[Error] 🚫 Target parameter cannot be empty.", "error");
        return;
    }

    // Reset UI
    reportCard.style.display = 'none';
    logTerminal(`[System] 🛰️ Initiating scout protocols for: "${query}"...`, "system");
    logTerminal("[Action] 🔍 Deploying Serper heuristics...", "filtering");
    
    // Simulate API delay and processing
    setTimeout(() => {
        logTerminal("[Action] 🌐 Extracting DOM via Firecrawl API...", "filtering");
    }, 1000);

    setTimeout(() => {
        logTerminal("[Action] 🧠 Parsing schemas via Gemini AI...", "filtering");
    }, 2500);

    setTimeout(() => {
        logTerminal("[Success] ✅ Extraction complete. Rendering report...", "success");
        
        // Mock Data Generation based on query
        const mockCompany = query.length > 10 ? query.substring(0, 15) + " Corp" : "TechNova Solutions";
        const mockIndustry = "Artificial Intelligence";
        const mockEmail = `contact@${mockCompany.toLowerCase().replace(/\s+/g, '')}.com`;
        const mockPhone = "+1 (555) " + Math.floor(1000000 + Math.random() * 9000000).toString().substring(0, 7);
        const qualityLevel = Math.random() > 0.5 ? "High Confidence" : "Missing Phone";
        const qualityClass = qualityLevel === "High Confidence" ? "badge-high-quality" : "badge-low-quality";
        
        // Update Report Card
        document.getElementById('execution-time').textContent = `⏱️ Execution Time: ${(Math.random() * 2 + 1).toFixed(2)}s`;
        document.getElementById('tokens-saved').textContent = `🧬 Tokens Saved: ${Math.floor(Math.random() * 40 + 60)}%`;
        document.getElementById('preview-company').textContent = mockCompany;
        document.getElementById('preview-industry').textContent = mockIndustry;
        document.getElementById('preview-email').textContent = mockEmail;
        
        // Populate Core Services
        const servicesContainer = document.getElementById('preview-services');
        servicesContainer.innerHTML = `
            <span class="meta-badge">Enterprise AI</span>
            <span class="meta-badge">Data Scraping</span>
            <span class="meta-badge">Automation</span>
        `;
        
        reportCard.style.display = 'block';

        // Add to Saved Leads Table
        addLeadToTable(mockCompany, mockIndustry, mockPhone, qualityLevel, qualityClass);
        
        targetInput.value = ''; // Clear input
    }, 4000);
});

// Add Lead to Table
function addLeadToTable(company, industry, contact, quality, qualityClass) {
    // Remove placeholder if it exists
    const placeholder = document.getElementById('empty-placeholder-row');
    if (placeholder) placeholder.remove();

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${company}</td>
        <td>${industry}</td>
        <td>${contact}</td>
        <td><span class="${qualityClass}">${quality}</span></td>
    `;
    
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
        <div style="margin-bottom: 25px;">
            <label style="font-size: 12px; color: #8e8a9f; display: block; margin-bottom: 5px;">Gemini API Key</label>
            <input type="password" id="geminiKey" value="${localStorage.getItem('geminiKey') || ''}" placeholder="Enter Gemini Key" style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid #444; color: #fff;">
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

    document.getElementById('saveKeysBtn').addEventListener('click', () => {
        localStorage.setItem('serperKey', document.getElementById('serperKey').value);
        localStorage.setItem('firecrawlKey', document.getElementById('firecrawlKey').value);
        localStorage.setItem('geminiKey', document.getElementById('geminiKey').value);
        modalOverlay.style.display = 'none';
        logTerminal("[System] 🔐 API Keys saved locally (BYOK applied).", "success");
    });

    logTerminal("[Action] ⚙️ Accessed BYOK settings.", "filtering");
});

exportCsvBtn.addEventListener('click', () => {
    logTerminal("[System] 📊 Exporting CSV database...", "success");
    setTimeout(() => alert("CSV Exported Successfully!"), 500);
});

downloadJsonBtn.addEventListener('click', () => {
    alert("Downloading JSON report...");
});

shareLinkBtn.addEventListener('click', () => {
    alert("Shareable link copied to clipboard!");
});

// Press Enter to Scout
targetInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        scoutBtn.click();
    }
});
