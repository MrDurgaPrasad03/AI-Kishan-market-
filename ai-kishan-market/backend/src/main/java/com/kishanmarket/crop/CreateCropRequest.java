package com.kishanmarket.crop;

import java.math.BigDecimal;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

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