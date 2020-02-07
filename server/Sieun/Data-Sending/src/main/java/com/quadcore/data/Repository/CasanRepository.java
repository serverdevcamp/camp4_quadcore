package com.quadcore.data.Repository;

import com.quadcore.data.Domain.Casan;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CasanRepository extends CrudRepository<Casan, UUID> {
    @Query("SELECT * FROM examples WHERE date=?0 AND create_at > ?1")
    public List<Casan> findCasansBy(LocalDate date, LocalTime time);
}