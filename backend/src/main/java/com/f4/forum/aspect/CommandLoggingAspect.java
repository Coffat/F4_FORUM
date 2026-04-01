package com.f4.forum.aspect;

import com.f4.forum.command.CommandHistory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class CommandLoggingAspect {

    private final CommandHistory commandHistory;

    @Around("execution(* com.f4.forum.facade..*.create*(..)) || " +
            "execution(* com.f4.forum.facade..*.update*(..)) || " +
            "execution(* com.f4.forum.facade..*.delete*(..)) || " +
            "execution(* com.f4.forum.facade..*.pay*(..)) || " +
            "execution(* com.f4.forum.facade..*.cancel*(..))")
    public Object logCommand(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String commandType = className + "." + methodName;
        
        long startTime = System.currentTimeMillis();
        log.info("📨 [ASPECT COMMAND] Starting: {}", commandType);
        
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            
            log.info("📬 [ASPECT COMMAND] Completed: {} in {}ms", commandType, duration);
            
            return result;
        } catch (Throwable ex) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("❌ [ASPECT COMMAND] Failed: {} in {}ms - Error: {}", 
                    commandType, duration, ex.getMessage());
            throw ex;
        }
    }
}
