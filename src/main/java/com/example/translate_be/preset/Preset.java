package com.example.translate_be.preset;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "presets")
public class Preset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "default_tone", length = 64)
    private String defaultTone;

    @Column(name = "default_domain", length = 64)
    private String defaultDomain;

    @Column(name = "prompt_snippet", columnDefinition = "TEXT")
    private String promptSnippet;
}
