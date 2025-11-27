document.addEventListener('DOMContentLoaded', () => {
    const runBtn = document.getElementById('runBtn');
    const numSimulationsInput = document.getElementById('numSimulations');
    const flipsPerGameInput = document.getElementById('flipsPerGame');
    const gameModeInput = document.getElementById('gameMode');

    const avgPayoutEl = document.getElementById('avgPayout');
    const medianPayoutEl = document.getElementById('medianPayout');
    const minPayoutEl = document.getElementById('minPayout');
    const maxPayoutEl = document.getElementById('maxPayout');

    let chartInstance = null;

    runBtn.addEventListener('click', runSimulation);

    // Initial run
    runSimulation();

    function runSimulation() {
        const numSimulations = parseInt(numSimulationsInput.value) || 10000;
        const flipsPerGame = parseInt(flipsPerGameInput.value) || 100;
        const gameMode = gameModeInput.value;

        // Validate inputs
        if (numSimulations <= 0 || flipsPerGame <= 0) {
            alert('Please enter valid positive numbers.');
            return;
        }

        // Show loading state
        runBtn.textContent = 'Running...';
        runBtn.disabled = true;

        setTimeout(() => {
            const results = [];

            for (let i = 0; i < numSimulations; i++) {
                let balance = gameMode === 'multiplicative' ? 1 : 100;

                for (let j = 0; j < flipsPerGame; j++) {
                    const isHeads = Math.random() < 0.5;

                    if (gameMode === 'multiplicative') {
                        if (isHeads) {
                            balance *= 1.1;
                        } else {
                            balance *= 0.9;
                        }
                    } else {
                        // Additive
                        if (isHeads) {
                            balance += 1;
                        } else {
                            balance -= 1;
                        }
                    }
                }
                results.push(balance);
            }

            updateStats(results);
            updateChart(results);

            runBtn.innerHTML = `
                Run Simulation
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            `;
            runBtn.disabled = false;
        }, 50);
    }

    function updateStats(results) {
        const sum = results.reduce((a, b) => a + b, 0);
        const avg = sum / results.length;
        const min = Math.min(...results);
        const max = Math.max(...results);

        // Calculate Median
        const sortedResults = [...results].sort((a, b) => a - b);
        const mid = Math.floor(sortedResults.length / 2);
        const median = sortedResults.length % 2 !== 0
            ? sortedResults[mid]
            : (sortedResults[mid - 1] + sortedResults[mid]) / 2;

        // Animate numbers
        animateValue(avgPayoutEl, parseFloat(avgPayoutEl.textContent.replace('$', '')) || 0, avg, 1000, true);
        animateValue(medianPayoutEl, parseFloat(medianPayoutEl.textContent.replace('$', '')) || 0, median, 1000, true);
        animateValue(minPayoutEl, parseFloat(minPayoutEl.textContent.replace('$', '')) || 0, min, 1000, true);
        animateValue(maxPayoutEl, parseFloat(maxPayoutEl.textContent.replace('$', '')) || 0, max, 1000, true);
    }

    function animateValue(obj, start, end, duration, isFloat = false) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = progress * (end - start) + start;

            // Format based on magnitude
            let formattedValue;
            if (Math.abs(value) < 0.01 && value !== 0) {
                formattedValue = value.toExponential(2);
            } else if (isFloat || Math.abs(value) < 100) {
                formattedValue = value.toFixed(2);
            } else {
                formattedValue = Math.floor(value);
            }

            obj.innerHTML = '$' + formattedValue;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function updateChart(results) {
        const ctx = document.getElementById('resultsChart').getContext('2d');

        // Binning for continuous data (multiplicative) or discrete (additive)
        const isMultiplicative = gameModeInput.value === 'multiplicative';

        let labels, data;

        if (isMultiplicative) {
            // Create histogram bins using log scale
            const binCount = 50; // Use fewer bins for cleaner look
            const minVal = Math.min(...results);
            const maxVal = Math.max(...results);

            // Avoid log(0) issues
            const safeMin = minVal > 0 ? minVal : 0.0001;
            const logMin = Math.log10(safeMin);
            const logMax = Math.log10(maxVal);

            const logRange = logMax - logMin;
            const logBinSize = logRange / binCount;

            const bins = new Array(binCount).fill(0);
            const binLabels = [];

            // Create labels (geometric mean of bin edges)
            for (let i = 0; i < binCount; i++) {
                const binLogStart = logMin + i * logBinSize;
                const binLogEnd = logMin + (i + 1) * logBinSize;
                const binCenter = Math.pow(10, (binLogStart + binLogEnd) / 2);

                // Format label nicely
                if (binCenter < 0.01) {
                    binLabels.push(binCenter.toExponential(1));
                } else if (binCenter < 100) {
                    binLabels.push(binCenter.toFixed(2));
                } else {
                    binLabels.push(Math.round(binCenter).toString());
                }
            }

            results.forEach(val => {
                if (val <= 0) return; // Skip non-positive values
                const logVal = Math.log10(val);
                let binIndex = Math.floor((logVal - logMin) / logBinSize);
                if (binIndex >= binCount) binIndex = binCount - 1;
                if (binIndex < 0) binIndex = 0;
                bins[binIndex]++;
            });

            labels = binLabels;
            data = bins;
        } else {
            // Discrete frequency
            const counts = {};
            results.forEach(x => {
                counts[x] = (counts[x] || 0) + 1;
            });
            labels = Object.keys(counts).map(Number).sort((a, b) => a - b);
            data = labels.map(label => counts[label]);
        }

        // Destroy previous chart if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Frequency',
                    data: data,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Final Balance Distribution',
                        color: '#94a3b8',
                        font: {
                            size: 16,
                            family: "'Inter', sans-serif"
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#f8fafc',
                        bodyColor: '#cbd5e1',
                        padding: 10,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            title: (context) => `Balance: $${context[0].label}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            maxTicksLimit: 20
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
});
