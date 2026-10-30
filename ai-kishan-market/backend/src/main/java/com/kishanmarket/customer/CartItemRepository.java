
package com.kishanmarket.customer;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository
        extends JpaRepository<CartItemEntity, Long> {

    List<CartItemEntity> findByCustomerId(Long customerId);

    Optional<CartItemEntity> findByCustomerIdAndCrop_Id(
            Long customerId,
            Long cropId);

    Optional<CartItemEntity> findByIdAndCustomerId(
            Long id,
            Long customerId);

    void deleteByCustomerId(Long customerId);
}
