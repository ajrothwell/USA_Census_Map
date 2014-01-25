
function drawLegend() {
			
			var w=900, h=400

			var barWidth = 20;
			var barHeight = 8;
			var barSeparation = 8;
			var verticalBarDistance = barHeight + barSeparation;
			var barX = 550;			
			var firstBarY = 110;

			var textXOffset = 35
			var textYOffset = verticalBarDistance / 2;
			var textXPosition = barX + textXOffset;

			
			//Create the SVG
			var svg = d3.select("body")
				.append("svg")
				.attr("width", w)
				.attr("height", h);
			
			//Add data to the graph and call enter.
			var dataEnter = svg.selectAll("rect")
				.data([10, 10, 10, 10, 10, 10, 10, 10, 10])
				.enter();
			
			//Draw the bars.
			dataEnter.append("rect")
				.attr('class', function(d, i){
					return 'q' + i + '-9';
				})
				.attr("x", barX)
				.attr("y", function(d, i) {
					return firstBarY + i * verticalBarDistance;
				})
				.attr("width", function(d) {
					return barWidth;
				})
				.attr("height", function(d) {
					return barHeight;
				})
				.attr('stroke-width', 1)
				.attr('stroke', 'rgb(0,0,0)');
			
			//Draw the text.
			dataEnter.append("text")
				.text(function(d) {
					return d;
				})
				.attr('class', 'legendText')
				.attr('x', textXPosition)
				.attr('y', function(d, i) {
					return firstBarY + i * verticalBarDistance + textYOffset;
				});

}