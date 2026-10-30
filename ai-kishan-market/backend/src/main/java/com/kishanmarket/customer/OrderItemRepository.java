
package com.kishanmarket.customer;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository
        extends JpaRepository<OrderItemEntity, Long> {

    List<OrderItemEntity> findByOrder_Id(Long orderId);

    List<OrderItemEntity> findByFarmerId(Long farmerId);
}
