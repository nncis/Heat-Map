const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

let data
let values = []
let baseTemperature

let minYear
let maxYear

let xScale
let yScale

let xScaleLegend
let yScaleLegend

let xAxis
let yAxis

let width = 1200
let height = 600
let padding = 90

let colors = ["rgb(69, 117, 180)", "rgb(116, 173, 209)", "rgb(171, 217, 233)", "rgb(224, 243, 248)", "rgb(255, 255, 191)", "rgb(254, 224, 144)", "rgb(253, 174, 97)", "rgb(244, 109, 67)", "rgb(215, 48, 39)", "rgb(165, 0, 38)"]

let svg = d3.select("svg")

const drawCanvas = () => {
    svg.attr("width", width)
    svg.attr("height", height)
    svg.style("background-color", "grey")
}

const generateScales = () => {

    minYear = d3.min(values, d => d.year)
    maxYear = d3.max(values, d => d.year)

    xScale = d3.scaleLinear()
        .domain([d3.min(values, d => d.year), d3.max(values, d => d.year)])
        .range([padding, width - padding])

    yScale = d3.scaleTime()
        .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
        .range([padding, height - padding])

    xScaleLegend = d3.scaleLinear()
        .domain([d3.min(values, d => (baseTemperature + d.variance)), d3.max(values, d => baseTemperature + d.variance)])
        .range([0, 300])    
}

const drawBars = () => {

    svg.selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr('fill', d => {
            let temp = baseTemperature + d.variance

            if (d.variance <= -1) {
                return colors[0]
            } else if (d.variance <= 0) {
                return colors[2]
            } else if (d.variance < 1) {
                return colors[7]
            } else {
                return colors[8]
            }
        })
        .attr("data-month", d => d.month - 1)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => d.variance + baseTemperature)
        .attr("width", () => {
            let numberOfYears = maxYear - minYear
            return (width - (2 * padding)) / numberOfYears
        })
        .attr("height", (height - (2*padding)) / 12)
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
}

const generateAxes = () => {
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"))
    let yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%B'))

    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0, " + (height - padding) + ")")

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ", 0)")

    let xAxisLegend =  d3.axisBottom(xScaleLegend)
        
    let yAxisLegend = d3.axisLeft(yScaleLegend)

        svg.append("g")
            .call(xAxisLegend)
            .attr("transform", "translate(" + (3 * padding) + "," +  (height - (padding/2.5)) + ")")
}

const legend = () => {

    svg.append("g")
        .attr("id", "legend")
        .attr("transform", "translate(" + (3 * padding) + "," +  (height - (padding/2.5)) + ")")
        .selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", (d,i) => xScaleLegend(i+2))
        .attr("fill", d => d)
       
}

fetch(url)
    .then(response => response.json())
    .then(data => {
        values = data.monthlyVariance
        baseTemperature = data.baseTemperature
        drawCanvas()
        generateScales()
        drawBars()
        legend()
        generateAxes()
        
    })