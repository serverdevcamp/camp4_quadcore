package com.quadcore.auth.Repository;

import com.quadcore.auth.Domain.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FollowRepository  extends MongoRepository<Follow, String> {
    Follow findFollowByUsername(String username);
}
