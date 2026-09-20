package com.jobportal.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class RequestLoggingAspect {
    private final Logger log = LoggerFactory.getLogger(this.getClass());
      @Before("execution(* com.jobportal.controller..*(..)) || " +
              "execution(* com.jobportal.service..*(..)) || " +
              "execution(* com.jobportal.repository..*(..))")
    public void logIncommingRequest(JoinPoint joinPoint) {
         String methodName = joinPoint.getSignature().getName();
         Object[] args = joinPoint.getArgs();
         log.info("Entering method: " + methodName + " with args: " + Arrays.toString(args));
    }


}
