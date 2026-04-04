package com.f4.forum.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * ===== PROXY PATTERN (Spring AOP) =====
 * Aspect giám sát transaction - theo dõi các thay đổi database.
 */
@Slf4j
@Aspect
@Component
public class TransactionAspect {

    /**
     * Log transaction boundaries.
     */
    @Around("@annotation(Transactional)")
    public Object logTransaction(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        
        log.debug("🔄 [TX] Bắt đầu transaction: {}", methodName);
        
        try {
            Object result = joinPoint.proceed();
            log.debug("🔄 [TX] Commit transaction: {}", methodName);
            return result;
        } catch (Throwable ex) {
            log.error("🔄 [TX] Rollback transaction: {} - Error: {}", methodName, ex.getMessage());
            throw ex;
        }
    }
}
