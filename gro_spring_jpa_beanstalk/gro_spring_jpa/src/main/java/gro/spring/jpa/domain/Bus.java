package gro.spring.jpa.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.util.List;

@Entity
public class Bus extends BaseDomainModel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer busId;

    private String      registration;
    private String      maker;
    private Integer     makeYear;
    private Date        lastServiced;
    private Integer     seats;

    @OneToMany(mappedBy="bus", fetch=FetchType.LAZY)
    private List<Travel> travels;

    public List<Travel> getTravels() { return travels;}

    public void setTravels(List<Travel> travels) {this.travels = travels;}

    public Integer getBusId() {
        return busId;
    }

    public void setBusId(Integer busId) {
        this.busId = busId;
    }

    public String getRegistration() {
        return registration;
    }

    public void setRegistration(String registration) {
        this.registration = registration;
    }

    public String getMaker() {
        return maker;
    }

    public void setMaker(String maker) {
        this.maker = maker;
    }

    public Integer getMakeYear() {
        return makeYear;
    }

    public void setMakeYear(Integer makeYear) {
        this.makeYear = makeYear;
    }

    public Date getLastServiced() {
        return lastServiced;
    }

    public void setLastServiced(Date lastServiced) {
        this.lastServiced = lastServiced;
    }

    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    @Override
    public String toString() {
        return "Bus{" +
                "busId=" + busId +
                ", registration='" + registration + '\'' +
                ", maker='" + maker + '\'' +
                ", makeYear=" + makeYear +
                ", seats=" + seats +
                '}';
    }
}
