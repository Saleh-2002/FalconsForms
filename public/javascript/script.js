document.getElementById('specTicketForm').addEventListener('submit', function (event) {
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