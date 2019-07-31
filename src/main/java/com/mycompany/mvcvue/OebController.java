/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.mvcvue;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * @author Vicky Sundesha <vicky.sundesha@bsc.es>
 */
@Controller
@RequestMapping(value = {"/","/html/**","/dashboard/**", "/tool/**", "/scientific/**", "/stats/**", "/about/**", "/docs/**"})
public class OebController {
    
    @RequestMapping("")
    public String openebench(){
        return "index";
    }
    
}
