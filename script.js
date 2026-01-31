// Državni praznici u Srbiji (primer za 2026)
const STATE_HOLIDAYS = [
    '2026-01-01', // Nova godina
    '2026-01-02', // Nova godina
    '2026-01-07', // Božić
    '2026-02-15', // Dan državnosti
    '2026-02-16', // Dan državnosti
    '2026-04-17', // Veliki petak (Pravoslavni)
    '2026-04-20', // Vaskršnji ponedeljak (Pravoslavni)
    '2026-05-01', // Praznik rada
    '2026-05-02', // Praznik rada
    '2026-11-11', // Dan primirja
];

// Elementi DOM-a
const startDateInput = document.getElementById('startDate');
const workDaysInput = document.getElementById('workDays');
const includeHolidaysCheckbox = document.getElementById('includeHolidays');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const resultDateP = document.querySelector('.result-date');
const resultDayP = document.querySelector('.result-day');

// Postavi današnji datum kao podrazumevani
startDateInput.valueAsDate = new Date();

// Nazivi dana u nedelji
const dayNames = [
    'Nedelja',
    'Ponedeljak',
    'Utorak',
    'Sreda',
    'Četvrtak',
    'Petak',
    'Subota'
];

/**
 * Proverava da li je datum vikend (subota ili nedelja)
 */
function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = nedelja, 6 = subota
}

/**
 * Proverava da li je datum državni praznik
 */
function isHoliday(date) {
    const dateString = formatDateForComparison(date);
    return STATE_HOLIDAYS.includes(dateString);
}

/**
 * Formatira datum u YYYY-MM-DD format za poređenje
 */
function formatDateForComparison(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Formatira datum u DD.MM.YYYY format za prikaz
 */
function formatDateForDisplay(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

/**
 * Računa krajnji datum na osnovu broja radnih dana
 */
function calculateDeadline(startDate, workDays, includeHolidays) {
    let currentDate = new Date(startDate);
    let remainingDays = workDays;

    while (remainingDays > 0) {
        // Pomeri datum za jedan dan
        currentDate.setDate(currentDate.getDate() + 1);

        // Proveri da li je radni dan
        if (!isWeekend(currentDate)) {
            // Ako su uključeni praznici, proveri i njih
            if (includeHolidays && isHoliday(currentDate)) {
                continue; // Preskoči praznik
            }
            remainingDays--;
        }
    }

    return currentDate;
}

/**
 * Prikazuje grešku
 */
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');
}

/**
 * Prikazuje rezultat
 */
function showResult(deadline) {
    const formattedDate = formatDateForDisplay(deadline);
    const dayName = dayNames[deadline.getDay()];

    resultDateP.textContent = `Rok završetka je: ${formattedDate}`;
    resultDayP.textContent = `Dan u nedelji: ${dayName}`;

    resultDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
}

/**
 * Validira unos
 */
function validateInput() {
    // Proveri da li je datum unet
    if (!startDateInput.value) {
        showError('⚠️ Molimo unesite početni datum.');
        return false;
    }

    // Proveri da li je broj dana unet
    if (!workDaysInput.value) {
        showError('⚠️ Molimo unesite broj radnih dana.');
        return false;
    }

    const workDays = parseInt(workDaysInput.value);

    // Proveri da li je broj dana validan
    if (isNaN(workDays) || workDays <= 0) {
        showError('⚠️ Broj radnih dana mora biti veći od 0.');
        return false;
    }

    // Proveri da li je broj dana razuman (npr. ne više od 1000)
    if (workDays > 1000) {
        showError('⚠️ Broj radnih dana je prevelik. Unesite manji broj.');
        return false;
    }

    return true;
}

/**
 * Glavna funkcija za računanje
 */
function handleCalculate() {
    // Validacija
    if (!validateInput()) {
        return;
    }

    // Preuzmi vrednosti
    const startDate = new Date(startDateInput.value);
    const workDays = parseInt(workDaysInput.value);
    const includeHolidays = includeHolidaysCheckbox.checked;

    // Izračunaj rok
    const deadline = calculateDeadline(startDate, workDays, includeHolidays);

    // Prikaži rezultat
    showResult(deadline);
}

// Event listeneri
calculateBtn.addEventListener('click', handleCalculate);

// Omogući Enter za submit
workDaysInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCalculate();
    }
});

// Sakrij greške kada korisnik počne da menja input
startDateInput.addEventListener('input', () => {
    errorDiv.classList.add('hidden');
});

workDaysInput.addEventListener('input', () => {
    errorDiv.classList.add('hidden');
});
