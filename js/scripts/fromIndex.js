

function precise_round(num,decimals){
	return Math.round(num*Math.pow(10,decimals))/Math.pow(10,decimals);
}
			
function commaSeparateNumber(val){
	while (/(\d+)(\d{3})/.test(val.toString())){
		val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	return val;
}

function initMap_CountryStateSplitter(stateNumber) {
	stateNumber_saved = stateNumber
	if (stateNumber != 00) {
		initStateMap(stateNumber);
	} else {
		initCountryMap();
	}
}

function getDemographic() {
	formData = $('#insertForm').serializeArray();
	completeMap_CountryStateSplitter(formData[1].value)
};
			
function completeMap_CountryStateSplitter(theDemographic) {
	theDemographic_saved = theDemographic
	if (stateNumber_saved != 00) {
		completeStateMap(theDemographic);
	} else {
		if (countyMode == 0) {
			completeCountryMap(theDemographic);
		} else {
			// all the code for the Please Wait box						
			svg.append('g')
				.attr('id', 'pleaseWaitBox')
				.attr('class', 'pleaseWaitBox')
				.append('rect')
				.attr('x', 220)
				.attr('y', 150)
				.attr("width", 150)
				.attr("height", 50)
				.attr('stroke-width', 2)
				.attr('stroke', 'rgb(0,0,0)')
				.attr('fill', 'rgb(255,255,51)')
			svg.select('#pleaseWaitBox')
				.append('text')
				.attr('class', 'pleaseWaitButtonText')
				.attr("x", 225)
				.attr("y", 183)
				.text('Please Wait')

			setTimeout(completeCountryCountyMap, 100, theDemographic);
		}
	}
}
