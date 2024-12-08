const rows = 5;
const seatsPerRow = 5;
const theatre = document.getElementById('theatre');
const selectedSeatsDiv = document.getElementById('selectedSeats');
const bookedSeats = new Set();
let selectedSeats = [];
const paymentModal = document.getElementById('paymentModal');
const closeModal = document.querySelector('.close');

document.getElementById('submitDetails').addEventListener('click', () => {
    const numTickets = parseInt(document.getElementById('numTickets').value);
    const movieTitle = document.getElementById('movieTitle').value;
    
    if (!movieTitle) {
        alert("Please select a movie.");
        return;
    }
    if (numTickets > rows * seatsPerRow) {
        alert("Not enough seats available. Please reduce the number of tickets.");
        return;
    }

    createTheatre();
    document.getElementById('bookTickets').style.display = 'inline';
    document.getElementById('ticketForm').style.display = 'none';
});

function createTheatre() {
    theatre.innerHTML = ''; 
    for (let i = 0; i < rows; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        for (let j = 0; j < seatsPerRow; j++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');
            seat.dataset.row = i;
            seat.dataset.seat = j;

            seat.addEventListener('click', () => toggleSeat(seat));
            rowDiv.appendChild(seat);
        }
        theatre.appendChild(rowDiv);
    }
}

function toggleSeat(seat) {
    const seatId = `${seat.dataset.row}-${seat.dataset.seat}`;
    if (bookedSeats.has(seatId)) {
        alert("Sorry, this seat is already booked.");
        return;
    }

    if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s !== seatId);
    } else {
        selectedSeats.push(seatId);
        if (selectedSeats.length > parseInt(document.getElementById('numTickets').value)) {
            alert("You can only select up to the number of tickets requested.");
            return;
        }
        seat.classList.add('selected');
    }
    updateSelectedSeats();
}

function updateSelectedSeats() {
    selectedSeatsDiv.textContent = "Selected Seats: " + (selectedSeats.length ? selectedSeats.join(', ') : "None");
}

document.getElementById('bookTickets').addEventListener('click', () => {
    if (selectedSeats.length === 0) {
        alert("Please select at least one seat to book.");
        return;
    }
    paymentModal.style.display = "block";
});

closeModal.addEventListener('click', () => {
    paymentModal.style.display = "none";
});

document.getElementById('paymentForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    selectedSeats.forEach(seatId => {
        bookedSeats.add(seatId);
        const [row, seat] = seatId.split('-').map(Number);
        const seatElement = theatre.children[row].children[seat];
        seatElement.classList.remove('selected');
        seatElement.classList.add('booked');
    });

    if (paymentMethod === "card") {
        alert("Payment confirmed using Credit/Debit Card.");
    } else if (paymentMethod === "upi") {
        const upiId = document.getElementById('upiId').value;
        alert("Payment confirmed using UPI ID: " + upiId);
    }

    alert("Tickets booked successfully for " + document.getElementById('movieTitle').value + "!");
    selectedSeats = [];
    updateSelectedSeats();
    paymentModal.style.display = "none";
});


document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.value === "card") {
            document.getElementById('cardPayment').style.display = "block";
            document.getElementById('upiPayment').style.display = "none";
        } else {
            document.getElementById('cardPayment').style.display = "none";
            document.getElementById('upiPayment').style.display = "block";
        }
    });
});