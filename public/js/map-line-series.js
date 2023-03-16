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
        coordinates: [
          [
            [ -0.454296, 51.470020 ],
            [ 116.4074, 39.9042 ]
          ],
          [
            [116.4074, 39.9042],
            [2.15899, 41.38879]
          ]
        ]
    }
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


  