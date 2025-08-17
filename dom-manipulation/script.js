// Initial quotes array
let quotes = [
  "The best way to predict the future is to create it.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there."
];

// Function to display a random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = quotes[randomIndex];
}

// Function to add a new quote
function addQuote() {
  const newQuoteInput = document.getElementById("newQuoteInput");
  const newQuote = newQuoteInput.value.trim();

  if (newQuote) {
    quotes.push(newQuote); // Add to array
    newQuoteInput.value = ""; // Clear input
    displayRandomQuote(); // Update DOM with new quote
  }
}

// Event listeners
document.getElementById("newQuoteBtn").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

