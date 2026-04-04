package com.f4.forum.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CacheEvictorService {

    private final CacheManager cacheManager;

    @Async
    public void evictCourseCache() {
        evictCache("courses");
    }

    @Async
    public void evictClassCache() {
        evictCache("classes");
    }

    @Async
    public void evictRoomCache() {
        evictCache("rooms");
    }

    @Async
    public void evictScheduleCache() {
        evictCache("schedules");
    }

    @Async
    public void evictPromotionCache() {
        evictCache("promotions");
    }

    @Async
    public void evictAllCaches() {
        cacheManager.getCacheNames().forEach(this::evictCache);
    }

    private void evictCache(String cacheName) {
        var cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
            log.info("🗑️ [CACHE] Evicted cache: {}", cacheName);
        }
    }
}
