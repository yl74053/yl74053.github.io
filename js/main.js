var margin = {top: 40, right: 20, bottom: 60, left: 100};

var width = 500
var height = 400

var width1 = width - margin.left - margin.right;
var height1 = height - margin.top - margin.bottom;

var radius = (Math.min(width, height)/2 - 30);

var widthPlot = 600;
var heightPlot = 600;

var curValue = "";

var chart1 = d3.select("#chart1")
    .append("svg")
    .attr("width",width)
    .attr("height",height)
    .append("g")
    .attr("transform", "translate(" + margin.left + " , " + margin.top + " )");

var chart2 = d3.select("#chart2")
    .append("svg")
    .attr("width",width)
    .attr("height",height)
    .append("g")
    .attr("transform", "translate(" + margin.left + " , " + margin.top + " )");

d3.dsv("," ,"./data/filtered_movies.csv" , function(d) {

    return{
        ID : d.ID,
        imdb_score : Number(d.imdb_score),
        num_critic_for_reviews : Number(d.num_critic_for_reviews),
        num_user_for_reviews : Number(d.num_user_for_reviews),
        budget : Number(d.budget),
        gross : Number(d.gross),
        director_name : d.director_name,
        duration : Number(d.duration),
        genres : d.genres,
        content_rating : d.content_rating,
        movie_title : d.movie_title,
        country : d.country,
        language : d.language,
        year : d.title_year 
    }

}).then(function(csv){

    var moviesByCountry = d3.nest()
        .key(function(d){
            return d.country;
        })
        .rollup(function(v){ return d3.sum(v, function(d){return 1;});})
        .entries(csv);

    var moviesByLanguage = d3.nest()
        .key(function(d){
            return d.language;
        })
        .rollup(function(v){ return d3.sum(v,function(d){return 1;});})
        .entries(csv);

    var moviesByYear = d3.nest()
        .key(function(d){
            if (d.year != "0")
                return d.year;
            else
                return "N/A";
        })
        .rollup(function(v){ return d3.sum(v, function(d){return 1;});})
        .entries(csv);

    var moviesByYear = moviesByYear.sort(
        function(x, y){
            return d3.ascending(x.key, y.key);
        })

    var countCountry = 0;
    var otherCountry = [];

    var moviesByCountryfilter = d3.nest()
        .key(function(d){
            if (d.value > 5)
                return d.key;
            else
                otherCountry[countCountry] = d.key;
                countCountry++;
                return "Other";
        })
        .rollup(function(v){ return d3.sum(v, function(d){return d.value;});})
        .entries(moviesByCountry);

    var moviesByCountryfilter = moviesByCountryfilter.sort(
        function(x, y){
            return d3.descending(x.value, y.value);
        })

    console.log(moviesByCountryfilter)

    var xScale = d3.scaleBand()
        .domain(moviesByYear.map(d => d.key))
        .rangeRound([0, width1])
        .padding(0.1);

    var yScale = d3.scaleLinear()
        .domain([0,d3.max(moviesByYear, d => d.value)])
        .rangeRound([height1, 0]);

    var yearText = chart1.append("text")
        .attr("x", width1 - 140)
        .attr("y",  20)
        .style("font-size", "12px")
        .text("# Movies:");

    var bar1 = chart1
        .selectAll(".bar")
        .data(moviesByYear)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.key))
        .attr('y', d => yScale(d.value))
        .attr('height', d => height1 - yScale(d.value))
        .attr('width', 30)
        .attr("transform", "translate(-15, 0)")
        .style('fill', "steelblue")
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "yellow");
            yearText.text("# Movies: "+ d.value)
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", "steelblue");
            yearText.text("# Movies: ")
        })
        .on("touchstart", function(d) {
            d3.selectAll(".bar").style("fill", "steelblue")
            d3.select(this).style("fill", "yellow");
            yearText.text("# Movies: "+ d.value)
        })


    chart1.append("text")
        .attr("x", width1/2 - 100)
        .attr("y", -10)
        .style("font-size", "15px")
        .text("Number of Movies by Year");

    chart1.append("g")
        .attr("class", "axis")
        .attr("transform", "translate( -20," + height1 + ")")
        .call(d3.axisBottom(xScale));

    chart1.append("text")
        .attr("x", width1/2 - 35)
        .attr("y", height1 + 30)
        .style("font-size", "12px")
        .text("Year");

    chart1.append("g")
        .attr("class", "axis")
        .attr("transform", "translate( -20, 0)")
        .call(d3.axisLeft(yScale));;

    chart1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height1/2 - 60)
        .attr("y", -55)
        .style("font-size", "12px")
        .text("Number of Movies");

    chart2.append("text")
        .attr("x", width1/2 - 100)
        .attr("y", -10)
        .style("font-size", "15px")
        .text("Number of Movies by Country");



    
})