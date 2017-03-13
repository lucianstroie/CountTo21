var math = require('mathjs');

var Chart = require('chart.js');

//chartCreator

class ChartCreator {
  constructor(probArrArray){
    this.probArrArray = probArrArray;

    this.datasetArr = this.probArrArray.map((prob, idx) => {
      return {
        label: 'Round ' + idx,
        data: prob,
        backgroundColor:
            'rgba(54, 162, 235, 0.2)'
            ,
        borderColor:

            'rgba(54, 162, 235, 1)'
            ,
        borderWidth: 1
    };
  });


    this.ctx = document.getElementById("myChart");
    this.chart = new Chart(this.ctx, {
        type: 'bar',
        data: {
            labels: [...Array(22).keys()].slice(4).map(x => x.toString()),
            datasets: this.datasetArr
        },
        options: {
                    elements: {
                        rectangle: {
                            borderWidth: 1,
                        }
                    },
                    responsive: true,
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Probability Density Function'
                    }
                }
    });
  }
}

module.exports = ChartCreator;
