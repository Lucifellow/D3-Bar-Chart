
//get api
const req = new XMLHttpRequest();
req.open("GET","https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",true)
req.send();
req.onload=function(){  //after getting api
   const json= JSON.parse(req.responseText);
   const dataSet = json.data;   //gets data as 2D array of string and number
   const w = 850;   //width of svg
   const h = 600;   //height of svg
   const padding = 40;  

   //x-axis scale
   const xScale = d3.scaleLinear()
                .domain([d3.min(dataSet,(d)=>getFirstFourNum(d[0]))
                ,d3.max(dataSet,(d)=>getFirstFourNum(d[0]))]) // min to max
                .range([padding,w-padding])

    //y-axis scale
   const yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataSet, (d)=>d[1])])
                    .range([h-padding,padding]);
    
    //adds svg to a container div
   const svg = d3.select(".container-fluid")
                    .append("svg")
                    .attr("width",w)
                    .attr("height",h)

    //bottom x-axis
    const xAxis= d3.axisBottom(xScale)
                .tickFormat(d3.format("d"));    //removes "," from a number such as 1,000 to 1000

    
    //left y-axis
    const yAxis = d3.axisLeft(yScale);

    //a div to display tooltip
    const tooltip= d3.select(".container-fluid")
                    .append("div")
                    .attr("id","tooltip");

    //adds y-axis to svg
    svg.append("g")
    .attr("id","y-axis")
    .attr("transform","translate("+(padding)+",0)")     
    .call(yAxis);

    //adds label to y-axis svg
    svg.append("text")
        .attr("class","color-green")
        .attr("transform","rotate(-90)")
        .attr("x",0-(150))
        .attr("y",padding+(padding/2))
        .text("GDP (billions)")
       
    //adds x-axis to svg
    svg.append("g")
    .attr("id","x-axis")
    .attr("transform","translate(0,"+(h-padding)+")")
    .call(xAxis)


    //adds label to x-axis svg
    svg.append("text")
    .attr("class","color-blue")
    .attr("transform","translate("+(w/2)+","+(h)+")")
    .text("Time")

    //adds bars to svg based of data in dataSet
    svg.selectAll("rect")
    .data(dataSet)
    .enter()
    .append("rect")
    .attr("x",(d,i)=>xScale(getFirstFourNum(d[0]))) //x-co-ordinate based on xScale
    .attr("y",(d,i)=>yScale(d[1]))  //y co-ordinate based on yScale
    .attr("width",6)                //width of bar
    .attr("height",(d,i)=>h-padding-yScale(d[1]))   //height based on dataSet and inverting the whole rect
    .attr("class","bar")
    .attr("data-date",(d,i)=>d[0])
    .attr("data-gdp",(d,i)=>d[1]) 
    .style("fill",(d,i)=>{
        return getColor(d[1]);      //adds color based on GDP value
    })
    .on("mouseover",(d,i)=>{            //adds tooltip and highlights current rect on mouse hover
        d3.select(event.currentTarget)  
        .style("fill","blue")

        tooltip.style("left",xScale(getFirstFourNum(d[0]))-350+"px") //positioning left 
        .style("top",yScale(d[1])-40 +"px") //positioning height
        .style("display","inline-block")    
        .style("background-color","black")
        .style("color","white")
        .html("Date: " +d[0]+"<br> GDP: $ "+d[1]+" billion")
        .attr("data-date",d[0])
        .attr("data-gdp",d[1]) 
    })
    .on("mouseout",(d,i)=>{         //removes highlight,tooltip and adds back original color 
        d3.select(event.currentTarget)
        .style("fill",(d,i)=>{
           return getColor(d[1]);   //sets original color back
        })
        tooltip.style("display","none")
    })
}
//gets year from complete date
function getFirstFourNum(aString){
    return(parseInt(aString.slice(0,5)));
}

//gets color based on GDP value
function getColor(d){
    if(d<2000){
        return "red";
    } else if(d<8000){
        return "orange";
    } else if(d<12000){
        return "rgb(228, 225, 41)";
    }else{
        return "green";
    } 
}