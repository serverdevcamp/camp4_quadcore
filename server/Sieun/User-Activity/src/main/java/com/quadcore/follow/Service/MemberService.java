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

        System.out.println("updateTweetmemver of : " + mem);
        ArrayList<String> fl = mem.getTweetMembers();
        fl.add(tweetMember);
        mem.setTweetMembers(fl);
        repository.save(mem);
    }
}
