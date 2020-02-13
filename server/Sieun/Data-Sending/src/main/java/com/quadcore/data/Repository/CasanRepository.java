package com.quadcore.data.Repository;

import com.quadcore.data.Domain.Casan;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CasanRepository extends CrudRepository<Casan, UUID> {
    @Query("SELECT * FROM examples WHERE date=:date AND create_at > :time")
    public List<Casan> findCasansBy(@Param("date") LocalDate date, @Param("time") LocalTime time);

    @Query("SELECT * FROM examples WHERE test2=:keyword ALLOW FILTERING")
    public List<Casan> findCasansBy(@Param("keyword") String keyword);

    @Query("SELECT * FROM examples WHERE date=:date AND create_at > :time AND test2=:keyword ALLOW FILTERING")
    public List<Casan> findCasansBy(@Param("date") LocalDate date, @Param("time") LocalTime time, @Param("keyword") String keyword);

}