
package com.kishanmarket.admin;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.kishanmarket.crop.CropEntity;

import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AdminDashboardService dashboardService;
    private final AdminFarmerService farmerService;
    private final AdminCustomerService customerService;
    private final AdminCropService cropService;
    private final AdminOrderService orderService;
    public AdminController(
        AdminService adminService,
        AdminDashboardService dashboardService,
        AdminFarmerService farmerService,
        AdminCustomerService customerService,
        AdminCropService cropService,
        AdminOrderService orderService) {

    this.adminService = adminService;
    this.dashboardService = dashboardService;
    this.farmerService = farmerService;
    this.customerService = customerService;
    this.cropService = cropService;
    this.orderService = orderService;
}
    // Admin Login
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(
            @RequestBody AdminLoginRequest request) {

        try {
            String token = adminService.login(
                    request.email(),
                    request.password()
            );

            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "message", "Admin login successful"
                    )
            );

        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message", "Invalid email or password"
                    ));
        }
    }

    // Admin Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStatistics() {

        return ResponseEntity.ok(
                dashboardService.getDashboardStatistics()
        );
    }

    public record AdminLoginRequest(
            String email,
            String password
    ) {
    }
    // Get all registered farmers
    @GetMapping("/farmers")
    public ResponseEntity<?> getAllFarmers() {
    return ResponseEntity.ok(farmerService.getAllFarmers());
}
  @GetMapping("/customers")
public ResponseEntity<?> getAllCustomers() {
    return ResponseEntity.ok(customerService.getAllCustomers());
}

    // Get all registered crops
    @GetMapping("/crops")
    public ResponseEntity<?> getAllCrops() {
        return ResponseEntity.ok(cropService.getAllCrops());
    }

    // Update crop details
    @PutMapping("/crops/{id}")
    public ResponseEntity<?> updateCrop(
            @PathVariable Long id,
           @RequestBody CropEntity request) {

        try {
            return ResponseEntity.ok(cropService.updateCrop(id, request));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    // Delete a crop
    @DeleteMapping("/crops/{id}")
    public ResponseEntity<?> deleteCrop(@PathVariable Long id) {

        try {
            cropService.deleteCrop(id);

            return ResponseEntity.ok(
                    Map.of("message", "Crop deleted successfully")
            );

        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", ex.getMessage()));
        }
    }
    // Get all customer orders
@GetMapping("/orders")
public ResponseEntity<?> getAllOrders() {
    return ResponseEntity.ok(orderService.getAllOrders());
}
@PatchMapping("/orders/items/{itemId}/status")
public ResponseEntity<?> updateAdminOrderItemStatus(
        @PathVariable Long itemId,
        @RequestBody AdminOrderItemStatusRequest request) {

    try {
        return ResponseEntity.ok(
                orderService.updateOrderItemStatus(itemId, request.status())
        );
    } catch (IllegalArgumentException ex) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", ex.getMessage()));
    }
}

public record AdminOrderItemStatusRequest(String status) {}
@PatchMapping("/orders/recalculate-statuses")
public ResponseEntity<?> recalculateOrderStatuses() {

    orderService.recalculateAllOrderStatuses();

    return ResponseEntity.ok(
        Map.of("message", "All order statuses recalculated successfully")
    );
}
}
