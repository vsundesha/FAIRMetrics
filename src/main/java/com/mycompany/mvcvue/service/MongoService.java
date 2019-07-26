/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.mvcvue.service;
import com.mycompany.mvcvue.models.Metric;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 *
 * @author Vicky Sundesha <vicky.sundesha@bsc.es>
 */
@Service
public class MongoService {
    
    @Autowired
    MetricsRepository mr;
    
    public Page<Metric> getMetrics(Pageable pageable){
        return mr.findAll(pageable);
    }
}
