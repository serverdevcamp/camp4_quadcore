package com.quadcore.data.Config;


import org.springframework.context.annotation.Bean;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.lang.Nullable;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;


public class HandshakeInterceptor extends HttpSessionHandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) throws Exception {

        // 위의 파라미터 중, attributes 에 값을 저장하면 웹소켓 핸들러 클래스의 WebSocketSession에 전달된다
        System.out.println("Before Handshake");


        ServletServerHttpRequest ssreq = (ServletServerHttpRequest) request;
        System.out.println("URI:" + request.getURI());

        HttpServletRequest req = ssreq.getServletRequest();
        System.out.println(req.getHeaderNames());


        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                                  ServerHttpResponse response,
                                  WebSocketHandler wsHandler,
                                  @Nullable
                                              Exception exception)  {
        System.out.println("headers : " +  response.getHeaders());
        try {
            System.out.println("bodys : " +  response.getBody());
        } catch (Exception e) {
            System.out.println(e);
        }

    }
}
