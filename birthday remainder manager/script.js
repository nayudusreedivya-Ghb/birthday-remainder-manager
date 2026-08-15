let birthdays = JSON.parse(localStorage.getItem("birthdays")) || [];

const form = document.getElementById("birthdayForm");
const nameInput = document.getElementById("name");
const birthdayInput = document.getElementById("birthday");
const birthdayList = document.getElementById("birthdayList");
const searchInput = document.getElementById("search");

const totalCount = document.getElementById("totalCount");
const upcomingCount = document.getElementById("upcomingCount");


// Add Birthday
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = nameInput.value.trim();
    const birthday = birthdayInput.value;

    if (name === "" || birthday === "") {
        alert("Please enter all details.");
        return;
    }

    const newBirthday = {
        id: Date.now(),
        name: name,
        birthday: birthday
    };

    birthdays.push(newBirthday);

    saveBirthdays();

    form.reset();

    displayBirthdays();

    alert("Birthday added successfully! 🎉");
});


// Save birthdays in Local Storage
function saveBirthdays() {
    localStorage.setItem("birthdays", JSON.stringify(birthdays));
}


// Calculate next birthday
function getNextBirthday(dateString) {

    const birthday = new Date(dateString);
    const today = new Date();

    let nextBirthday = new Date(
        today.getFullYear(),
        birthday.getMonth(),
        birthday.getDate()
    );

    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    return nextBirthday;
}


// Calculate remaining days
function getDaysRemaining(dateString) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const nextBirthday = getNextBirthday(dateString);

    nextBirthday.setHours(0, 0, 0, 0);

    const difference =
        nextBirthday.getTime() - today.getTime();

    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );
}


// Format birthday
function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long"
    });
}


// Display birthdays
function displayBirthdays(searchText = "") {

    birthdayList.innerHTML = "";

    const filteredBirthdays = birthdays
        .filter(item =>
            item.name
                .toLowerCase()
                .includes(searchText.toLowerCase())
        )
        .sort((a, b) =>
            getDaysRemaining(a.birthday) -
            getDaysRemaining(b.birthday)
        );


    if (filteredBirthdays.length === 0) {

        birthdayList.innerHTML =
            '<p class="empty">No birthdays found.</p>';

    } else {

        filteredBirthdays.forEach(item => {

            const days = getDaysRemaining(item.birthday);

            let message;

            if (days === 0) {
                message = "🎉 Birthday is today!";
            } else if (days === 1) {
                message = "⏰ Tomorrow!";
            } else {
                message = `${days} days remaining`;
            }


            const card = document.createElement("div");

            card.className = "birthday-card";

            card.innerHTML = `

                <div class="birthday-info">

                    <h3>🎂 ${item.name}</h3>

                    <p>
                        📅 Birthday:
                        <strong>${formatDate(item.birthday)}</strong>
                    </p>

                    <p class="days">
                        ${message}
                    </p>

                </div>

                <button
                    class="delete-btn"
                    onclick="deleteBirthday(${item.id})">
                    🗑️ Delete
                </button>

            `;

            birthdayList.appendChild(card);

        });
    }


    updateStatistics();
}


// Delete birthday
function deleteBirthday(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this birthday?");

    if (!confirmDelete) {
        return;
    }

    birthdays = birthdays.filter(
        item => item.id !== id
    );

    saveBirthdays();

    displayBirthdays();
}


// Update statistics
function updateStatistics() {

    totalCount.textContent = birthdays.length;

    const upcoming = birthdays.filter(
        item => getDaysRemaining(item.birthday) <= 30
    );

    upcomingCount.textContent = upcoming.length;
}


// Search
searchInput.addEventListener("input", function() {

    displayBirthdays(searchInput.value);

});


// Initial display
displayBirthdays();