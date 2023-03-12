package gro.spring.jpa.repository;

import gro.spring.jpa.domain.Bus;
import gro.spring.jpa.domain.Travel;
import gro.spring.jpa.domain.TravelStatus;
import gro.spring.jpa.dto.TravelSearchResultDto;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RepositoryRestResource
public interface TravelRepository extends JpaRepository<Travel, Integer> {

    public List<Travel> findAll();

    @EntityGraph("graph.travel.travelBookings")
    public Optional<Travel> findByTravelId(Integer id);

    @RestResource(exported = false) // stops Spring from making this available to clients
    public List<Travel> findByBus(Bus bus);

    @Query(nativeQuery = true,
            value = "select * from t_travel where (?1 is null or source=?1) and (?2 is null or destination=?2) " +
                    "and (?3 is null or departure_datetime=?3) and (?4 is null or status=?4)")
    public List<Travel> findForCondition(
            String source, String destination, Timestamp departureDatetime, String status);

    @Query("select new gro.spring.jpa.dto.TravelSearchResultDto(" +
            "t.travelId, t.source, t.destination, t.departureDatetime, t.status, " +
            "b.busId, b.maker, b.makeYear," +
            "(b.seats - (select count(*) from TravelBooking tb)) " +
            ") from Travel t join t.bus b " +
            "where t.source like :source and t.destination like :destination " +
            "and t.departureDatetime between :fromDt and :untilDt"
            )
    public List<TravelSearchResultDto> findFor(
            String source, String destination,
            LocalDateTime fromDt, LocalDateTime untilDt);

    @Query("select " +
            "t.travelId, t.source, t.destination, t.departureDatetime, t.status, " +
            "b.busId, b.maker, b.makeYear," +
            "(b.seats - (select count(*) from TravelBooking tb)) " +
            "from Travel t join t.bus b " +
            "where t.source like :source and t.destination like :destination " +
            "and t.departureDatetime between :fromDt and :untilDt"
    )
    public <T> List<T> findDynamicFor(
            String source, String destination,
            LocalDateTime fromDt, LocalDateTime untilDt, Class<T> returnType);


}
