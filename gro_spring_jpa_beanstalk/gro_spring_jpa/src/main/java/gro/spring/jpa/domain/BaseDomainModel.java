package gro.spring.jpa.domain;

import jakarta.persistence.*;
import java.sql.Timestamp;

@MappedSuperclass
public class BaseDomainModel {

    protected Timestamp updAt;

    protected String updBy;

    public Timestamp getUpdAt() {
        return updAt;
    }

    public void setUpdAt(Timestamp updAt) {
        this.updAt = updAt;
    }

    public String getUpdBy() {
        return updBy;
    }

    public void setUpdBy(String updBy) {
        this.updBy = updBy;
    }

}
