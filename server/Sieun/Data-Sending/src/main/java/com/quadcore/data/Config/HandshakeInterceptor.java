package com.quadcore.data.Config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;


public final class HandshakeInterceptor implements org.springframework.web.socket.server.HandshakeInterceptor {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) throws Exception {
        HttpServletRequest req = ((ServletServerHttpRequest)request).getServletRequest();
        String username = req.getParameter("username");
        String userToken = req.getParameter("token");

        //System.out.println(stringRedisTemplate.opsForValue().get("hi"));
        //System.out.println("tok : " + (String)stringRedisTemplate.opsForValue().get("st-" + username));
        try {
            String tokenInRedis = (String) stringRedisTemplate.opsForValue().get("st-" + username);
            if (tokenInRedis.equals(userToken)) {
                return true;
            } else return false;
        } catch (NullPointerException e) {
            return false;
        }

    }
    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
    }
}
