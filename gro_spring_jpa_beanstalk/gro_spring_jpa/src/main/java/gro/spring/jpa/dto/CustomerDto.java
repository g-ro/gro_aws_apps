package gro.spring.jpa.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.beans.factory.annotation.Value;

/**
 *
 * An example of closed and open projection
 * For closed projection, getters should be exactly same as getter of the underlying entity
 * For open project, hint of conversion should be provided using @Value annotation
 */
public interface CustomerDto {

    public Integer getCustomerId();

    public String getFirstName();

    public String getLastName();

//  The aggregate root backing the projection is available in the target variable.
    @Value("#{target.firstName + ' ' + target.lastName}")
    public String getFullName();

    public String getEmail();

    public String getPhone();

    public String getState();

    public String getPostcode();

}
