document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('logChart').getContext('2d');
    let chart;
  
    async function fetchAndUpdateLogs() {
      try {
        // Change fetch URL to
        const response = await fetch('/api/logs');
        const logs = await response.json();
        
        updateTable(logs);
        updateChart(logs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    }
  
    function updateTable(logs) {
      const tbody = document.querySelector('#logTable tbody');
      tbody.innerHTML = logs
        .map(log => `
          <tr>
            <td>${log.date}</td>
            <td>${log.count}</td>
          </tr>
        `).join('');
    }
  
    function updateChart(logs) {
      if (chart) chart.destroy();
      
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: logs.map(log => log.date),
          datasets: [{
            label: 'Daily User Count',
            data: logs.map(log => log.count),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  
    // Refresh data every 5 minutes
    fetchAndUpdateLogs();
    setInterval(fetchAndUpdateLogs, 300000);
  });