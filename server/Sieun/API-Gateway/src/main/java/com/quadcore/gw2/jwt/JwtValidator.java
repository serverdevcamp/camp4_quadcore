package com.quadcore.gw2.jwt;

import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.*;


@Component
public class JwtValidator implements Serializable {

    private static final long serialVersionUID = -2550185165626007488L;
    @Value("${jwt.secret}")
    private String secret;
    private static final Logger logger = LoggerFactory.getLogger(JwtValidator.class);

    public Map<String, Object> getUserParseInfo(String token) {
        Claims parseInfo = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
        Map<String, Object> result = new HashMap<>();
        //expiration date < now
        boolean isExpired = !parseInfo.getExpiration().before(new Date());
        result.put("username", parseInfo.getSubject());
        result.put("role", parseInfo.get("role", List.class));
        result.put("isExpired", isExpired);
        System.out.println("parseinfo in getuseroarseinfo: " + result);
        return result;
    }

    public boolean isValidate(String token) {
        try {
            Map<String, Object> info = getUserParseInfo(token);
        } catch (NullPointerException e) {
            logger.warn("NullpointerException");
            return false;
        }
        // token is expired
        catch (ExpiredJwtException e) {
            logger.warn("The token is expired.");
            return false;
        }
        // signature is wrong
        catch (SignatureException e) {
            logger.warn("Signature of the token is wrong.");
            return false;
        }
        // format is wrong
        catch (MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            logger.warn("The token string is wrong format.");
            return false;
        }
        return true;
    }

}
