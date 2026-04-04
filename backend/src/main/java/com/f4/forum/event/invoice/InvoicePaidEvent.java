package com.f4.forum.event.invoice;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class InvoicePaidEvent {
    private final Long invoiceId;
    private final String invoiceCode;
    private final Long studentId;
    private final String studentName;
    private final BigDecimal amountPaid;
}
