package gro.spring.jpa.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@NamedEntityGraph(name="graph.travelBooking.travel&customer", attributeNodes={@NamedAttributeNode("travel"), @NamedAttributeNode("customer")})
public class TravelBooking extends BaseDomainModel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer travelBookingId;

    private Timestamp bookingDatetime;
    
    private Integer bookedSeats;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="travelId", referencedColumnName="travelId")
    private Travel travel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="customerId", referencedColumnName="customerId")
    private Customer customer;

    public Integer getTravelBookingId() {
        return travelBookingId;
    }

    public void setTravelBookingId(Integer travelBookingId) {
        this.travelBookingId = travelBookingId;
    }

    public Travel getTravel() {
        return travel;
    }

    public void setTravel(Travel travel) {
        this.travel = travel;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Timestamp getBookingDatetime() {
        return bookingDatetime;
    }

    public void setBookingDatetime(Timestamp bookingDatetime) {
        this.bookingDatetime = bookingDatetime;
    }

    public Integer getBookedSeats() {
        return bookedSeats;
    }

    public void setBookedSeats(Integer bookedSeats) {
        this.bookedSeats = bookedSeats;
    }

    @Override
    public String toString() {
        return "TravelBooking{" +
                "travelBookingId=" + travelBookingId +
                ", travel=" + travel.getTravelId() +
                ", customer=" + customer.getCustomerId() +
                ", bookingDatetime=" + bookingDatetime +
                ", bookedSeats=" + bookedSeats +
                '}';
    }
}
