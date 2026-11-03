
package com.kishanmarket.admin;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kishanmarket.auth.FarmerRepository;

@Service
public class AdminFarmerService {

    private final FarmerRepository farmerRepository;

    public AdminFarmerService(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }

    public List<FarmerResponse> getAllFarmers() {
        return farmerRepository.findAll()
                .stream()
                .map(FarmerResponse::from)
                .toList();
    }
}
