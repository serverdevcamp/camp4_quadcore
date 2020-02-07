package com.quadcore.auth.Domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.experimental.Delegate;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.redis.core.RedisHash;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
public class Member implements Serializable {

    private static final long serialVersionUID = -7353484588260422449L;


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable=false, unique=true, length=20)
    private String username;

    @Column(nullable=false, unique=true, length=50)
    private String email;

    @Length(min=8, max=200)
    private String password;

    @CreationTimestamp
    private Date reg_dt;

    @UpdateTimestamp
    private Date updated_dt;

    private Date access_dt;

    private int grade;

    /*
    @Column(columnDefinition = "integer default 0")
    private int email_status;
    */
}

