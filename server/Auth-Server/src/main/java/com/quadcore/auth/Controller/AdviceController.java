package com.quadcore.auth.Controller;

import io.jsonwebtoken.ExpiredJwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class AdviceController {
    private Logger logger = LoggerFactory.getLogger(ApplicationRunner.class);

    @ExceptionHandler(DataIntegrityViolationException.class)
    public Map<String, Object> duplicateEx(Exception e) {
        logger.warn("DataIntegrityViolationException" + e.getClass());
        Map<String, Object> map = new HashMap<>();
        map.put("errorCode", 53);
        return map;
    }

    @ExceptionHandler(BadCredentialsException.class)
    public Map<String, Object> badCredentialEx(Exception e) {
        logger.warn("BadCredentialsException");
        Map<String, Object> map = new HashMap<>();
        map.put("errorCode", 63);
        return map;
    }

    @ExceptionHandler({
            IllegalArgumentException.class, MissingServletRequestParameterException.class})
    public Map<String, Object> paramsEx(Exception e) {
        logger.warn("params ex: "+ e);
        Map<String, Object> map = new HashMap<>();
        map.put("errorCode", 51);
        return map;
    }

    @ExceptionHandler(NullPointerException.class)
    public Map<String, Object> nullEx(Exception e) {
        logger.warn("null ex" + e.getClass());
        Map<String, Object> map = new HashMap<>();
        map.put("errorCode", 61);
        return map;
    }

}
