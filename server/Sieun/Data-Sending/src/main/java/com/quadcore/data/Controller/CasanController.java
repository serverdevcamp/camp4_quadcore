package com.quadcore.data.Controller;

import com.google.gson.Gson;
import com.quadcore.data.Domain.Casan;
import com.quadcore.data.Repository.CasanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.TimeUnit;


@EnableScheduling
@RequiredArgsConstructor
@CrossOrigin
@RestController
public class CasanController {
    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private CasanRepository casanRepository;

    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Autowired
    RedisTemplate<String, Object> redisTemplate;

    @GetMapping(path = "/data/test")
    public @ResponseBody List<Casan> test() {
        List<Casan> products = new ArrayList<>();
        casanRepository.findAll().forEach(products::add); //fun with Java 8
        return products;
    }

    @PostMapping(path="/data/add")
    public void savee(@RequestBody Map<String, Object> m) {
        System.out.println(redisTemplate);
        Casan casan = new Casan();
        Gson gson = new Gson();
        String t1 = gson.toJson(m.get("test1"), LinkedHashMap.class);
        casan.setTest1(t1);
        casan.setTest2((String)m.get("test2"));
        casan.setTest3((String)m.get("test3"));
        casanRepository.save(casan);
    }

/*
    @MessageMapping("/chat/message")
    public void chat(String str) {
        messagingTemplate.convertAndSend("/sub/chat/", str+" 아이고야");
    }
*/

/*
    @GetMapping(path="/search/{keyword}")
    public Map<String, Object>


    @GetMapping(path="/data/get20")
    public List<Casan> li() {

    }
*/


    public String getSHA256Token(String toHash){
        String generatedToken = null;
        String salt = String.valueOf(new Random().nextLong());
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt.getBytes(StandardCharsets.UTF_8));
            byte[] bytes = md.digest(toHash.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for(int i=0; i< bytes.length ;i++){
                sb.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));
            }
            generatedToken = sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return generatedToken;
    }

    @GetMapping(path="/data/token/{username}")
    public Map<String, Object> getSocketToken(@PathVariable("username") String username) {
        String token = getSHA256Token(username);
        System.out.println(token);
        Map<String,Object> map = new HashMap<>();
        map.put("errorCode", 10);
        stringRedisTemplate.opsForValue().set("st-"+username, token);
        stringRedisTemplate.expire("st-"+username, 30*1000, TimeUnit.MILLISECONDS); // for 30 sec

        map.put("socketToken", token);
        return map;
    }

    @Scheduled(fixedRate = 2000)
    public void greeting() {
        List<Casan> c= casanRepository.findCasansBy(LocalDate.now(), LocalTime.now().minusSeconds(2));
        if (!c.isEmpty()) {
            messagingTemplate.convertAndSend("/topic/message", c);
        }
    }

    @SubscribeMapping("/pub/topic/message")
    public void whenSubscribe() {
        System.out.println("NEW SUBSCRIBER");
    }

}
