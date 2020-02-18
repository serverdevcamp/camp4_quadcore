package com.quadcore.gw2;

import com.quadcore.gw2.jwt.JwtRequestFilter;
import com.quadcore.gw2.jwt.WebSocketJwtFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.handler.RoutePredicateHandlerMapping;
import org.springframework.cloud.gateway.route.RouteLocator;

import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.HashMap;

@SpringBootApplication
public class Gw2Application {

    public static void main(String[] args) {
        SpringApplication.run(Gw2Application.class, args);
    }


    @Bean
    public CorsConfiguration corsConfiguration(RoutePredicateHandlerMapping routePredicateHandlerMapping) {
        CorsConfiguration corsConfiguration = new CorsConfiguration().applyPermitDefaultValues();
        Arrays.asList(HttpMethod.OPTIONS, HttpMethod.PUT, HttpMethod.GET, HttpMethod.DELETE, HttpMethod.POST) .forEach(m -> corsConfiguration.addAllowedMethod(m));
        corsConfiguration.addAllowedOrigin("*");
        routePredicateHandlerMapping.setCorsConfigurations(new HashMap<String, CorsConfiguration>() {{ put("/**", corsConfiguration); }});
        return corsConfiguration;
    }



    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder, JwtRequestFilter jwtRequestFilter, WebSocketJwtFilter webSocketJwtFilter) {
        String authServer="http://localhost:8083/";
        String followServer="http://localhost:8086/";
        String webSocketServer = "ws://localhost:8888/";
        String dataServer = "http://localhost:8888/";

        return builder.routes()
                .route("auth",  r-> r.path("/auth/**")
                        .filters(f -> f
                                .rewritePath("/auth/(?<segment>.*)", "/auth/${segment}")
                                //.filter(jwtRequestFilter.apply(new JwtRequestFilter.Config("dummy", true, true)))
                                /*
                                .hystrix(config -> config
                                .setName("fallbackpoint")
                                .setFallbackUri("forward:/fallback"))
                                 */
                        )
                        .uri(authServer))
                .route("follow",  r-> r.path("/follow/**")
                        .filters(f -> f
                                .rewritePath("/follow/(?<segment>.*)", "/follow/${segment}")
                                .filter(jwtRequestFilter.apply(new JwtRequestFilter.Config("ROLE_USER")))
                                /*
                                .hystrix(config -> config
                                        .setName("fallbackpoint")
                                        .setFallbackUri("forward:/fallback"))
                                */
                        )

                        .uri(followServer))
                .route("user", r->r.path("/user/**")
                    .filters(f -> f
                            .rewritePath("/user/(?<segment>.*)", "/user/${segment}")
                            .filter(jwtRequestFilter.apply(new JwtRequestFilter.Config("ROLE_USER"))
                    ))
                        .uri(authServer)
                )
                .route("data", r->r.path("/data/**")
                        .filters(f -> f
                                .filter(jwtRequestFilter.apply(new JwtRequestFilter.Config("ROLE_USER"))
                                ))
                        .uri(dataServer)
                )

                .route("socket", r->r.path("/wscn/**") //.and().method("GET")
                        .uri(webSocketServer)
                )
                .route("admin", r->r.path("/admin/**")
                        .filters(f -> f
                                .rewritePath("/admin/(?<segment>.*)", "/admin/${segment}")
                                .filter(jwtRequestFilter.apply(new JwtRequestFilter.Config("ROLE_ADMIN"))
                                ))
                        .uri(authServer)
                )
                .build();
    }
}
