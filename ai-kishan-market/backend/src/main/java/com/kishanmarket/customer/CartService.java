
package com.kishanmarket.customer;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.kishanmarket.crop.CropEntity;
import com.kishanmarket.crop.CropRepository;

@Service
public class CartService {

    private final CartItemRepository cartRepository;
    private final CropRepository cropRepository;

    public CartService(
            CartItemRepository cartRepository,
            CropRepository cropRepository) {
        this.cartRepository = cartRepository;
        this.cropRepository = cropRepository;
    }

    
@Transactional(readOnly = true)
public List<CartItemResponse> getCart(Long customerId) {
    return cartRepository.findByCustomerId(customerId)
            .stream()
            .map(item -> {
                var crop = item.getCrop();

                return new CartItemResponse(
                        item.getId(),
                        item.getCustomerId(),
                        crop.getId(),
                        crop.getName(),
                        crop.getLocation(),
                        crop.getPrice(),
                        crop.getQuantity(),
                        crop.getFarmerName(),
                        crop.getFarmerId(),
                        item.getQuantity(),
                        item.getCreatedAt()
                );
            })
            .toList();
}

    @Transactional
    public CartItemEntity addOrUpdate(
            Long customerId,
            Long cropId,
            BigDecimal quantity) {

        validateQuantity(quantity);

        CropEntity crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Crop not found"));

        if (crop.getFarmerId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This crop is not available for purchase yet");
        }

        if (quantity.compareTo(crop.getQuantity()) > 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Requested quantity exceeds available stock");
        }

        CartItemEntity item = cartRepository
                .findByCustomerIdAndCrop_Id(customerId, cropId)
                .orElseGet(() -> {
                    CartItemEntity newItem = new CartItemEntity();
                    newItem.setCustomerId(customerId);
                    newItem.setCrop(crop);
                    return newItem;
                });

        item.setQuantity(quantity);
        return cartRepository.save(item);
    }
    @Transactional
public CartItemEntity updateItem(
        Long customerId,
        Long itemId,
        BigDecimal quantity) {

    validateQuantity(quantity);

    CartItemEntity item = cartRepository
            .findByIdAndCustomerId(itemId, customerId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Cart item not found"));

    CropEntity crop = cropRepository.findById(item.getCrop().getId())
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Crop not found"));

    if (quantity.compareTo(crop.getQuantity()) > 0) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Requested quantity exceeds available stock");
    }

    item.setQuantity(quantity);
    return cartRepository.save(item);
}
    @Transactional
    public void remove(Long customerId, Long itemId) {
        CartItemEntity item = cartRepository
                .findByIdAndCustomerId(itemId, customerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cart item not found"));

        cartRepository.delete(item);
    }

    @Transactional
    public void clearCart(Long customerId) {
        cartRepository.deleteByCustomerId(customerId);
    }

    private void validateQuantity(BigDecimal quantity) {
        if (quantity == null
                || quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantity must be greater than zero");
        }
    }
}
