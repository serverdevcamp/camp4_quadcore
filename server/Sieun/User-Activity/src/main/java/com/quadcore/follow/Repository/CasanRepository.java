
package com.quadcore.follow.Repository;

import com.quadcore.follow.Domain.Casan;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface CasanRepository extends CassandraRepository<Casan, Long> {


    //for HOME column: past data
    @Query("SELECT * FROM bts.master_dataset WHERE timestamp > :weekstamp AND  timestamp < :pointstamp AND user_id=:userid limit 10 ALLOW FILTERING")
    public List<Casan> findCasansByUser(@Param("date") String date, @Param("weekstamp") Long weekstamp, @Param("pointstamp") Long pointstamp, @Param("userid") Long userid);

    //for HOME column: recent 1 minute
    @Query("SELECT * FROM bts.master_dataset WHERE date >= :date AND timestamp > :timestamp AND user_id=:userid limit 10 ALLOW FILTERING")
    public List<Casan> findCasansByTimestamp(@Param("date") String date, @Param("timestamp") Long timestamp, @Param("userid") Long userid);

}



