
function initStateMap(stateNumber){
	
	d3.json ("topojson/State_topo.json", function(stateTopoJson) {
		stateGeoJson = topojson.feature(stateTopoJson, stateTopoJson.objects.State_geo);

		centerStateView(stateNumber);

		projection = d3.geo.mercator()
			.center([centerLon, centerLat])
			.scale(theReScale-(theReScale*.2))
			.translate([w/2, h/2]);
					
		path = d3.geo.path()
			.projection(projection);
				

		d3.json ("topojson/County_topo.json", function(countyTopoJson) {
			countyGeoJson = topojson.feature(countyTopoJson, countyTopoJson.objects.County_geo);
			for (i=0; i<countyGeoJson.features.length; i++){
				countyGeoJson.features[i].properties.state = countyGeoJson.features[i].id.slice(0,2)
			}
			for (i=0; i<countyGeoJson.features.length; i++){
				if (countyGeoJson.features[i].properties.state != stateNumber){
					countyGeoJson.features.splice(i,1);
					i--;
				} 
			}

			// loop that fills out an array with a demographics stat
			for (i=0; i<countyGeoJson.features.length; i++){
				demographicsArray[i] = countyGeoJson.features[i].properties.pop
			}
			quantize.domain([
				d3.min(demographicsArray), 
				d3.max(demographicsArray)
			]);

			svg.append('g')
				.attr('class', 'theCounty')
				.selectAll('path')
				.data(countyGeoJson.features)
				.enter()
				.append('path')
				.attr('class', 'q3-9')
				.attr('class', function(d) { return quantize(d.properties.pop); })
				.attr('d', path)

			svg.append('text')
				.attr('class', 'name_label')
				.attr('y', 40)
				.attr('x', 40)
				.attr("text-anchor", "left")
				.text(stateName);
		});
	});
}
