package gro.spring.jpa.dto;

import gro.spring.jpa.domain.TravelStatus;

import java.time.LocalDateTime;
import java.util.Date;

public class TravelSearchResultDto {

    private Integer travelId;
    private String source;
    private String destination;
    private LocalDateTime departureDatetime;
    private TravelStatus status;

    private Integer         busId;
    private String          maker;
    private Integer         makeYear;

    private Long availableSeatsCount;

    public TravelSearchResultDto(Integer travelId, String source,
          String destination, LocalDateTime departureDatetime, TravelStatus status,
          Integer busId, String maker, Integer makeYear, Long availableSeatsCount) {
        this.travelId = travelId;
        this.source = source;
        this.destination = destination;
        this.departureDatetime = departureDatetime;
        this.status = status;
        this.busId = busId;
        this.maker = maker;
        this.makeYear = makeYear;
        this.availableSeatsCount = availableSeatsCount;
    }

    public TravelSearchResultDto() {}

    public Integer getTravelId() {
        return travelId;
    }

    public void setTravelId(Integer travelId) {
        this.travelId = travelId;
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

    public TravelStatus getStatus() {
        return status;
    }

    public void setStatus(TravelStatus status) {
        this.status = status;
    }

    public Integer getBusId() { return busId;  }

    public void setBusId(Integer busId) { this.busId = busId;}

    public String getMaker() { return maker; }

    public void setMaker(String maker) {  this.maker = maker;  }

    public Integer getMakeYear() { return makeYear; }

    public void setMakeYear(Integer makeYear) {
        this.makeYear = makeYear;
    }

    public Long getAvailableSeatsCount() { return availableSeatsCount; }

    public void setAvailableSeatsCount(Long availableSeatsCount) { this.availableSeatsCount = availableSeatsCount; }

    @Override
    public String toString() {
        return "TravelSearchResultDto{" +
                "travelId=" + travelId +
                ", source='" + source + '\'' +
                ", destination='" + destination + '\'' +
                ", departureDatetime=" + departureDatetime +
                ", status=" + status +
                ", busId=" + busId +
                ", maker='" + maker + '\'' +
                ", makeYear=" + makeYear +
                ", availableSeatsCount=" + availableSeatsCount +
                '}';
    }
}
