
function initCountryMap(){

//	alert('is this working?')	
//	theError = error


	// define (or re-define) these things 
	projection = d3.geo.albersUsa()
		.translate([w/2-150, h/2])
		.scale([600]);

	path = d3.geo.path()
		.projection(projection);




	// Now working with the CSV data

	getDemographic();

}
