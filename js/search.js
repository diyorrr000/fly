// Flight Search and Display
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const flightsGrid = document.getElementById('flightsGrid');
    const selectFlight = document.getElementById('selectFlight');
    
    // Sample flight data
    const sampleFlights = [
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
            seatsAvailable: 45
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
            seatsAvailable: 12
        },
        {
            id: 3,
            flightNumber: "EK-789",
            airline: "Emirates",
            fromCountry: "Uzbekistan",
            fromCity: "Toshkent",
            toCountry: "UAE",
            toCity: "Dubai",
            departureTime: "2024-01-20T14:00:00",
            arrivalTime: "2024-01-20T18:30:00",
            price: 420,
            seatsTotal: 240,
            seatsAvailable: 89
        },
        {
            id: 4,
            flightNumber: "AA-101",
            airline: "American Airlines",
            fromCountry: "USA",
            fromCity: "New York",
            toCountry: "Germany",
            toCity: "Berlin",
            departureTime: "2024-01-20T20:00:00",
            arrivalTime: "2024-01-21T08:30:00",
            price: 650,
            seatsTotal: 220,
            seatsAvailable: 56
        },
        {
            id: 5,
            flightNumber: "BA-202",
            airline: "British Airways",
            fromCountry: "UK",
            fromCity: "London",
            toCountry: "USA",
            toCity: "Los Angeles",
            departureTime: "2024-01-20T18:00:00",
            arrivalTime: "2024-01-20T22:30:00",
            price: 720,
            seatsTotal: 260,
            seatsAvailable: 34
        },
        {
            id: 6,
            flightNumber: "QR-303",
            airline: "Qatar Airways",
            fromCountry: "Qatar",
            fromCity: "Doha",
            toCountry: "Japan",
            toCity: "Tokyo",
            departureTime: "2024-01-20T22:00:00",
            arrivalTime: "2024-01-21T14:30:00",
            price: 580,
            seatsTotal: 230,
            seatsAvailable: 78
        }
    ];
    
    // Load flights on page load
    function loadFlights() {
        flightsGrid.innerHTML = '';
        selectFlight.innerHTML = '<option value="">Reysni tanlang</option>';
        
        sampleFlights.forEach(flight => {
            // Add to flights grid
            const flightCard = createFlightCard(flight);
            flightsGrid.appendChild(flightCard);
            
            // Add to booking select
            const option = document.createElement('option');
            option.value = flight.id;
            option.textContent = `${flight.flightNumber} - ${flight.fromCity} → ${flight.toCity} ($${flight.price})`;
            selectFlight.appendChild(option);
        });
    }
    
    function createFlightCard(flight) {
        const card = document.createElement('div');
        card.className = 'flight-card';
        card.dataset.id = flight.id;
        
        const departure = new Date(flight.departureTime);
        const arrival = new Date(flight.arrivalTime);
        const duration = Math.round((arrival - departure) / 60000); // minutes
        
        card.innerHTML = `
            <div class="flight-header">
                <div class="flight-route">
                    ${flight.fromCity} → ${flight.toCity}
                </div>
                <div class="flight-price">$${flight.price}</div>
            </div>
            <div class="flight-details">
                <div class="detail-item">
                    <span>Reys raqami:</span>
                    <span>${flight.flightNumber}</span>
                </div>
                <div class="detail-item">
                    <span>Aviakompaniya:</span>
                    <span>${flight.airline}</span>
                </div>
                <div class="detail-item">
                    <span>Uchish:</span>
                    <span>${departure.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span>Qo'nish:</span>
                    <span>${arrival.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span>Davomiylik:</span>
                    <span>${Math.floor(duration / 60)}h ${duration % 60}m</span>
                </div>
            </div>
            <div class="seats-info">
                <span class="${flight.seatsAvailable > 0 ? 'seat-available' : 'seat-unavailable'}">
                    ${flight.seatsAvailable > 0 ? '✅' : '❌'} ${flight.seatsAvailable} ta bo'sh o'rindiq
                </span>
            </div>
        `;
        
        return card;
    }
    
    // Search functionality
    searchBtn.addEventListener('click', function() {
        const fromCountry = document.getElementById('fromCountry').value;
        const toCountry = document.getElementById('toCountry').value;
        const date = document.getElementById('flightDate').value;
        const passengers = parseInt(document.getElementById('passengers').value);
        
        let filteredFlights = sampleFlights;
        
        if (fromCountry) {
            filteredFlights = filteredFlights.filter(f => 
                f.fromCountry.toLowerCase().includes(fromCountry.toLowerCase())
            );
        }
        
        if (toCountry) {
            filteredFlights = filteredFlights.filter(f => 
                f.toCountry.toLowerCase().includes(toCountry.toLowerCase())
            );
        }
        
        if (passengers > 0) {
            filteredFlights = filteredFlights.filter(f => 
                f.seatsAvailable >= passengers
            );
        }
        
        // Update flights grid
        flightsGrid.innerHTML = '';
        
        if (filteredFlights.length === 0) {
            flightsGrid.innerHTML = `
                <div class="no-flights">
                    <h3>Reys topilmadi</h3>
                    <p>Qidiruv shartlariga mos reyslar mavjud emas.</p>
                </div>
            `;
        } else {
            filteredFlights.forEach(flight => {
                flightsGrid.appendChild(createFlightCard(flight));
            });
        }
        
        // Scroll to flights section
        document.getElementById('flights').scrollIntoView({ behavior: 'smooth' });
        
        // Show notification
        showNotification(`${filteredFlights.length} ta reys topildi`, 'success');
    });
    
    // Initialize
    loadFlights();
});