document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('logChart').getContext('2d');
  let chart;

  async function fetchAndUpdateLogs() {
      try {
          const response = await fetch('https://usergarden.vercel.app/logs');
          const logs = await response.json();
          
          // Sort logs by date ascending for chart
          const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
          
          updateTable(logs);
          updateChart(sortedLogs);
      } catch (error) {
          console.error('Error fetching logs:', error);
      }
  }

  function updateTable(logs) {
      const tbody = document.querySelector('#logTable tbody');
      tbody.innerHTML = logs
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort descending for table
          .map(log => `
              <tr>
                  <td>${new Date(log.date).toLocaleDateString()}</td>
                  <td>${log.count}</td>
              </tr>
          `).join('');
  }

  function updateChart(logs) {
      if (chart) chart.destroy();
      
      chart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: logs.map(log => new Date(log.date).toLocaleDateString()),
              datasets: [{
                  label: 'Daily User Count',
                  data: logs.map(log => log.count),
                  borderColor: '#4bc0c0',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  tension: 0.3,
                  fill: true
              }]
          },
          options: {
              responsive: true,
              plugins: {
                  legend: { position: 'top' },
                  title: { 
                      display: true, 
                      text: 'User Activity Over Time',
                      font: { size: 16 }
                  }
              },
              scales: {
                  x: { 
                      display: true, 
                      title: { 
                          display: true, 
                          text: 'Date',
                          font: { weight: 'bold' }
                      } 
                  },
                  y: { 
                      display: true, 
                      title: { 
                          display: true, 
                          text: 'Users',
                          font: { weight: 'bold' }
                      },
                      beginAtZero: true,
                      ticks: { precision: 0 }
                  }
              }
          }
      });
  }

  // Initial load
  fetchAndUpdateLogs();
  // Refresh every 5 minutes
  setInterval(fetchAndUpdateLogs, 300000);
});