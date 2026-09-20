package com.jobportal.aop;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
@Component
@Aspect
public class TrackExecutionTIme {
    @Around("execution(* com.jobportal.controller..*(..)) || " +
            "execution(* com.jobportal.service..*(..)) || " +
            "execution(* com.jobportal.repository..*(..))")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();

        Object result = joinPoint.proceed();

        long endTime = System.currentTimeMillis();

        System.out.println("Total execution time: " + (endTime - startTime) + "ms");
        return result;
    }
}
