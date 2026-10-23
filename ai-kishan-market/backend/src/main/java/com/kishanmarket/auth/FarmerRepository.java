
package com.kishanmarket.auth;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FarmerRepository extends JpaRepository<FarmerEntity, Long> {

    Optional<FarmerEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}
