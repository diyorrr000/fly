// Admin Panel Functions
document.addEventListener('DOMContentLoaded', function() {
    const addFlightBtn = document.getElementById('addFlightBtn');
    const soldTicketsContainer = document.getElementById('soldTickets');
    
    // Add new flight
    addFlightBtn.addEventListener('click', function() {
        const flight = {
            id: Date.now(),
            flightNumber: document.getElementById('newFlightNumber').value,
            airline: document.getElementById('newAirline').value,
            fromCountry: document.getElementById('newFromCountry').value,
            fromCity: document.getElementById('newFromCity').value,
            toCountry: document.getElementById('newToCountry').value,
            toCity: document.getElementById('newToCity').value,
            departureTime: document.getElementById('newDeparture').value,
            arrivalTime: document.getElementById('newArrival').value,
            price: parseFloat(document.getElementById('newPrice').value),
            seatsTotal: parseInt(document.getElementById('newSeats').value),
            seatsAvailable: parseInt(document.getElementById('newSeats').value)
        };
        
        // Validate
        if (!flight.flightNumber || !flight.airline || !flight.fromCountry || 
            !flight.toCountry || !flight.price || !flight.seatsTotal) {
            showNotification('Barcha maydonlarni to\'ldiring!', 'error');
            return;
        }
        
        // Save flight
        const flights = JSON.parse(localStorage.getItem('flights')) || [];
        flights.push(flight);
        localStorage.setItem('flights', JSON.stringify(flights));
        
        // Clear form
        document.querySelectorAll('#add-flight input').forEach(input => {
            input.value = '';
        });
        
        showNotification('Yangi reys qo\'shildi!', 'success');
        updateStatistics();
        
        // Update flights list on main page
        if (typeof loadFlights === 'function') {
            loadFlights();
        }
    });
    
    // Load sold tickets
    function loadSoldTickets() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const tickets = JSON.parse(localStorage.getItem('userTickets')) || [];
        
        soldTicketsContainer.innerHTML = '';
        
        if (orders.length === 0) {
            soldTicketsContainer.innerHTML = `
                <div class="no-data">
                    <p>Hozircha sotilgan chiptalar yo'q</p>
                </div>
            `;
            return;
        }
        
        orders.forEach(order => {
            const ticketDiv = document.createElement('div');
            ticketDiv.className = 'sold-ticket-item';
            
            ticketDiv.innerHTML = `
                <div class="ticket-summary">
                    <strong>Buyurtma ID:</strong> ${order.orderId}<br>
                    <strong>Yo'lovchi:</strong> ${order.passengerData.passengerName}<br>
                    <strong>Email:</strong> ${order.passengerData.email}<br>
                    <strong>Sana:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
                    <strong>Holat:</strong> <span class="status-completed">To'landi</span>
                </div>
                <div class="ticket-amount">
                    <strong>Summa:</strong> $${Math.floor(Math.random() * 500) + 200}
                </div>
            `;
            
            soldTicketsContainer.appendChild(ticketDiv);
        });
    }
    
    // Update statistics
    function updateStatistics() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const flights = JSON.parse(localStorage.getItem('flights')) || [];
        const tickets = JSON.parse(localStorage.getItem('userTickets')) || [];
        
        // Today's sales
        const today = new Date().toDateString();
        const todaySales = orders.filter(order => 
            new Date(order.createdAt).toDateString() === today
        ).length;
        
        document.getElementById('todaySales').textContent = todaySales;
        
        // Monthly revenue
        const monthlyRevenue = orders.length * 350; // Simulated average ticket price
        document.getElementById('monthlyRevenue').textContent = '$' + monthlyRevenue.toLocaleString();
        
        // Active flights
        document.getElementById('activeFlights').textContent = flights.length || 6;
        
        // Available seats
        const totalSeats = flights.reduce((sum, flight) => sum + (flight.seatsAvailable || 0), 0);
        document.getElementById('availableSeats').textContent = totalSeats || 842;
    }
    
    // Tab switching
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            if (tabId === 'view-tickets') {
                loadSoldTickets();
            } else if (tabId === 'statistics') {
                updateStatistics();
            }
        });
    });
    
    // Initialize
    updateStatistics();
    
    // Make functions globally available
    window.updateStatistics = updateStatistics;
});
