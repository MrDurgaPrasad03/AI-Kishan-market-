
package com.kishanmarket.crop;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    private final CropRepository cropRepository;

    public CropController(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    private Long getAuthenticatedFarmerId(Authentication authentication) {
        if (authentication == null
                || !(authentication.getCredentials() instanceof Long farmerId)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in again");
        }

        return farmerId;
    }

    private void verifyOwnership(CropEntity crop, Long farmerId) {
        if (crop.getFarmerId() == null
                || !crop.getFarmerId().equals(farmerId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to modify this crop");
        }
    }

    @GetMapping
    public List<Crop> listCrops() {
        return cropRepository.findAll()
                .stream()
                .map(this::toCrop)
                .toList();
    }
@GetMapping("/my")
public List<Crop> listMyCrops(Authentication authentication) {
    Long farmerId = getAuthenticatedFarmerId(authentication);

    return cropRepository.findByFarmerId(farmerId)
            .stream()
            .map(this::toCrop)
            .toList();
}


    @PostMapping
    public ResponseEntity<Crop> createCrop(
            @Valid @RequestBody CreateCropRequest request,
            Authentication authentication) {

        Long farmerId = getAuthenticatedFarmerId(authentication);
        validateCrop(request.name(), request.location(),
                request.price(), request.quantity());

        CropEntity crop = new CropEntity();
        crop.setName(request.name().trim());
        crop.setLocation(request.location().trim());
        crop.setPrice(request.price());
        crop.setQuantity(request.quantity());
        crop.setFarmerId(farmerId);
        crop.setFarmerName(request.farmerName());
        crop.setDescription(request.description());

        CropEntity savedCrop = cropRepository.save(crop);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toCrop(savedCrop));
    }

    @PutMapping("/{id}")
    public Crop updateCrop(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCropRequest request,
            Authentication authentication) {

        Long farmerId = getAuthenticatedFarmerId(authentication);

        CropEntity crop = cropRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Crop not found"));

        verifyOwnership(crop, farmerId);

        validateCrop(request.name(), request.location(),
                request.price(), request.quantity());

        crop.setName(request.name().trim());
        crop.setLocation(request.location().trim());
        crop.setPrice(request.price());
        crop.setQuantity(request.quantity());
        crop.setFarmerName(request.farmerName());
        crop.setDescription(request.description());

        return toCrop(cropRepository.save(crop));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrop(
            @PathVariable Long id,
            Authentication authentication) {

        Long farmerId = getAuthenticatedFarmerId(authentication);

        CropEntity crop = cropRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Crop not found"));

        verifyOwnership(crop, farmerId);
        cropRepository.delete(crop);

        return ResponseEntity.noContent().build();
    }

    private void validateCrop(
            String name,
            String location,
            BigDecimal price,
            BigDecimal quantity) {

        if (name == null || name.isBlank()
                || location == null || location.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Crop name and location are required");
        }

        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0
                || quantity == null
                || quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Price and quantity must be greater than zero");
        }
    }

    private Crop toCrop(CropEntity crop) {
        return new Crop(
                crop.getId(),
                crop.getName(),
                crop.getDescription(),
                crop.getPrice(),
                crop.getQuantity(),
                crop.getLocation(),
                "🌱",
                "Available",
                crop.getFarmerId()
        );
    }
       public record CreateCropRequest(
        @NotBlank(message = "Crop name is required")
        @Size(max = 100, message = "Crop name cannot exceed 100 characters")
        String name,

        @NotBlank(message = "Location is required")
        @Size(max = 150, message = "Location cannot exceed 150 characters")
        String location,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = false,
                message = "Price must be greater than zero")
        BigDecimal price,

        @NotNull(message = "Quantity is required")
        @DecimalMin(value = "0.0", inclusive = false,
                message = "Quantity must be greater than zero")
        BigDecimal quantity,

        @Size(max = 100, message = "Farmer name cannot exceed 100 characters")
        String farmerName,

        @Size(max = 500, message = "Description cannot exceed 500 characters")
        String description
) {}

public record UpdateCropRequest(
        @NotBlank(message = "Crop name is required")
        @Size(max = 100, message = "Crop name cannot exceed 100 characters")
        String name,

        @NotBlank(message = "Location is required")
        @Size(max = 150, message = "Location cannot exceed 150 characters")
        String location,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = false,
                message = "Price must be greater than zero")
        BigDecimal price,

        @NotNull(message = "Quantity is required")
        @DecimalMin(value = "0.0", inclusive = false,
                message = "Quantity must be greater than zero")
        BigDecimal quantity,

        @Size(max = 100, message = "Farmer name cannot exceed 100 characters")
        String farmerName,

        @Size(max = 500, message = "Description cannot exceed 500 characters")
        String description
) {}
}
