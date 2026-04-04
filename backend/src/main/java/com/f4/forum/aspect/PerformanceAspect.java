package com.f4.forum.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * ===== PROXY PATTERN (Spring AOP) =====
 * Aspect đo hiệu năng - track execution time của các method.
 */
@Slf4j
@Aspect
@Component
public class PerformanceAspect {

    /**
     * Đo thời gian thực thi của các write operations.
     */
    @Around("execution(* com.f4.forum.service..*.create*(..)) || " +
            "execution(* com.f4.forum.service..*.update*(..)) || " +
            "execution(* com.f4.forum.service..*.delete*(..)) || " +
            "execution(* com.f4.forum.facade..*.create*(..)) || " +
            "execution(* com.f4.forum.facade..*.update*(..)) || " +
            "execution(* com.f4.forum.facade..*.delete*(..))")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringTypeName();
        
        long startTime = System.currentTimeMillis();
        log.info("⏱️ [PERF] Bắt đầu: {}.{}", className, methodName);
        
        Object result = joinPoint.proceed();
        
        long executionTime = System.currentTimeMillis() - startTime;
        log.info("⏱️ [PERF] Hoàn thành: {}.{} trong {}ms", 
                className, methodName, executionTime);
        
        return result;
    }
}
