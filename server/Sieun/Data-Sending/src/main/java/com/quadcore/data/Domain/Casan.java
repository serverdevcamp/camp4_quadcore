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
        import java.math.BigInteger;
        import java.sql.Timestamp;
        import java.time.LocalDate;
        import java.time.LocalDateTime;
        import java.time.LocalTime;
        import java.util.ArrayList;
        import java.util.Date;
        import java.util.List;
        import java.util.UUID;


@Data
@Table("master_dataset")
public class Casan implements Serializable {
    private ArrayList<String> hashtags;


    @PrimaryKeyColumn(ordinal=1, type = PrimaryKeyType.CLUSTERED, ordering = Ordering.DESCENDING)
    private Long timestamp = new Timestamp(System.currentTimeMillis()).getTime();

    @PrimaryKeyColumn(ordinal = 0, type = PrimaryKeyType.PARTITIONED)
    private String date = LocalDate.now().toString();
    private int favorite_count, quote_count, reply_count, retweet_count;
    private String create_at, entities, extended_entities, extended_tweet, lang, quoted_status, retweeted_status, text, user;
    private long id;
    private boolean is_quote_status, media_status, reply_status, retweeted, truncated;

}

