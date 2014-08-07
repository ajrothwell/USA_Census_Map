
function initCountryMap(){

	// define (or re-define) these things 
	projection = d3.geo.albersUsa()
		.translate([w/2, h/2])
		.scale([500]);

	path = d3.geo.path()
		.projection(projection);




	// Now working with the CSV data








	d3.select('svg')
		.select('g')
		.remove();
		
	d3.select('svg')
		.select('text')
		.remove();

	svg.append('g')
		.attr('class', 'theState')
		.selectAll("path")
		.data(stateGeoJson.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style('fill', 'rgb(200,200,200)');
	
	svg.append('text')
		.attr('class', 'name_label')
		.attr('y', 40)
		.attr('x', 40)
		.attr("text-anchor", "left")
		.text("U.S.A.");


}
