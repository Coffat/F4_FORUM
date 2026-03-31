package com.f4.forum.validation.chain;

public interface ValidationHandler<T> {
    void handle(T context);
    ValidationHandler<T> setNext(ValidationHandler<T> next);
}
