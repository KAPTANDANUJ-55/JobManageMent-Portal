package com.jobportal.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ResponseLoggingAspect {

    private final Logger log = LoggerFactory.getLogger(ResponseLoggingAspect.class);

       @AfterReturning(pointcut = "execution(* com.jobportal.controller..*(..)) || " +
               "execution(* com.jobportal.service..*(..)) || " +
               "execution(* com.jobportal.repository..*(..))", returning = "response")
    private void logMethodSuccess(JoinPoint joinPoint,Object response) {
           String methodName = joinPoint.getSignature().toShortString();

           log.info("<== [REQUEST COMPLETED] Method: {} | Returned Response: {}", methodName, response != null ? response : "void");

    }
}
