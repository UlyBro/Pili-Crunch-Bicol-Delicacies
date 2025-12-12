function handleSearch(event) {
    // 1. Stop the default form submission (which causes a page reload)
    event.preventDefault();

    // 2. Get the search term and convert it to lowercase for case-insensitive matching
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();

    // 3. Define the map of keywords to their target page/section
    // The script will check if the user's search term contains any of these keywords.
    const searchMap = {
        // Products and specific product names will redirect to the products section
        'products': 'index.html#products',
        'product': 'index.html#products',
        'sugar': 'index.html#products',
        'crispy': 'index.html#products',
        'salted': 'index.html#products',
        'masa': 'index.html#products',
        'tarts': 'index.html#products',
        'jam': 'index.html#products',
        'pili': 'index.html#products',
        'candy': 'index.html#products',
        
        // About page keywords
        'about': 'about.html',
        'owner': 'about.html',
        'business': 'about.html',
        
        // Testimonials section keywords
        'testimonials': 'index.html#testimonials',
        'reviews': 'reviews.html', // Changed to reviews.html now that it's a dedicated page
        
        // Contact and Footer keywords
        'contact': 'index.html#footer',
        'footer': 'index.html#footer',
        'phone': 'index.html#footer',
        'email': 'index.html#footer',
        'quick links': 'index.html#footer',

        // Home page keywords
        'home': 'index.html#hero'
    };
    
    let destination = null;

    // 4. Check for a match
    for (const keyword in searchMap) {
        if (searchTerm.includes(keyword)) {
            destination = searchMap[keyword];
            break; // Stop checking after the first match is found
        }
    }
    
    // 5. Navigate or show an alert if no match is found
    if (destination) {
        window.location.href = destination;
    } else {
        alert('Could not find a specific page or section for your search term: "' + searchInput.value + '". Please try a general term like "products" or "about".');
    }
}

// NEW FUNCTION: Handle the testimonial form submission
function handleTestimonialSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('testimonial-form');
    const messageContainer = document.getElementById('form-message-container');
    const submitButton = document.getElementById('submit-btn');

    // 1. Prepare form data
    const formData = new FormData(form);
    
    // 2. Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    messageContainer.style.display = 'none';

    // 3. Send data via AJAX (Fetch API)
    fetch('submit_testimonial.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        // Check for success or error status codes
        const isSuccess = response.ok;
        return response.json().then(data => ({
            data: data,
            status: isSuccess ? 'success' : 'error'
        }));
    })
    .then(({ data, status }) => {
        // 4. Display response message
        messageContainer.textContent = data.message;
        messageContainer.style.display = 'block';
        
        if (status === 'success') {
            messageContainer.style.backgroundColor = '#d4edda'; // Light green
            messageContainer.style.color = '#155724'; // Dark green
            form.reset(); // Clear form on successful submission
        } else {
            messageContainer.style.backgroundColor = '#f8d7da'; // Light red
            messageContainer.style.color = '#721c24'; // Dark red
        }
    })
    .catch(error => {
        // 5. Handle network or parsing errors
        console.error('Submission error:', error);
        messageContainer.textContent = 'A network error occurred. Please try again.';
        messageContainer.style.display = 'block';
        messageContainer.style.backgroundColor = '#f8d7da'; 
        messageContainer.style.color = '#721c24';
    })
    .finally(() => {
        // 6. Reset button state
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    });
}


// Attach event listeners on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Search form logic
    const searchForms = document.querySelectorAll('.search-form');
    searchForms.forEach(form => {
        form.addEventListener('submit', handleSearch);
    });
    
    // Testimonial form logic (ONLY if the form exists on the current page)
    const testimonialForm = document.getElementById('testimonial-form');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', handleTestimonialSubmit);
    }
    
    // --- Mobile menu toggle logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
        
        // Close menu when a link is clicked (UX improvement for mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                }
            });
        });
    }
});