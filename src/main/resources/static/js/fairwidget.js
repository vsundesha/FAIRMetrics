// import {d3} from "https://d3js.org/d3.v5.min.js";
import * as d3 from "d3";




function createFairLogo(id, data){

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    
}

function loadChart (elems){
       
    // console.log(elems);
    if(elems===undefined) {
        elems = document.getElementsByClassName("fairmetrics");
    }

    let i = 0;
    for(let y of elems){
        try{
            i++;
            const dataId = y.getAttribute('id');
            const dataFAIR = JSON.parse(y.getAttribute('data-fair-metrics'));
            createFairLogo(dataId,dataFAIR);
        }catch(err){
            console.log('Internat error :' +err)
        }
    }
}

loadChart();