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
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.TimeUnit;

@CrossOrigin
@EnableScheduling
@RequiredArgsConstructor
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
        Casan casan = new Casan();
        Gson gson = new Gson();
        String t1 = gson.toJson(m.get("test1"), LinkedHashMap.class);
        casan.setHashtags((ArrayList)m.get("hashtags"));
        casanRepository.save(casan);
    }




    @GetMapping(path="/data/search/{keyword}")
    public Map<String, Object> gotKeyword(@PathVariable("keyword") String keyword) {
        stringRedisTemplate.opsForSet().add("search-keywords", keyword);
        List<Casan> c = get20(keyword);
        Map<String, Object> map = new HashMap<>();
        map.put("data", c);
        map.put("errorCode", 10);
        return map;
    }





    public List<Casan> get20(String keyword) {

        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        //System.out.println("timestamp: " + timestamp.getTime());
        List<Casan> c= casanRepository.findCasansByTimestamp(LocalDate.now().toString(),timestamp.getTime()*1000, keyword);
        return c;
    }



    @GetMapping(path="/data/get20/{keyword}")
    public List<Casan> li(@PathVariable("keyword") String keyword) {
        return get20(keyword);
    }




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
        Map<String,Object> map = new HashMap<>();
        map.put("errorCode", 10);
        stringRedisTemplate.opsForValue().set("st-"+username, token);
        stringRedisTemplate.expire("st-"+username, 30*1000, TimeUnit.MILLISECONDS); // for 30 sec

        map.put("socketToken", token);
        return map;
    }


    @Scheduled(fixedRate = 2000)
    public void greeting() {
        Set hm = stringRedisTemplate.opsForSet().members("search-keywords");
        Timestamp timestamp = new Timestamp(System.currentTimeMillis() - (2 * 1000));
        /*
        List<Casan> c= casanRepository.findCasansByDate(LocalDate.now().toString(),(Long)(timestamp.getTime()));
        messagingTemplate.convertAndSend("/topic/test", c);
         */
        //System.out.println("timestamp: " + timestamp.getTime()*1000);

        for (Object s: hm) {
            List<Casan> c= casanRepository.findCasansByDate(LocalDate.now().toString(),timestamp.getTime()*1000, (String)s);

            //List<Casan> c= casanRepository.findCasansByEntities(LocalDate.now(), LocalTime.now().minusSeconds(2), (String)s);
            if (!c.isEmpty()) {
                System.out.println(c);
               // System.out.println("not empty key: " + s + "result: \n" + c);
                messagingTemplate.convertAndSend("/topic/" + s, c);

            }
        }



    }




    @SubscribeMapping("/pub/topic/message")
    public void whenSubscribe() {
        System.out.println("NEW SUBSCRIBER");
    }

}
