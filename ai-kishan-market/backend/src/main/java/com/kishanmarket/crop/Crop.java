
package com.kishanmarket.crop;

import java.math.BigDecimal;

public record Crop(
    Long id,
    String name,
    String variety,
    BigDecimal pricePerQuintal,
    BigDecimal quantityQuintals,
    String location,
    String emoji,
    String tag,
    Long farmerId
) {}
