import ApexCharts from "apexcharts";

let responseData; // Define data variable

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
    console.log(responseData); // Log the fetched data
    return responseData; // Return the fetched data
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const chart01 = async () => {
  try {
    await fetchData();

    // Initialize an object to store interaction counts for each page title and month
    // const interactionCounts = {};

    // // Iterate over each user
    // responseData.interaction.users.forEach(user => {
    //   // Iterate over each token for the user
    //   user.tokens.forEach(token => {
    //     // Iterate over each interaction detail for the token
    //     token.interactionDetails.forEach(interaction => {
    //       const pageTitle = interaction.pageTitle;
    //       const month = interaction.ISTMonth;

    //       // Initialize count for the page title if it doesn't exist
    //       if (!interactionCounts[pageTitle]) {
    //         interactionCounts[pageTitle] = {};
    //       }

    //       // Initialize count for the month if it doesn't exist
    //       if (!interactionCounts[pageTitle][month]) {
    //         interactionCounts[pageTitle][month] = 0;
    //       }

    //       // Increment count for the month
    //       interactionCounts[pageTitle][month]++;
    //     });
    //   });
    // });

    // // Extract page titles and months
    // const pageTitles = Object.keys(interactionCounts);
    // const months = Array.from(new Set(responseData.interaction.users.flatMap(user => user.tokens.flatMap(token => token.interactionDetails.map(interaction => interaction.ISTMonth)))));

    // // Generate series data for each page title
    // const seriesData = pageTitles.map(pageTitle => {
    //   const interactionArray = months.map(month => interactionCounts[pageTitle][month] || 0);
    //   return { name: pageTitle, data: interactionArray };
    // });

    // console.log('Series Data:', seriesData);




    const chartOneOptions = {
      series: seriesData,

      legend: {
        show: false,
        position: "top",
        horizontalAlign: "left",
      },
      colors: ["#3C50E0", "#80CAEE"],
      chart: {
        fontFamily: "Satoshi, sans-serif",
        height: 335,
        type: "area",
        dropShadow: {
          enabled: true,
          color: "#623CEA14",
          top: 10,
          blur: 4,
          left: 0,
          opacity: 0.1,
        },
        toolbar: {
          show: false,
        },
      },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: {
              height: 300,
            },
          },
        },
        {
          breakpoint: 1366,
          options: {
            chart: {
              height: 350,
            },
          },
        },
      ],
      stroke: {
        width: [2, 2],
        curve: "straight",
      },
      markers: {
        size: 0,
      },
      labels: {
        show: false,
        position: "top",
      },
      grid: {
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 4,
        colors: "#fff",
        strokeColors: ["#3056D3", "#80CAEE"],
        strokeWidth: 3,
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [],
        hover: {
          size: undefined,
          sizeOffset: 5,
        },
      },
      xaxis: {
        type: "category",
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        title: {
          style: {
            fontSize: "0px",
          },
        },
        min: 0,
        max: 100,
      },
    };

    const chartSelector = document.querySelectorAll("#chartOne");

    if (chartSelector.length) {
      const chartOne = new ApexCharts(
        document.querySelector("#chartOne"),
        chartOneOptions
      );
      chartOne.render();
    }
  } catch (error) {
    console.error("Error rendering chart:", error);
  }
};

(async () => {
  await chart01(); // Render chart after data is fetched
})();

export default chart01;
///////////////////////////////////////




const frequencyArray = [];

    // Iterate over each page title
    pageTitles.forEach(pageTitle => {
      // Initialize a frequency array for the current page
      const pageFrequencyArray = Array(12).fill(0);

      // Loop through months
      months.forEach((month, index) => {
        // Check if interactionCounts has data for the current page and month
        if (interactionCounts[pageTitle] && interactionCounts[pageTitle][month]) {
          // If data exists, assign it to the corresponding index in the frequency array
          pageFrequencyArray[index] = interactionCounts[pageTitle][month];
        }
      });

      // Push the frequency array for the current page to the frequencyArrays array
      frequencyArray.push(pageFrequencyArray);
    });
    // Log the frequency array
    const series = pageTitles.map((pageTitle, index) => ({
      name: pageTitle,
      data: frequencyArray[index],
    }));