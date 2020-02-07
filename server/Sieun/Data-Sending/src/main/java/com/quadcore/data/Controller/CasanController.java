package com.quadcore.data.Controller;

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

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;


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


    @GetMapping(path = "/test")
    public @ResponseBody List<Casan> test() {
        List<Casan> products = new ArrayList<>();
        casanRepository.findAll().forEach(products::add); //fun with Java 8
        return products;
    }

    @PostMapping(path="/add")
    public void savee(@RequestBody Map<String, Object> m) {

        Casan casan = new Casan();
        casan.setDesc((String)m.get("desc"));
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
*/




    @Scheduled(fixedRate = 5000)
    public void greeting() {
        //Random rand = new Random();
        //System.out.println("rand: " + rand);
        List<Casan> c= casanRepository.findCasansBy(LocalDate.now(), LocalTime.now().minusSeconds(5));
        System.out.println(c);
        //redisTemplate.opsForValue().get("2020-")

        messagingTemplate.convertAndSend("/topic/message", c);
    }

    @SubscribeMapping("/pub/topic/message")
    public void whenSubscribe() {
        System.out.println("NEW SUBSCRIBER");
    }
}
