// Initial quotes array
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "work" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "In the middle of difficulty lies opportunity.", category: "inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

// Display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p class="category">— ${quote.category}</p>
  `;
}

// Add a new quote (FIXED IMPLEMENTATION)
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  
  // Validate inputs
  if (!textInput.value.trim() || !categoryInput.value.trim()) {
    alert('Please enter both quote text and category');
    return;
  }

  // Add to quotes array
  quotes.push({
    text: textInput.value.trim(),
    category: categoryInput.value.trim()
  });

  // Clear inputs
  textInput.value = '';
  categoryInput.value = '';

  // Update DOM
  showRandomQuote();
}

// Event listener for "Show New Quote" button (FIXED IMPLEMENTATION)
newQuoteBtn.addEventListener('click', function() {
  showRandomQuote();
});

// Initialize
showRandomQuote();
