package com.f4.forum.command.invoice;

import com.f4.forum.command.AbstractCommand;
import com.f4.forum.dto.invoice.InvoiceResponse;
import com.f4.forum.facade.StaffInvoiceFacade;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;

@Slf4j
public class PayInvoiceCommandHandler extends AbstractCommand<InvoiceResponse> {

    private final StaffInvoiceFacade staffInvoiceFacade;
    private final Long invoiceId;
    private final BigDecimal amount;
    
    public PayInvoiceCommandHandler(StaffInvoiceFacade staffInvoiceFacade, Long invoiceId, BigDecimal amount) {
        this.staffInvoiceFacade = staffInvoiceFacade;
        this.invoiceId = invoiceId;
        this.amount = amount;
    }
    
    @Override
    protected InvoiceResponse doExecute() {
        log.info("📨 [COMMAND] Executing PayInvoiceCommand: {} for invoice {}", 
                getCommandId(), invoiceId);
        
        InvoiceResponse result = staffInvoiceFacade.payInvoice(invoiceId, amount);
        
        log.info("💰 [COMMAND] PayInvoiceCommand completed for invoice {}", invoiceId);
        return result;
    }
    
    @Override
    public String getCommandName() {
        return "PayInvoiceCommandHandler";
    }
}
