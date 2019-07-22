/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.mvcvue.service;


import com.mycompany.mvcvue.models.Metric;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Vicky Sundesha <vicky.sundesha@bsc.es>
 */
@Repository
public interface MetricsRepository extends MetricsRepositoryCustom, MongoRepository<Metric, String>{
    
}
