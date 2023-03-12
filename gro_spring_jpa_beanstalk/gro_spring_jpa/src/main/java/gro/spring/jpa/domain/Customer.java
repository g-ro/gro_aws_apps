package gro.spring.jpa.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gro.spring.jpa.Utility;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity()
//@Table(name = "t_customer")
public class Customer extends BaseDomainModel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer customerId;

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private String address;

    private String city;

    private String state;

    private String postcode;

    private String phone;

    private Integer admin;

    /*
        It may not be a good idea to map travelBookings to Customer.
        Over time, a customer can have thousands of travel bookings,
        and a user may not be happy seeing all of them at once.
        If mapped, must be annotated with FetchType.Lazy
    */

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<TravelBooking> travelBookings;

    @JsonIgnore
    public List<TravelBooking> getTravelBookings() {
        return travelBookings;
    }

    public void setTravelBookings(List<TravelBooking> travelBookings) {
        this.travelBookings = travelBookings;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    /*
        Sensitive information should not be streamed out by Jackson
        @JsonIgnore will ensure that
     */
    @JsonIgnore
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostcode() {
        return postcode;
    }

    public void setPostcode(String postcode) {
        this.postcode = postcode;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getAdmin() {
        return admin;
    }

    public void setAdmin(Integer admin) {
        this.admin = admin;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "customerId=" + customerId +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", postcode='" + postcode + '\'' +
                '}';
    }

    public static Customer from(Integer id, String firstName, String lastName, String email) {
        Customer customer = new Customer();
        if (!Utility.isNull(id)) customer.setCustomerId(id);
        if (!Utility.isNull(firstName)) customer.setFirstName(firstName);
        if (!Utility.isNull(lastName)) customer.setLastName(lastName);
        if (!Utility.isNull(email)) customer.setEmail(email);
        return customer;
    }

    public static Customer from(Integer customerId, String firstName, String lastName,
                                String email, String password, String address, String city,
                                String state, String postcode, String phone) {

        Customer customer = new Customer();
        customer.customerId = customerId;
        customer.firstName = firstName;
        customer.lastName = lastName;
        customer.email = email;
        customer.password = password;
        customer.address = address;
        customer.city = city;
        customer.state = state;
        customer.postcode = postcode;
        customer.phone = phone;
        return customer;
    }
}
