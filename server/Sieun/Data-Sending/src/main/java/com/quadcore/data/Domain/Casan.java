package com.quadcore.data.Domain;

import com.datastax.driver.core.DataType;
import com.datastax.driver.core.utils.UUIDs;
import lombok.Data;
import org.springframework.core.annotation.Order;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.cassandra.core.cql.Ordering;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.CassandraType;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.UUID;


@Data
@Table("examples")
public class Casan implements Serializable {

    @CassandraType(type = DataType.Name.UUID)
    private UUID id= UUIDs.timeBased();

    private String test1;
    private String test2;
    private String test3;

    @PrimaryKeyColumn(ordinal=1, type = PrimaryKeyType.CLUSTERED, ordering = Ordering.DESCENDING)
    private LocalTime create_at= LocalTime.now();

    @PrimaryKeyColumn(ordinal = 0, type = PrimaryKeyType.PARTITIONED)
    private LocalDate date = LocalDate.now();
}

