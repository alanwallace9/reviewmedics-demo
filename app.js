document.getElementById('business-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const businessName = document.getElementById('business-name').value;
  const reviews = await getGoogleReviews(businessName);

  if (reviews) {
    displayReviews(reviews);
  } else {
    alert('No reviews found.');
  }
});

async function getGoogleReviews(businessName) {
  // Replace with your Google API endpoint to fetch reviews
  const apiEndpoint = `https://your-google-api.com/reviews?business=${businessName}`;
  const response = await fetch(apiEndpoint);
  const data = await response.json();
  return data.reviews; // Assuming the API returns reviews in a "reviews" array
}

function displayReviews(reviews) {
  const mainSection = document.querySelector('main');
  mainSection.innerHTML = '<h1>Your Reviews</h1>';

  reviews.forEach(review => {
    const reviewElement = document.createElement('div');
    reviewElement.classList.add('review');

    const reviewText = document.createElement('p');
    reviewText.textContent = review.text;
    reviewElement.appendChild(reviewText);

    const aiReply = document.createElement('p');
    aiReply.classList.add('ai-reply');
    aiReply.textContent = generateAIReply(review.text); // Simple function for AI reply
    reviewElement.appendChild(aiReply);

    mainSection.appendChild(reviewElement);
  });
}

function generateAIReply(reviewText) {
  // Placeholder for AI logic that generates replies based on review content
  return `Thank you for your feedback! We're happy to assist you further.`;
}
