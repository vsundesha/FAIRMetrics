package com.mycompany.mvcvue;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.mycompany.mvcvue.models.Metric;
import com.mycompany.mvcvue.service.MongoService;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Vicky Sundesha <vicky.sundesha@bsc.es>
 */
@Controller
@RequestMapping("/")
public class FairController {

    @Autowired
    MongoService ms;
    
    public static final int defaultPage = 0;
    public static final int defaultSize = 5;
    
    @RequestMapping
    public String greeting(
            @PageableDefault(page=defaultPage,size=defaultSize) Pageable pageable,            
            Model model){ 
        Page<Metric> metricPage = ms.getMetrics(pageable);
        if(metricPage.hasContent()){
            model.addAttribute("metricPage",metricPage);
        } else {
            Page<Metric> metricPageReset = ms.getMetrics(PageRequest.of(defaultPage, defaultSize));
            model.addAttribute("metricPage",metricPageReset);
            model.addAttribute("paginationError", "Pager out of bound");
        }
        return "fair";
    }
    
    
    @RequestMapping(params ={"name"})
    public String getMetricByName(
        @RequestParam(name = "name") String toolName,
        
        Model model ){
            Page<Metric> metricPage = ms.getMetricByName(toolName,PageRequest.of(defaultPage, defaultSize));
            if(metricPage.hasContent()){
                model.addAttribute("metricPage",metricPage);
            } else {
                Page<Metric> metricPageReset = ms.getMetrics(PageRequest.of(defaultPage, defaultSize));
                model.addAttribute("metricPage",metricPageReset);
                if(!toolName.isEmpty()) { model.addAttribute("metricTableErrors", "Tool Not Found"); };
            }
        return "fair";
    }
    
}
