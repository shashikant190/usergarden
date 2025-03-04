document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('logChart').getContext('2d');
    let chart;
    let currentLogs = [];

    // async function fetchAndUpdateLogs() {
    //   try {
    //     // Change fetch URL to
    //     const response = await fetch('/api/logs');
    //     const logs = await response.json();
        
    //     updateTable(logs);
    //     updateChart(logs);
    //   } catch (error) {
    //     console.error('Error fetching logs:', error);
    //   }
    // }

    // Modify the fetchAndUpdateLogs function
async function fetchAndUpdateLogs() {
  try {
    const response = await fetch('/api/logs');
    currentLogs = await response.json(); // Store logs globally
    updateTable(currentLogs);
    updateChart(currentLogs);
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


  document.getElementById('downloadButton').addEventListener('click', () => {
    if (!currentLogs.length) {
      alert('No data available to download');
      return;
    }
  
    // Create CSV content
    const csv = [
      ['Date', 'User Count'].join(','),
      ...currentLogs.map(log => [log.date, log.count].join(','))
    ].join('\n');
  
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_logs_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  });