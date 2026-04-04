package com.f4.forum.event.invoice;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class InvoiceCreatedEvent {
    private final Long invoiceId;
    private final String invoiceCode;
    private final Long studentId;
    private final String studentName;
    private final String studentEmail;
    private final BigDecimal finalAmount;
    private final LocalDate dueDate;
}
