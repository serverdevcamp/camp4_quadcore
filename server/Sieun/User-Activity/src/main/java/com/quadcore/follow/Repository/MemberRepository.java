package com.quadcore.follow.Repository;

import com.quadcore.follow.Domain.Member;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository  extends MongoRepository<Member, String> {
   Member findMemberByUsername(String username);
}
