var margin = {top: 40, right: 20, bottom: 60, left: 80};
var marginPlot = {top: 40, right: 80, bottom: 60, left: 60};

var width = 500
var height = 400

var width1 = width - margin.left - margin.right;
var height1 = height - margin.top - margin.bottom;

var radius = (Math.min(width, height)/2 - 30);

var widthPlot = 600;
var heightPlot = 600;

var widthPlot1 = widthPlot - marginPlot.left - marginPlot.right;
var heightPlot1 = heightPlot - marginPlot.top - marginPlot.bottom;

var curValue = "";

var touchstate = 0;

var chart1 = d3.select("#chart1")
    .append("svg")
    .style("background", "white")
    .attr("width",width)
    .attr("height",height)
    .append("g")
    .attr("transform", "translate(" + margin.left + " , " + margin.top + " )");

var chart2 = d3.select("#chart2")
    .append("svg")
    .style("background", "white")
    .attr("width",width - margin.left)
    .attr("height",height)
    .append("g")
    .attr("transform", "translate(" + 0 + " , " + margin.top + " )");

var chart3 = d3.select("#chart3")
    .append("svg")
    .style("background", "white")
    .attr("width",widthPlot)
    .attr("height",heightPlot)
    .append("g")
    .attr("transform", "translate(" + marginPlot.left + " , " + marginPlot.top + " )");

var chart4 = d3.select("#chart4")
    .append("svg")
    .style("background", "white")
    .attr("width", 100)
    .attr("height",100)

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

    //data manipulation

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
            if (d.value > 10)
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

    //data manipulation end

    //Bar chart

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
            chart1.selectAll(".bar").style("fill", "steelblue")
            d3.select(this).style("fill", "yellow");
            yearText.text("# Movies: "+ d.value)
        })
        .on("touchmove", function(d) {
            chart1.selectAll(".bar").style("fill", "steelblue")
            d3.select(this).style("fill", "yellow");
            yearText.text("# Movies: "+ d.value)
        })
        .on("touchend", function(d) {
            chart1.selectAll(".bar").style("fill", "steelblue")
            yearText.text("# Movies: ")
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

    //End Barchart

    //Piechart

    var pie = d3.pie()
        .value(d => d.value)

    var data_ready = pie(moviesByCountryfilter)

    var pie_arc = d3.arc().innerRadius(0).outerRadius(radius - 40)

    var colorScale = d3.schemeSet3;

    var widthPie = width / 2 - margin.left/2

    var heightPie = height / 2 - margin.top/2

    var countryText = chart2.append("text")
        .attr("x", width1 - 140)
        .attr("y",  30)
        .style("font-size", "12px")
        .text("Country: # Movies");

    chart2.selectAll(".arc")
        .data(data_ready)
        .enter().append("g")
        .attr("transform", "translate(" + widthPie + "," + heightPie + ")")
        .attr("class", "arc")
        .append("path")
        .attr('d', pie_arc)
        .style("fill", d => colorScale[d.index])
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "yellow");
            countryText.text( d.data.key + " : " + d.data.value );
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", d => colorScale[d.index]);
            countryText.text("Country: # Movies");
        })
        .on("touchstart", function(d) {
            chart2.selectAll(".arc").style("fill", d => colorScale[d.index]);
            d3.select(this).style("fill", "yellow");
            countryText.text( d.data.key + " : " + d.data.value );
        })
        .on("touchmove", function(d) {
            chart2.selectAll(".arc").style("fill", d => colorScale[d.index]);
            d3.select(this).style("fill", "yellow");
            countryText.text( d.data.key + " : " + d.data.value );
        })
        .on("touchend", function(d) {
            d3.select(this).style("fill", d => colorScale[d.index]);
            countryText.text("Country: # Movies");
        })


    chart2.append("text")
        .attr("x", width1/2 - 100)
        .attr("y", -10)
        .style("font-size", "15px")
        .text("Number of Movies by Country");

    //End Piechart

    //Scatter Plot

    var votedExtent = d3.extent(csv, function(row) { return row.num_critic_for_reviews ; });
    var userExtent = d3.extent(csv,  function(row) { return row.num_user_for_reviews;   });
    var scoreExtent = d3.extent(csv, function(row) { return row.imdb_score; });

    var xScalePlot = d3.scaleLinear()
        .domain(userExtent)
        .rangeRound([0, widthPlot1]);

    var yScalePlot = d3.scaleLinear()
        .domain(scoreExtent)
        .rangeRound([heightPlot1, 0]);

    var TitleText = chart3.append("text")
        .attr("x", widthPlot1 - 140)
        .attr("y",  20)
        .style("font-size", "12px")
        .text("Movie Title: ");

    var UserText = chart3.append("text")
        .attr("x", widthPlot1 - 140)
        .attr("y",  40)
        .style("font-size", "12px")
        .text("# User Reviews: ");

    var UScoreText = chart3.append("text")
        .attr("x", widthPlot1 - 140)
        .attr("y",  60)
        .style("font-size", "12px")
        .text("IMDb Score: ");

    var scatterPlot = chart3.selectAll(".circle")
        .data(csv)
        .enter().append("g")
        .append("circle")
        .attr("id",function(d,i) {return i;} )
        //.attr("stroke", "steelblue")
        .style("fill", "steelblue")
        //.attr("class", "selected")
        .attr("cx", function(d) { return xScalePlot(d.num_user_for_reviews ); })
        .attr("cy", function(d) { return yScalePlot(d.imdb_score); })
        .attr("r", 3)
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "yellow");
            //d3.select(this).attr("stroke", "yellow");
            TitleText.text("Movie Title: " + d.movie_title)
            UserText.text("# User Reviews: " + d.num_user_for_reviews)
            UScoreText.text("IMDb Score: " + d.imdb_score)
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", "steelblue");
            //d3.select(this).attr("stroke", "steelblue");
            TitleText.text("Movie Title: " )
            UserText.text("# User Reviews: ")
            UScoreText.text("IMDb Score: " )
        })
        .on("touchstart", function(d) {
            event.preventDefault();
            d3.selectAll(".arc").style("fill", "steelblue");
            d3.select(this).style("fill", "yellow");
            //d3.select(this).attr("stroke", "yellow");
            TitleText.text("Movie Title: " + d.movie_title)
            UserText.text("# User Reviews: " + d.num_user_for_reviews)
            UScoreText.text("IMDb Score: " + d.imdb_score)
        })
        .on("touchmove", function(d) {
            event.preventDefault();
            d3.selectAll(".arc").style("fill", "steelblue");
            d3.select(this).style("fill", "yellow");
            //d3.select(this).attr("stroke", "yellow");
            TitleText.text("Movie Title: " + d.movie_title)
            UserText.text("# User Reviews: " + d.num_user_for_reviews)
            UScoreText.text("IMDb Score: " + d.imdb_score)
        })
        .on("touchend", function(d) {
            event.preventDefault();
            d3.select(this).style("fill", "steelblue");
            //d3.select(this).attr("stroke", "steelblue");
            TitleText.text("Movie Title: " )
            UserText.text("# User Reviews: ")
            UScoreText.text("IMDb Score: " )
        })

    d3.selectAll(".circle").classed("selected", true)

    console.log(d3.selectAll(".selected"))

    chart3.append("text")
        .attr("x", widthPlot1/2 - 100)
        .attr("y", -10)
        .style("font-size", "15px")
        .text("User Reviews vs IMDb Score");

     chart3.append("g")
        .attr("class", "axis")
        .attr("transform", "translate( 0," + heightPlot1 + ")")
        .call(d3.axisBottom(xScalePlot));

    chart3.append("g")
        .attr("class", "axis")
        .attr("transform", "translate( 0, 0)")
        .call(d3.axisLeft(yScalePlot));;

    chart3.append("text")
        .attr("x", widthPlot1/2 -80)
        .attr("y", heightPlot1 + 30)
        .style("font-size", "12px")
        .text("Number of User Reviews");

    chart3.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -heightPlot1/2 - 30)
        .attr("y", -20)
        .style("font-size", "12px")
        .text("IMDb Score");

    //End Scatter Plot

    //Brush 
    var enablebrush = false;

    var brush = d3.brush()
        .extent([[0, 0],[widthPlot1, heightPlot1]]);


    //brush.x(xScale).y(yScale);

    var brushContainer1 = chart3.append("g")
        .attr("class", "brush")
        .call(brush);

    d3.selectAll(".brush").remove()

    // Register brush events
    brush
        .on("start", brushstart)   
        .on("brush", brushing)          
        .on("end", brushend); 

    function brushstart(event) {
        event.preventDefault();
    }     

    function brushing(event) {

        event.preventDefault();
        // simultaneous update during brushing
         var e = brush.extent().call();

         let selectionCordinates = d3.event.selection;

         let x1 = xScalePlot.invert(selectionCordinates[0][0]) 
         let x2 = xScalePlot.invert(selectionCordinates[1][0]) 
         let y1 = yScalePlot.invert(selectionCordinates[0][1]) 
         let y2 = yScalePlot.invert(selectionCordinates[1][1]) 

         chart3.selectAll('circle').classed("selected", function(d) {

            return x1 <= d.num_critic_for_reviews  && d.num_critic_for_reviews  <= x2 &&
                y1 <= d.imdb_score && d.imdb_score <= y2;

        });


        // change the class of node to brushed if the node is inside the brushed extent
        /*chart3.selectAll('circle').classed("selected", function(d) {

            return e[0][0] <= d.num_critic_for_reviews  && d.num_critic_for_reviews  <= e[1][0] &&
                e[0][1] <= d.imdb_score && d.imdb_score <= e[1][1];

        });

        brushed_idx = chart3.selectAll("circle.selected").data().map(a => a.ID);*/

    }

    function brushend(event) {

        event.preventDefault();
        // update after brusing is finished
    }

    //End Brush

    //Touch state

    chart4.append("g")
        .append("rect")
        .style("fill", "white")
        .attr("height", height)
        .attr("width", width)
        .on("click", function(d){
            if (enablebrush) {
                enablebrush = false;
                d3.selectAll(".brush").remove()
                d3.select(this).style("fill", "white")
            } else {
                var brushContainer = chart3.append("g")
                    .attr("class", "brush")
                    .call(brush);
                enablebrush = true;
                d3.select(this).style("fill", "blue")
            }

        })
        .on("touchstart", function(d) {
            touchstate = 1;
        })
        .on("touchend", function(d) {
            touchstate = 0;
        })

    //End Touch state
    
})