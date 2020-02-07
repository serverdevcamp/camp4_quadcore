package com.quadcore.data.Domain;

import com.datastax.driver.core.DataType;
import lombok.Data;
import org.springframework.data.cassandra.core.mapping.CassandraType;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;


@Data
@Table("examples")
public class Casan implements Serializable {

    @PrimaryKey
    @CassandraType(type = DataType.Name.UUID)
    private UUID id;
    private String description;
    private int price;
    private String imageUrl;
}
