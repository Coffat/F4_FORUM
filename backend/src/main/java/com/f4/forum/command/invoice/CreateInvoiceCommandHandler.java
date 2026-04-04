package com.f4.forum.command.invoice;

import com.f4.forum.command.AbstractCommand;
import com.f4.forum.dto.invoice.CreateInvoiceCommand;
import com.f4.forum.dto.invoice.InvoiceResponse;
import com.f4.forum.facade.StaffInvoiceFacade;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CreateInvoiceCommandHandler extends AbstractCommand<InvoiceResponse> {

    private final StaffInvoiceFacade staffInvoiceFacade;
    private final CreateInvoiceCommand command;
    
    public CreateInvoiceCommandHandler(StaffInvoiceFacade staffInvoiceFacade, CreateInvoiceCommand command) {
        this.staffInvoiceFacade = staffInvoiceFacade;
        this.command = command;
    }
    
    @Override
    public InvoiceResponse execute() {
        log.info("📨 [COMMAND] Executing CreateInvoiceCommand: {}", getCommandId());
        long startTime = System.currentTimeMillis();
        
        InvoiceResponse result = staffInvoiceFacade.createInvoice(command);
        
        long duration = System.currentTimeMillis() - startTime;
        log.info("📬 [COMMAND] CreateInvoiceCommand completed in {}ms", duration);
        
        return result;
    }
}
