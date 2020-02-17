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
public interface CasanRepository extends CrudRepository<Casan, UUID> {

    /*
    @Query("SELECT * FROM examples WHERE date=:date AND create_at > :time")
    public List<Casan> findCasansBy(@Param("date") LocalDate date, @Param("time") LocalTime time);

    @Query("SELECT * FROM examples WHERE test2=:keyword ALLOW FILTERING")
    public List<Casan> findCasansBy(@Param("keyword") String keyword);


    // FOR REAL_TIME Socket: polling 2 secs
    @Query("SELECT * FROM examples WHERE date=:date AND create_at > :time AND test2=:keyword ALLOW FILTERING")
    public List<Casan> findCasansBy(@Param("date") LocalDate date, @Param("time") LocalTime time, @Param("keyword") String keyword);


    //public List<Casan> findCasansByEntities(@Param("date") LocalDate date, @Param("time") LocalTime time, @Param("keyword") String keyword);
//SELECT * FROM examples WHERE date='2020-02-15' AND create_at < '17:21:48.810' AND entities CONTAINS 'asd' limit 2 ALLOW FILTERING;

 */

    //FOR SEARCH past data. before given date and time + limit 20
    @Query("SELECT * FROM bts.master_dataset WHERE timestamp <= :timestamp AND hashtags CONTAINS :keyword limit 20 ALLOW FILTERING")
    public List<Casan> findCasansByTimestamp(@Param("date") String date, @Param("timestamp")Long timestamp, @Param("keyword")String keyword);

    @Query("SELECT * FROM bts.master_dataset WHERE date>=:date AND timestamp > :timestamp AND hashtags CONTAINS :keyword limit 10 ALLOW FILTERING")
    public List<Casan> findCasansByDate(@Param("date") String date, @Param("timestamp")Long timestamp, @Param("keyword")String keyword);

}