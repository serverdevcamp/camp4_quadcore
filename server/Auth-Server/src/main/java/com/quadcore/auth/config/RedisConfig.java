package com.quadcore.auth.config;


import com.quadcore.auth.Domain.Member;
import com.quadcore.auth.Domain.Token;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        LettuceConnectionFactory lettuceConnectionFactory = new LettuceConnectionFactory();
        return lettuceConnectionFactory;
    }


    @Bean
    public RedisTemplate<String, Object> memberRedisTemplate() {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        redisTemplate.setKeySerializer(new StringRedisSerializer());

        //객체를 json 형태로 깨지지 않고 받기 위한 직렬화 작업
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(Member.class));
        return redisTemplate;
    }
}