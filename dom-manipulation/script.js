class QuoteManager {
  constructor() {
    this.quotes = JSON.parse(localStorage.getItem('quotes')) || [
      { text: "The only way to do great work is to love what you do.", category: "work" },
      { text: "Life is what happens when you're busy making other plans.", category: "life" },
      { text: "In the middle of difficulty lies opportunity.", category: "inspiration" }
    ];
    this.lastSyncTime = localStorage.getItem('lastSyncTime') || 0;
    this.initElements();
    this.setupEventListeners();
    this.initApp();
    this.setupSyncInterval();
  }

  initElements() {
    this.quoteDisplay = document.getElementById('quoteDisplay');
    this.newQuoteBtn = document.getElementById('newQuote');
    this.addQuoteBtn = document.getElementById('addQuoteBtn');
    this.categoryFilter = document.getElementById('categoryFilter');
    this.newQuoteText = document.getElementById('newQuoteText');
    this.newQuoteCategory = document.getElementById('newQuoteCategory');
    this.exportBtn = document.getElementById('exportBtn');
    this.importFile = document.getElementById('importFile');
    this.syncButton = document.getElementById('syncButton');
    this.notification = document.getElementById('notification');
    this.conflictResolutionModal = document.createElement('div');
    this.conflictResolutionModal.id = 'conflictModal';
    this.conflictResolutionModal.style.display = 'none';
    document.body.appendChild(this.conflictResolutionModal);
  }

  // TASK 1: JSON Export/Import - Fixed implementations
  exportToJsonFile() {
    try {
      const dataStr = JSON.stringify(this.quotes, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `quotes_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      this.showNotification('Quotes exported successfully!');
    } catch (error) {
      this.showNotification('Export failed: ' + error.message, true);
    }
  }

  importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        
        if (!Array.isArray(importedQuotes)) {
          throw new Error('Invalid format: Expected array of quotes');
        }
        
        // Validate each quote has required fields
        const isValid = importedQuotes.every(q => q.text && q.category);
        if (!isValid) {
          throw new Error('Some quotes are missing required fields');
        }
        
        // Show conflict resolution if there are existing quotes
        if (this.quotes.length > 0) {
          await this.showConflictResolution(importedQuotes);
        } else {
          this.quotes = importedQuotes;
          this.saveQuotes();
          this.showNotification('Quotes imported successfully!');
        }
        
        this.populateCategories();
        this.showRandomQuote();
        event.target.value = ''; // Reset file input
      } catch (error) {
        this.showNotification('Import failed: ' + error.message, true);
      }
    };
    reader.readAsText(file);
  }

  // TASK 3: Server Sync - Complete implementation
  async fetchQuotesFromServer() {
    try {
      // Using JSONPlaceholder as mock API
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) throw new Error('Server returned ' + response.status);
      
      const serverData = await response.json();
      
      // Transform mock data to our quote format
      return serverData.slice(0, 5).map(post => ({
        text: post.title,
        category: `server-${post.userId}`
      }));
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  async postQuotesToServer() {
    try {
      // Simulate posting to server
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Quote sync',
          body: JSON.stringify(this.quotes),
          userId: 1
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      if (!response.ok) throw new Error('Server returned ' + response.status);
      return await response.json();
    } catch (error) {
      console.error('Post error:', error);
      throw error;
    }
  }

  async syncQuotes() {
    try {
      this.showNotification('Starting sync with server...');
      
      // 1. Get server data
      const serverQuotes = await this.fetchQuotesFromServer();
      
      // 2. Post our data to server
      await this.postQuotesToServer();
      
      // 3. Merge strategies
      const mergedQuotes = this.mergeQuotes(this.quotes, serverQuotes);
      
      // 4. Update local storage if changes
      if (JSON.stringify(mergedQuotes) !== JSON.stringify(this.quotes)) {
        this.quotes = mergedQuotes;
        this.saveQuotes();
        this.lastSyncTime = Date.now();
        localStorage.setItem('lastSyncTime', this.lastSyncTime);
        this.showNotification('Sync complete! Merged ' + (mergedQuotes.length - this.quotes.length) + ' new quotes');
      } else {
        this.showNotification('Sync complete - no new quotes found');
      }
      
      this.populateCategories();
      this.showRandomQuote();
    } catch (error) {
      this.showNotification('Sync failed: ' + error.message, true);
    }
  }

  mergeQuotes(localQuotes, serverQuotes) {
    // Simple merge by unique text (in real app would use proper IDs)
    const merged = [...localQuotes];
    const localTexts = new Set(localQuotes.map(q => q.text));
    
    for (const serverQuote of serverQuotes) {
      if (!localTexts.has(serverQuote.text)) {
        merged.push(serverQuote);
      }
    }
    
    return merged;
  }

  setupSyncInterval() {
    // Sync every 2 minutes
    setInterval(() => {
      this.syncQuotes();
    }, 120000);
  }

  async showConflictResolution(importedQuotes) {
    return new Promise((resolve) => {
      this.conflictResolutionModal.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
        background: white; padding: 20px; border: 1px solid #ccc; z-index: 1001;">
          <h3>Conflict Resolution</h3>
          <p>Found ${importedQuotes.length} quotes to import with ${this.quotes.length} existing quotes.</p>
          <button id="mergeBtn">Merge All</button>
          <button id="replaceBtn">Replace All</button>
          <button id="cancelBtn">Cancel</button>
        </div>
      `;
      
      this.conflictResolutionModal.style.display = 'block';
      
      document.getElementById('mergeBtn').addEventListener('click', () => {
        this.quotes = this.mergeQuotes(this.quotes, importedQuotes);
        this.saveQuotes();
        this.showNotification('Quotes merged successfully!');
        this.conflictResolutionModal.style.display = 'none';
        resolve();
      });
      
      document.getElementById('replaceBtn').addEventListener('click', () => {
        this.quotes = importedQuotes;
        this.saveQuotes();
        this.showNotification('Quotes replaced successfully!');
        this.conflictResolutionModal.style.display = 'none';
        resolve();
      });
      
      document.getElementById('cancelBtn').addEventListener('click', () => {
        this.showNotification('Import cancelled', true);
        this.conflictResolutionModal.style.display = 'none';
        resolve();
      });
    });
  }

  // ... (rest of the existing methods remain the same)
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new QuoteManager();
});
