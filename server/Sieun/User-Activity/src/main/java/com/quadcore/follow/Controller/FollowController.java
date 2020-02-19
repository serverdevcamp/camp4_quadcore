package com.quadcore.follow.Controller;

import com.quadcore.follow.Domain.Casan;
import com.quadcore.follow.Domain.Member;
import com.quadcore.follow.Repository.CasanRepository;
import com.quadcore.follow.Repository.MemberRepository;
import com.quadcore.follow.Service.MemberService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController


public class FollowController {

    @Autowired
    MemberRepository memberRepository;


    @Autowired
    private CasanRepository casanRepository;

    @Autowired
    MemberService memberService;
    Logger logger = LoggerFactory.getLogger(FollowController.class);

    public void sendMail() {

    }

    @PostMapping(path = "/follow/add")
    public Map<String, Object> follow(@RequestBody Map<String, String> m) {
        String member = m.get("username");
        String tweetMember = m.get("tweetUsername");
        logger.info(member+" start to follow " + tweetMember);
        memberService.updateTweetMembers(member, tweetMember);
        Map<String, Object> map = new HashMap<>();
        map.put("errorCode", 10);
        return map;
    }


    @GetMapping(path="/follow/flist/{username}")
    public Map<String, Object> getall(@PathVariable("username") String member) {
        //logger.info("member: " + member);
        ArrayList<String> followings =memberService.findMemberByUsername(member).getTweetMembers();
        Map<String, Object> map = new HashMap<>();
        map.put("errorCode", 10);
        map.put("followings", followings);
        return map;
    }

    @GetMapping(path="/follow/searchuser/{tweetuser}")
    public Map<String, Object> getUserPosts(@PathVariable("tweetuser") String tweetuser) {
        logger.info("get posts of: " + tweetuser);
        Timestamp timestamp = new Timestamp(System.currentTimeMillis() - (5 * 1000));

        //System.out.println("timestamp: " + timestamp.getTime()*1000);

        List<Casan> c = casanRepository.findCasansByUser(LocalDate.now().toString(),timestamp.getTime()*1000, tweetuser);
        Map<String, Object> map = new HashMap<>();
        map.put("data", c);
        map.put("errorCode", 10);

        return map;
    }



}
