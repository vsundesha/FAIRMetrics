// import {d3} from "https://d3js.org/d3.v5.min.js";
import * as c3 from "c3";
import * as d3 from "d3";
import './app.css';

function createFairMetricsChart(id, data) {
  data.unshift("value")
  var chart = c3.generate({
    bindto: "#" + id,
    data: {
      x: 'Letter',
      columns: [
        ['Letter','F','A','I','R'],
        data
      ],
      names: {
        fair: "Fair"
      },
      type: "bar",
      colors: {
        value: function(d) {
          if(d.value<0.3){
            return '#ff0000'
          } else if(d.value>=0.3 && d.value<0.7){
            return '#f6c600'
          } else if(d.value>=0.7){
            return '#60b044'
          }
        }
      },
      
    },
    axis: {
      x: {
        type: 'category'
      },
      y:{
        max: 0.9
      }
    },
    legend: {
      padding: 5,
            item: {
                tile: {
                    width: 15,
                    height: 2
                },
            },
            show: false,
            position: 'bottom',
    },
  });
  d3.select('#'+id).insert('div', '.chart').attr('class', 'oeb-legend')
  .insert('div','.chart').attr('class','legend-scale')
  .insert('ul','.chart').attr('class','legend-labels')
  
  .selectAll('span')

  .data(['&#119961; &#60; 0.3','0.3 &le; &#119961; &le; 0.7','&#119961; &#62; 0.7'])
  .enter().append('li').html(function (id) { return id; }).append('span')
  .attr('data-id', function (id) { return id; })
  
  .each(function (id) {
    switch (id) {
      case '&#119961; &#60; 0.3':
        d3.select(this).style('background-color', '#ff0000');
        break;
      case '0.3 &le; &#119961; &le; 0.7':
        d3.select(this).style('background-color', '#f6c600');
        break;
      case '&#119961; &#62; 0.7':
        d3.select(this).style('background-color', '#60b044');
        break;
      default:
        break;
    }
      
  })
}



// GaugeChart
function createFairGaugeChart(id, data) {
  const arrSum = arr => arr.reduce((a, b) => a + b, 0);
  let datasum = (arrSum(data) * 100) / data.length;

  var chart = c3.generate({
    bindto: "#" + id,

    data: {
      columns: [["Fair", datasum]],
      type: "gauge"
    },
    gauge: {},
    color: {
      pattern: ["#FF0000", "#F6C600", "#60B044"], // the three color levels for the percentage values.
      threshold: {
        values: [30, 60, 100]
      }
    }
  });
}

function createChart(id, data) {
  if (id.includes("fairmetrics")) {
    createFairMetricsChart(id, data);
  } else if (id.includes("fairgauge")) {
    createFairGaugeChart(id, data);
  } else {
    createFairMetricsChart(id, data);
  }
}

function loadChart(elems) {
  // console.log(elems);
  if (elems === undefined) {
    elems = document.getElementsByClassName("fairmetrics");
  }

  let i = 0;
  for (let y of elems) {
    try {
      i++;
      const dataId = y.getAttribute("id");
      const dataFAIR = JSON.parse(y.getAttribute("data-fair-metrics"));
      createChart(dataId, dataFAIR);
    } catch (err) {
      console.log("Internat error :" + err);
    }
  }
}

loadChart();
