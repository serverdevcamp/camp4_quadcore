package com.quadcore.data.Repository;

import com.quadcore.data.Domain.Casan;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CasanRepository extends CrudRepository<Casan, Long> {

    //FOR BTS column past data. before given date and time + limit 10
    @Query("SELECT * FROM bts.tweet_dataset WHERE date = :date AND timestamp < :timestamp limit 10 ALLOW FILTERING")
    public List<Casan> findCasansByTimestamp(@Param("date") String date, @Param("timestamp")Long timestamp);

    //FOR SEARCH past data. before given date and time + limit 10
    @Query("SELECT * FROM bts.tweet_dataset WHERE date = :date AND timestamp < :timestamp AND hashtags CONTAINS :keyword limit 10 ALLOW FILTERING")
    public List<Casan> findCasansByEntities(@Param("date") String date, @Param("timestamp")Long timestamp, @Param("keyword")String keyword);

    //real - time data in SEARCH COLUMN (recent 5)
    @Query("SELECT * FROM bts.tweet_dataset WHERE date = :date AND timestamp > :timestamp AND hashtags CONTAINS :keyword limit 5 ALLOW FILTERING")
    public List<Casan> findCasansByDate(@Param("date") String date, @Param("timestamp")Long timestamp, @Param("keyword")String keyword);


    //real - time data in  BTS column
    @Query("SELECT * FROM bts.tweet_dataset WHERE date = :date AND hour IN ( :now_hour , :prior_hour ) AND timestamp > :timestamp limit 10 ALLOW FILTERING")
    public List<Casan> findCasansByUser(@Param("date") String date, @Param("now_hour") Byte now_hour, @Param("prior_hour") Byte prior_hour, @Param("timestamp")Long timestamp);
}
