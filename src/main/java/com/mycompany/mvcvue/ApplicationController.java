package com.mycompany.mvcvue;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.mycompany.mvcvue.models.Metric;
import com.mycompany.mvcvue.service.MongoService;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
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
public class ApplicationController {

    @Autowired
    MongoService ms;
    
    @GetMapping("/fair")
    public String greeting(@RequestParam(name="name", required=false, defaultValue="World") String name, Model model) throws JsonProcessingException, IOException {
        
        
        
        List<Metric> metrics = ms.getMetrics();
        model.addAttribute("name", name);
        model.addAttribute("metrics",metrics);
        return "fair";
    }
}
