// Quote management system
class QuoteManager {
  constructor() {
    this.quotes = JSON.parse(localStorage.getItem('quotes')) || [
      { text: "The only way to do great work is to love what you do.", category: "work" },
      { text: "Life is what happens when you're busy making other plans.", category: "life" },
      { text: "In the middle of difficulty lies opportunity.", category: "inspiration" }
    ];
    this.initElements();
    this.setupEventListeners();
    this.initApp();
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
  }

  setupEventListeners() {
    this.newQuoteBtn.addEventListener('click', () => this.showRandomQuote());
    this.addQuoteBtn.addEventListener('click', () => this.addQuote());
    this.categoryFilter.addEventListener('change', () => this.filterQuotes());
    this.exportBtn.addEventListener('click', () => this.exportToJsonFile());
    this.importFile.addEventListener('change', (e) => this.importFromJsonFile(e));
    this.syncButton.addEventListener('click', () => this.syncWithServer());
  }

  initApp() {
    this.showRandomQuote();
    this.populateCategories();
    this.restoreLastFilter();
  }

  // TASK 0: Core functionality
  showRandomQuote(filteredQuotes = null) {
    const quotesToUse = filteredQuotes || this.quotes;
    
    if (quotesToUse.length === 0) {
      this.quoteDisplay.innerHTML = "<p>No quotes available. Please add some quotes.</p>";
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * quotesToUse.length);
    const quote = quotesToUse[randomIndex];
    this.quoteDisplay.innerHTML = `
      <p>"${quote.text}"</p>
      <p class="category">— ${quote.category}</p>
    `;
    
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  }

  addQuote() {
    const text = this.newQuoteText.value.trim();
    const category = this.newQuoteCategory.value.trim();
    
    if (!text || !category) {
      this.showNotification('Please enter both quote text and category', true);
      return;
    }
    
    this.quotes.push({ text, category });
    this.saveQuotes();
    this.newQuoteText.value = '';
    this.newQuoteCategory.value = '';
    this.populateCategories();
    this.showRandomQuote();
    this.showNotification('Quote added successfully!');
  }

  // TASK 1: Web Storage and JSON
  saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(this.quotes));
  }

  exportToJsonFile() {
    const dataStr = JSON.stringify(this.quotes);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'quotes.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    this.showNotification('Quotes exported successfully!');
  }

  importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (Array.isArray(importedQuotes) {
          this.quotes = importedQuotes;
          this.saveQuotes();
          this.populateCategories();
          this.showRandomQuote();
          this.showNotification('Quotes imported successfully!');
        } else {
          throw new Error('Invalid format: Expected array of quotes');
        }
      } catch (error) {
        this.showNotification('Error importing quotes: ' + error.message, true);
      }
    };
    reader.readAsText(file);
  }

  // TASK 2: Filtering system
  populateCategories() {
    this.categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    const categories = [...new Set(this.quotes.map(quote => quote.category))];
    
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      this.categoryFilter.appendChild(option);
    });
  }

  filterQuotes() {
    const selectedCategory = this.categoryFilter.value;
    localStorage.setItem('lastCategoryFilter', selectedCategory);
    
    if (selectedCategory === 'all') {
      this.showRandomQuote();
    } else {
      const filteredQuotes = this.quotes.filter(quote => quote.category === selectedCategory);
      this.showRandomQuote(filteredQuotes);
    }
  }

  restoreLastFilter() {
    const lastFilter = localStorage.getItem('lastCategoryFilter');
    if (lastFilter) {
      this.categoryFilter.value = lastFilter;
    }
  }

  // TASK 3: Server sync
  async syncWithServer() {
    try {
      // Simulate server request
      this.showNotification('Syncing with server...');
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      
      if (!response.ok) throw new Error('Server not available');
      
      // In a real app, you would compare and merge data here
      this.showNotification('Data synced with server (simulated)');
      
    } catch (error) {
      this.showNotification('Sync failed: ' + error.message, true);
    }
  }

  // Helper function
  showNotification(message, isError = false) {
    this.notification.textContent = message;
    this.notification.style.backgroundColor = isError ? '#ffcccc' : '#ccffcc';
    this.notification.style.borderColor = isError ? '#ff0000' : '#00ff00';
    this.notification.style.display = 'block';
    
    setTimeout(() => {
      this.notification.style.display = 'none';
    }, 3000);
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new QuoteManager();
});
