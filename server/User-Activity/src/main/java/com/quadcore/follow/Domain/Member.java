package com.quadcore.follow.Domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "follow")
public class Member {
    @Id
    private String id;
    private String username;
    private ArrayList<String> tweetMembers;
}
