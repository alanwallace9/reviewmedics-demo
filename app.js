// Replace with your actual Google API key and OpenAI API key
const apiKey = 'AIzaSyDodU9T1rzRN9cYkEi8mdY7_1a6jeWUIpw'; // Google API Key for Places API
const openAI_API_KEY = '';  // OpenAI API Key for ChatGPT

// Show search bar if the user clicks "Yes"
document.getElementById('yes-btn').addEventListener('click', function() {
  document.getElementById('search-section').classList.remove('hidden');
  document.getElementById('no-section').classList.add('hidden');
  document.getElementById('calendar').classList.add('hidden');
  document.getElementById('chatbot-section').classList.add('hidden');
  document.getElementById('reviews-section').classList.add('hidden');
});

// Show chatbot if the user clicks "No"
document.getElementById('no-btn').addEventListener('click', function() {
  document.getElementById('no-section').classList.remove('hidden');
  document.getElementById('calendar').classList.add('hidden');
  document.getElementById('search-section').classList.add('hidden');
  document.getElementById('chatbot-section').classList.remove('hidden');
  document.getElementById('reviews-section').classList.add('hidden');
});

// Function to trigger business name search (this can later connect to the Google Places API)
function searchBusiness() {
  const businessName = document.getElementById('business-name').value;
  if (businessName) {
    getPlaceIdByName(businessName);
  } else {
    alert("Please enter a business name.");
  }
}

// Step 1: Search for the place by business name
async function getPlaceIdByName(businessName) {
  const apiEndpoint = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(businessName)}&key=${apiKey}`;
  const response = await fetch(apiEndpoint);
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const placeId = data.results[0].place_id;
    getGoogleReviews(placeId);
  } else {
    alert('Business not found.');
  }
}

// Step 2: Get reviews for the place using Place ID
async function getGoogleReviews(placeId) {
  const apiEndpoint = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;
  const response = await fetch(apiEndpoint);
  const data = await response.json();

  if (data.result && data.result.reviews) {
    const reviews = data.result.reviews.filter(review => review.rating === 5).slice(0, 3); // Get only the last 3 5-star reviews
    displayReviews(reviews);
  } else {
    alert('No reviews found for this business.');
  }
}

// Display the reviews and AI-generated replies
function displayReviews(reviews) {
  const reviewsSection = document.getElementById('reviews-section');
  const reviewsGrid = document.getElementById('reviews-grid');
  reviewsSection.classList.remove('hidden');
  reviewsGrid.innerHTML = '';

  // Add a short pause before starting the typing effect
  setTimeout(() => {
    reviews.forEach(async (review, index) => {
      const reviewCard = document.createElement('div');
      reviewCard.classList.add('review-card');

      const reviewText = document.createElement('p');
      reviewText.classList.add('review-text');
      reviewText.textContent = review.text;

      const aiReply = document.createElement('p');
      aiReply.classList.add('ai-reply');
      aiReply.textContent = 'Thank you for your feedback! We\'re happy to assist you further.'; // Default text

      reviewCard.appendChild(reviewText);
      reviewCard.appendChild(aiReply);

      reviewsGrid.appendChild(reviewCard);

      // Generate AI reply
      const aiResponse = await generateAIReply(review.text);
      aiReply.textContent = aiResponse;
    });

    // Simulate typing effect for all 3 replies at once
    const aiReplies = document.querySelectorAll('.ai-reply');
    aiReplies.forEach((aiReply, index) => {
      simulateTyping(aiReply);
    });
  }, 500); // Short pause before typing starts
}

// Simulate typing effect for AI replies (typing effect for all replies at once)
function simulateTyping(element) {
  const text = element.textContent;
  let index = 0;
  element.textContent = '';
  
  const typingInterval = setInterval(() => {
    element.textContent += text[index];
    index++;
    
    if (index === text.length) {
      clearInterval(typingInterval);
    }
  }, 100); // Typing speed (in milliseconds)
}

// Function to call OpenAI and get a response based on the review
async function generateAIReply(reviewText) {
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',  // or use gpt-4 if you have access to it
      prompt: `Write a friendly, thoughtful response thanking the customer for their 5-star review. Mention one specific thing they enjoyed from their review if appropriate. Review: "${reviewText}"`,
      max_tokens: 150
    })
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}

// Trigger chat with AI assistant
document.getElementById('start-chat-btn').addEventListener('click', function() {
  document.getElementById('chatbot').innerHTML = `
    <p>Our AI assistant will help you get started. We'll send you a checklist or help you schedule a time for us to do it for you!</p>
    <button onclick="sendChecklist()">Send Checklist</button>
    <button onclick="scheduleConsultation()">Schedule a Time</button>
  `;
});

// Function to send a checklist
function sendChecklist() {
  alert("The checklist has been sent to your email. Please check your inbox!");
}

// Function to schedule a consultation
function scheduleConsultation() {
  alert("We'll help you schedule a time shortly!");
}
