function compare(a, b) {
    if (a.value < b.value) {
        return -1;
    }
    if (a.value > b.value) {
        return 1;
    }
    return 0;
}

function copyAndRemoveOutliers(sprints, outliers) {
    var sprintsCopy = [...sprints];
    sprintsCopy.sort(compare);

    for (let i = 0; i < outliers; i++) {
        if (sprintsCopy.length > 2) {
            sprintsCopy.splice(0, 1);
            sprintsCopy.pop();
        }
    }

    return sprintsCopy;
}

function reduceToHours(a, b) {
    return a.hours + b.hours;
}

function drawGraph(data) {
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data,
            datasets: [{
                data: data,
                lineTension: 0,
                backgroundColor: 'transparent',
                borderColor: '#007bff',
                borderWidth: 4,
                pointBackgroundColor: '#007bff'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            },
            legend: {
                display: false,
            }
        }
    });
}

var app = new Vue({
    el: '#app',
    data: {
        planning: {
            persons: [
                {
                    name: "Dev",
                    hours: 40,
                    off: 8
                },
                {
                    name: "Dev",
                    hours: 40,
                    off: 8
                },
                {
                    name: "Dev",
                    hours: 40,
                    off: 8
                }
            ],
            newPoint: 0,
            sprints: [],
            outliers: 1,
            sprintWeeks: 2,
            url: '#',
            filename: ''
        }
    },
    mounted: function(){
        $('.collapse').collapse();  
    },
    methods: {
        addPerson: function () {
            this.planning.persons.push({ name: "", hours: 40, off: 0 });
        },
        removePerson: function (index) {
            this.planning.persons.splice(index, 1);
        },
        getTotalHours: function () {
            var total = 0;

            for (const person of this.planning.persons) {
                total += (person.hours * this.planning.sprintWeeks - person.off);
            }

            return total;
        },
        getTotalOffHours: function () {
            var total = 0;
            for (const person of this.planning.persons) {
                total = total + person.off;
            }
            return total;
        },
        addSprint: function () {
            if (typeof this.planning.newPoint == "string") {
                for (const point of this.planning.newPoint.split(",")) {
                    this.planning.sprints.push({ value: +(point.trim()), hours: (this.planning.persons.length * 40 * 2) });
                }
            } else if (typeof this.planning.newPoint == "number") {
                this.planning.sprints.push({ value: this.planning.newPoint, hours: (this.planning.persons.length * 40 * 2) });
            }
            this.planning.newPoint = 0;
            drawGraph(this.pointsInt());
        },
        getHoursPerPoint: function (index) {
            return this.planning.sprints[index].hours / this.planning.sprints[index].value;
        },
        getPointPerHours: function (index) {
            return this.planning.sprints[index].value / this.planning.sprints[index].hours;
        },
        pointsInt: function () {
            var pointsIntArr = [];
            for (const sprint of this.planning.sprints) {
                pointsIntArr.push(sprint.value);
            }

            return pointsIntArr;
        },
        removePoint: function (index) {
            this.planning.sprints.splice(index, 1);
            drawGraph(this.pointsInt());
        },
        getPointPerHourAverage: function () {
            var sprintsCopy = copyAndRemoveOutliers(this.planning.sprints, this.planning.outliers);

            var sumSpeedPerHour = 0;

            for (let i = 0; i < sprintsCopy.length; i++) {
                sumSpeedPerHour += sprintsCopy[i].value / sprintsCopy[i].hours;
            }

            if (sprintsCopy.length == 0) {
                return 0;
            }
            return sumSpeedPerHour / sprintsCopy.length;
        },
        getHourPerPointAverage: function () {
            var sprintsCopy = copyAndRemoveOutliers(this.planning.sprints, this.planning.outliers);

            var sumSpeedPerHour = 0;

            for (let i = 0; i < sprintsCopy.length; i++) {
                sumSpeedPerHour += sprintsCopy[i].hours / sprintsCopy[i].value;
            }

            if (sprintsCopy.length == 0) {
                return 0;
            }
            return sumSpeedPerHour / sprintsCopy.length;
        },
        getEstimatedCapacity: function () {
            return this.getPointPerHourAverage() * this.getTotalHours();
        },
        load: function () {
            if (window.localStorage.getItem('planning')) {
                try {
                    this.planning = JSON.parse(window.localStorage.getItem('planning'));
                } catch (e) {
                    window.localStorage.removeItem('planning');
                }
            }
        },
        persist: function () {
            window.localStorage.setItem('planning', JSON.stringify(this.planning));
        }
    }
})