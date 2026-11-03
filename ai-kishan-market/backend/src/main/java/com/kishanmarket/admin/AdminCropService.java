
package com.kishanmarket.admin;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kishanmarket.crop.CropEntity;
import com.kishanmarket.crop.CropRepository;

@Service
public class AdminCropService {

    private final CropRepository cropRepository;

    public AdminCropService(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    // Get all crops
    public List<CropResponse> getAllCrops() {
        return cropRepository.findAll()
                .stream()
                .map(CropResponse::from)
                .toList();
    }

    // Update crop details
    @Transactional
    public CropResponse updateCrop(Long id, CropEntity request) {

        CropEntity crop = cropRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Crop not found with ID: " + id)
                );

        crop.setName(request.getName());
        crop.setLocation(request.getLocation());
        crop.setPrice(request.getPrice());
        crop.setQuantity(request.getQuantity());
        crop.setDescription(request.getDescription());

        return CropResponse.from(cropRepository.save(crop));
    }

    // Delete crop
    public void deleteCrop(Long id) {

        CropEntity crop = cropRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Crop not found with ID: " + id)
                );

        cropRepository.delete(crop);
    }
}
