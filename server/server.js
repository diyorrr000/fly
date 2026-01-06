// Simulated Backend Server
// Note: This is a demonstration. In real project, you would use Express.js with MongoDB

console.log('SkyTicket International Server - Simulated Mode');
console.log('===============================================');

// Simulated database
const simulatedDB = {
    flights: [
        {
            id: 1,
            flightNumber: "TK-123",
            airline: "Turkish Airlines",
            fromCountry: "Uzbekistan",
            fromCity: "Toshkent",
            toCountry: "Turkey",
            toCity: "Istanbul",
            departureTime: "2024-01-20T08:00:00",
            arrivalTime: "2024-01-20T11:30:00",
            price: 350,
            seatsTotal: 180,
            seatsAvailable: 45,
            status: "active"
        },
        {
            id: 2,
            flightNumber: "HY-456",
            airline: "Uzbekistan Airways",
            fromCountry: "Uzbekistan",
            fromCity: "Toshkent",
            toCountry: "Russia",
            toCity: "Moskva",
            departureTime: "2024-01-20T10:30:00",
            arrivalTime: "2024-01-20T13:45:00",
            price: 280,
            seatsTotal: 200,
            seatsAvailable: 12,
            status: "active"
        }
    ],
    
    tickets: [],
    orders: [],
    users: []
};

// Simulated API functions
const SkyTicketAPI = {
    // Get all flights
    getFlights: () => {
        console.log('API: GET /api/flights');
        return {
            success: true,
            data: simulatedDB.flights,
            timestamp: new Date().toISOString()
        };
    },
    
    // Search flights
    searchFlights: (criteria) => {
        console.log('API: POST /api/flights/search', criteria);
        let results = simulatedDB.flights;
        
        if (criteria.fromCountry) {
            results = results.filter(f => 
                f.fromCountry.toLowerCase().includes(criteria.fromCountry.toLowerCase())
            );
        }
        
        if (criteria.toCountry) {
            results = results.filter(f => 
                f.toCountry.toLowerCase().includes(criteria.toCountry.toLowerCase())
            );
        }
        
        if (criteria.passengers) {
            results = results.filter(f => f.seatsAvailable >= criteria.passengers);
        }
        
        return {
            success: true,
            data: results,
            count: results.length,
            timestamp: new Date().toISOString()
        };
    },
    
    // Book ticket
    bookTicket: (ticketData) => {
        console.log('API: POST /api/tickets/book', ticketData);
        
        // Find flight
        const flight = simulatedDB.flights.find(f => f.id === ticketData.flightId);
        if (!flight) {
            return {
                success: false,
                error: "Flight not found"
            };
        }
        
        // Check seat availability
        if (flight.seatsAvailable < 1) {
            return {
                success: false,
                error: "No seats available"
            };
        }
        
        // Create ticket
        const newTicket = {
            id: 'TKT-' + Date.now(),
            ...ticketData,
            status: "sold",
            bookedAt: new Date().toISOString(),
            ticketNumber: Math.random().toString(36).substr(2, 8).toUpperCase()
        };
        
        simulatedDB.tickets.push(newTicket);
        
        // Update flight seats
        flight.seatsAvailable--;
        
        // Create order
        const newOrder = {
            orderId: 'ORD-' + Date.now(),
            ticketId: newTicket.id,
            passengerName: ticketData.passengerName,
            amount: flight.price,
            currency: "USD",
            paymentStatus: "completed",
            createdAt: new Date().toISOString()
        };
        
        simulatedDB.orders.push(newOrder);
        
        return {
            success: true,
            data: {
                ticket: newTicket,
                order: newOrder,
                flight: flight
            },
            message: "Ticket booked successfully",
            timestamp: new Date().toISOString()
        };
    },
    
    // Get user tickets
    getUserTickets: (email) => {
        console.log('API: GET /api/tickets/user/' + email);
        const userTickets = simulatedDB.tickets.filter(t => t.email === email);
        
        return {
            success: true,
            data: userTickets,
            count: userTickets.length,
            timestamp: new Date().toISOString()
        };
    },
    
    // Cancel ticket
    cancelTicket: (ticketId) => {
        console.log('API: DELETE /api/tickets/' + ticketId);
        const ticketIndex = simulatedDB.tickets.findIndex(t => t.id === ticketId);
        
        if (ticketIndex === -1) {
            return {
                success: false,
                error: "Ticket not found"
            };
        }
        
        const ticket = simulatedDB.tickets[ticketIndex];
        ticket.status = "cancelled";
        
        // Return seat
        const flight = simulatedDB.flights.find(f => f.id === ticket.flightId);
        if (flight) {
            flight.seatsAvailable++;
        }
        
        return {
            success: true,
            data: ticket,
            message: "Ticket cancelled successfully",
            timestamp: new Date().toISOString()
        };
    },
    
    // Admin: Add flight
    addFlight: (flightData) => {
        console.log('API: POST /api/admin/flights', flightData);
        
        const newFlight = {
            id: simulatedDB.flights.length + 1,
            ...flightData,
            status: "active"
        };
        
        simulatedDB.flights.push(newFlight);
        
        return {
            success: true,
            data: newFlight,
            message: "Flight added successfully",
            timestamp: new Date().toISOString()
        };
    },
    
    // Admin: Get statistics
    getStatistics: () => {
        console.log('API: GET /api/admin/statistics');
        
        const today = new Date().toDateString();
        const todayOrders = simulatedDB.orders.filter(order => 
            new Date(order.createdAt).toDateString() === today
        );
        
        const stats = {
            totalFlights: simulatedDB.flights.length,
            activeFlights: simulatedDB.flights.filter(f => f.status === "active").length,
            totalTickets: simulatedDB.tickets.length,
            soldTickets: simulatedDB.tickets.filter(t => t.status === "sold").length,
            todaySales: todayOrders.length,
            monthlyRevenue: simulatedDB.orders.reduce((sum, order) => sum + order.amount, 0),
            availableSeats: simulatedDB.flights.reduce((sum, flight) => sum + flight.seatsAvailable, 0),
            popularRoute: "Tashkent → Istanbul",
            topAirline: "Turkish Airlines"
        };
        
        return {
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        };
    }
};

// Export for browser simulation
if (typeof window !== 'undefined') {
    window.SkyTicketAPI = SkyTicketAPI;
    
    // Simulate API responses in browser
    console.log('SkyTicket API loaded in simulation mode');
    console.log('Available methods:');
    console.log('- SkyTicketAPI.getFlights()');
    console.log('- SkyTicketAPI.searchFlights(criteria)');
    console.log('- SkyTicketAPI.bookTicket(ticketData)');
    console.log('- SkyTicketAPI.getUserTickets(email)');
    console.log('- SkyTicketAPI.cancelTicket(ticketId)');
    console.log('- SkyTicketAPI.addFlight(flightData)');
    console.log('- SkyTicketAPI.getStatistics()');
}

// For Node.js simulation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkyTicketAPI;
}