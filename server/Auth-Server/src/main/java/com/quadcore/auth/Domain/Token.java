package com.quadcore.auth.Domain;

import lombok.Data;

import java.io.Serializable;

@Data
public class Token implements Serializable {

    private static final long serialVersionUID = -7353484588260422449L;
    private String username;
    private String refreshToken;

}
