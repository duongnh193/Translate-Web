package com.example.translate_be.preset;

import com.example.translate_be.dto.PresetResponse;
import com.example.translate_be.preset.repo.PresetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PresetService {

    private final PresetRepository presetRepository;

    public List<PresetResponse> getAll() {
        return presetRepository.findAll().stream()
                .map(preset -> new PresetResponse(
                        preset.getId(),
                        preset.getName(),
                        preset.getDefaultTone(),
                        preset.getDefaultDomain(),
                        preset.getPromptSnippet()))
                .toList();
    }

    public Preset findById(Long id) {
        return presetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Preset not found"));
    }
}
