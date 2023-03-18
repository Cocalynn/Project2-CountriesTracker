// Create root
var root = am5.Root.new("chartdiv"); 

// Set themes
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create chart
var chart = root.container.children.push(
  am5map.MapChart.new(root, {
    panX: "rotateX",
    panY: "none",
    projection: am5map.geoNaturalEarth1()
  })
);


// Create polygon series
var polygonSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: am5geodata_worldLow,
    exclude: ["AQ"]
  })
);

// Interactive
polygonSeries.mapPolygons.template.setAll({
    tooltipText: "{name}", // hover text
    toggleKey: "active", // toggle active state
    interactive: true,
});

//only for testing purpose
let visitedCountries = [

];

let currentCoordinates = [0,0];
let departureCountry, arrivalCountry, departureCoordinates, arrivalCoordinates;
let isDepartureLocked = false;
let isArrivalLocked = true;
polygonSeries.mapPolygons.template.events.once("click", function (ev) {
    const countryId = ev.target.dataItem.dataContext.name;
    console.log("Clicked on:", countryId);

    let departureConfirmButton = document.getElementById("country-departure-confirm");
    let arrivalConfirmButton = document.getElementById("country-arrival-confirm");
    let journeyConfirmButton = document.getElementById("journey-confirm");

    if (!isDepartureLocked) {
        let departure = document.getElementById("country-departure");
        departure.innerHTML = countryId;
    }
    if (!isArrivalLocked) {
        let arrival = document.getElementById("country-arrival");
        arrival.innerHTML = countryId;
    }

    //if click the first confirm button
    departureConfirmButton.onclick = function() {
        isDepartureLocked = true;
        // lock the value of departure.innerHTML
        departureConfirmButton.disabled = true;
        departureConfirmButton.style.backgroundColor = "grey";
        departureConfirmButton.style.color = "white";
        departureConfirmButton.style.cursor = "not-allowed";
        departureConfirmButton.innerHTML = "Confirmed";
        // enable the arrival confirm button
        arrivalConfirmButton.disabled = false;
        arrivalConfirmButton.style.backgroundColor = "white";
        arrivalConfirmButton.style.color = "black";
        arrivalConfirmButton.style.cursor = "pointer";
        arrivalConfirmButton.innerHTML = "Confirm";
        // enable the arrival input
        isArrivalLocked = false;

        // set the current coordinates as the departure coordinates
        // data is stored in currentCoordinates
        // needs to be sent to the database
        departureCountry = countryId;
        departureCoordinates = currentCoordinates;
    }
    arrivalConfirmButton.onclick = function() {
        isArrivalLocked = true;
        // lock the value of arrival.innerHTML
        arrivalConfirmButton.disabled = true;
        arrivalConfirmButton.style.backgroundColor = "grey";
        arrivalConfirmButton.style.color = "white";
        arrivalConfirmButton.style.cursor = "not-allowed";
        arrivalConfirmButton.innerHTML = "Confirmed";
        arrivalCountry = countryId;
        arrivalCoordinates = currentCoordinates;
    }    
    journeyConfirmButton.onclick = function() {
        // send the data to the database
        visitedCountries.push(
          {
            from: {
              country: departureCountry,
              coordinates: departureCoordinates
            },
            to: {
              country: arrivalCountry,
              coordinates: arrivalCoordinates
            }
          }
        );
      route._settings.geometry.coordinates.push([ departureCoordinates, arrivalCoordinates ]); // push new data here
      console.log(visitedCountries);
    }

});


polygonSeries.mapPolygons.template.states.create("hover", {
fill: root.interfaceColors.get("primaryButtonHover"), // hover color
});

// polygonSeries.mapPolygons.template.states.create("active", {
// fill: root.interfaceColors.get("primaryButtonActive"), // active countries color
// });

// Set clicking on "water" to zoom out
chart.chartContainer.get("background").events.on("click", function () {
    chart.goHome();
  });

// Create line series
var lineSeries = chart.series.push(
  am5map.MapLineSeries.new(root, {})
);
  
lineSeries.mapLines.template.setAll({
  stroke: am5.color(0xffba00),
  strokeWidth: 2,
  strokeOpacity: 1
});

var route = lineSeries.pushDataItem({
  geometry: {
      type: "MultiLineString",
      coordinates: [ // need to get data from database
          [
              [ -0.454296, 51.470020 ],
              [ 116.4074, 39.9042 ]
          ],
          [
              [ 116.4074, 39.9042 ],
              [ 2.15899, 41.38879 ]
          ],
          [
              [ 2.15899, 41.38879 ],
              [ 116.4074, 39.9042 ]
          ],
          [
              [75, 75],
              [20, 20]
          ],
      ]
  }
});

//console.log(route._settings.geometry.type);
//console.log(route._settings.geometry.coordinates);
//route._settings.geometry.coordinates.push([ [ 116.4074, 39.9042 ], [ -0.454296, 51.470020 ] ]); // push new data here
//console.log(route._settings.geometry.coordinates);

chart.events.on("click", function(ev) {
  const apiKey = '8804044d31394579b1e84fe19be2521f'; // Replace with your OpenCage API key
  const coordinates = [chart.invert(ev.point).longitude, chart.invert(ev.point).latitude];

  const reverseGeocode = async (lat, lng, apiKey) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const country = result.components.country;
      return {
        country: country || 'Unknown',
      };
    } else {
      return {
        country: 'Unknown',
      };
    }
  };
  reverseGeocode(coordinates[1], coordinates[0], apiKey)
      .then(result => {
        console.log('Country:', result.country);
        if (result.country !== 'Unknown') {
          // store coordinates array
          currentCoordinates = coordinates;
          console.log("currentCoordinates:", currentCoordinates);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
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
homeButton.events.on("click", function () {
    chart.goHome();
  });

// Create point series
var pointSeries = chart.series.push(
  am5map.MapPointSeries.new(root, {})
);

pointSeries.bullets.push(function() {
  var container = am5.Container.new(root, {});
  container.children.push(am5.Graphics.new(root, {
    svgPath: "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47",
    scale: 0.06,
    centerY: am5.p50,
    centerX: am5.p50,
    fill: am5.color(0x000000)
  }));
  return am5.Bullet.new(root, { sprite: container });
});

// To be updated for lineDataItem, need a function to calculate positionOnLine based on coordinates and journey routes
var plane1 = pointSeries.pushDataItem({
  lineDataItem: route,
  positionOnLine: 0,
  autoRotate: true
});
plane1.animate({
    key: "positionOnLine",
    to: 1,
    duration: 5000,
    loop: -1,
    easing: am5.ease.inOut(am5.ease.cubic)
})


  