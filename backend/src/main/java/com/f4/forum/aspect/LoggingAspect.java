package com.f4.forum.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * ===== PROXY PATTERN (Spring AOP) =====
 * Aspect logging ghi nhận tất cả method calls.
 * Sử dụng AOP proxy thay vì manual proxy pattern.
 */
@Slf4j
@Aspect
@Component
public class LoggingAspect {

    /**
     * Log trước khi method được gọi.
     */
    @Before("execution(* com.f4.forum.service..*(..)) || execution(* com.f4.forum.facade..*(..))")
    public void logBefore(JoinPoint joinPoint) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        
        log.debug("▶ [{}.{}] Args: {}", className, methodName, 
                args.length > 0 ? Arrays.toString(args) : "none");
    }

    /**
     * Log sau khi method hoàn thành.
     */
    @AfterReturning(pointcut = "execution(* com.f4.forum.service..*(..))", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        
        if (result != null) {
            log.debug("✅ [{}.{}] Completed", className, methodName);
        }
    }
}
