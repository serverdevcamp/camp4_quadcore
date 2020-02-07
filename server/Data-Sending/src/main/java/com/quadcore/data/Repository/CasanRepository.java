package com.quadcore.data.Repository;

import com.quadcore.data.Domain.Casan;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CasanRepository extends CrudRepository<Casan, UUID> {
}