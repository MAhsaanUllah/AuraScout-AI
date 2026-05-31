// Frontend logic & BYOK localStorage routing

// Dynamic API Environment Routing
const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? "http://127.0.0.1:8000" 
    : "http://127.0.0.1:8000"; // Fallback to local server for demo setups from remote GH Pages

function writeToTerminal(msg) {
    const term = document.getElementById('terminal-output');
    if (!term) return;
    term.innerHTML += `<br>> ${msg}`;
    term.scrollTop = term.scrollHeight;
}

// Example Scout Execution
function executeScout() {
    const searchInput = document.getElementById('search-input').value;
    if (!searchInput) {
        writeToTerminal("<span style='color: #ef4444;'>Error: Query parameter missing.</span>");
        return;
    }

    // Collapse Report Card
    const reportCard = document.getElementById('scout-report-card');
    if (reportCard) {
        reportCard.style.display = 'none';
    }

    writeToTerminal(`Initiating Serper heuristics for: "${searchInput}"...`);
    writeToTerminal("Extracting DOM via Firecrawl API...");
    writeToTerminal("Parsing schemas via Gemini AI...");

    // Simulated API response delay
    setTimeout(() => {
        writeToTerminal("Extraction complete. Injecting into Matrix Hub.");
        
        // Mock data to inject
        const mockData = [{
            Company: "CyberShield Dynamics",
            Industry: "Cybersecurity",
            Contact: "+1 (800) 123-4567",
            Quality: "High Confidence"
        }];
        
        appendSavedHub(mockData);
        document.getElementById('search-input').value = ""; // Clear input
    }, 2000);
}

// Safe DOM Rendering for XSS Protection
function appendSavedHub(data) {
    const tableBody = document.getElementById('saved-hub-body'); 
    if (!tableBody) return;

    data.forEach(item => {
        const row = document.createElement('tr');

        const companyCell = document.createElement('td');
        companyCell.textContent = item.Company || 'N/A';
        row.appendChild(companyCell);

        const industryCell = document.createElement('td');
        industryCell.textContent = item.Industry || 'N/A';
        row.appendChild(industryCell);

        const contactCell = document.createElement('td');
        contactCell.textContent = item.Contact || 'N/A';
        row.appendChild(contactCell);
        
        const qualityCell = document.createElement('td');
        const badgeSpan = document.createElement('span');
        badgeSpan.className = item.Quality.includes('High') ? 'badge badge-high-quality' : 'badge badge-low-quality';
        badgeSpan.textContent = item.Quality || 'Unrated';
        qualityCell.appendChild(badgeSpan);
        row.appendChild(qualityCell);

        // Prepend to show newest first
        tableBody.insertBefore(row, tableBody.firstChild);
    });
}

function clearHistory() {
    const tableBody = document.getElementById('saved-hub-body'); 
    if (tableBody) tableBody.innerHTML = '';
    writeToTerminal("Intelligence Hub cleared.");
}
