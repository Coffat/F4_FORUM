package com.f4.forum.command;

import com.f4.forum.command.invoice.CreateInvoiceCommandHandler;
import com.f4.forum.command.invoice.PayInvoiceCommandHandler;
import com.f4.forum.dto.invoice.CreateInvoiceCommand;
import com.f4.forum.facade.StaffInvoiceFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class CommandFactory {

    private final StaffInvoiceFacade staffInvoiceFacade;

    public Command<?> createInvoiceCommand(CreateInvoiceCommand command) {
        return new CreateInvoiceCommandHandler(staffInvoiceFacade, command);
    }

    public Command<?> payInvoiceCommand(Long invoiceId, BigDecimal amount) {
        return new PayInvoiceCommandHandler(staffInvoiceFacade, invoiceId, amount);
    }

    public Command<?> createCommand(String commandType, Object... params) {
        return switch (commandType) {
            case "CREATE_INVOICE" -> createInvoiceCommand((CreateInvoiceCommand) params[0]);
            case "PAY_INVOICE" -> payInvoiceCommand(
                    (Long) params[0], 
                    (BigDecimal) params[1]
            );
            default -> throw new IllegalArgumentException("Unknown command type: " + commandType);
        };
    }
}
