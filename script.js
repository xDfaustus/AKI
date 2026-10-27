package com.arcade.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    // Estructura para enviar las pistas de audio al frontend
    public static class Track {
        private String title;
        private String artist;
        private String src;

        public Track(String title, String artist, String src) {
            this.title = title;
            this.artist = artist;
            this.src = src;
        }

        public String getTitle() { return title; }
        public String getArtist() { return artist; }
        public String getSrc() { return src; }
    }

    // Endpoint para la lista de reproducción (Música del 0 al 4 en formato .mp3)
    @GetMapping("/playlist")
    public ResponseEntity<List<Track>> getPlaylist() {
        List<Track> playlist = Arrays.asList(
            new Track("KOF Battle Theme 1", "【Kanaria】", "/assets/0.mp3"),
            new Track("Esaka!! (KOF Theme)", "【SNK Sound Team】", "/assets/1.mp3"),
            new Track("Lonely Wolf", "【Garou Asset Mix】", "/assets/2.mp3"),
            new Track("Arashi no Saxophone", "【Iori Theme Asset】", "/assets/3.mp3"),
            new Track("Final Boss Theme", "【Boss Asset】", "/assets/4.mp3")
        );
        return ResponseEntity.ok(playlist);
    }

    // Endpoint para los efectos de sonido interactivos (A.mp3, B.mp3, C.mp3)
    @GetMapping("/sfx")
    public ResponseEntity<Map<String, String>> getSfx() {
        Map<String, String> sfx = new HashMap<>();
        sfx.put("intro", "/assets/A.mp3");  // Sonido de inicio (secuencia inicial)
        sfx.put("nav", "/assets/B.mp3");    // Sonido al cambiar de personaje (tick)
        sfx.put("select", "/assets/C.mp3"); // Sonido al hacer clic / seleccionar
        return ResponseEntity.ok(sfx);
    }
}