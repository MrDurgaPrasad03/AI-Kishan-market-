
package com.kishanmarket.crop;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kishanmarket.auth.FarmerEntity;
import com.kishanmarket.auth.JwtService;
import com.kishanmarket.auth.JwtAuthenticationFilter;
import com.kishanmarket.config.SecurityConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CropController.class)
@Import({
    SecurityConfig.class,
    JwtAuthenticationFilter.class,
    JwtService.class
})
class CropControllerTest {

    private static final String TEST_SECRET =
        "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtService jwtService;

    @MockBean
    private CropRepository cropRepository;

    private String farmerAToken;
    private String farmerBToken;

    @BeforeEach
    void setUp() {
        farmerAToken = createToken(1L, "farmerA@example.com");
        farmerBToken = createToken(2L, "farmerB@example.com");
    }

    private String createToken(Long id, String email) {
        FarmerEntity farmer = new FarmerEntity();
        ReflectionTestUtils.setField(farmer, "id", id);
        farmer.setEmail(email);
        return jwtService.generateToken(farmer);
    }

    private CropEntity cropOwnedBy(Long farmerId) {
        CropEntity crop = new CropEntity();
        ReflectionTestUtils.setField(crop, "id", 10L);
        crop.setFarmerId(farmerId);
        crop.setName("Rice");
        crop.setLocation("Kakinada");
        crop.setPrice(new BigDecimal("2500"));
        crop.setQuantity(new BigDecimal("10"));
        crop.setFarmerName("Test Farmer");
        crop.setDescription("Test crop");
        return crop;
    }

    private Map<String, Object> validCropRequest() {
        return Map.of(
            "name", "Rice",
            "location", "Kakinada",
            "price", 2500,
            "quantity", 10,
            "farmerName", "Test Farmer",
            "description", "Test crop"
        );
    }

    @Test
    void getCropsReturnsList() throws Exception {
        when(cropRepository.findAll())
            .thenReturn(List.of(cropOwnedBy(1L)));

        mockMvc.perform(get("/api/crops"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("Rice"));
    }

    @Test
    void farmerCanCreateCrop() throws Exception {
        when(cropRepository.save(any(CropEntity.class)))
            .thenAnswer(invocation -> {
                CropEntity saved = invocation.getArgument(0);
                ReflectionTestUtils.setField(saved, "id", 11L);
                return saved;
            });

        mockMvc.perform(post("/api/crops")
                .header("Authorization", "Bearer " + farmerAToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validCropRequest())))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Rice"));

        org.mockito.ArgumentCaptor<CropEntity> captor =
            org.mockito.ArgumentCaptor.forClass(CropEntity.class);

        verify(cropRepository).save(captor.capture());
        org.junit.jupiter.api.Assertions.assertEquals(
            1L, captor.getValue().getFarmerId());
    }

    @Test
    void farmerCanUpdateOwnCrop() throws Exception {
        CropEntity crop = cropOwnedBy(1L);

        when(cropRepository.findById(10L))
            .thenReturn(Optional.of(crop));
        when(cropRepository.save(any(CropEntity.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        Map<String, Object> update = Map.of(
            "name", "Rice",
            "location", "Kakinada",
            "price", 2700,
            "quantity", 12,
            "farmerName", "Test Farmer",
            "description", "Updated crop"
        );

        mockMvc.perform(put("/api/crops/10")
                .header("Authorization", "Bearer " + farmerAToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(update)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.pricePerQuintal").value(2700));
    }

    @Test
    void farmerCanDeleteOwnCrop() throws Exception {
        when(cropRepository.findById(10L))
            .thenReturn(Optional.of(cropOwnedBy(1L)));

        mockMvc.perform(delete("/api/crops/10")
                .header("Authorization", "Bearer " + farmerAToken))
            .andExpect(status().isNoContent());

        verify(cropRepository).delete(any(CropEntity.class));
    }

    @Test
    void farmerCannotUpdateAnotherFarmersCrop() throws Exception {
        when(cropRepository.findById(10L))
            .thenReturn(Optional.of(cropOwnedBy(1L)));

        mockMvc.perform(put("/api/crops/10")
                .header("Authorization", "Bearer " + farmerBToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validCropRequest())))
            .andExpect(status().isForbidden());

        verify(cropRepository, never()).save(any(CropEntity.class));
    }

    @Test
    void farmerCannotDeleteAnotherFarmersCrop() throws Exception {
        when(cropRepository.findById(10L))
            .thenReturn(Optional.of(cropOwnedBy(1L)));

        mockMvc.perform(delete("/api/crops/10")
                .header("Authorization", "Bearer " + farmerBToken))
            .andExpect(status().isForbidden());

        verify(cropRepository, never()).delete(any(CropEntity.class));
    }

    @Test
    void createCropRejectsInvalidPrice() throws Exception {
        Map<String, Object> invalid = Map.of(
            "name", "Rice",
            "location", "Kakinada",
            "price", 0,
            "quantity", 10
        );

        mockMvc.perform(post("/api/crops")
                .header("Authorization", "Bearer " + farmerAToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
            .andExpect(status().isBadRequest());

        verify(cropRepository, never()).save(any(CropEntity.class));
    }
    

@Test
void createCropWithoutTokenIsUnauthorized() throws Exception {
    mockMvc.perform(post("/api/crops")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(validCropRequest())))
        .andExpect(status().isUnauthorized());

    verify(cropRepository, never()).save(any(CropEntity.class));
}

@Test
void createCropWithInvalidTokenIsUnauthorized() throws Exception {
    mockMvc.perform(post("/api/crops")
            .header("Authorization", "Bearer invalid-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(validCropRequest())))
        .andExpect(status().isUnauthorized());

    verify(cropRepository, never()).save(any(CropEntity.class));
}

@Test
void updateMissingCropReturnsNotFound() throws Exception {
    when(cropRepository.findById(999L))
        .thenReturn(Optional.empty());

    mockMvc.perform(put("/api/crops/999")
            .header("Authorization", "Bearer " + farmerAToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(validCropRequest())))
        .andExpect(status().isNotFound());

    verify(cropRepository, never()).save(any(CropEntity.class));
}

@Test
void farmerCannotDeleteCropWithoutOwner() throws Exception {
    CropEntity unownedCrop = cropOwnedBy(1L);
    unownedCrop.setFarmerId(null);

    when(cropRepository.findById(10L))
        .thenReturn(Optional.of(unownedCrop));

    mockMvc.perform(delete("/api/crops/10")
            .header("Authorization", "Bearer " + farmerAToken))
        .andExpect(status().isForbidden());

    verify(cropRepository, never()).delete(any(CropEntity.class));
}

}
