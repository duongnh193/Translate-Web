package com.example.translate_be.translation.web;

import com.example.translate_be.dto.HistoryResponse;
import com.example.translate_be.dto.TranslateRequest;
import com.example.translate_be.dto.TranslateResponse;
import com.example.translate_be.translation.TranslationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TranslationController {

    private final TranslationService translationService;

    public TranslationController(TranslationService translationService) {
        this.translationService = translationService;
    }

    @PostMapping("/translate")
    public ResponseEntity<TranslateResponse> translate(@Valid @RequestBody TranslateRequest request,
                                                        Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(translationService.translate(request, email));
    }

    @GetMapping("/history")
    public ResponseEntity<HistoryResponse> history(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(translationService.history(authentication.getName()));
    }
}
