// Card data with icons as SVG strings
const iconConfigs = [
  { 
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>', 
    color: '#fb7185' 
  },
  { 
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>', 
    color: '#fbbf24' 
  },
  { 
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>', 
    color: '#facc15' 
  },
  { 
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>', 
    color: '#c084fc' 
  },
  { 
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon cloud"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>', 
    color: '#7dd3fc' 
  },
  { 
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon flower"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"></path><circle cx="12" cy="12" r="3"></circle><path d="m8 16 1.5-1.5"></path><path d="M14.5 9.5 16 8"></path><path d="m8 8 1.5 1.5"></path><path d="M14.5 14.5 16 16"></path></svg>', 
    color: '#6ee7b7' 
  }
];

// Game state
let cards = [];
let flippedIndexes = [];
let matches = 0;
let isChecking = false;
const totalMatches = iconConfigs.length;

// DOM elements
const cardGrid = document.getElementById('card-grid');
const matchesDisplay = document.getElementById('matches');
const totalMatchesDisplay = document.getElementById('total-matches');
const resetButton = document.getElementById('reset-button');
const toast = document.getElementById('toast');

// Initialize the game
function initGame() {
  cards = createCards();
  renderCards();
  matchesDisplay.textContent = matches;
  totalMatchesDisplay.textContent = totalMatches;
}

// Create and shuffle cards
function createCards() {
  const newCards = [];
  
  iconConfigs.forEach((config, index) => {
    newCards.push(
      { id: index * 2, svg: config.svg, color: config.color, isMatched: false },
      { id: index * 2 + 1, svg: config.svg, color: config.color, isMatched: false }
    );
  });
  
  return shuffleArray(newCards);
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Render cards to the grid
function renderCards() {
  cardGrid.innerHTML = '';
  
  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${card.isMatched ? 'matched' : ''}`;
    cardElement.dataset.index = index;
    
    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">
          <div style="color: ${card.color}; width: 3rem; height: 3rem;">
            ${card.svg}
          </div>
        </div>
      </div>
    `;
    
    cardElement.addEventListener('click', () => handleCardClick(index));
    cardGrid.appendChild(cardElement);
  });
}

// Handle card click
function handleCardClick(clickedIndex) {
  // Prevent clicking if already checking or card is already matched
  if (isChecking || cards[clickedIndex].isMatched) return;
  // Prevent clicking if card is already flipped
  if (flippedIndexes.includes(clickedIndex)) return;
  // Prevent clicking if two cards are already flipped
  if (flippedIndexes.length === 2) return;

  // Add clicked card to flipped cards
  flippedIndexes.push(clickedIndex);
  const cardElement = document.querySelector(`.card[data-index="${clickedIndex}"]`);
  cardElement.classList.add('flipped');

  // If we now have two cards flipped, check for a match
  if (flippedIndexes.length === 2) {
    isChecking = true;
    const [firstIndex, secondIndex] = flippedIndexes;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    if (firstCard.svg === secondCard.svg) {
      // Match found
      setTimeout(() => {
        // Update cards array
        cards = cards.map((card, index) => 
          index === firstIndex || index === secondIndex
            ? { ...card, isMatched: true }
            : card
        );
        
        // Update DOM
        document.querySelector(`.card[data-index="${firstIndex}"]`).classList.add('matched');
        document.querySelector(`.card[data-index="${secondIndex}"]`).classList.add('matched');
        
        // Reset state
        flippedIndexes = [];
        matches++;
        matchesDisplay.textContent = matches;
        isChecking = false;
        
        // Check for game completion
        if (matches === totalMatches) {
          showToast();
        }
      }, 500);
    } else {
      // No match - reset after delay
      setTimeout(() => {
        document.querySelector(`.card[data-index="${firstIndex}"]`).classList.remove('flipped');
        document.querySelector(`.card[data-index="${secondIndex}"]`).classList.remove('flipped');
        flippedIndexes = [];
        isChecking = false;
      }, 1000);
    }
  }
}

// Show toast notification
function showToast() {
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 5000);
}

// Reset game
function resetGame() {
  cards = createCards();
  flippedIndexes = [];
  matches = 0;
  isChecking = false;
  matchesDisplay.textContent = matches;
  renderCards();
  toast.classList.add('hidden');
}

// Event listeners
resetButton.addEventListener('click', resetGame);

// Initialize the game on load
document.addEventListener('DOMContentLoaded', initGame);