// Function to fetch data from API
async function fetchData() {
    try {
        const response = await fetch('https://mgpka0.buildship.run/webflowdata', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }

        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        document.getElementById('data-container').innerText = 'Failed to load data.';
    }
}

// Function to display data in the HTML
function displayData(data) {
    const container = document.getElementById('card-container');
    container.innerHTML = ''; // Clear any existing content

    // Assuming 'data' is an array of objects
    data.forEach(item => {
        const itemElement = document.createElement('sample-card');
         itemElement.classList.add('sample-card');
        itemElement.innerText = item.name; // Adjust based on your data structure
        container.appendChild(itemElement);
        itemElement.style.display = 'block';
    });
}

// Call the fetchData function when the page loads
document.addEventListener('DOMContentLoaded', fetchData());