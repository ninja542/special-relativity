var margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = 960 - margin.left - margin.right,
    height = 640 - margin.top - margin.bottom;

var svg = d3.select('#graph').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');