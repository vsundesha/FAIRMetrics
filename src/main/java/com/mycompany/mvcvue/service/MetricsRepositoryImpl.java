/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.mvcvue.service;


import com.mycompany.mvcvue.models.Metric;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 *
 * @author vsundesh
 */

public class MetricsRepositoryImpl implements MetricsRepositoryCustom{

    @Autowired
    private MongoTemplate mt; 
    
    public List<Metric> getMetrics(){
        List <Metric> metrics = new ArrayList<>();

        
        metrics = mt.findAll(Metric.class);
        
        return metrics;
    }
    
    
}
