package com.quadcore.data.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@RequiredArgsConstructor
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /*
    @Autowired
    HandshakeInterceptor handshakeInterceptor;
    */
    @Bean
    public HandshakeInterceptor handshakeInterceptor() {
        return new HandshakeInterceptor();
    }


    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/pub");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/wscn").addInterceptors(handshakeInterceptor()).setAllowedOrigins("*").withSockJS();
    }

    /*
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new FilterChannelInterceptor());
    }

     */

}