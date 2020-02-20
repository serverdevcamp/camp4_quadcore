package com.quadcore.follow.Domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;

@Data
@Entity
public class Followings implements Serializable {

    private static final long serialVersionUID = -7353484588260422449L;

    @Id
    @Column(nullable=false, unique=true, length=20)
    private String username;

    @Column(columnDefinition = "TEXT")
    private String tweetMembers;
}
