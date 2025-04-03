const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const generateGraph = async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load Chart.js in a headless browser
    await page.setContent(`
      <html>
        <body>
          <canvas id="myChart"></canvas>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <script>
            const ctx = document.getElementById('myChart').getContext('2d');
            new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green'],
                datasets: [{
                  label: 'Dataset',
                  data: [12, 19, 3, 5],
                  backgroundColor: ['red', 'blue', 'yellow', 'green']
                }]
              }
            });
          </script>
        </body>
      </html>
    `);

    // Define the path to save the generated graph
    const chartPath = path.join(__dirname, "../public/chart.png");
    await page.screenshot({ path: chartPath });

    await browser.close();

    // Send the generated chart as a response
    res.sendFile(chartPath);
  } catch (error) {
    res.status(500).json({ error: "Error generating graph", details: error.message });
  }
};

module.exports = { generateGraph };