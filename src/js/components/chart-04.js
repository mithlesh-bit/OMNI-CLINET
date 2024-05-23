import ApexCharts from "apexcharts";

let responseData; // Define responseData variable

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch("http://localhost:8080/api/home", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({}),
    });
    responseData = await response.json(); // Assign fetched data to a variable
    console.log(responseData); // Log the fetched data
    return responseData; // Return the fetched data
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// ===== chartFour
const chart04 = async () => {
  try {
    await fetchData();

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so we add 1
    const currentYear = currentDate.getFullYear();

    // Initialize an array to store interaction counts for each date of the current month
    const interactionsByDate = new Array(new Date(currentYear, currentMonth, 0).getDate()).fill(0);

    // Iterate over each user
    responseData.interaction.users.forEach(user => {
      // Iterate over each token for the user
      user.tokens.forEach(token => {
        // Iterate over each interaction detail for the token
        token.interactionDetails.forEach(interaction => {
          // Convert ISTMonth to a number for comparison
          const interactionMonth = parseInt(interaction.ISTMonth, 10);
          const interactionYear = interaction.ISTYear; // Assuming you have a property ISTYear

          // Check if the interaction occurred in the current month and year
          if (interactionMonth === currentMonth) {
            const interactionDate = interaction.ISTDateNum;

            // Increment the count for the corresponding date
            interactionsByDate[interactionDate - 1]++; // Subtract 1 because array is 0-indexed
          }
        });
      });
    });

    // Define chart options
    const chartFourOptions = {
      series: [{
        name: "Interactions", // Change the series name here
        data: interactionsByDate,
      }],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
          borderRadius: 2,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 4,
        colors: ["transparent"],
      },
      xaxis: {
        categories: Array.from({ length: interactionsByDate.length }, (_, i) => i + 1),
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "left",
        fontFamily: "Satoshi",
        markers: {
          radius: 99,
        },
      },
      yaxis: {
        title: false,
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        x: {
          show: false,
        },
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    };

    // Render the chart
    const chartSelector = document.querySelectorAll("#chartFour");
    if (chartSelector.length) {
      const chartFour = new ApexCharts(document.querySelector("#chartFour"), chartFourOptions);
      chartFour.render();
    }
  } catch (error) {
    console.error("Error rendering chart:", error);
  }
};

export default chart04;
