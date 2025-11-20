package com.example.translate_be.dto;

import java.time.Instant;

public record ApiError(String message, Instant timestamp) {
    public static ApiError of(String message) {
        return new ApiError(message, Instant.now());
    }
}
