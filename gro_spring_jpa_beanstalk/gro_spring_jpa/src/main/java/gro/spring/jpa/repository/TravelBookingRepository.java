package gro.spring.jpa.repository;

import gro.spring.jpa.domain.Customer;
import gro.spring.jpa.domain.Travel;
import gro.spring.jpa.domain.TravelBooking;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource
public interface TravelBookingRepository extends JpaRepository<TravelBooking, Integer> {

    public List<TravelBooking> findAll();

    public Optional<TravelBooking> findByTravel(Travel travel);

    @EntityGraph("graph.travelBooking.travel&customer")
    public List<TravelBooking> findByCustomer(Customer customer);


//    @Query(
//
//    )
//    public <T> T findFor(Integer customerId, Class<T> dto);


    @Query(nativeQuery=true,
           value="select * from t_travel_booking where customer_id=?1")
    public List<TravelBooking> findForCondition(Integer customerId);

}
