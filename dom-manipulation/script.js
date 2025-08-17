// Initial quotes array
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "work" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "In the middle of difficulty lies opportunity.", category: "inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

// Display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available. Please add some quotes.</p>";
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p class="category">— ${quote.category}</p>
  `;
}

// Create form for adding new quotes (as per requirement)
function createAddQuoteForm() {
  // This is already implemented in the HTML as per the task description
  // The form elements are present in the provided HTML structure
}

// Add a new quote (corrected implementation)
function addQuote() {
  const quoteText = newQuoteText.value.trim();
  const quoteCategory = newQuoteCategory.value.trim();

  if (quoteText && quoteCategory) {
    // Add new quote to array
    quotes.push({
      text: quoteText,
      category: quoteCategory
    });

    // Clear form inputs
    newQuoteText.value = '';
    newQuoteCategory.value = '';

    // Update the DOM by showing a random quote (including the new one)
    showRandomQuote();
  } else {
    alert('Please enter both a quote and a category');
  }
}

// Event listener for "Show New Quote" button (corrected implementation)
newQuoteBtn.addEventListener('click', showRandomQuote);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createAddQuoteForm();
  showRandomQuote();
});
