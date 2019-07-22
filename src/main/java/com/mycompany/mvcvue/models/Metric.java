/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.mvcvue.models;

import java.util.List;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 *
 * @author Vicky Sundesha <vicky.sundesha@bsc.es>
 */
@Document (collection="metrics")
public class Metric {
    @Field("_id")
    public String mongoid;
    @Field("id")
    public String id;
    public Object F;
    public Object A;
    public Object I;
    public Object R;
    public List<Float> scores;
}
