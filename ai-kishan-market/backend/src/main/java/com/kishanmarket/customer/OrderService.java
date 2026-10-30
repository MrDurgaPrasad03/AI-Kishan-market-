
package com.kishanmarket.customer;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.kishanmarket.crop.CropEntity;
import com.kishanmarket.crop.CropRepository;

@Service
public class OrderService {

    private final CustomerRepository customerRepository;
    private final CartItemRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CropRepository cropRepository;

    public OrderService(
            CustomerRepository customerRepository,
            CartItemRepository cartRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CropRepository cropRepository) {
        this.customerRepository = customerRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cropRepository = cropRepository;
    }

    @Transactional
    public OrderEntity checkout(Long customerId, String paymentMethod) {

        if (!"CASH_ON_DELIVERY".equals(paymentMethod)
                && !"DIRECT_TO_FARMER".equals(paymentMethod)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Choose CASH_ON_DELIVERY or DIRECT_TO_FARMER");
        }

        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Customer not found"));

        List<CartItemEntity> cartItems =
                cartRepository.findByCustomerId(customerId);

        if (cartItems.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Your cart is empty");
        }

        OrderEntity order = new OrderEntity();
        order.setCustomerId(customer.getId());
        order.setCustomerName(customer.getFullName());
        order.setCustomerEmail(customer.getEmail());
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus("PENDING");
        order.setStatus("PLACED");

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItemEntity> items = new ArrayList<>();

        for (CartItemEntity cartItem : cartItems) {
            Long cropId = cartItem.getCrop().getId();

            CropEntity crop = cropRepository.findById(cropId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "A crop in your cart no longer exists"));

            if (crop.getFarmerId() == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "A crop in your cart has no assigned farmer");
            }

            BigDecimal quantity = cartItem.getQuantity();

            if (quantity == null
                    || quantity.compareTo(BigDecimal.ZERO) <= 0
                    || crop.getQuantity().compareTo(quantity) < 0) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Insufficient stock for crop: " + crop.getName());
            }

            BigDecimal unitPrice = crop.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(quantity);

            OrderItemEntity item = new OrderItemEntity();
            item.setOrder(order);
            item.setCropId(crop.getId());
            item.setCropName(crop.getName());
            item.setFarmerId(crop.getFarmerId());
            item.setFarmerName(crop.getFarmerName());
            item.setQuantity(quantity);
            item.setUnitPrice(unitPrice);
            item.setLineTotal(lineTotal);

            items.add(item);
            total = total.add(lineTotal);

            crop.setQuantity(crop.getQuantity().subtract(quantity));
            cropRepository.save(crop);
        }

        order.setTotalAmount(total);
        OrderEntity savedOrder = orderRepository.save(order);

        for (OrderItemEntity item : items) {
            orderItemRepository.save(item);
        }

        cartRepository.deleteByCustomerId(customerId);

        return savedOrder;
    }

    @Transactional(readOnly = true)
    public List<OrderEntity> getCustomerOrders(Long customerId) {
        return orderRepository
                .findByCustomerIdOrderByCreatedAtDesc(customerId);
    }
}
