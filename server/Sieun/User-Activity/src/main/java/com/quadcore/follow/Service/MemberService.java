package com.quadcore.follow.Service;

import com.quadcore.follow.Domain.Member;
import com.quadcore.follow.Repository.MemberRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;


@Service
@AllArgsConstructor
public class MemberService {

    @Autowired
    private MemberRepository repository;

    public Member findMemberByUsername(String username) {
        return repository.findMemberByUsername(username);
    }

    public void updateTweetMembers (String member, String tweetMember) {
        Member mem = repository.findMemberByUsername(member);
        ArrayList<String> fl;

        if (mem == null) {
            mem = new Member();
            mem.setUsername(member);
            mem.setId(String.valueOf(mem.hashCode()));
            fl = new ArrayList<>();
        } else {
            fl = mem.getTweetMembers();
        }
        System.out.println("update of: " + mem);
        fl.add(tweetMember);
        mem.setTweetMembers(fl);
        repository.save(mem);
    }
}
