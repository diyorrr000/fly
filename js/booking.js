// Ticket Booking System
document.addEventListener('DOMContentLoaded', function() {
    const bookBtn = document.getElementById('bookBtn');
    const ticketsList = document.getElementById('ticketsList');
    
    // Load user's tickets from localStorage
    function loadTickets() {
        const tickets = JSON.parse(localStorage.getItem('userTickets')) || [];
        ticketsList.innerHTML = '';
        
        if (tickets.length === 0) {
            ticketsList.innerHTML = `
                <div class="no-tickets">
                    <h3>Sizda chiptalar mavjud emas</h3>
                    <p>Birinchi chiptangizni sotib oling!</p>
                </div>
            `;
            return;
        }
        
        tickets.forEach(ticket => {
            const ticketItem = createTicketElement(ticket);
            ticketsList.appendChild(ticketItem);
        });
    }
    
    function createTicketElement(ticket) {
        const item = document.createElement('div');
        item.className = `ticket-item ${ticket.status === 'cancelled' ? 'cancelled' : ''}`;
        
        const flight = getFlightById(ticket.flightId);
        const departure = new Date(flight.departureTime);
        
        item.innerHTML = `
            <div class="ticket-info">
                <h4>${flight.fromCity} → ${flight.toCity}</h4>
                <p><strong>Reys:</strong> ${flight.flightNumber}</p>
                <p><strong>Yo'lovchi:</strong> ${ticket.passengerName}</p>
                <p><strong>Uchish vaqti:</strong> ${departure.toLocaleString()}</p>
                <p><strong>O'rindiq:</strong> ${ticket.seatNumber}</p>
            </div>
            <div class="ticket-actions">
                <span class="ticket-status ${ticket.status === 'sold' ? 'status-sold' : 'status-cancelled'}">
                    ${ticket.status === 'sold' ? 'SOTIB OLINDI' : 'BEKOR QILINGAN'}
                </span>
                ${ticket.status === 'sold' ? 
                    `<button class="btn btn-danger btn-sm" onclick="cancelTicket('${ticket.id}')">Bekor qilish</button>` : 
                    ''
                }
            </div>
        `;
        
        return item;
    }
    
    function getFlightById(id) {
        const sampleFlights = [
            // Same flights as in search.js
            { id: 1, flightNumber: "TK-123", fromCity: "Toshkent", toCity: "Istanbul" },
            { id: 2, flightNumber: "HY-456", fromCity: "Toshkent", toCity: "Moskva" },
            { id: 3, flightNumber: "EK-789", fromCity: "Toshkent", toCity: "Dubai" },
            { id: 4, flightNumber: "AA-101", fromCity: "New York", toCity: "Berlin" },
            { id: 5, flightNumber: "BA-202", fromCity: "London", toCity: "Los Angeles" },
            { id: 6, flightNumber: "QR-303", fromCity: "Doha", toCity: "Tokyo" }
        ];
        
        return sampleFlights.find(f => f.id == id) || sampleFlights[0];
    }
    
    // Book ticket
    bookBtn.addEventListener('click', function() {
        const passengerName = document.getElementById('passengerName').value;
        const passportNumber = document.getElementById('passportNumber').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const flightId = document.getElementById('selectFlight').value;
        const seatNumber = document.getElementById('seatNumber').value || Math.floor(Math.random() * 100) + 1;
        
        // Validation
        if (!passengerName || !passportNumber || !email || !flightId) {
            showNotification('Iltimos, barcha maydonlarni to\'ldiring!', 'error');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Iltimos, to\'g\'ri email kiriting!', 'error');
            return;
        }
        
        // Simulate payment process
        showNotification('To\'lov jarayoni boshlanmoqda...', 'info');
        
        setTimeout(() => {
            // Create ticket object
            const newTicket = {
                id: 'TKT-' + Date.now(),
                passengerName,
                passportNumber,
                email,
                phone,
                flightId: parseInt(flightId),
                seatNumber,
                status: 'sold',
                bookedAt: new Date().toISOString()
            };
            
            // Save to localStorage
            const tickets = JSON.parse(localStorage.getItem('userTickets')) || [];
            tickets.push(newTicket);
            localStorage.setItem('userTickets', JSON.stringify(tickets));
            
            // Update flight seats (simulated)
            const flights = JSON.parse(localStorage.getItem('flights')) || [];
            const flightIndex = flights.findIndex(f => f.id == flightId);
            if (flightIndex > -1 && flights[flightIndex].seatsAvailable > 0) {
                flights[flightIndex].seatsAvailable--;
                localStorage.setItem('flights', JSON.stringify(flights));
            }
            
            // Create order
            const order = {
                orderId: 'ORD-' + Date.now(),
                passengerData: { passengerName, email, phone },
                route: newTicket.id,
                paymentStatus: 'completed',
                createdAt: new Date().toISOString()
            };
            
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Show success
            showNotification('Chipta muvaffaqiyatli sotib olindi! ✅', 'success');
            
            // Clear form
            document.getElementById('passengerName').value = '';
            document.getElementById('passportNumber').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('seatNumber').value = '';
            
            // Update tickets list
            loadTickets();
            
            // Update statistics
            updateStatistics();
            
            // Scroll to tickets section
            document.getElementById('mytickets').scrollIntoView({ behavior: 'smooth' });
            
        }, 2000);
    });
    
    // Cancel ticket function (global)
    window.cancelTicket = function(ticketId) {
        if (confirm('Chiptani bekor qilishni tasdiqlaysizmi?')) {
            const tickets = JSON.parse(localStorage.getItem('userTickets')) || [];
            const ticketIndex = tickets.findIndex(t => t.id === ticketId);
            
            if (ticketIndex > -1) {
                tickets[ticketIndex].status = 'cancelled';
                localStorage.setItem('userTickets', JSON.stringify(tickets));
                
                // Return seat (simulated)
                const flightId = tickets[ticketIndex].flightId;
                const flights = JSON.parse(localStorage.getItem('flights')) || [];
                const flightIndex = flights.findIndex(f => f.id == flightId);
                if (flightIndex > -1) {
                    flights[flightIndex].seatsAvailable++;
                    localStorage.setItem('flights', JSON.stringify(flights));
                }
                
                showNotification('Chipta bekor qilindi', 'info');
                loadTickets();
                updateStatistics();
            }
        }
    };
    
    // Initialize
    loadTickets();
});