package com.quadcore.data.Controller;

import com.quadcore.data.Domain.Casan;
import com.quadcore.data.Repository.CasanRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.core.ApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.messaging.simp.broker.DefaultSubscriptionRegistry;
import org.springframework.messaging.simp.broker.SimpleBrokerMessageHandler;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;


@EnableScheduling
@RequiredArgsConstructor
@CrossOrigin
@Controller
public class CasanController {
    private final SimpMessageSendingOperations messagingTemplate;

    //SimpleBrokerMessageHandler messageHandler;

    @Autowired
    SimpUserRegistry userRegistry;

    @Autowired
    private CasanRepository casanRepository;

    @GetMapping(path = "/test")
    public @ResponseBody List<Casan> test() {
        List<Casan> products = new ArrayList<>();
        casanRepository.findAll().forEach(products::add); //fun with Java 8
        return products;
    }

    @PostMapping(path="/add")
    public void savee() {
        Casan casan = new Casan();
        casan.setImageUrl("Sdgsdf");
        UUID u = UUID.randomUUID();
        casan.setId(u);
        casan.setDescription("hi this is test.");
        casan.setPrice(2342);
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

    @Scheduled(fixedRate = 1000)
    public void greeting() {
        Random rand = new Random();
        System.out.println("rand: " + rand);

        messagingTemplate.convertAndSend("/topic/message", "rnad~"+rand);
    }

    @SubscribeMapping("/pub/topic/message")
    public void whenSubscribe() {
        System.out.println("NEW SUBSCRIBER");
    }
}
