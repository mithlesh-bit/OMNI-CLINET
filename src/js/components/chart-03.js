import ApexCharts from "apexcharts";

var data; // Define data variable

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
    data = await response.json(); // Assign fetched data to the data variable

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// Function to count occurrences of desktop, tablet, and mobile
const countDeviceTypes = () => {
  let desktopCount = 0;
  let tabletCount = 0;
  let mobileCount = 0;

  // Check if data is available and has interaction and users
  if (data && data.interaction && data.interaction.users) {
    // Iterate through users
    data.interaction.users.forEach((user) => {
      // Iterate through tokens
      user.tokens.forEach((token) => {
        // Iterate through interactionDetails
        token.interactionDetails.forEach((interactionDetail) => {
          if (interactionDetail.deviceType) {
            // Increment counts based on deviceType
            switch (interactionDetail.deviceType) {
              case "Desktop":
                desktopCount++;
                break;
              case "Tablet":
                tabletCount++;
                break;
              case "Mobile":
                mobileCount++;
                break;
              default:
                break;
            }
          }
        });
      });
    });
  } else {
    console.error("Invalid data format");
  }

  return { desktopCount, tabletCount, mobileCount };
};

// ===== chartThree
const chart03 = () => {
  const chartThreeOptions = {
    series: [0, 0, 0, 0], // Initial series values
    chart: {
      type: "donut",
      width: 380,
    },
    colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF"],
    labels: ["Desktop", "Tablet", "Mobile", "Unknown"],
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "55%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  // Call fetchData to fetch data and update chart series
  fetchData().then(() => {
    // Call countDeviceTypes to get counts
    const { desktopCount, tabletCount, mobileCount } = countDeviceTypes();

    // Update chart series
    chartThreeOptions.series = [desktopCount, tabletCount, mobileCount, 0];

    // Render the chart
    const chartThree = new ApexCharts(
      document.querySelector("#chartThree"),
      chartThreeOptions
    );
    chartThree.render();
  });
};

export default chart03;
