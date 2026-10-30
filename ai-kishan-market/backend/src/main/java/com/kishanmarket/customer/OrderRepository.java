
package com.kishanmarket.customer;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository
        extends JpaRepository<OrderEntity, Long> {

    List<OrderEntity> findByCustomerIdOrderByCreatedAtDesc(
            Long customerId);

    Optional<OrderEntity> findByIdAndCustomerId(
            Long id,
            Long customerId);
}
