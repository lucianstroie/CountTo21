var math = require('mathjs');

var Chart = require('chart.js');

//chartCreator

class ChartCreator {
  constructor(probArr){
    this.probArr = probArr;
    this.ctx = document.getElementById("myChart");
    this.chart = new Chart(this.ctx, {
        type: 'bar',
        data: {
            labels: [...Array(22).keys()].slice(4).map(x => x.toString()),
            datasets: [{
                label: 'Probability Density Function',
                data: this.probArr,
                backgroundColor:
                    'rgba(54, 162, 235, 0.2)'
                    ,
                borderColor:

                    'rgba(54, 162, 235, 1)'
                    ,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
  }
}

module.exports = ChartCreator;
