package com.kishanmarket.crop;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/crops")
public class CropController {
    @GetMapping
    public List<Crop> listCrops() {
        // Seed data for the first UI/API integration milestone.
        // Replace with validated database-backed records in the next phase.
        return List.of(
            new Crop(1L, "Tomatoes", "Fresh harvest", new BigDecimal("1800"), new BigDecimal("24"), "Kakinada, Andhra Pradesh", "🍅", "Popular"),
            new Crop(2L, "Paddy", "Grade A", new BigDecimal("2320"), new BigDecimal("80"), "Rajahmundry, Andhra Pradesh", "🌾", "High demand"),
            new Crop(3L, "Chilli", "Red chilli", new BigDecimal("9400"), new BigDecimal("12"), "Guntur, Andhra Pradesh", "🌶️", "New listing"),
            new Crop(4L, "Bananas", "Fresh bunches", new BigDecimal("1600"), new BigDecimal("35"), "Amalapuram, Andhra Pradesh", "🍌", "Fresh today")
        );
    }
}
