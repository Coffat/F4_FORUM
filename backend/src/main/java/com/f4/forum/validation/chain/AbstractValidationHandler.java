package com.f4.forum.validation.chain;

public abstract class AbstractValidationHandler<T> implements ValidationHandler<T> {
    private ValidationHandler<T> next;

    @Override
    public ValidationHandler<T> setNext(ValidationHandler<T> next) {
        this.next = next;
        return next;
    }

    protected void passToNext(T context) {
        if (next != null) {
            next.handle(context);
        }
    }
}
