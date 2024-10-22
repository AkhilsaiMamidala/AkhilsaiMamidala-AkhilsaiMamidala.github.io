document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const seatGrid = document.querySelector('.seat-grid'); // Grid for displaying seats
    const bookedSeatsEl = document.getElementById('bookedSeats'); // Element displaying booked seats count
    const availableSeatsEl = document.getElementById('availableSeats'); // Element displaying available seats count
    const seatsToBookInput = document.getElementById('seatsToBook'); // Input field for number of seats to book
    const bookButton = document.getElementById('bookButton'); // Button to book seats
    const resetButton = document.getElementById('resetButton'); // Button to reset bookings

    // Define the seating arrangement: rows and number of seats in each row
    const rows = [
        { row: 1, seats: 7 },
        { row: 2, seats: 7 },
        { row: 3, seats: 7 },
        { row: 4, seats: 7 },
        { row: 5, seats: 7 },
        { row: 6, seats: 7 },
        { row: 7, seats: 7 },
        { row: 8, seats: 7 },
        { row: 9, seats: 7 },
        { row: 10, seats: 7 },
        { row: 11, seats: 7 },
        { row: 12, seats: 3 }, // Last row with only 3 seats
    ];

    let totalSeats = 80; // Total number of seats available
    let bookedSeats = 0; // Counter for booked seats
    let availableSeats = totalSeats - bookedSeats; // Calculate available seats

    // Seat status array; each element is an array representing a row of seats
    const seatStatus = rows.map(row => Array(row.seats).fill(false)); // Initialize all seats as available (false)

    // Function to render the seat grid
    function renderSeats() {
        seatGrid.innerHTML = ''; // Clear existing seat grid
        let seatNumber = 1; // Seat numbering starts from 1
        rows.forEach((row, rowIndex) => {
            for (let seatIndex = 0; seatIndex < row.seats; seatIndex++) {
                const seatDiv = document.createElement('div'); // Create a div for each seat
                seatDiv.classList.add('seat'); // Add base class for styling
                seatDiv.textContent = seatNumber; // Set seat number as text

                // Apply booked or available class based on seat status
                if (seatStatus[rowIndex][seatIndex]) {
                    seatDiv.classList.add('booked'); // Seat is booked
                } else {
                    seatDiv.classList.add('available'); // Seat is available
                }

                seatGrid.appendChild(seatDiv); // Add the seat to the seat grid
                seatNumber++; // Increment seat number
            }
        });
    }

    // Function to update the summary of booked and available seats
    function updateSummary() {
        bookedSeatsEl.textContent = `Booked Seats = ${bookedSeats}`; // Update booked seats display
        availableSeatsEl.textContent = `Available Seats = ${availableSeats}`; // Update available seats display
    }

    // Function to book seats in one row if possible
    function bookSeatsInRow(rowIndex, numSeatsToBook) {
        let seatsBooked = 0; // Counter for seats booked in this row
        for (let i = 0; i < seatStatus[rowIndex].length; i++) {
            if (!seatStatus[rowIndex][i]) {
                seatStatus[rowIndex][i] = true; // Mark seat as booked
                seatsBooked++;
                if (seatsBooked === numSeatsToBook) break; // Exit loop if requested seats are booked
            }
        }
        return seatsBooked; // Return the number of seats booked
    }

    // Function to find and book seats in the nearest rows
    function bookSeats(numSeatsToBook) {
        let seatsBooked = 0; // Total seats booked
        let bookedSeatNumbers = []; // Array to hold booked seat numbers

        // Try to book seats in a single row first
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            let availableSeatsInRow = seatStatus[rowIndex].filter(seat => !seat).length; // Count available seats in the row
            if (availableSeatsInRow >= numSeatsToBook) { // Check if enough seats are available
                for (let i = 0; i < seatStatus[rowIndex].length && seatsBooked < numSeatsToBook; i++) {
                    if (!seatStatus[rowIndex][i]) { // If seat is available
                        seatStatus[rowIndex][i] = true; // Book the seat
                        bookedSeatNumbers.push(getSeatNumber(rowIndex, i)); // Add seat number to booked list
                        seatsBooked++; // Increment booked seat counter
                    }
                }
                break; // Exit once we've booked seats in the same row
            }
        }

        // If unable to book all seats in one row, book nearby seats
        if (seatsBooked < numSeatsToBook) {
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                for (let i = 0; i < seatStatus[rowIndex].length && seatsBooked < numSeatsToBook; i++) {
                    if (!seatStatus[rowIndex][i]) { // If seat is available
                        seatStatus[rowIndex][i] = true; // Book the seat
                        bookedSeatNumbers.push(getSeatNumber(rowIndex, i)); // Add seat number to booked list
                        seatsBooked++; // Increment booked seat counter
                    }
                }
            }
        }

        // Update totals and render updated seat grid
        bookedSeats += numSeatsToBook;
        availableSeats -= numSeatsToBook;
        renderSeats();
        updateSummary();
        alert(`Seats booked: ${bookedSeatNumbers.join(', ')}`); // Notify user of booked seats
    }

    // Helper function to get seat number based on row and column
    function getSeatNumber(rowIndex, seatIndex) {
        let seatNumber = 0; // Initialize seat number
        for (let i = 0; i < rowIndex; i++) {
            seatNumber += rows[i].seats; // Accumulate seat numbers in previous rows
        }
        return seatNumber + seatIndex + 1; // Return the final seat number
    }

    // Reset function to clear all bookings
    function resetBooking() {
        rows.forEach((row, rowIndex) => {
            seatStatus[rowIndex] = Array(row.seats).fill(false); // Reset all seats to available
        });
        bookedSeats = 0; // Reset booked seats counter
        availableSeats = totalSeats; // Reset available seats count

        renderSeats(); // Re-render seats
        updateSummary(); // Update summary display
    }

    // Event listeners for buttons
    bookButton.addEventListener('click', () => {
        const numSeatsToBook = parseInt(seatsToBookInput.value); // Get user input for number of seats to book
        if (numSeatsToBook > 7 || numSeatsToBook < 1) { // Validate input
            alert('Invalid number of seats. You can only book between 1 and 7 seats at a time.');
            return; // Exit if invalid
        }

        if (numSeatsToBook > availableSeats) { // Check for seat availability
            alert('Not enough seats available.');
            return; // Exit if not enough seats
        }

        bookSeats(numSeatsToBook); // Proceed to book seats
    });

    resetButton.addEventListener('click', resetBooking); // Reset booking on button click

    // Initial render of seats and summary
    renderSeats();
    updateSummary();
});
