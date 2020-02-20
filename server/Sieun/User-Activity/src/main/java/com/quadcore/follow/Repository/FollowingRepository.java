package com.quadcore.follow.Repository;

import com.quadcore.follow.Domain.Followings;
import org.springframework.data.repository.CrudRepository;

public interface FollowingRepository extends CrudRepository<Followings, Long> {
    Followings findByUsername(String username);
}
