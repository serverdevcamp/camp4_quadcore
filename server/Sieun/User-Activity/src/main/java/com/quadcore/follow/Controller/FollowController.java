package com.quadcore.follow.Controller;

//import com.quadcore.follow.Domain.Casan;
        import com.quadcore.follow.Domain.Casan;
        import com.quadcore.follow.Domain.Followings;
//import com.quadcore.follow.Domain.Member;
        import com.quadcore.follow.Repository.CasanRepository;
        import com.quadcore.follow.Repository.FollowingRepository;
//import com.quadcore.follow.Repository.MemberRepository;
//import com.quadcore.follow.Service.MemberService;
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
    FollowingRepository followingRepository;

    @Autowired
    private CasanRepository casanRepository;

    /*
    @Autowired
    MemberRepository memberRepository;



    @Autowired
    MemberService memberService;

 */
    Logger logger = LoggerFactory.getLogger(FollowController.class);

    public void sendMail() {

    }


    @PostMapping(path = "/follow/add")
    public Map<String, Object> follow(@RequestBody Map<String,String> m) {
        String username = m.get("username");
        String tweetMember = m.get("tweetUserId");
        logger.info(username+" start to follow " + tweetMember);
//        logger.info("repo: "+memberRepository + " and service : " + memberService);
//        logger.info("AAAAALLLL: " + memberRepository.findAll());
//        logger.info("in controller: " + memberRepository.findMemberByUsername(member));
//        memberService.updateTweetMembers(member, tweetMember);
        Followings nf = followingRepository.findByUsername(username);
        if (nf == null) {
            nf= new Followings();
            nf.setUsername(username);
            nf.setTweetMembers(tweetMember);
            followingRepository.save(nf);
        } else {
            nf.setTweetMembers(nf.getTweetMembers() + "/" + tweetMember);
            followingRepository.save(nf);
        }
//        followingRepository.save(nf);
        Map<String, Object> map = new HashMap<>();
        map.put("errorCode", 10);
        return map;
    }




    @GetMapping(path="/follow/flist/{username}")
    public Map<String, Object> getall(@PathVariable("username") String memb) {
        //logger.info("member: " + member);
        Followings m = followingRepository.findByUsername(memb);
        String st = m.getTweetMembers();
        //ArrayList<String> followings =memberService.findMemberByUsername(member).getTweetMembers();
        Map<String, Object> map = new HashMap<>();
        map.put("errorCode", 10);
        map.put("followings", st.split("/"));
        return map;
    }


    //for HOME column: past data
    @GetMapping(path="/follow/searchuser/{username}/{date}/{time}")
    public Map<String, Object> getUserPosts(@PathVariable("username") String username, @PathVariable("date") String date, @PathVariable("time") Long time) {
        Timestamp weekstamp = new Timestamp(System.currentTimeMillis() - (60 * 60 * 24 * 7 * 1000)); //a week
        //Timestamp nowstamp =new Timestamp(System.currentTimeMillis());
        //System.out.println("timestamp: " + timestamp.getTime()*1000);
        logger.info("search user of: " + username);

        Followings m = followingRepository.findByUsername(username);
        String st = m.getTweetMembers();
        logger.info("st : " + st);
        //ArrayList<String> followings =memberService.findMemberByUsername(member).getTweetMembers();

        String[] strlist =  st.split("/");
        List<Long> result = new ArrayList<>();
        for (int i = 0; i < strlist.length; i++)
            result.add(Long.parseLong(strlist[i]));
        logger.info("result: " + result);
        //List<Casan> c = casanRepository.findCasansByUser(date,weekstamp.getTime()*1000,time, result);
        List<Casan> c = casanRepository.findCasansByCreate_at(date,weekstamp.getTime()*1000,time, result);

        Map<String, Object> map = new HashMap<>();
        map.put("data", c);
        map.put("errorCode", 10);
        return map;
    }


    //recent 1 minute
    @GetMapping(path="/follow/updateuser/{userid}/{date}/{time}")
    public Map<String, Object> updateUserHome(@PathVariable("userid") Long userid, @PathVariable("date") String date, @PathVariable("time") Long time) {
        logger.info("recent data request of: " + userid);
        List<Casan> c = casanRepository.findCasansByTimestamp(date,time, userid);
        Map<String, Object> map = new HashMap<>();
        map.put("data", c);
        map.put("errorCode", 10);
        return map;
    }
}
