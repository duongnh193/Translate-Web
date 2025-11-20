package com.example.translate_be.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TranslateRequest(
        @NotBlank @Size(max = 2000) String sourceText,
        @NotBlank String srcLang,
        @NotBlank String tgtLang,
        String tone,
        String domain,
        Long presetId,
        String extraInstruction
) {}
