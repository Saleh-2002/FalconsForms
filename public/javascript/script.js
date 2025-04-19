
// JavaScript


// Form Validation
const specTicketForm = document.getElementById('specTicketForm');
if (specTicketForm) {
    console.log('Form validation is active.');
    specTicketForm.addEventListener('submit', function (event) {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const ticketCode = document.getElementById('ticketCode').value.trim();
        const ticketImage = document.getElementById('ticketImage').files.length;

        if (!fullName || !email || !phone || !ticketCode || ticketImage === 0) {
            event.preventDefault(); // Prevent form submission
            alert('يرجى ملء جميع الحقول المطلوبة وتحميل صورة.');
        }
    });
}

// Countdown Timer
const countdownElement = document.getElementById('countdown');
if (countdownElement) {
    console.log('Countdown timer is active.');
    const eventDate = new Date('April 20, 2025 00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = eventDate - now;

        if (timeLeft <= 0) {
            countdownElement.innerHTML = "لقد بدأ الحدث!";
            clearInterval(timer);
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${days} يوم ${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`;
    }

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call to display immediately
}

// Scroll Button
const scrollButton = document.getElementById('scrollButton');
if (scrollButton) {
    console.log('Scroll button is active.');
    scrollButton.addEventListener('click', () => {
        document.querySelector('footer').scrollIntoView({ behavior: 'smooth' });
    });
}