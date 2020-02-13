package com.quadcore.data.Config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

@Component
public class SessionConnectedListener implements ApplicationListener<SessionConnectEvent> {

    private static final Logger log = LoggerFactory.getLogger(SessionConnectedListener.class);

    @Autowired
    private SimpMessagingTemplate template;

    @Override
    public void onApplicationEvent(SessionConnectEvent event) {
        SimpMessageHeaderAccessor s = SimpMessageHeaderAccessor.wrap(event.getMessage());
        log.info("s :" + s);
        log.info("log " + event.toString());
        log.info("attrivutes: " + s.getSessionAttributes());
        log.info("type: " + s.getMessageType());

        // Not sure if it's sending...?
        template.convertAndSend("/topic/message", "New user logged in");
    }
}