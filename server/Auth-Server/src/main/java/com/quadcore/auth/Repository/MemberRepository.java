package com.quadcore.auth.Repository;

import com.quadcore.auth.Domain.Member;
import org.springframework.data.repository.CrudRepository;

public interface MemberRepository extends CrudRepository<Member, Integer> {
    Member findByUsername(String username);
    Member findByEmail(String email);
    Long deleteByUsername(String username);
}
