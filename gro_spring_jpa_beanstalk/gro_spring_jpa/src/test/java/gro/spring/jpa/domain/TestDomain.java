package gro.spring.jpa.domain;

import gro.spring.jpa.repository.*;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.AFTER_TEST_METHOD;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;

import java.util.List;
import java.util.Optional;

@Disabled("Disabled until DTO tests are up and running")
@SpringBootTest
public class TestDomain {

    private final Logger logger = LoggerFactory.getLogger(TestDomain.class);

    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private BusRepository busRepository;
    @Autowired
    private TravelRepository travelRepository;
    @Autowired
    private TravelBookingRepository travelBookingRepository;

//    https://stackoverflow.com/questions/27126974/how-to-execute-sql-before-a-before-method/27156080
//    SqlGroup is optional for Java 8 and above, but must for 6 and 7 when using multiple Sql
    @Test
    @SqlGroup({
            @Sql("classpath:createCustomer.sql")
           ,@Sql(scripts = "classpath:deleteCustomer.sql", executionPhase = AFTER_TEST_METHOD)
    })
    public void testCustomer() {
        Optional<Customer> customer = customerRepository.findByFirstNameAndLastName("John", "Doe");
        logger.info("{}", customer.get());
        assertNotNull(customer.orElseGet(null));
    }

    @Test
    public void testBus() {
        Optional<Bus> bus = busRepository.findByBusId(1);
        assertNotNull(bus.orElseGet(null));
    }

    @Test
    public void testBusByMaker() {
        List<Bus> buses = busRepository.findByMaker("Volvo");
        buses.stream().forEach(b -> logger.info("{}", b));
        assertTrue(buses.size() > 0);
    }

    @Test
    public void testTravel() {
        Optional<Travel> travel = travelRepository.findByTravelId(1);
        logger.info("{}", travel.get());
        assertNotNull(travel.orElseGet(null));
    }

    @Test
    public void testTravelNativeQuery() {
        List<Travel> travels = travelRepository.findForCondition("Sydney Airport", "Melbourne Airport", null, "Open");
        travels.stream().forEach(b -> logger.info("{}", b));
        assertNotNull(travels);
    }

    @Test
    public void testTravelBooking() {
        List<TravelBooking> travelBooking = travelBookingRepository.findByCustomer(
                customerRepository.findByCustomerId(1).get()
        );
        travelBooking.stream().forEach(b -> logger.info("{}", b));
        assertTrue(travelBooking.size() > 0);
    }

//    @Test
//    public void testTravelBooking2(){
//        logger.info("------Let us see -------");
//        List<TravelBooking> travelBooking = travelBookingRepository.findByCustomerId(1);
//        travelBooking.stream().forEach(b -> logger.info("{}", b));
//        assertTrue(travelBooking.size() > 0);
//    }

    @Test
    public void testTravelBookingNativeQuery() {
        List<TravelBooking> travelBooking = travelBookingRepository.findForCondition(1);
        travelBooking.stream().forEach(b -> logger.info("{}", b));
        assertTrue(travelBooking.size() > 0);
    }


}
