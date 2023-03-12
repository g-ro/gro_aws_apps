package gro.spring.jpa.domain;

import org.springframework.data.jpa.repository.EntityGraph;

import jakarta.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@NamedEntityGraph(name="graph.travel.travelBookings", attributeNodes=@NamedAttributeNode("travelBookings"))
public class Travel extends BaseDomainModel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer travelId;

    @OneToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="busId", referencedColumnName="busId")
    private Bus bus;

    private String      source;
    private String      destination;
    private LocalDateTime departureDatetime;
    private TravelStatus status; // use of JPA 2.1 javax.persistence.Converter to convert between DB and Enum

    @OneToMany(mappedBy="travel", fetch=FetchType.LAZY) /* mapped by which attribute in travelBookings */
    private Set<TravelBooking> travelBookings;

    public Integer getTravelId() {return travelId;}

    public void setTravelId(Integer travelId) {
        this.travelId = travelId;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDateTime getDepartureDatetime() { return departureDatetime;  }

    public void setDepartureDatetime(LocalDateTime departureDatetime) { this.departureDatetime = departureDatetime; }

    public TravelStatus getStatus() {return status;}

    public void setStatus(TravelStatus status) { this.status = status;}

    public Set<TravelBooking> getTravelBookings() { return travelBookings;}

    public void setTravelBookings(Set<TravelBooking> travelBookings) { this.travelBookings = travelBookings; }

    @Override
    public String toString() {
        return "Travel{" +
                "travelId=" + travelId +
                ", source='" + source + '\'' +
                ", destination='" + destination + '\'' +
                ", departureDateTime=" + departureDatetime +
                ", status='" + status + '\'' +
                '}';
    }
}
