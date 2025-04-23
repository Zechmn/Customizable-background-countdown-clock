document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const datetimeInput = document.getElementById('datetime');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const messageElement = document.getElementById('countdown-message');
    const colorOptions = document.querySelectorAll('.color-option');
    const gradientOptions = document.querySelectorAll('.gradient-option');
    const imageUrlInput = document.getElementById('image-url');
    const applyImageBtn = document.getElementById('apply-image');
    
    // Variables
    let countdownInterval;
    let targetDate = null;
    
    // Set default datetime to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    datetimeInput.value = formatDateForInput(tomorrow);
    
    // Load saved background if available
    loadSavedBackground();
    
    // Event Listeners
    startBtn.addEventListener('click', startCountdown);
    resetBtn.addEventListener('click', resetCountdown);
    
    // Background customization event listeners
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const color = option.getAttribute('data-color');
            changeBackground(color);
            saveBackground('color', color);
        });
    });
    
    gradientOptions.forEach(option => {
        option.addEventListener('click', () => {
            const gradient = option.getAttribute('data-gradient');
            changeBackground(gradient);
            saveBackground('gradient', gradient);
        });
    });
    
    applyImageBtn.addEventListener('click', () => {
        const imageUrl = imageUrlInput.value.trim();
        if (imageUrl) {
            // Check if the image URL exists/is valid
            const img = new Image();
            img.onload = function() {
                changeBackgroundImage(imageUrl);
                saveBackground('image', imageUrl);
            };
            img.onerror = function() {
                alert('Invalid image URL or the image could not be loaded.');
            };
            img.src = imageUrl;
        } else {
            alert('Please enter a valid image URL');
        }
    });
    
    // Functions
    function startCountdown() {
        // Clear any existing countdown
        clearInterval(countdownInterval);
        
        // Get the target date from the input
        const datetimeValue = datetimeInput.value;
        
        if (!datetimeValue) {
            alert('Please select a date and time');
            return;
        }
        
        targetDate = new Date(datetimeValue).getTime();
        const now = new Date().getTime();
        
        // Check if the target date is in the future
        if (targetDate <= now) {
            alert('Please select a future date and time');
            return;
        }
        
        // Save the target date to localStorage
        localStorage.setItem('countdownTargetDate', targetDate);
        
        // Start the countdown
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
        
        // Update UI
        messageElement.textContent = '';
    }
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = targetDate - now;
        
        if (timeLeft <= 0) {
            // Countdown finished
            clearInterval(countdownInterval);
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            messageElement.textContent = 'Countdown finished!';
            return;
        }
        
        // Calculate time units
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update display with leading zeros
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    function resetCountdown() {
        // Clear interval and reset displays
        clearInterval(countdownInterval);
        daysElement.textContent = '00';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        messageElement.textContent = '';
        targetDate = null;
        
        // Reset datetime input to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        datetimeInput.value = formatDateForInput(tomorrow);
        
        // Clear saved target date
        localStorage.removeItem('countdownTargetDate');
    }
    
    function changeBackground(value) {
        document.body.style.backgroundImage = 'none';
        document.body.style.background = value;
    }
    
    function changeBackgroundImage(url) {
        document.body.style.backgroundImage = `url(${url})`;
    }
    
    function saveBackground(type, value) {
        const backgroundSettings = {
            type: type,
            value: value
        };
        localStorage.setItem('countdownBackground', JSON.stringify(backgroundSettings));
    }
    
    function loadSavedBackground() {
        const savedBackground = localStorage.getItem('countdownBackground');
        if (savedBackground) {
            const settings = JSON.parse(savedBackground);
            if (settings.type === 'color' || settings.type === 'gradient') {
                changeBackground(settings.value);
            } else if (settings.type === 'image') {
                changeBackgroundImage(settings.value);
                imageUrlInput.value = settings.value;
            }
        }
        
        // Check for a saved countdown
        const savedTargetDate = localStorage.getItem('countdownTargetDate');
        if (savedTargetDate) {
            targetDate = parseInt(savedTargetDate);
            const now = new Date().getTime();
            
            if (targetDate > now) {
                // Format the target date for the input
                const targetDateObj = new Date(parseInt(savedTargetDate));
                datetimeInput.value = formatDateForInput(targetDateObj);
                
                // Start the countdown
                updateCountdown();
                countdownInterval = setInterval(updateCountdown, 1000);
            } else {
                // If the saved date is in the past, remove it
                localStorage.removeItem('countdownTargetDate');
            }
        }
    }
    
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
});
