package gro.spring.jpa.repository;

import gro.spring.jpa.domain.Bus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource
public interface BusRepository extends JpaRepository<Bus, Integer> {

    public List<Bus> findAll();

    public Optional<Bus> findByBusId(Integer id);

    public Optional<Bus> findByRegistration(@Param("registration") String registration);

    /*
     * By using attributePaths, one could get the same effect
     * as NamedEntityGraph without tagging the Entity by the annotation
     *
     * https://www.baeldung.com/spring-data-jpa-named-entity-graphs
     *
     */
    @EntityGraph(attributePaths={"travels"})
    public List<Bus> findByMaker(@Param("maker") String maker);

}
