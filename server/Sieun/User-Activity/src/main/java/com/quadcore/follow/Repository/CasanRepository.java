package com.quadcore.follow.Repository;

import com.quadcore.follow.Domain.Casan;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CasanRepository extends CrudRepository<Casan, Long> {


    //for HOME column: search by user
    @Query("SELECT * FROM bts.master_dataset WHERE timestamp < :timestamp AND user=:user limit 5 ALLOW FILTERING")
    public List<Casan> findCasansByUser(@Param("date") String date, @Param("timestamp") Long timestamp, @Param("user") String user);
}