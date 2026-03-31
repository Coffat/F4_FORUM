package com.f4.forum.repository;

import com.f4.forum.entity.Invoice;
import com.f4.forum.entity.enums.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    Page<Invoice> findByStudentId(Long studentId, Pageable pageable);
    
    Page<Invoice> findByStatus(InvoiceStatus status, Pageable pageable);
    
    @Query("SELECT i FROM Invoice i WHERE i.status = :status ORDER BY i.dueDate ASC")
    List<Invoice> findOverdueInvoices(InvoiceStatus status);
    
    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.status = :status")
    long countByStatus(InvoiceStatus status);
}