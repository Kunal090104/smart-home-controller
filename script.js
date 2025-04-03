// Initialize Particle Background
particlesJS("particles-js", {
    particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: "#8a2be2" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#8a2be2", opacity: 0.2, width: 1 },
        move: { enable: true, speed: 1, direction: "none", random: true }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" }
        }
    }
});

// Appliance Control System
document.addEventListener('DOMContentLoaded', function() {
    const appliances = [
        { id: 'light', name: 'Light', brand: 'philips', icon: 'lightbulb', power: 45 },
        { id: 'ac', name: 'AC', brand: 'samsung', icon: 'snowflake', power: 1500 },
        { id: 'tv', name: 'TV', brand: 'lg', icon: 'tv', power: 120 },
        { id: 'airpurifier', name: 'Air Purifier', brand: 'daikin', icon: 'wind', power: 50 },
        { id: 'fridge', name: 'Fridge', brand: 'whirlpool', icon: 'blender', power: 200 },
        { id: 'cooler', name: 'Cooler', brand: 'havells', icon: 'fan', power: 80 },
        { id: 'sound', name: 'Sound System', brand: 'sony', icon: 'music', power: 100 },
        { id: 'vacuum', name: 'Vacuum', brand: 'irobot', icon: 'robot', power: 60 }
    ];

    // Initialize all appliances
    appliances.forEach(appliance => {
        const toggle = document.getElementById(`${appliance.id}-toggle`);
        const card = document.getElementById(`${appliance.id}-card`);
        const status = document.getElementById(`${appliance.id}-status`);

        // Load initial state from localStorage
        const savedState = localStorage.getItem(`appliance-${appliance.id}`);
        if (savedState === 'on') {
            toggle.checked = true;
            card.classList.add('on');
            status.textContent = 'ON';
            status.className = 'status on';
        }

        // Toggle event
        toggle.addEventListener('change', function() {
            if (this.checked) {
                card.classList.add('on');
                status.textContent = 'ON';
                status.className = 'status on';
                localStorage.setItem(`appliance-${appliance.id}`, 'on');
                
                // In real app: fetch(`/api/${appliance.id}/on`);
                console.log(`${appliance.name} turned ON`);
            } else {
                card.classList.remove('on');
                status.textContent = 'OFF';
                status.className = 'status off';
                localStorage.setItem(`appliance-${appliance.id}`, 'off');
                
                // In real app: fetch(`/api/${appliance.id}/off`);
                console.log(`${appliance.name} turned OFF`);
            }
            
            updateEnergyStats();
        });

        // Card click event
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('toggle-switch') && 
                !e.target.classList.contains('slider') && 
                e.target.tagName !== 'INPUT') {
                toggle.checked = !toggle.checked;
                toggle.dispatchEvent(new Event('change'));
            }
        });
    });

    // Scene Controls
    document.getElementById('good-morning').addEventListener('click', function() {
        // Turn on lights, turn off AC
        document.getElementById('light-toggle').checked = true;
        document.getElementById('light-toggle').dispatchEvent(new Event('change'));
        
        document.getElementById('ac-toggle').checked = false;
        document.getElementById('ac-toggle').dispatchEvent(new Event('change'));
        
        console.log('Morning scene activated');
    });

    document.getElementById('good-night').addEventListener('click', function() {
        // Turn off lights and TV, turn on AC
        document.getElementById('light-toggle').checked = false;
        document.getElementById('light-toggle').dispatchEvent(new Event('change'));
        
        document.getElementById('tv-toggle').checked = false;
        document.getElementById('tv-toggle').dispatchEvent(new Event('change'));
        
        document.getElementById('ac-toggle').checked = true;
        document.getElementById('ac-toggle').dispatchEvent(new Event('change'));
        
        console.log('Night scene activated');
    });

    document.getElementById('movie-time').addEventListener('click', function() {
        // Dim lights, turn on TV
        document.getElementById('light-toggle').checked = true;
        document.getElementById('light-toggle').dispatchEvent(new Event('change'));
        
        document.getElementById('tv-toggle').checked = true;
        document.getElementById('tv-toggle').dispatchEvent(new Event('change'));
        
        document.getElementById('sound-toggle').checked = true;
        document.getElementById('sound-toggle').dispatchEvent(new Event('change'));
        
        console.log('Movie scene activated');
    });

    document.getElementById('away-mode').addEventListener('click', function() {
        // Turn off all appliances
        appliances.forEach(appliance => {
            document.getElementById(`${appliance.id}-toggle`).checked = false;
            document.getElementById(`${appliance.id}-toggle`).dispatchEvent(new Event('change'));
        });
        
        console.log('Away mode activated');
    });

    // Settings Button
    document.getElementById('settings-btn').addEventListener('click', function() {
        alert('Settings panel would open here');
    });

    // Notifications Button
    document.getElementById('notifications-btn').addEventListener('click', function() {
        alert('Notifications panel would open here');
    });

    // Energy Calculation
    function updateEnergyStats() {
        let totalPower = 0;
        let activeAppliances = [];
        
        appliances.forEach(appliance => {
            if (document.getElementById(`${appliance.id}-toggle`).checked) {
                totalPower += appliance.power;
                activeAppliances.push(appliance.name);
            }
        });
        
        // Calculate kWh (assuming 8 hours of usage for demo)
        const totalKwh = (totalPower * 8 / 1000).toFixed(1);
        const cost = (totalKwh * 9).toFixed(2); // ₹9 per kWh
        
        // Update UI
        document.querySelector('.stat-value:nth-child(1)').textContent = `${totalKwh} kWh`;
        document.querySelector('.stat-value:nth-child(2)').textContent = `₹ ${cost}`;
        document.querySelector('.stat-value:nth-child(3)').textContent = 
            activeAppliances.length > 0 ? activeAppliances[0] : 'None';
    }

    // Initialize energy stats
    updateEnergyStats();
});