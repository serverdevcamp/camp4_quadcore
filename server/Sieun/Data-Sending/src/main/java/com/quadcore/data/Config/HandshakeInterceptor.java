package com.quadcore.data.Config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketHandler;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;


public final class HandshakeInterceptor implements org.springframework.web.socket.server.HandshakeInterceptor {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) throws Exception {

        // 위의 파라미터 중, attributes 에 값을 저장하면 웹소켓 핸들러 클래스의 WebSocketSession에 전달된다
        System.out.println("Before Handshake");

        ServletServerHttpRequest ssreq = (ServletServerHttpRequest) request;
        System.out.println("URI:" + request.getURI());
        System.out.println("before: " + stringRedisTemplate);


        HttpServletRequest req = ssreq.getServletRequest();
        String username = req.getParameter("username");
        String token = req.getParameter("token");
        System.out.println("token param : " + token);

        System.out.println(stringRedisTemplate.opsForValue().get("hi"));
        System.out.println("tok : " + (String)stringRedisTemplate.opsForValue().get("st-" + username));

        try {
            String tok = (String) stringRedisTemplate.opsForValue().get("st-" + username);
            System.out.println("token: " + token + ", tok: " + tok);
            return true;
        } catch (NullPointerException e) {
            return false;
        }

    }
    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        System.out.println("after: " + stringRedisTemplate);
    }
}
