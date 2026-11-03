
package com.kishanmarket.admin;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.kishanmarket.auth.FarmerRepository;
import com.kishanmarket.customer.CustomerRepository;
import com.kishanmarket.crop.CropRepository;
import com.kishanmarket.customer.OrderRepository;

@Service
public class AdminDashboardService {

    private final FarmerRepository farmerRepository;
    private final CustomerRepository customerRepository;
    private final CropRepository cropRepository;
    private final OrderRepository orderRepository;

    public AdminDashboardService(
            FarmerRepository farmerRepository,
            CustomerRepository customerRepository,
            CropRepository cropRepository,
            OrderRepository orderRepository) {

        this.farmerRepository = farmerRepository;
        this.customerRepository = customerRepository;
        this.cropRepository = cropRepository;
        this.orderRepository = orderRepository;
    }

    public Map<String, Long> getDashboardStatistics() {

        long totalFarmers = farmerRepository.count();
        long totalCustomers = customerRepository.count();
        long totalCrops = cropRepository.count();
        long totalOrders = orderRepository.count();

        return Map.of(
                "totalFarmers", totalFarmers,
                "totalCustomers", totalCustomers,
                "totalCrops", totalCrops,
                "totalOrders", totalOrders
        );
    }
}
