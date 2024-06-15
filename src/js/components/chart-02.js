import ApexCharts from "apexcharts";
import { theme } from "apexcharts";

let responseData; // Define responseData variable
function generateColors(count) {
  const colors = ['#3C50E0', '#80CAEE', '#3CB371', '#FFD700', '#FF6347', '#9370DB', '#00FFFF', '#00FF00', '#FF69B4']; // Add more colors as needed
  return colors.slice(0, count); // Return only the required number of colors
}

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch("https://omni-server.onrender.com/api/home", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({}),
    });
    responseData = await response.json(); // Assign fetched data to a variable
    return responseData; // Return the fetched data
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
// ===== chartTwo
const chart02 = async () => {
  try {
    await fetchData();

    // Initialize an object to store interaction counts for each browser and day
    const browserCounts = {};

    // Iterate over each user
    responseData.interaction.users.forEach(user => {
      // Iterate over each token for the user
      user.tokens.forEach(token => {
        // Iterate over each interaction detail for the token
        token.interactionDetails.forEach(interaction => {
          const browserName = interaction.browserName;
          const day = interaction.ISTDay;

          // Initialize count for the browser if it doesn't exist
          if (!browserCounts[browserName]) {
            browserCounts[browserName] = {};
          }

          // Initialize count for the day if it doesn't exist
          if (!browserCounts[browserName][day]) {
            browserCounts[browserName][day] = 0;
          }

          // Increment count for the day and browser
          browserCounts[browserName][day]++;
        });
      });
    });

    // Extract browser names and days
    const browserNames = Object.keys(browserCounts);
    const days = Array.from(new Set(responseData.interaction.users.flatMap(user => user.tokens.flatMap(token => token.interactionDetails.map(interaction => interaction.ISTDay)))));

    // Generate series data for each browser
    const seriesData = browserNames.map(browserName => {
      const browserArray = days.map(day => browserCounts[browserName][day] || 0);
      return { name: browserName, data: browserArray };
    });


    const chartTwoOptions = {
      series: seriesData,
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: generateColors(browserNames.length),
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "left",
        onItemClick: {
          toggleDataSeries: false,
        },
      },
      xaxis: {
        categories: days,
      },
      yaxis: {
        title: {
          text: "Interaction Count",
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " interactions";
          },
        },
      },
    };

    const chartSelector = document.querySelectorAll("#chartTwo");

    if (chartSelector.length) {
      const chartTwo = new ApexCharts(
        document.querySelector("#chartTwo"),
        chartTwoOptions
      );
      chartTwo.render();
    }
  } catch (error) {
    console.error("Error rendering chart:", error);
  }
};

export default chart02;
