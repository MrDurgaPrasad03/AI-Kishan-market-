
package com.kishanmarket.crop;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CropRepository extends JpaRepository<CropEntity, Long> {

    // Retrieve only crops belonging to a specific farmer
    List<CropEntity> findByFarmerId(Long farmerId);
}
