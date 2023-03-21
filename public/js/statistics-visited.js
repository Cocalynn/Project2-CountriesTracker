// Create root element
var root = am5.Root.new("chartdiv");

// Set themes
root.setThemes([am5themes_Animated.new(root)]);

// Create the map chart
var chart = root.container.children.push(
    am5map.MapChart.new(root, {
    panX: "rotateX",
    projection: am5map.geoMercator(),
    layout: root.horizontalLayout
}));

// Create polygon series for countries
var polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"],
      calculateAggregates: true,
      valueField: "value"
    })
  );

polygonSeries.mapPolygons.template.setAll({
    tooltipText: "{name}",
    interactive: true
});

polygonSeries.mapPolygons.template.states.create("hover", {
    //fill: am5.color(0x677935)
});

polygonSeries.set("heatRules", [{
    target: polygonSeries.mapPolygons.template,
    dataField: "value",
    min: am5.color(0x8ab7ff),
    max: am5.color(0x25529a),
    key: "fill"
}]);

polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
    heatLegend.showValue(ev.target.dataItem.get("value"));
});


fetch('https://friendly-hare-pea-coat.cyclic.app/api/countries')
.then((res) => res.json())
.then((countryData) => {
    var data = []
    for (var i = 0; i < countryData.data.length; i++) {
        data.push({
            id: countryData.data[i].cid,
            value: countryData.data[i].visitedTimes
        })
    }
    polygonSeries.data.setAll(data)
}).catch((err) => {
    console.log(err)
})

chart.seriesContainer.children.push(am5.Label.new(root, {
background: am5.RoundedRectangle.new(root, {
    fill: am5.color(0xffffff),
    fillOpacity: 0.2
})
}))

var heatLegend = chart.children.push(
    am5.HeatLegend.new(root, {
    orientation: "vertical",
    startColor: am5.color(0x8ab7ff),
    endColor: am5.color(0x25529a),
    startText: "Least frequent country visited",
    endText: "Most frequent country visited",
    stepCount: 1
    })
);

heatLegend.startLabel.setAll({
    fontSize: 12,
    fill: heatLegend.get("startColor")
});

heatLegend.endLabel.setAll({
    fontSize: 12,
    fill: heatLegend.get("endColor")
});

// change this to template when possible
polygonSeries.events.on("datavalidated", function () {
    heatLegend.set("startValue", polygonSeries.getPrivate("valueLow"));
    heatLegend.set("endValue", polygonSeries.getPrivate("valueHigh"));
});



