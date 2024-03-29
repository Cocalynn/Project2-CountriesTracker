// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
const root = am5.Root.new("mapDiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([am5themes_Animated.new(root)]);

// Create the map chart
// https://www.amcharts.com/docs/v5/charts/map-chart/
const chart = root.container.children.push(
  am5map.MapChart.new(root, {
    panX: "rotateX",
    panY: "translateY",
    projection: am5map.geoNaturalEarth1(),
  })
);

// Create main polygon series for countries
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
const polygonSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: am5geodata_worldLow,
    exclude: ["AQ"],
  })
);

polygonSeries.mapPolygons.template.setAll({
  tooltipText: "{name}",
  toggleKey: "active",
  interactive: true,
});

polygonSeries.mapPolygons.template.states.create("hover", {
  fill: root.interfaceColors.get("primaryButtonHover"),
});

polygonSeries.mapPolygons.template.states.create("active", {
  fill: root.interfaceColors.get("primaryButtonActive"),
});

// Set clicking on "water" to zoom out
chart.chartContainer.get("background").events.on("click", function () {
  chart.goHome();
});

// Get countries inside the DB for the user
async function getSavedCountries() {
  const response = await fetch("/api/countries/saved");
  const savedCountries = await response.json();
  return savedCountries;
}

// fetch the object id property from the db
async function getCountryObjectId(countryId) {
  const response = await fetch(`/api/countries/cid/${countryId}`);
  const country = await response.json();
  return { countryObjectId: country._id, country };
}

// is the country already planned

async function isCountryAlreadyPlanned(countryId) {
  console.log("Checking if country is already planned:", countryId);
  const savedCountries = await getSavedCountries();
  console.log("Saved countries:", savedCountries);
  return savedCountries.some((country) => country === countryId);
}

// Catch the country click event

polygonSeries.mapPolygons.template.events.on("click", async function (ev) {
  const countryId = ev.target.dataItem.dataContext.id;
  const countryName = ev.target.dataItem.dataContext.name;
  console.log("Clicked on:", countryId);

  const isCountryPlanned = await isCountryAlreadyPlanned(countryId);
  console.log("Is country planned:", isCountryPlanned);

  if (isCountryPlanned) {
    Swal.fire({
      title: "Oops!",
      text: "You have already planned to visit " + countryName + ".",
      icon: "error",
      confirmButtonText: "Cancel",
      confirmButtonColor: "#dc3545",
    });
    return;
  }

  // Get the ObjectId of the country from the database
  const { countryObjectId, country } = await getCountryObjectId(countryId);

  let nextCountryButton = document.getElementById("country-next-confirm");
  let nextConfirmButton = document.getElementById("next-confirm-ok");

  let departure = document.getElementById("country-next");
  departure.innerHTML = countryName;

  nextConfirmButton.onclick = function () {
    isJourneyLocked = true;
    fetch(`/api/countries/${countryObjectId}/plan`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plannedTimes: 1,
        country, // Include the country object here
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to update plannedTimes: " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        location.reload(); // Reload the page
      })
      .catch((error) => console.error(error));
  };
});
// Add zoom control
// https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Zoom_control
const zoomControl = chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
const homeButton = zoomControl.children.moveValue(
  am5.Button.new(root, {
    paddingTop: 10,
    paddingBottom: 10,
    icon: am5.Graphics.new(root, {
      svgPath:
        "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8",
      fill: am5.color(0xffffff),
    }),
  }),
  0
);

async function updateSavedCountriesSeries() {
  const savedCountries = await getSavedCountries();
  const savedCountriesData = [];

  savedCountries.forEach((country) => {
    savedCountriesData.push({
      id: country.countryId,
      latitude: country.latitude,
      longitude: country.longitude,
    });
  });

  chart.series.push(
    am5map.MapPointSeries.new(root, {
      data: savedCountriesData,
      name: "Saved Countries",
    })
  );
}

updateSavedCountriesSeries();

/**
 * Exporting map
 */
const exporting = am5plugins_exporting.Exporting.new(root, {
  menu: am5plugins_exporting.ExportingMenu.new(root, {}),
  filePrefix: "myPlannedMap",
});

homeButton.events.on("click", function () {
  chart.goHome();
});

// Make stuff animate on load
chart.appear(1000, 100);
