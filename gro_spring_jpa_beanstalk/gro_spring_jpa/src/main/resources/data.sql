INSERT INTO bus(bus_id, registration, maker, make_year, last_serviced, seats, upd_at, upd_by)
VALUES(default, 'NSW100', 'Volvo', 2015, CURRENT_DATE(), 20, CURRENT_TIMESTAMP(),'admin');

INSERT INTO bus(bus_id, registration, maker, make_year, last_serviced, seats, upd_at, upd_by)
VALUES(default, 'NSW520', 'Holden', 2023, CURRENT_DATE(), 47, CURRENT_TIMESTAMP(),'admin');

INSERT INTO customer(customer_id, first_name, last_name, admin, address, city, state, postcode, phone, email, password, upd_at, upd_by)
VALUES(default, 'John', 'Doe', 0, '291 Kent Street', 'Sydney', 'NSW', '2000', '0444111222', 'john.doe@mail.com', 'secret', CURRENT_TIMESTAMP(), 'admin');

INSERT INTO customer(customer_id, first_name, last_name, admin, address, city, state, postcode, phone, email, password, upd_at, upd_by)
VALUES(default, 'Hans', 'Muster', 0, '166 George Street', 'Sydney', 'NSW', '2000', '0423551222', 'hans.muster@mail.com', 'secret', CURRENT_TIMESTAMP(), 'admin');
