package com.example.translate_be.preset;

import com.example.translate_be.dto.PresetResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/presets")
public class PresetController {

    private final PresetService presetService;

    public PresetController(PresetService presetService) {
        this.presetService = presetService;
    }

    @GetMapping
    public ResponseEntity<List<PresetResponse>> list() {
        return ResponseEntity.ok(presetService.getAll());
    }
}
