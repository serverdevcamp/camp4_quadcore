package com.quadcore.gw2.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Map;

@Component
public class WebSocketJwtFilter extends
        AbstractGatewayFilterFactory<WebSocketJwtFilter.Config> implements Ordered {

    final Logger logger =
            LoggerFactory.getLogger(WebSocketJwtFilter.class);

    @Autowired
    private JwtValidator jwtValidator;

    @Override
    public int getOrder() {
        return -2; // -1 is response write filter, must be called before that
    }

    public static class Config {
        private String role;
        public Config(String role) {
            this.role = role;
        }
        public String getRole() {
            return role;
        }
    }

    public WebSocketJwtFilter() {
        super(WebSocketJwtFilter.Config.class);
    }
    // public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            logger.info("SDfdsgdsgdsf");
            System.out.println(exchange.getRequest().getHeaders().get("Origin"));

                    //.getHeaders().get("Authorization").get(0).substring(7);
                        /*

            logger.info("token : " + token);
            Map<String, Object> userInfo = jwtValidator.getUserParseInfo(token);
            logger.info("role of Request user : " + userInfo.get("role"));
            ArrayList<String> arr = (ArrayList<String>)userInfo.get("role");
            logger.info("roelsdfsdf: " + userInfo.get("role") + userInfo.get("role").getClass());
            if ( !arr.contains(config.getRole())) {
                throw new IllegalArgumentException();
            }

             */
            return chain.filter(exchange);
        };
    }
}