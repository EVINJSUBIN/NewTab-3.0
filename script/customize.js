const colorSelect = document.getElementById('colorSelect');
const clockTypeSelect = document.getElementById('clockType');

// Set initial values
colorSelect.value = settings['colorScheme'] || 'cyan';
clockTypeSelect.value = settings['clockType'] || '24h';

// Color change handler
colorSelect.addEventListener('change', (e) => {
    set('colorScheme', e.target.value);
    settings['colorScheme'] = e.target.value;
    document.getElementById('body').className = e.target.value;
});

// Clock type change handler
clockTypeSelect.addEventListener('change', (e) => {
    set('clockType', e.target.value);
    settings['clockType'] = e.target.value;
    // Trigger immediate clock update
    updateClock();
});
