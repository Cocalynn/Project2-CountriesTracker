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

// Catch the country click event

polygonSeries.mapPolygons.template.events.on("click", function (ev) {
  const countryId = ev.target.dataItem.dataContext.name;
  const isActive = ev.target.dataItem.dataContext.isActive;
  console.log(isActive);
  console.log("Clicked on:", countryId);

  // If country is active, don't update visitedTimes
  if (isActive) {
    return;
  }

  // Otherwise, update visitedTimes and set isActive to true
  ev.target.dataItem.dataContext.isActive = true;
  fetch(`/api/countries/${countryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      visitedTimes: 1, // Increase visitedTimes by 1
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
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

/**
 * Exporting map
 */
const exporting = am5plugins_exporting.Exporting.new(root, {
  menu: am5plugins_exporting.ExportingMenu.new(root, {}),
});

homeButton.events.on("click", function () {
  chart.goHome();
});

// Make stuff animate on load
chart.appear(1000, 100);
