package com.quadcore.gw2.controller;

import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@RestController
public class FirstController {

    @GetMapping(path="/test")
    public String hi() {
        return "hi";
    }

    @RequestMapping("/fallback")
    public Mono<Map<String, Object>> fallback() {
        Map<String, Object> map = new HashMap<>();
        map.put("errorCode", 65);
        return Mono.just(map);
    }

}
