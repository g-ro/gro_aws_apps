package gro.spring.jpa.repository;

import gro.spring.jpa.domain.Customer;
import gro.spring.jpa.dto.CustomerDto;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

/*
*   @RepositoryRestResource exposes the queries methods from the repositories under ../search
*   For example http://localhost:8080/api/customers/search/findByCustomerId?id=1
*
*/

@RepositoryRestResource
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    public Optional<Customer> findByCustomerId(Integer customerId);

    public Optional<CustomerDto> getByEmailAndPassword(String email, String password);

    public Optional<Customer> getByEmail(String email);

    public Optional<Customer> findByFirstNameAndLastName(String firstName, String lastName);

    public void deleteByFirstNameAndLastName(String firstName, String lastName);

}
